const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export const analyzeImageAndGenerateCategory = async (imageFile) => {
  if (!OPENAI_API_KEY || OPENAI_API_KEY === 'YOUR_OPENAI_API_KEY_HERE') {
    throw new Error('OpenAI API key is required. Please add VITE_OPENAI_API_KEY to your .env.local file');
  }

  // Convert image to base64
  const base64Image = await fileToBase64(imageFile);
  console.log('Base64 image length:', base64Image.length);
  console.log('Base64 preview:', base64Image.substring(0, 100) + '...');

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze this image in detail and provide ONLY a valid JSON response with the following exact structure (no additional text, no markdown, just the JSON):

{
  "category": "one of: electronics, clothing, furniture, sports, music, books, other",
  "name": "descriptive item name (2-4 words)",
  "description": "detailed description of the item (1-2 sentences)",
  "estimated_value": 100,
  "condition": "one of: excellent, very good, good, fair, poor",
  "quality_analysis": "detailed assessment of item condition, wear, damage, or quality indicators you can see",
  "pricing_factors": "explanation of what influenced the price estimate (brand, condition, market demand, etc.)",
  "confidence_level": 8
}

CRITICAL PRICING GUIDELINES:
- Use current 2024-2025 market values for electronics and brand items
- iPhone 15 Pro Max: $800-1200 depending on condition
- Latest MacBooks: $1000-3000 depending on model
- Gaming consoles: $300-800 depending on generation
- Designer items: Research actual resale values
- Vintage items: Consider collector value
- Don't undervalue modern electronics - they retain significant value

IMPORTANT: 
- estimated_value must be a NUMBER, not a string
- confidence_level must be a NUMBER from 1-10
- Return ONLY the JSON object, no other text
- Be realistic about current market prices, especially for electronics and luxury items
- Consider the item's actual resale/trade value, not just depreciated value`
              },
              {
                type: "image_url",
                image_url: {
                  url: base64Image
                }
              }
            ]
          }
        ],
        max_tokens: 600,
        temperature: 0.2
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API Error Response:', errorText);
      try {
        const error = JSON.parse(errorText);
        throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
      } catch {
        throw new Error(`OpenAI API error: ${response.statusText} - ${errorText}`);
      }
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    console.log('OpenAI Response Content:', content);
    
    // Parse JSON response - try multiple approaches
    try {
      let parsed;
      
      // First try direct JSON parse
      try {
        parsed = JSON.parse(content);
      } catch {
        // If that fails, try to extract JSON from markdown code blocks
        const jsonMatch = content.match(/```(?:json)?\n?(.*?)\n?```/s);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[1]);
        } else {
          // Try to extract JSON object from text
          const objectMatch = content.match(/\{[\s\S]*\}/);
          if (objectMatch) {
            parsed = JSON.parse(objectMatch[0]);
          } else {
            throw new Error('No JSON found in response');
          }
        }
      }
      
      return {
        category: parsed.category || 'other',
        suggestedName: parsed.name || 'Unknown Item',
        suggestedDescription: parsed.description || 'Item from image',
        estimatedValue: Number(parsed.estimated_value) || 100,
        condition: parsed.condition || 'good',
        qualityAnalysis: parsed.quality_analysis || 'Analysis not available',
        pricingFactors: parsed.pricing_factors || 'Factors not specified',
        confidenceLevel: Number(parsed.confidence_level) || 5
      };
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', content);
      console.error('Parse error:', parseError);
      throw new Error('Failed to parse AI response. Please try again.');
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
};

export const generateBarterSuggestions = async (userItem, userPreferences, availableItems) => {
  if (!OPENAI_API_KEY || OPENAI_API_KEY === 'YOUR_OPENAI_API_KEY_HERE') {
    throw new Error('OpenAI API key is required. Please add VITE_OPENAI_API_KEY to your .env.local file');
  }

  try {
    const itemsForAnalysis = availableItems.slice(0, 15).map((item, index) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      description: item.description,
      estimatedValue: item.estimatedValue || 100,
      zipcode: item.zipcode
    }));

    const prompt = `Analyze barter matches for the following scenario:

USER'S ITEM:
- Name: "${userItem.name}"
- Category: ${userItem.category}
- Description: ${userItem.description || 'No description'}
- Estimated Value: $${userItem.estimatedValue}

USER'S PREFERENCES:
"${userPreferences}"

AVAILABLE ITEMS FOR BARTER:
${JSON.stringify(itemsForAnalysis, null, 2)}

Please suggest the top 5 best barter matches and return a JSON array with this structure:
[
  {
    "itemId": number,
    "matchScore": number (1-100),
    "reason": "detailed explanation why this is a good match"
  }
]

Consider:
1. Value similarity (within reasonable range)
2. User preferences and interests
3. Category compatibility
4. Practical trade value
5. Geographic proximity if relevant

Return only the JSON array, no other text.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 800,
        temperature: 0.4
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content.trim();
    
    try {
      const suggestions = JSON.parse(content);
      
      return suggestions.map(suggestion => {
        const item = availableItems.find(item => item.id === suggestion.itemId);
        return item ? {
          ...item,
          matchScore: suggestion.matchScore,
          matchReason: suggestion.reason
        } : null;
      }).filter(Boolean);
      
    } catch (parseError) {
      console.error('Failed to parse barter suggestions:', content);
      throw new Error('Failed to parse AI suggestions. Please try again.');
    }
  } catch (error) {
    console.error('OpenAI barter suggestion error:', error);
    throw error;
  }
};

// Helper functions
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    // Check file type
    console.log('File type:', file.type);
    console.log('File size:', file.size, 'bytes');
    
    if (!file.type.startsWith('image/')) {
      reject(new Error('File must be an image'));
      return;
    }
    
    // Check file size (max 20MB)
    if (file.size > 20 * 1024 * 1024) {
      reject(new Error('Image too large. Please choose a smaller image.'));
      return;
    }
    
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result;
      console.log('Base64 data URL prefix:', result.substring(0, 50));
      resolve(result);
    };
    reader.onerror = error => {
      console.error('FileReader error:', error);
      reject(error);
    };
  });
};

// Removed mock functions as we now use real OpenAI API