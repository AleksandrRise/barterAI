import { useState } from "react";
import ChatInterface from "../shared/ChatInterface";

function ListingCard({ item, onItemClick }) {
    const getCategoryColor = (category) => {
        const colors = {
            'electronics': 'bg-blue-100 text-blue-800 border-blue-200',
            'clothing': 'bg-purple-100 text-purple-800 border-purple-200',
            'furniture': 'bg-amber-100 text-amber-800 border-amber-200',
            'sports': 'bg-green-100 text-green-800 border-green-200',
            'music': 'bg-pink-100 text-pink-800 border-pink-200',
            'books': 'bg-indigo-100 text-indigo-800 border-indigo-200',
            'other': 'bg-gray-100 text-gray-800 border-gray-200'
        };
        return colors[category] || colors.other;
    };

    return (
        <li 
            className="bg-white rounded-xl shadow-md hover:shadow-lg border border-gray-200 p-6 transition-all duration-200 hover:scale-[1.02] cursor-pointer"
            onClick={() => onItemClick(item)}
        >
            <div className="flex gap-5">
                {/* Image */}
                <div className="w-24 h-24 flex-shrink-0">
                    {item.image ? (
                        <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover rounded-xl shadow-sm"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    )}
                </div>
                
                {/* Content */}
                <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-lg text-gray-900 leading-tight">{item.name}</h3>
                        {item.category && (
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${getCategoryColor(item.category)}`}>
                                {item.category}
                            </span>
                        )}
                    </div>
                    
                    {item.description && (
                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{item.description}</p>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="font-medium">{item.zipcode}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span>{item.radius} mi radius</span>
                        </div>
                    </div>
                </div>
            </div>
        </li>
    );
}

export default function Listings({ items }) {
    const [chatItem, setChatItem] = useState(null);
    const [currentUserItem, setCurrentUserItem] = useState(null);
    
    const handleItemClick = (item) => {
        // For listings, we'll use a mock user item
        const mockUserItem = {
            id: 'user-item',
            name: 'My Item',
            description: 'Something I want to trade',
            category: 'other',
            zipcode: '95192',
            image: null
        };
        
        setCurrentUserItem(mockUserItem);
        setChatItem(item);
    };
    
    const handleTradeComplete = (meetupAddress) => {
        alert(`Trade confirmed! Meetup at: ${meetupAddress}`);
        setChatItem(null);
        setCurrentUserItem(null);
    };
    if (!items?.length) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <div className="max-w-sm mx-auto">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
                    <p className="text-sm text-gray-600 mb-4">
                        Try widening your search radius or searching in a different zipcode.
                    </p>
                    <div className="text-xs text-gray-500">
                        Popular zipcodes: 90210, 10001, 33101, 95192
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                    Available Items ({items.length})
                </h2>
                <div className="text-sm text-gray-500">
                    Sorted by relevance
                </div>
            </div>
            <ul className="grid gap-4">
                {items.map((it) => (
                    <ListingCard key={it.id} item={it} onItemClick={handleItemClick} />
                ))}
            </ul>
            
            {/* Chat Interface */}
            {chatItem && currentUserItem && (
                <ChatInterface
                    item={chatItem}
                    currentUserItem={currentUserItem}
                    onClose={() => {
                        setChatItem(null);
                        setCurrentUserItem(null);
                    }}
                    onTrade={handleTradeComplete}
                />
            )}
        </div>
    );
}