import React, { useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { supabase } from '../../api/supabase';

const mapContainerStyle = { width: '100%', height: '100%' };
const defaultCenter = { lat: 26.894669, lng: 90.484858 };

export default function ManagePlace() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Tourist Attraction',
    car_time: '',
    walk_time: '',
    lat: 26.894669,
    lng: 90.484858,
    description: ''
  });

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyB63r-akX8cX_g873UMJzRHVk6Qeg748q8",
    libraries: ['places']
  });

  // --- SAVE LOGIC ---
  const handleSaveLandmark = async () => {
    if (!formData.name || !formData.description) {
      alert("Please fill in the Name and Description");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('landmarks') // Ensure your table is named 'landmarks'
        .insert([{
          name: formData.name,
          category: formData.category,
          car_time: formData.car_time,
          walk_time: formData.walk_time,
          lat: formData.lat,
          lng: formData.lng,
          description: formData.description,
          created_at: new Date()
        }]);

      if (error) throw error;

      alert("Landmark saved successfully! 🎉");
      
      // Reset form for a "New Landmark"
      setFormData({
        name: '',
        category: 'Tourist Attraction',
        car_time: '',
        walk_time: '',
        lat: 26.894669,
        lng: 90.484858,
        description: ''
      });
    } catch (err: any) {
      alert("Error saving: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = (targetLat: number, targetLng: number) => {
    if (!window.google) return;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const origin = { lat: position.coords.latitude, lng: position.coords.longitude };
        const destination = { lat: targetLat, lng: targetLng };
        const service = new google.maps.DistanceMatrixService();

        service.getDistanceMatrix({
          origins: [origin],
          destinations: [destination],
          travelMode: google.maps.TravelMode.DRIVING,
        }, (res, status) => {
          if (status === 'OK') setFormData(p => ({ ...p, car_time: res?.rows[0].elements[0].duration?.text || '' }));
        });

        service.getDistanceMatrix({
          origins: [origin],
          destinations: [destination],
          travelMode: google.maps.TravelMode.WALKING,
        }, (res, status) => {
          if (status === 'OK') setFormData(p => ({ ...p, walk_time: res?.rows[0].elements[0].duration?.text || '' }));
        });
      });
    }
  };

  const onMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setFormData(prev => ({ ...prev, lat, lng }));
      calculateDistance(lat, lng);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[600px]">
      <div className="w-full lg:w-1/3 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4 h-fit">
        <h3 className="text-lg font-bold text-emerald-900 mb-2">
          {formData.name ? `Editing: ${formData.name}` : 'Add New Landmark'}
        </h3>
        
        <input 
          type="text" placeholder="Landmark Name" 
          className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
          value={formData.name}
          onChange={e => setFormData({...formData, name: e.target.value})}
        />

        <div className="grid grid-cols-2 gap-3">
          <select 
            className="p-3 border rounded-xl bg-white text-sm"
            value={formData.category}
            onChange={e => setFormData({...formData, category: e.target.value})}
          >
            <option>Tourist Attraction</option>
            <option>Spiritual Site</option>
            <option>Nature & Park</option>
          </select>
          <div className="p-3 border rounded-xl bg-gray-50 text-emerald-700 font-bold text-xs truncate">
            🚗 {formData.car_time || "Car Time"}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 border rounded-xl bg-gray-50 text-emerald-700 font-bold text-xs truncate">
            🚶 {formData.walk_time || "Walk Time"}
          </div>
          <div className="p-3 border rounded-xl bg-gray-50 text-[10px] text-gray-400 truncate">
            📍 {formData.lat.toFixed(4)}, {formData.lng.toFixed(4)}
          </div>
        </div>

        <textarea 
          placeholder="Description (History, importance, etc.)..." 
          className="w-full p-3 border rounded-xl h-24 outline-none resize-none"
          value={formData.description}
          onChange={e => setFormData({...formData, description: e.target.value})}
        />

        <button 
          onClick={handleSaveLandmark}
          disabled={loading}
          className={`w-full py-3 text-white font-bold rounded-xl transition-all active:scale-95 ${
            loading ? 'bg-gray-400' : 'bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-100'
          }`}
        >
          {loading ? 'Saving to GMC Database...' : 'Save Landmark'}
        </button>
      </div>

      <div className="flex-1 bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm min-h-[400px] relative">
        {!isLoaded ? (
          <div className="w-full h-full bg-gray-50 flex items-center justify-center">Loading Map...</div>
        ) : (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={defaultCenter}
            zoom={14}
            onClick={onMapClick}
          >
            <Marker position={{ lat: formData.lat, lng: formData.lng }} />
          </GoogleMap>
        )}
      </div>
    </div>
  );
}