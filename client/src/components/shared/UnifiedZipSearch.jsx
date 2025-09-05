import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UnifiedZipSearch({ 
  items, 
  setItemsModified, 
  isLandingPage = false,
  showLocationDetect = true,
  onSearch
}) {
  const [zip, setZip] = useState("");
  const [radius, setRadius] = useState(10);
  const navigate = useNavigate();

  const detectLocation = () => {
    setZip("95192");
  };


  const handleSearch = (e) => {
    e.preventDefault();

    if (!zip) {
      alert("Please enter a zipcode");
      return;
    }

    if (isLandingPage) {
      // Navigate to home page with search parameters
      navigate(`/home?zip=${zip}&radius=${radius}`);
      return;
    }

    // Filter items by zip and radius for home page
    if (items && setItemsModified) {
      const results = items.filter((item) => {
        // Exact zipcode match
        if (item.zipcode === zip) return true;
        // Universal items (zipcode "00000") are always included
        if (item.zipcode === "00000") return true;
        // If no exact matches, include items within reasonable radius
        return item.radius >= radius * 0.5; // Show items with larger radius as fallback
      });
      setItemsModified([...results]);
      
    }
    
    // Notify parent component about search
    onSearch?.(zip, radius);
  };

  return (
    <form onSubmit={handleSearch} className="p-4 space-y-2">
      <div className="flex gap-3">
        <input
          type="text"
          value={zip}
          onChange={(e) => setZip(e.target.value)}
          placeholder="Enter zipcode"
          className="border px-3 py-2 rounded w-full"
          inputMode="numeric"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
        >
          Search
        </button>
      </div>

      {/* Radius slider */}
      <div className="space-y-2">
        <label className="block font-medium">
          Search Radius: {radius} miles
        </label>
        <input
          type="range"
          min="1"
          max="100"
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Detect location */}
      {showLocationDetect && (
        <button
          type="button"
          className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded w-full transition-colors"
          onClick={detectLocation}
        >
          🌍 Detect your location
        </button>
      )}
    </form>
  );
}