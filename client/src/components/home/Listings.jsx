function ListingCard({ item }) {
    return (
        <li className="border rounded-xl p-4 flex gap-4">
            {/* Image */}
            <div className="w-20 h-20 flex-shrink-0">
                {item.image ? (
                    <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg border"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-100 rounded-lg border flex items-center justify-center text-gray-400 text-xs">
                        No Image
                    </div>
                )}
            </div>
            
            {/* Content */}
            <div className="flex-1 space-y-1">
                <div className="font-medium">{item.name}</div>
                {item.description && (
                    <div className="text-sm text-gray-600 line-clamp-2">{item.description}</div>
                )}
                <div className="flex items-center gap-4 text-xs text-neutral-600">
                    <span>ZIP: {item.zipcode}</span>
                    <span>Radius: {item.radius} miles</span>
                    {item.category && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{item.category}</span>}
                </div>
            </div>
        </li>
    );
}

export default function Listings({ items }) {
    if (!items?.length) {
        return (
            <div className="text-sm text-neutral-600 mt-3">No results. Try widening the radius or a different zip.</div>
        );
    }


    return (
        <ul className="grid gap-3 mt-5">
            {items.map((it) => (
                <ListingCard key={it.id} item={it} />
            ))}
        </ul>
    );
}