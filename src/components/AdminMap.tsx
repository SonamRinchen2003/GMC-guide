import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';
import { useCallback, useState } from 'react';

const mapContainerStyle = { width: '100%', height: '350px' };
const gelephuCenter = { lat: 26.8585, lng: 90.4893 };

export default function AdminMap({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY" // Put your actual key here
  });

  const [marker, setMarker] = useState<google.maps.LatLngLiteral | null>(null);

  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setMarker({ lat, lng });
      onLocationSelect(lat, lng);
    }
  }, [onLocationSelect]);

  return isLoaded ? (
    <GoogleMap mapContainerStyle={mapContainerStyle} center={gelephuCenter} zoom={13} onClick={onMapClick}>
      {marker && <MarkerF position={marker} />}
    </GoogleMap>
  ) : <div>Loading Map...</div>;
}