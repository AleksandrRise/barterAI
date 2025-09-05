function ListingCard({ item }) {
    return (
        <li className="border rounded-xl p-4 flex items-center justify-between">
            <div className="space-y-1">
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-neutral-600">ZIP: {item.zipcode}</div>
            </div>
            <div className="text-xs text-neutral-600">Item radius: {item.radius} miles</div>
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