export default function UploadButton({ onFilesSelected }) {

    return (
        <label className="inline-flex items-center gap-2 cursor-pointer w-fit mt-15">
            <span className="rounded px-4 py-2 border">Upload Item</span>
            <input className="sr-only" />
        </label>
    );
}