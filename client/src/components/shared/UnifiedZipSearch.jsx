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
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // For demo purposes, we'll use a mock zipcode based on coordinates
            // In production, you'd use a geocoding service
            const mockZipcode = getMockZipcodeFromCoords(latitude, longitude);
            setZip(mockZipcode);
          } catch (error) {
            console.error("Error getting location:", error);
            alert("Unable to detect location. Please enter zipcode manually.");
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert("Unable to access location. Please enter zipcode manually.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const getMockZipcodeFromCoords = (lat, lng) => {
    // Mock function - in production you'd use a real geocoding service
    if (lat > 40 && lat < 41 && lng > -74 && lng < -73) return "10001"; // NYC area
    if (lat > 34 && lat < 35 && lng > -118.5 && lng < -117.5) return "90210"; // LA area
    if (lat > 25 && lat < 26 && lng > -80.5 && lng < -79.5) return "33101"; // Miami area
    return "90210"; // Default
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
        return item.radius <= radius && item.zipcode === zip;
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