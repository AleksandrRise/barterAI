import { useEffect, useState } from "react";

export function UploadItemModal({ isOpen, onClose, onUpload, onFindEquivalent }) {
  const [name, setName] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageURL, setImageURL] = useState("");

  // Close on ESC
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  // Preview for selected image
  useEffect(() => {
    if (!imageFile) {
      setImageURL("");
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setImageURL(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const payload = () => ({ name: name.trim(), zipcode: zipcode.trim(), imageFile });

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

        <div className="p-4 grid gap-4">
          {/* 1. Name */}
          <label className="grid gap-1">
            <span className="text-sm font-medium">Name</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded px-3 py-2"
              placeholder="e.g., Vintage Lamp"
            />
          </label>

          {/* 2. Image */}
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

          {/* 3. Zipcode */}
          <label className="grid gap-1">
            <span className="text-sm font-medium">Zipcode</span>
            <input
              type="text"
              inputMode="numeric"
              pattern="\\d{5}"
              value={zipcode}
              onChange={(e) => setZipcode(e.target.value)}
              className="border rounded px-3 py-2"
              placeholder="90210"
            />
          </label>

          {/* 4. Map placeholder */}
          <div className="grid gap-1">
            <span className="text-sm font-medium">Location (Map placeholder)</span>
            <div className="h-40 w-full rounded bg-neutral-200 border grid place-items-center text-neutral-600">
              Google Maps goes here
            </div>
          </div>
        </div>

        <div className="p-4 border-t flex items-center justify-end gap-3">
          {/* 6. Find equivalent button */}
          <button onClick={() => onFindEquivalent?.(payload())} className="rounded px-4 py-2 border">
            Find equivalent
          </button>
          {/* 5. Upload Button */}
          <button onClick={() => onUpload?.(payload())} className="rounded px-4 py-2 bg-black text-white">
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}


