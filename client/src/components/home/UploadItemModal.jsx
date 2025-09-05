import { useEffect, useState } from "react";
import { addItem, findSimilarItems, getUserById, getItems } from "../../shared/utils/items.js"
import { analyzeImageAndGenerateCategory, generateBarterSuggestions } from "../../shared/services/openai.js"
import MapComponent from "../shared/MapComponent"
import ChatInterface from "../shared/ChatInterface"

export function UploadItemModal({ isOpen, onClose, onItemAdded }) {
  const [name, setName] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageURL, setImageURL] = useState("");
  const [similarItems, setSimilarItems] = useState([]);
  const [showSimilarItems, setShowSimilarItems] = useState(false);
  const [chatItem, setChatItem] = useState(null);
  const [currentUserItem, setCurrentUserItem] = useState(null);
  
  // OpenAI integration states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [estimatedValue, setEstimatedValue] = useState("");
  const [barterPreferences, setBarterPreferences] = useState("");
  const [barterSuggestions, setBarterSuggestions] = useState([]);
  const [showBarterSuggestions, setShowBarterSuggestions] = useState(false);
  const [analysisError, setAnalysisError] = useState("");

  // Close on ESC
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  // Preview for selected image and process upload with OpenAI analysis
  useEffect(() => {
    if (!imageFile) {
      setImageURL("");
      return;
    }
    
    // Create preview URL
    const url = URL.createObjectURL(imageFile);
    setImageURL(url);
    
    // Auto-analyze image with OpenAI when uploaded
    analyzeImageWithOpenAI(imageFile);
    
    // Convert image to base64 for storage (mock persistent storage)
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setImageURL(base64String);
    };
    reader.readAsDataURL(imageFile);
    
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const analyzeImageWithOpenAI = async (file) => {
    setIsAnalyzing(true);
    setAnalysisError("");
    
    try {
      const analysis = await analyzeImageAndGenerateCategory(file);
      
      // Auto-populate form fields with AI suggestions
      if (!name) setName(analysis.suggestedName);
      if (!description) setDescription(analysis.suggestedDescription);
      if (!category) setCategory(analysis.category);
      setEstimatedValue(analysis.estimatedValue.toString());
      
    } catch (error) {
      console.error('Image analysis failed:', error);
      setAnalysisError(error.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const findEq = async () => {
    if (!name || !description) {
      alert("Please enter both name and description to find equivalents");
      return;
    }

    const tempItem = { 
      name, 
      description, 
      category, 
      zipcode,
      estimatedValue: estimatedValue ? parseInt(estimatedValue) : 100
    };
    
    // Find similar items using existing algorithm
    const similar = findSimilarItems(tempItem);
    setSimilarItems(similar);
    setShowSimilarItems(true);
    
    // Generate intelligent barter suggestions if preferences are provided
    if (barterPreferences.trim()) {
      try {
        const availableItems = getItems();
        const suggestions = await generateBarterSuggestions(tempItem, barterPreferences, availableItems);
        setBarterSuggestions(suggestions);
        setShowBarterSuggestions(true);
      } catch (error) {
        console.error('Barter suggestions failed:', error);
        // Fall back to regular similar items if OpenAI fails
      }
    }
  }

  const uploadItem = () => {
    if (!name || !zipcode || !description) {
      alert("Please fill in all required fields");
      return;
    }

    const newItem = {
      name,
      zipcode,
      description,
      category: category || "other",
      radius: 0,
      image: imageURL || null,
      estimatedValue: estimatedValue ? parseInt(estimatedValue) : 100
    };

    const addedItem = addItem(newItem);
    onItemAdded?.(addedItem);
    
    // Reset form
    setName("");
    setZipcode("");
    setDescription("");
    setCategory("");
    setImageFile(null);
    setImageURL("");
    setSimilarItems([]);
    setShowSimilarItems(false);
    setChatItem(null);
    setCurrentUserItem(null);
    setEstimatedValue("");
    setBarterPreferences("");
    setBarterSuggestions([]);
    setShowBarterSuggestions(false);
    setAnalysisError("");
    
    onClose();
  }

  const handleItemClick = (item) => {
    // Create current user's item from form data
    const userItem = {
      id: 'temp',
      name,
      description,
      category: category || "other",
      zipcode,
      image: imageURL || null,
      estimatedValue: estimatedValue ? parseInt(estimatedValue) : 100
    };
    
    setCurrentUserItem(userItem);
    setChatItem(item);
  };

  const handleTradeComplete = (meetupAddress) => {
    alert(`Trade confirmed! Meetup at: ${meetupAddress}`);
    setChatItem(null);
    setCurrentUserItem(null);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="upload-item-title"
      className={`fixed inset-0 flex items-center justify-center p-4 transition-all duration-300 ${
        isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
      }`}
      style={{ zIndex: 50 }}
    >
      <div className="w-full max-w-lg rounded-2xl border bg-white shadow-xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 id="upload-item-title" className="text-lg font-semibold">Upload Item</h2>
          <button onClick={onClose} className="p-2 text-black/60 hover:text-black" aria-label="Close">✕</button>
        </div>

        <div className="p-4 grid gap-4 max-h-[70vh] overflow-y-auto">
          {/* 1. Name */}
          <label className="grid gap-1">
            <span className="text-sm font-medium">Name *</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded px-3 py-2"
              placeholder="e.g., Vintage Lamp"
            />
          </label>

          {/* 2. Description */}
          <label className="grid gap-1">
            <span className="text-sm font-medium">Description *</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border rounded px-3 py-2 h-20 resize-none"
              placeholder="Describe your item in detail..."
            />
          </label>

          {/* 3. Category */}
          <label className="grid gap-1">
            <span className="text-sm font-medium">Category</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="">Select category</option>
              <option value="clothing">Clothing</option>
              <option value="electronics">Electronics</option>
              <option value="furniture">Furniture</option>
              <option value="sports">Sports</option>
              <option value="music">Music</option>
              <option value="books">Books</option>
              <option value="other">Other</option>
            </select>
          </label>

          {/* 4. Image */}
          <div className="grid gap-2">
            <span className="text-sm font-medium">Image</span>
            {imageURL ? (
              <div className="relative">
                <img src={imageURL} alt="Preview" className="w-full h-48 object-cover rounded border" />
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded">
                    <div className="text-white text-center">
                      <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full mx-auto mb-2"></div>
                      <p className="text-sm">Analyzing image...</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-48 rounded border grid place-items-center text-sm text-neutral-600">
                No image selected
              </div>
            )}
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
            {analysisError && (
              <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{analysisError}</p>
            )}
          </div>

          {/* 4.5. Estimated Value */}
          <label className="grid gap-1">
            <span className="text-sm font-medium">Estimated Value (USD)</span>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={estimatedValue}
                onChange={(e) => setEstimatedValue(e.target.value)}
                className="border rounded px-8 py-2 w-full"
                placeholder="100"
                min="1"
                max="50000"
              />
            </div>
            {estimatedValue && (
              <p className="text-xs text-gray-500">Suggested by AI, but you can edit this value</p>
            )}
          </label>

          {/* 5. Barter Preferences */}
          <label className="grid gap-1">
            <span className="text-sm font-medium">What are you looking to trade for?</span>
            <textarea
              value={barterPreferences}
              onChange={(e) => setBarterPreferences(e.target.value)}
              className="border rounded px-3 py-2 h-16 resize-none"
              placeholder="e.g., I'm interested in electronics, musical instruments, or books about programming..."
            />
            <p className="text-xs text-gray-500">This helps our AI suggest better matches for you</p>
          </label>

          {/* 6. Zipcode */}
          <label className="grid gap-1">
            <span className="text-sm font-medium">Zipcode *</span>
            <input
              type="text"
              inputMode="numeric"
              value={zipcode}
              onChange={(e) => setZipcode(e.target.value)}
              className="border rounded px-3 py-2"
              placeholder="90210"
            />
          </label>

          {/* 7. AI Barter Suggestions */}
          {showBarterSuggestions && barterSuggestions.length > 0 && (
            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">🤖 AI Barter Suggestions</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                  Based on your preferences
                </span>
              </div>
              <div className="border rounded p-3 max-h-40 overflow-y-auto bg-gradient-to-br from-green-50 to-blue-50">
                {barterSuggestions.map((item) => {
                  const owner = getUserById(item.ownerId);
                  return (
                    <div 
                      key={item.id} 
                      className="py-3 border-b last:border-b-0 hover:bg-white cursor-pointer rounded-lg px-2 transition-colors"
                      onClick={() => handleItemClick(item)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-green-600 hover:text-green-800">{item.name}</p>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                              {item.matchScore}% AI match
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{item.description}</p>
                          <p className="text-xs text-green-700 mb-1 italic">🤖 {item.matchReason}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span>{item.category}</span>
                            <span>${item.estimatedValue}</span>
                            <span>{item.zipcode}</span>
                            <span className="text-green-600">by {owner?.name || 'Unknown User'}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-green-600 font-medium">Click to chat</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 8. Similar Items Results */}
          {showSimilarItems && (
            <div className="grid gap-2">
              <span className="text-sm font-medium">Similar Items Found</span>
              {similarItems.length > 0 ? (
                <div className="border rounded p-3 max-h-40 overflow-y-auto">
                  {similarItems.map((item) => {
                    const owner = getUserById(item.ownerId);
                    return (
                      <div 
                        key={item.id} 
                        className="py-3 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer rounded-lg px-2 transition-colors"
                        onClick={() => handleItemClick(item)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-blue-600 hover:text-blue-800">{item.name}</p>
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                {item.similarityScore}% match
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{item.description}</p>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span>{item.category}</span>
                              <span>${item.estimatedValue || 'N/A'}</span>
                              <span>{item.zipcode}</span>
                              <span className="text-green-600">by {owner?.name || 'Unknown User'}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-blue-600 font-medium">Click to chat</div>
                            <svg className="w-4 h-4 text-blue-400 ml-auto mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6 border rounded">
                  <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <p className="text-sm text-gray-500">No similar items found.</p>
                  <p className="text-xs text-gray-400 mt-1">Try adjusting your description or category.</p>
                </div>
              )}
            </div>
          )}

          {/* 9. Map */}
          <div className="grid gap-1">
            <span className="text-sm font-medium">Location Preview</span>
            <MapComponent 
              zipcode={zipcode}
              items={[]}
              radius={10}
              height="250px"
            />
          </div>
        </div>

        <div className="p-6 border-t bg-gray-50 flex items-center justify-between">
          <button 
            onClick={() => findEq()} 
            className="bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Find Similar Items
          </button>
          
          <button 
            onClick={() => uploadItem()} 
            className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white px-8 py-2.5 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Upload Item
          </button>
        </div>
      </div>
      
      {/* Chat Interface */}
      {chatItem && currentUserItem && (
        <ChatInterface
          item={chatItem}
          currentUserItem={currentUserItem}
          onClose={() => {
            setChatItem(null);
            setCurrentUserItem(null);
          }}
          onTrade={handleTradeComplete}
        />
      )}
    </div>
  );
}


