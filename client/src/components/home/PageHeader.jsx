export default function PageHeader() {
    return (
        <header className="border-b sticky top-0 bg-white/80 backdrop-blur p-4">
            <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold">Home</h1>
                <nav className="text-sm flex items-center gap-4">
                    <a href="/" className="hover:underline">Landing</a>
                    <a href="/home" className="font-medium hover:underline">Home</a>
                    <a href="/dashboard" className="hover:underline">Dashboard</a>
                </nav>
            </div>
        </header>
    );
}