import { UploadItemModal } from "./UploadItemModal";
import { Backdrop } from "./Backdrop";
import { useState } from "react";

export default function UploadButton({ onItemAdded }) {

    const [open, setOpen] = useState(false);

    return (
        <div className="inline-flex items-center gap-2 cursor-pointer w-fit mt-15">
            <button className="rounded px-4 py-2 border" onClick={() => setOpen(true)}>Upload item</button>

            <Backdrop isOpen={open} onClick={() => setOpen(false)} />

            <UploadItemModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onItemAdded={onItemAdded}
            />
        </div>
    );
}