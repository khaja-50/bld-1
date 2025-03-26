import { GoogleMap, LoadScriptNext, Autocomplete, Marker } from "@react-google-maps/api";
import { useState, useRef } from "react";

const goMapsUrl = "https://maps.gomaps.pro/maps/api/js"; // Define GoMaps API URL

const MapComponent = ({ location, setLocation }) => {
  const goMapsApiKey = import.meta.env.VITE_GOMAPS_API_KEY; // Ensure this environment variable is set
  const autocompleteRef = useRef(null);

  const defaultLocation = { lat: 20.5937, lng: 78.9629 }; // Default: India
  const sanitizedLocation = {
    lat: Number(location?.lat) || defaultLocation.lat,
    lng: Number(location?.lng) || defaultLocation.lng,
  };

  const [selectedAddress, setSelectedAddress] = useState("");

  const onPlaceSelected = () => {
    const place = autocompleteRef.current.getPlace();
    if (place?.geometry) {
      const newLocation = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      setLocation(newLocation);
      setSelectedAddress(place.formatted_address);
    }
  };

  return (
    <LoadScriptNext
      googleMapsApiKey={goMapsApiKey}
      libraries={["places"]}
      googleMapsApiBase={goMapsUrl} // Use GoMaps.pro as the base URL
    >
      <div style={{ marginBottom: "10px" }}>
        <Autocomplete
          onLoad={(ref) => (autocompleteRef.current = ref)}
          onPlaceChanged={onPlaceSelected}
        >
          <input
            type="text"
            placeholder="Enter an address"
            value={selectedAddress}
            onChange={(e) => setSelectedAddress(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "16px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </Autocomplete>
      </div>

      <GoogleMap
        mapContainerStyle={{ height: "300px", width: "100%" }}
        center={sanitizedLocation}
        zoom={10}
        onClick={(e) => {
          const newLocation = { lat: e.latLng.lat(), lng: e.latLng.lng() };
          setLocation(newLocation);
        }}
      >
        <Marker position={sanitizedLocation} />
      </GoogleMap>
    </LoadScriptNext>
  );
};

export default MapComponent;
