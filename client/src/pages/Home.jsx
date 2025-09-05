import PageHeader from "../components/home/PageHeader"
import ZipSearch from "../components/home/ZipSearch"
import UploadButton from "../components/home/UploadButton"
import Listings from "../components/home/Listings"
import data from "../shared/utils/items.js"
import { useEffect, useState } from "react"

export default function Home() {

    const [items, setItems] = useState([...data])
    const [itemsModified, setItemsModified] = useState([...items])

    useEffect(() => {
        setItems([...data])
    }, [data])

    return (
        <main className="px-5">
            <PageHeader />
            <ZipSearch items={items} setItems={setItems} setItemsModified={setItemsModified} />
            <UploadButton />
            <Listings items={itemsModified} />
        </main>
    )
}