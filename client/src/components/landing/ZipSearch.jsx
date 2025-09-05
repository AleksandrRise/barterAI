import { useState } from "react";
import data from "../../shared/utils/items.js";

export default function ZipSearch() {
  const [zip, setZip] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();

    if (!zip) {
      console.log("Please enter a zipcode");
      return;
    }

    // Filter items by zip
    const results = data.filter((item) => item.zipcode === zip);

    console.log("Results:", results);
  };

  return (
    <form onSubmit={handleSearch} className="p-4 space-y-2">
      <input
        type="text"
        value={zip}
        onChange={(e) => setZip(e.target.value)}
        placeholder="Enter zipcode"
        className="border px-3 py-2 rounded"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Search
      </button>

      <button
        type="button"
        className="bg-green-700 text-white px-4 py-2 rounded w-full"
      >
        Detect your location
      </button>
    </form>
  );
}
