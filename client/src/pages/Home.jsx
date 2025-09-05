import PageHeader from "../components/home/PageHeader"
import ZipSearch from "../components/home/ZipSearch"
import UploadButton from "../components/home/UploadButton"
import Listings from "../components/home/Listings"
import MapComponent from "../components/shared/MapComponent"
import { getItems } from "../shared/utils/items.js"
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"

export default function Home() {
    const [searchParams] = useSearchParams()
    const [items, setItems] = useState(getItems())
    const [itemsModified, setItemsModified] = useState([...items])
    const [currentZip, setCurrentZip] = useState("")
    const [currentRadius, setCurrentRadius] = useState(10)
    const [showMap, setShowMap] = useState(true)

    const handleItemAdded = () => {
        const updatedItems = getItems()
        setItems(updatedItems)
        setItemsModified(updatedItems)
    }

    useEffect(() => {
        const currentItems = getItems()
        setItems(currentItems)
        
        // Check if we have search parameters from landing page
        const zipParam = searchParams.get('zip')
        const radiusParam = searchParams.get('radius')
        
        if (zipParam) {
            const radius = radiusParam ? parseInt(radiusParam) : 10
            setCurrentZip(zipParam)
            setCurrentRadius(radius)
            const filteredItems = currentItems.filter((item) => {
                return item.radius <= radius && item.zipcode === zipParam
            })
            setItemsModified(filteredItems)
        } else {
            setItemsModified(currentItems)
        }
    }, [searchParams])

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <PageHeader />
                <ZipSearch 
                    items={items} 
                    setItemsModified={setItemsModified} 
                    onSearch={(zip, radius) => {
                        setCurrentZip(zip)
                        setCurrentRadius(radius)
                    }}
                />
                <UploadButton onItemAdded={handleItemAdded} />
                
                {/* Toggle Map/List View */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <h2 className="text-lg font-semibold text-gray-900">View Options</h2>
                            <div className="bg-gray-100 rounded-lg p-1 flex">
                                <button
                                    onClick={() => setShowMap(false)}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                                        !showMap 
                                            ? 'bg-white text-gray-900 shadow-sm' 
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                    </svg>
                                    List View
                                </button>
                                <button
                                    onClick={() => setShowMap(true)}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                                        showMap 
                                            ? 'bg-white text-gray-900 shadow-sm' 
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                    </svg>
                                    Map View
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                            <span className="text-sm text-gray-600 font-medium">
                                {itemsModified.length} items found
                            </span>
                        </div>
                    </div>
                </div>

                {/* Map or List View */}
                {showMap ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <MapComponent 
                            items={itemsModified}
                            zipcode={currentZip}
                            radius={currentRadius}
                            height="500px"
                        />
                    </div>
                ) : (
                    <Listings items={itemsModified} />
                )}
            </main>
        </div>
    )
}