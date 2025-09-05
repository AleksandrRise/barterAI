import UnifiedZipSearch from "../shared/UnifiedZipSearch";

export default function ZipSearch({ items, setItemsModified, onSearch }) {
  return (
    <UnifiedZipSearch 
      items={items}
      setItemsModified={setItemsModified}
      isLandingPage={false}
      showLocationDetect={true}
      onSearch={onSearch}
    />
  );
}
