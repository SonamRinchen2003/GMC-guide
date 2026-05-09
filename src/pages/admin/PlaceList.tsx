import { useEffect, useState } from 'react';
import { supabase } from '../../api/supabase';

export default function PlaceList() {
  const [places, setPlaces] = useState<any[]>([]);

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    const { data } = await supabase.from('places').select('*');
    if (data) setPlaces(data);
  };

  const deletePlace = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this place?")) {
      await supabase.from('places').delete().eq('id', id);
      fetchPlaces(); // Refresh list
    }
  };

  return (
    <div className="mt-8 overflow-hidden rounded-xl border border-gray-200">
      <table className="min-w-full bg-white">
        <thead className="bg-emerald-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-bold text-emerald-800 uppercase">Name</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-emerald-800 uppercase">Category</th>
            <th className="px-6 py-3 text-right text-xs font-bold text-emerald-800 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {places.map((place) => (
            <tr key={place.id} className="hover:bg-gray-50 transition">
              <td className="px-6 py-4 font-medium">{place.name}</td>
              <td className="px-6 py-4 italic text-gray-500">{place.category}</td>
              <td className="px-6 py-4 text-right space-x-2">
                <button className="text-blue-600 hover:underline">Edit</button>
                <button onClick={() => deletePlace(place.id)} className="text-red-600 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}