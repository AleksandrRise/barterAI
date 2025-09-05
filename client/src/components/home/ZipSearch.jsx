import { useEffect, useState } from "react";

export default function ZipSearch({ items, setItems, setItemsModified }) {
  const [zip, setZip] = useState("");
  const [radius, setRadius] = useState(10);

  const handleSearch = (e) => {
    e.preventDefault();

    if (!zip) {
      alert("Please enter a zipcode");
      return;
    }

    // Filter items by zip
    const results = items.filter((item) => {
      return item.radius <= radius && item.zipcode === zip
    });

    setItemsModified([...results])
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
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {/* Radius slider */}
      <div className="space-y-2">
        <label className="block font-medium">
          Search Radius: {radius} m
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
    </form>
  );
}
