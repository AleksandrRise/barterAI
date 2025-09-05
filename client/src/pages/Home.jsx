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
        <main className="px-5">
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
            <div className="flex items-center gap-4 my-4">
                <button
                    onClick={() => setShowMap(!showMap)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                    {showMap ? "Show List View" : "Show Map View"}
                </button>
                <span className="text-sm text-gray-600">
                    {itemsModified.length} items found
                </span>
            </div>

            {/* Map or List View */}
            {showMap ? (
                <div className="mt-4">
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
    )
}