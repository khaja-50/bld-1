import { useState, useRef, useCallback, useEffect } from 'react';
import { Map, Marker, Popup, NavigationControl, Source, Layer } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

const INDIA_BOUNDS = [
  [68.1, 6.7],  // Southwest
  [97.4, 35.7]  // Northeast
];

const MapComponent = () => {
  const mapRef = useRef(null);
  const [viewport, setViewport] = useState({
    longitude: 78.9629,
    latitude: 20.5937,
    zoom: 4.5
  });
  const [searchInput, setSearchInput] = useState('');
  const [marker, setMarker] = useState(null);
  const [show3D, setShow3D] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiKey = import.meta.env.VITE_MAPTILER_API_KEY;
  if (!apiKey) {
    return <div style={{ padding: 20, color: 'red' }}>MapTiler API key is missing</div>;
  }
  const mapStyle = `https://api.maptiler.com/maps/streets/style.json?key=${apiKey}`;

  // 1. Add click handler for the map
  const handleMapClick = useCallback(async (e) => {
    const { lngLat } = e;
    setIsLoading(true);
    
    try {
      // Reverse geocode the clicked location
      const response = await fetch(
        `https://api.maptiler.com/geocoding/${lngLat.lng},${lngLat.lat}.json?key=${apiKey}`
      );
      const data = await response.json();
      
      if (data.features.length > 0) {
        const place = data.features[0];
        setMarker({
          lng: lngLat.lng,
          lat: lngLat.lat,
          name: place.text || 'Selected Location',
          address: place.place_name
        });
        setViewport(v => ({ ...v, longitude: lngLat.lng, latitude: lngLat.lat, zoom: 12 }));
      }
    } catch (err) {
      setError('Failed to get location details');
    } finally {
      setIsLoading(false);
    }
  }, [apiKey]);

  // 2. Modified search function to work with clicks
  const handleSearch = useCallback(async () => {
    if (!searchInput.trim()) {
      setError('Please enter a search term');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://api.maptiler.com/geocoding/${encodeURIComponent(searchInput)}.json?key=${apiKey}&country=in`
      );
      
      if (!response.ok) throw new Error(`API request failed`);
      
      const data = await response.json();
      
      if (!data.features?.length) throw new Error('No locations found');
      
      const firstResult = data.features[0];
      const [lng, lat] = firstResult.center;
      
      setViewport({
        longitude: lng,
        latitude: lat,
        zoom: 12
      });
      setMarker({ 
        lng, 
        lat,
        name: firstResult.text || searchInput,
        address: firstResult.place_name 
      });
      
    } catch (err) {
      setError(err.message);
      setMarker(null);
    } finally {
      setIsLoading(false);
    }
  }, [searchInput, apiKey]);

  // ... (keep your existing 3D terrain useEffect) ...

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      {/* ... (keep your existing controls) ... */}

      <Map
        ref={mapRef}
        {...viewport}
        onMove={(evt) => setViewport(evt.viewState)}
        onClick={handleMapClick}
        mapStyle={mapStyle}
        style={{ width: '100%', height: '100%' }}
        maxBounds={INDIA_BOUNDS}
        minZoom={3.5}
      >
        {/* ... (keep your existing layers) ... */}

        {marker && (
          <Marker 
            longitude={marker.lng} 
            latitude={marker.lat} 
            color="#ff5252"
            draggable
            onDragEnd={handleMapClick} // Allow dragging marker
          >
            <Popup
              closeButton={true}
              closeOnClick={false}
              anchor="bottom"
            >
              <div style={{ padding: 8, minWidth: 200 }}>
                <div style={{ fontWeight: 'bold' }}>{marker.name}</div>
                {marker.address && (
                  <div style={{ fontSize: '0.9em' }}>{marker.address}</div>
                )}
                <div style={{ fontSize: '0.8em', color: '#666' }}>
                  {marker.lat.toFixed(4)}, {marker.lng.toFixed(4)}
                </div>
              </div>
            </Popup>
          </Marker>
        )}

        <NavigationControl position="bottom-right" />
      </Map>
    </div>
  );
};

export default MapComponent;