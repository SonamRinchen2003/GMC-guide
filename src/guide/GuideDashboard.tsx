import { useEffect, useState, useCallback } from 'react'; // Added useCallback
import { supabase } from '../api/supabase';
import { useNavigate } from 'react-router-dom';

interface Booking {
  id: string;
  place_name: string;
  booking_date: string;
  user_phone: string;
  status: 'pending' | 'approved' | 'rejected';
  user_id: string;
}

export default function GuideDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Use useCallback to prevent unnecessary re-renders
  const fetchGuideBookings = useCallback(async () => {
    setLoading(true);
    
    // 1. Get the logged-in user's UUID
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      navigate('/login');
      return;
    }

    // 2. Fetch bookings where guide_id matches the logged-in user's UUID
    // We no longer need to fetch from a separate 'guides' table first 
    // if the guide_id in 'bookings' is the User UUID.
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('guide_id', user.id) // This aligns with the UserExplore.tsx update
      .order('booking_date', { ascending: true });

    if (error) {
      console.error('Error fetching bookings:', error);
    } else {
      setBookings(data as Booking[]);
    }
    
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    fetchGuideBookings();
  }, [fetchGuideBookings]);

  async function updateStatus(bookingId: string, newStatus: string) {
    const { error } = await supabase
      .from('bookings')
      .update({ status: newStatus })
      .eq('id', bookingId);

    if (error) {
      alert('Error updating booking: ' + error.message);
    } else {
      // Refresh the list after update
      fetchGuideBookings();
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="font-black text-emerald-900">Loading your bookings...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-black text-emerald-950">Your Bookings</h1>
            <p className="text-gray-500 font-medium mt-2">Manage tour requests from users</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-6 py-3 rounded-2xl font-black hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white p-20 rounded-3xl text-center border-2 border-dashed border-gray-100">
            <div className="text-5xl mb-4">📅</div>
            <p className="text-xl font-black text-emerald-950">No bookings yet</p>
            <p className="text-gray-400 font-medium mt-2">Users will book your tours here</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-4">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                        booking.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                        booking.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-emerald-950 mb-3">{booking.place_name}</h3>
                    <div className="space-y-2 text-gray-600 font-medium">
                      <p>📅 <strong>Date:</strong> {new Date(booking.booking_date).toLocaleDateString()}</p>
                      <p>📞 <strong>Contact:</strong> {booking.user_phone}</p>
                    </div>
                  </div>

                  {booking.status === 'pending' && (
                    <div className="flex flex-col gap-3 min-w-max">
                      <button
                        onClick={() => updateStatus(booking.id, 'approved')}
                        className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-black hover:bg-emerald-700 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateStatus(booking.id, 'rejected')}
                        className="bg-red-600 text-white px-6 py-3 rounded-xl font-black hover:bg-red-700 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}