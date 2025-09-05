import { UploadItemModal } from "./UploadItemModal";
import { Backdrop } from "./Backdrop";
import { useState } from "react";

export default function UploadButton({ onItemAdded }) {

    const [open, setOpen] = useState(false);

    return (
        <div className="flex justify-center mb-6">
            <button 
                className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-3"
                onClick={() => setOpen(true)}
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Upload New Item
            </button>

            <Backdrop isOpen={open} onClick={() => setOpen(false)} />

            <UploadItemModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onItemAdded={onItemAdded}
            />
        </div>
    );
}