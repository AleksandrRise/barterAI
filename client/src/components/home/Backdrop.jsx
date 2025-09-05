export function Backdrop({ isOpen, onClick }) {
    return (
        <div
            className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ${
            isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
            onClick={onClick}
            aria-hidden="true"
            style={{ zIndex: 40 }}
        />
    );
}