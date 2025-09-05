import { useEffect, useRef, useState } from 'react';

// Mock Google Maps implementation for development
const MapComponent = ({ items = [], zipcode, radius = 10, height = "400px" }) => {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Mock zipcode to coordinates mapping
  const getCoordinatesFromZip = (zip) => {
    const zipCoords = {
      '10001': { lat: 40.7505, lng: -73.9934 }, // NYC
      '90210': { lat: 34.0901, lng: -118.4065 }, // Beverly Hills
      '33101': { lat: 25.7897, lng: -80.1311 }, // Miami
      '60601': { lat: 41.8781, lng: -87.6298 }, // Chicago
      '94102': { lat: 37.7749, lng: -122.4194 }, // San Francisco
    };
    return zipCoords[zip] || { lat: 39.8283, lng: -98.5795 }; // Center of US as fallback
  };

  const loadGoogleMaps = () => {
    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      initializeMap();
      return;
    }

    // For development, we'll create a mock map
    // In production, you would load the real Google Maps API like this:
    // const script = document.createElement('script');
    // script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap`;
    // script.async = true;
    // document.head.appendChild(script);
    
    // Mock implementation
    setTimeout(() => {
      setMapLoaded(true);
      initializeMockMap();
    }, 1000);
  };

  const initializeMap = () => {
    if (!mapRef.current) return;

    const center = zipcode ? getCoordinatesFromZip(zipcode) : { lat: 39.8283, lng: -98.5795 };
    
    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 10,
      center: center,
    });

    // Add markers for items
    items.forEach((item) => {
      const itemCoords = getCoordinatesFromZip(item.zipcode);
      
      const marker = new window.google.maps.Marker({
        position: itemCoords,
        map: map,
        title: item.name,
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${item.name}</h3>
            <p style="margin: 0 0 4px 0; font-size: 14px; color: #666;">${item.description || 'No description available'}</p>
            <p style="margin: 0; font-size: 12px; color: #999;">
              <strong>Category:</strong> ${item.category || 'Other'} | 
              <strong>Zipcode:</strong> ${item.zipcode}
            </p>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });
    });

    // Add radius circle if zipcode is provided
    if (zipcode) {
      new window.google.maps.Circle({
        strokeColor: '#4285f4',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#4285f4',
        fillOpacity: 0.1,
        map: map,
        center: center,
        radius: radius * 1609.34, // Convert miles to meters
      });
    }
  };

  const initializeMockMap = () => {
    if (!mapRef.current) return;

    // Create a mock map visualization
    mapRef.current.innerHTML = `
      <div style="
        width: 100%; 
        height: 100%; 
        background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
        border-radius: 8px;
        position: relative;
        overflow: hidden;
      ">
        <div style="
          position: absolute;
          top: 10px;
          left: 10px;
          background: white;
          padding: 8px 12px;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          font-size: 12px;
          font-weight: bold;
        ">
          Mock Google Maps View
        </div>
        
        <div style="
          position: absolute;
          bottom: 10px;
          left: 10px;
          background: white;
          padding: 8px 12px;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          font-size: 11px;
        ">
          ${zipcode ? `Showing items near ${zipcode}` : 'All items'}<br>
          ${items.length} items found within ${radius} miles
        </div>
        
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        ">
          ${items.map((item, index) => `
            <div style="
              position: absolute;
              width: 20px;
              height: 20px;
              background: #ff4444;
              border: 2px solid white;
              border-radius: 50%;
              cursor: pointer;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              transform: translate(${(index * 30) - (items.length * 15)}px, ${(index % 2) * 30 - 15}px);
            " 
            title="${item.name} - ${item.zipcode}">
            </div>
          `).join('')}
        </div>
        
        <div style="
          position: absolute;
          bottom: 10px;
          right: 10px;
          color: #666;
          font-size: 10px;
        ">
          To enable real maps, add Google Maps API key
        </div>
      </div>
    `;
  };

  useEffect(() => {
    loadGoogleMaps();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (mapLoaded) {
      if (window.google && window.google.maps) {
        initializeMap();
      } else {
        initializeMockMap();
      }
    }
  }, [items, zipcode, radius, mapLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div 
      ref={mapRef} 
      style={{ width: '100%', height: height }}
      className="border rounded-lg"
    />
  );
};

export default MapComponent;