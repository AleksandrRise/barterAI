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
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
      <form onSubmit={handleSearch} className="space-y-5">
        {/* Search input section */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                placeholder="Enter zipcode (e.g., 95192)"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm font-medium"
                inputMode="numeric"
              />
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              Search
            </button>
          </div>

          {/* Detect location button */}
          {showLocationDetect && (
            <button
              type="button"
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              onClick={detectLocation}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Detect My Location
            </button>
          )}
        </div>

        {/* Radius slider section */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Search Radius
            </label>
            <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
              {radius} miles
            </span>
          </div>
          <div className="relative">
            <input
              type="range"
              min="1"
              max="100"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${radius}%, #e5e7eb ${radius}%, #e5e7eb 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1 mi</span>
              <span>50 mi</span>
              <span>100 mi</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}