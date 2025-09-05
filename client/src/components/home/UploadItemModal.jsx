import { useEffect, useState } from "react";
import { addItem, findSimilarItems } from "../../shared/utils/items.js"
import MapComponent from "../shared/MapComponent"

export function UploadItemModal({ isOpen, onClose, onItemAdded }) {
  const [name, setName] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageURL, setImageURL] = useState("");
  const [similarItems, setSimilarItems] = useState([]);
  const [showSimilarItems, setShowSimilarItems] = useState(false);

  // Close on ESC
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  // Preview for selected image and process upload
  useEffect(() => {
    if (!imageFile) {
      setImageURL("");
      return;
    }
    
    // Create preview URL
    const url = URL.createObjectURL(imageFile);
    setImageURL(url);
    
    // Convert image to base64 for storage (mock persistent storage)
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      // In a real app, you'd upload to a cloud service here
      // For now, we'll store the base64 in our mock system
      setImageURL(base64String);
    };
    reader.readAsDataURL(imageFile);
    
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const findEq = () => {
    if (!name || !description) {
      alert("Please enter both name and description to find equivalents");
      return;
    }

    const tempItem = { name, description, category, zipcode };
    const similar = findSimilarItems(tempItem);
    setSimilarItems(similar);
    setShowSimilarItems(true);
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
      image: imageURL || null
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
    
    onClose();
  }

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
              <img src={imageURL} alt="Preview" className="w-full h-48 object-cover rounded border" />
            ) : (
              <div className="w-full h-48 rounded border grid place-items-center text-sm text-neutral-600">
                No image selected
              </div>
            )}
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
          </div>

          {/* 5. Zipcode */}
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

          {/* 6. Similar Items Results */}
          {showSimilarItems && (
            <div className="grid gap-2">
              <span className="text-sm font-medium">Similar Items Found</span>
              {similarItems.length > 0 ? (
                <div className="border rounded p-3 max-h-40 overflow-y-auto">
                  {similarItems.map((item) => (
                    <div key={item.id} className="py-2 border-b last:border-b-0 flex justify-between">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">{item.description}</p>
                        <p className="text-xs text-gray-500">
                          {item.category} • {item.zipcode} • Score: {item.similarityScore}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 p-3 border rounded">No similar items found.</p>
              )}
            </div>
          )}

          {/* 7. Map */}
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

        <div className="p-4 border-t flex items-center justify-end gap-3">
          {/* 6. Find equivalent button */}
          <button onClick={() => findEq()} className="rounded px-4 py-2 border">
            Find equivalent
          </button>
          {/* 5. Upload Button */}
          <button onClick={() => uploadItem()} className="rounded px-4 py-2 bg-black text-white">
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}


