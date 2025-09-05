const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export const analyzeImageAndGenerateCategory = async (imageFile) => {
  if (!OPENAI_API_KEY || OPENAI_API_KEY === 'YOUR_OPENAI_API_KEY_HERE') {
    throw new Error('OpenAI API key is required. Please add VITE_OPENAI_API_KEY to your .env.local file');
  }

  // Convert image to base64
  const base64Image = await fileToBase64(imageFile);

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
                text: `Analyze this image and provide a JSON response with the following structure:
{
  "category": "one of: electronics, clothing, furniture, sports, music, books, other",
  "name": "descriptive item name (2-4 words)",
  "description": "detailed description of the item (1-2 sentences)",
  "estimated_value": "estimated USD value as a number"
}

Be specific and accurate. Consider condition, brand, and market value.`
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
        max_tokens: 400,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse JSON response
    try {
      const parsed = JSON.parse(content);
      return {
        category: parsed.category,
        suggestedName: parsed.name,
        suggestedDescription: parsed.description,
        estimatedValue: parsed.estimated_value
      };
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', content);
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
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

// Removed mock functions as we now use real OpenAI API