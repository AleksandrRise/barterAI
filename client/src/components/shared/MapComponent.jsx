import { useEffect, useRef, useState } from 'react';

// Mock Google Maps implementation for development
const MapComponent = ({ items = [], zipcode, radius = 10, height = "400px" }) => {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [coordinateCache, setCoordinateCache] = useState(new Map());

  // Enhanced geocoding function using Google's Geocoding API
  const getCoordinatesFromZip = async (zip) => {
    if (!zip) return { lat: 39.8283, lng: -98.5795 }; // Default center of US
    
    // Check cache first
    if (coordinateCache.has(zip)) {
      return coordinateCache.get(zip);
    }

    // Mock zipcode to coordinates mapping as fallback
    const mockCoords = {
      '10001': { lat: 40.7505, lng: -73.9934 }, // NYC
      '90210': { lat: 34.0901, lng: -118.4065 }, // Beverly Hills
      '33101': { lat: 25.7897, lng: -80.1311 }, // Miami
      '60601': { lat: 41.8781, lng: -87.6298 }, // Chicago
      '94102': { lat: 37.7749, lng: -122.4194 }, // San Francisco
      '02101': { lat: 42.3601, lng: -71.0589 }, // Boston
      '75201': { lat: 32.7767, lng: -96.7970 }, // Dallas
      '77001': { lat: 29.7604, lng: -95.3698 }, // Houston
      '98101': { lat: 47.6062, lng: -122.3321 }, // Seattle
      '30301': { lat: 33.7490, lng: -84.3880 }, // Atlanta
      
      // San Jose area zipcodes
      '95192': { lat: 37.3382, lng: -121.8863 }, // San Jose - East
      '95112': { lat: 37.3541, lng: -121.9018 }, // San Jose - Downtown
      '95126': { lat: 37.3220, lng: -121.9058 }, // San Jose - Willow Glen
      '95118': { lat: 37.2322, lng: -121.7934 }, // San Jose - Almaden
      '95110': { lat: 37.3387, lng: -121.8914 }, // San Jose - Central
      '95124': { lat: 37.2677, lng: -121.9473 }, // San Jose - Cambrian
      '95127': { lat: 37.3686, lng: -121.8169 }, // San Jose - Alum Rock
      '95132': { lat: 37.4419, lng: -121.9132 }, // San Jose - North
      '95136': { lat: 37.2835, lng: -121.8597 }, // San Jose - Blossom Valley
      '95148': { lat: 37.2358, lng: -121.8011 }, // San Jose - Edenvale
      '95123': { lat: 37.2677, lng: -121.8308 }, // San Jose - Santa Teresa
    };

    // If Google Maps is loaded, use real geocoding
    if (window.google && window.google.maps && window.google.maps.Geocoder) {
      try {
        const geocoder = new window.google.maps.Geocoder();
        const result = await new Promise((resolve, reject) => {
          geocoder.geocode({ address: zip }, (results, status) => {
            if (status === 'OK' && results[0]) {
              const location = results[0].geometry.location;
              const coords = { lat: location.lat(), lng: location.lng() };
              resolve(coords);
            } else {
              reject(new Error(`Geocoding failed: ${status}`));
            }
          });
        });
        
        // Cache the result
        setCoordinateCache(prev => new Map(prev.set(zip, result)));
        return result;
      } catch (error) {
        console.warn(`Failed to geocode ${zip}:`, error);
      }
    }

    // Fallback to mock coordinates
    const fallback = mockCoords[zip] || { lat: 39.8283, lng: -98.5795 };
    setCoordinateCache(prev => new Map(prev.set(zip, fallback)));
    return fallback;
  };

  const loadGoogleMaps = () => {
    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      initializeMap();
      return;
    }

    // Get API key from environment variable (recommended) or hardcode it
    const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE';
    
    if (GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY !== 'YOUR_API_KEY_HERE') {
      // Load real Google Maps API
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=geometry,places`;
      script.async = true;
      script.onload = () => {
        setMapLoaded(true);
        initializeMap();
      };
      script.onerror = () => {
        console.error('Failed to load Google Maps API');
        setMapLoaded(true);
        initializeMockMap();
      };
      document.head.appendChild(script);
    } else {
      // Fallback to mock implementation
      console.log('No Google Maps API key found, using mock map');
      setTimeout(() => {
        setMapLoaded(true);
        initializeMockMap();
      }, 1000);
    }
  };

  const initializeMap = async () => {
    if (!mapRef.current) return;

    // Get center coordinates
    const center = zipcode 
      ? await getCoordinatesFromZip(zipcode) 
      : { lat: 39.8283, lng: -98.5795 };
    
    const map = new window.google.maps.Map(mapRef.current, {
      zoom: zipcode ? 12 : 4, // Zoom in more for specific zipcode, out for general view
      center: center,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
      zoomControl: true,
    });

    // Function to get marker color based on category
    const getMarkerColor = (category) => {
      const colors = {
        'electronics': '#4285f4', // Blue
        'clothing': '#ea4335', // Red
        'furniture': '#fbbc04', // Yellow
        'sports': '#34a853', // Green
        'music': '#9c27b0', // Purple
        'books': '#ff6d01', // Orange
        'other': '#6c757d' // Gray
      };
      return colors[category] || colors.other;
    };

    // Add markers for items with real coordinates
    const markerPromises = items.map(async (item, index) => {
      const itemCoords = await getCoordinatesFromZip(item.zipcode);
      
      // Create custom marker icon with category color
      const markerColor = getMarkerColor(item.category);
      const svgMarker = {
        path: 'M12,2A7,7 0 0,1 19,9C19,14.25 12,22 12,22C12,22 5,14.25 5,9A7,7 0 0,1 12,2M12,7A2,2 0 0,0 10,9A2,2 0 0,0 12,11A2,2 0 0,0 14,9A2,2 0 0,0 12,7Z',
        fillColor: markerColor,
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2,
        scale: 1.5,
        anchor: new window.google.maps.Point(12, 22)
      };
      
      const marker = new window.google.maps.Marker({
        position: itemCoords,
        map: map,
        title: item.name,
        icon: svgMarker,
        animation: window.google.maps.Animation.DROP,
        zIndex: items.length - index // Higher z-index for newer items
      });

      const getCategoryEmoji = (category) => {
        const emojis = {
          'electronics': '📱',
          'clothing': '👕',
          'furniture': '🪑',
          'sports': '⚽',
          'music': '🎵',
          'books': '📚',
          'other': '📦'
        };
        return emojis[category] || emojis.other;
      };

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 12px; max-width: 280px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
              <span style="font-size: 24px; margin-right: 8px;">${getCategoryEmoji(item.category)}</span>
              <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #1a73e8; flex: 1;">${item.name}</h3>
            </div>
            <p style="margin: 0 0 8px 0; font-size: 14px; color: #666; line-height: 1.4;">${item.description || 'No description available'}</p>
            <div style="display: flex; gap: 12px; font-size: 12px; color: #999; margin-bottom: 8px;">
              <span style="background: ${markerColor}15; color: ${markerColor}; padding: 2px 6px; border-radius: 12px; font-weight: 500;">
                ${item.category || 'Other'}
              </span>
              <span><strong>📍</strong> ${item.zipcode}</span>
            </div>
            <div style="text-align: center;">
              <button onclick="alert('Chat with owner feature - click any item in the main list to try it!')" 
                style="background: linear-gradient(135deg, ${markerColor}, ${markerColor}dd); color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 500; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: transform 0.2s;">
                💬 Contact Owner
              </button>
            </div>
          </div>
        `
      });

      marker.addListener('click', () => {
        // Close any open info windows
        if (window.currentInfoWindow) {
          window.currentInfoWindow.close();
        }
        infoWindow.open(map, marker);
        window.currentInfoWindow = infoWindow;
      });

      // Add hover effect
      marker.addListener('mouseover', () => {
        marker.setOptions({ 
          icon: { ...svgMarker, scale: 2 } 
        });
      });
      
      marker.addListener('mouseout', () => {
        marker.setOptions({ 
          icon: { ...svgMarker, scale: 1.5 } 
        });
      });

      return marker;
    });

    // Wait for all markers to be created
    await Promise.all(markerPromises);

    // Add radius circle if zipcode is provided
    if (zipcode) {
      const circle = new window.google.maps.Circle({
        strokeColor: '#4285f4',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#4285f4',
        fillOpacity: 0.15,
        map: map,
        center: center,
        radius: radius * 1609.34, // Convert miles to meters
      });

      // Fit map to include the circle
      const bounds = circle.getBounds();
      if (bounds) {
        map.fitBounds(bounds);
      }
    }

    // If there are items but no specific zipcode, fit bounds to show all markers
    if (!zipcode && items.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      const markerCoords = await Promise.all(
        items.map(item => getCoordinatesFromZip(item.zipcode))
      );
      markerCoords.forEach(coord => {
        bounds.extend(new window.google.maps.LatLng(coord.lat, coord.lng));
      });
      map.fitBounds(bounds);
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
          ${items.map((item, index) => {
            const colors = {
              'electronics': '#4285f4',
              'clothing': '#ea4335', 
              'furniture': '#fbbc04',
              'sports': '#34a853',
              'music': '#9c27b0',
              'books': '#ff6d01',
              'other': '#6c757d'
            };
            const color = colors[item.category] || colors.other;
            
            return `
            <div style="
              position: absolute;
              width: 24px;
              height: 24px;
              background: ${color};
              border: 3px solid white;
              border-radius: 50%;
              cursor: pointer;
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
              transform: translate(${(index * 35) - (items.length * 17.5)}px, ${(index % 3) * 40 - 20}px);
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 10px;
              color: white;
              font-weight: bold;
            " 
            title="${item.name} - ${item.category} - ${item.zipcode}">
              ${index + 1}
            </div>`;
          }).join('')}
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
        initializeMap().catch(error => {
          console.error('Error initializing map:', error);
          initializeMockMap();
        });
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