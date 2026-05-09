import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../api/supabase';

interface Booking {
  id: string;
  created_at: string;
  place_name: string;
  booking_date: string;
  user_phone: string;
  status: 'pending' | 'approved' | 'cancelled';
  user_id: string;
  guides: {
    name: string;
  } | null;
}

export default function ManageBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        guides (
          name
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bookings:', error);
    } else {
      setBookings(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchBookings();

    // REAL-TIME SUBSCRIPTION: Listen for new bookings automatically
    const subscription = supabase
      .channel('admin-booking-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => {
        fetchBookings(); // Auto-refresh data when any change happens in DB
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [fetchBookings]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('bookings')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      alert("Error updating status: " + error.message);
    }
    // No need to set state manually; the Real-time subscription will trigger fetchBookings()
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Permanently delete this booking record?");
    if (!confirmDelete) return;

    const { error } = await supabase.from('bookings').delete().eq('id', id);
    if (error) alert("Error deleting booking: " + error.message);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-900"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-500">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-emerald-50 text-emerald-800 uppercase text-[10px] tracking-widest font-bold border-b border-emerald-100">
              <th className="p-5">Destination</th>
              <th className="p-5">Guide Assigned</th>
              <th className="p-5">Travel Date</th>
              <th className="p-5">User Contact</th>
              <th className="p-5">Status</th>
              <th className="p-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-emerald-50/30 transition-colors group">
                  <td className="p-5">
                    <p className="font-bold text-gray-800">{booking.place_name}</p>
                    <p className="text-[10px] text-gray-400">ID: {booking.id.slice(0, 8)}...</p>
                  </td>
                  <td className="p-5 text-gray-600 font-medium">
                    <div className="flex items-center gap-2">
                      <span className="text-xs">👤</span>
                      {booking.guides?.name || 'Unassigned'}
                    </div>
                  </td>
                  <td className="p-5 text-gray-600">
                    {new Date(booking.booking_date).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="p-5 text-gray-600">
                    <a href={`tel:${booking.user_phone}`} className="hover:text-emerald-600 font-mono text-sm underline decoration-emerald-200">
                      {booking.user_phone || 'N/A'}
                    </a>
                  </td>
                  <td className="p-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider shadow-sm ${
                      booking.status === 'approved' 
                        ? 'bg-green-500 text-white' 
                        : booking.status === 'cancelled'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-amber-400 text-white'
                    }`}>
                      {booking.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-5 text-right space-x-2">
                    {booking.status === 'pending' && (
                      <button 
                        onClick={() => handleUpdateStatus(booking.id, 'approved')}
                        className="bg-emerald-600 text-white px-3 py-1 rounded-lg hover:bg-emerald-700 font-bold text-xs transition-transform active:scale-95"
                      >
                        Approve
                      </button>
                    )}
                    <button 
                      onClick={() => handleDelete(booking.id)}
                      className="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete Record"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-32 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-3xl">📅</div>
                    <p className="text-gray-400 font-medium">No active booking requests found.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}