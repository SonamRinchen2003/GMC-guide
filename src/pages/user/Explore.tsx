import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../api/supabase';

// --- Types ---
interface Landmark {
  id: string;
  name: string;
  category: string;
  description: string;
  image_url?: string;
  lat: number;
  lng: number;
}

interface Guide {
  id: string; 
  user_id: string; // ADDED: This is the UUID that matches the 'profiles' table
  full_name: string; 
  languages: string;
  specialization: string;
  price_per_day: number;
  profile_image?: string;
  experience_years: number;
}

export default function UserExplore() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'landmarks' | 'guides'>('landmarks');
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Booking State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [bookingData, setBookingData] = useState({
    date: '',
    phone: '',
    place: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    // Ensure you select user_id from guide_details
    const [placesRes, guidesRes] = await Promise.all([
      supabase.from('landmarks').select('*'),
      supabase.from('guide_details').select('*').eq('status', 'approved')
    ]);
    if (placesRes.data) setLandmarks(placesRes.data);
    if (guidesRes.data) setGuides(guidesRes.data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Handle Booking Submission
  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGuide) return;
    
    setIsSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login to book a guide");
      navigate('/login');
      return;
    }

    // FIX: Use the user_id from the guide record to satisfy the foreign key constraint
    const { error } = await supabase.from('bookings').insert([
      {
        // Change this to match whatever your foreign key references in the database
        guide_id: selectedGuide.user_id || selectedGuide.id, 
        user_id: user.id,
        place_name: bookingData.place,
        booking_date: bookingData.date,
        user_phone: bookingData.phone,
        status: 'pending' 
      }
    ]);

    setIsSubmitting(false);

    if (error) {
      // Improved error message to help you debug
      console.error("Booking Insert Error:", error);
      alert("Error: " + error.message);
    } else {
      alert(`Booking request sent to ${selectedGuide.full_name}! It will now appear on their dashboard.`);
      setIsModalOpen(false);
      setBookingData({ date: '', phone: '', place: '' });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login', { replace: true });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="animate-spin h-10 w-10 border-4 border-[#053225] border-t-transparent rounded-full"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* BRAND HERO SECTION */}
      <header className="bg-[#053225] pt-24 pb-40 px-6 text-center relative">
        <div className="max-w-3xl mx-auto relative z-10">
          <h1 className="text-6xl font-black text-white tracking-tighter mb-6 uppercase">GMC Guide</h1>
          <p className="text-emerald-100/70 text-lg font-medium mb-10 leading-relaxed">
            Your premier destination for navigating GMC services with calm confidence and expert precision.
          </p>
        </div>
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent"></div>
      </header>

      {/* MAIN EXPLORER CONTENT */}
      <main className="max-w-6xl mx-auto px-6 -mt-24 relative z-20 pb-32">
        <div className="bg-white rounded-[3.5rem] shadow-2xl p-10 border border-gray-50">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
            <div>
              <h2 className="text-4xl font-black text-[#053225] tracking-tight mb-2">Explore GMC</h2>
              <p className="text-gray-400 font-bold">Verified mobility solutions for Gelephu.</p>
            </div>
            
            <div className="w-full md:w-auto flex gap-4">
              <div className="flex-1 md:w-80 relative">
                <input 
                  type="text" 
                  placeholder="Search resources..." 
                  className="w-full pl-14 pr-6 py-5 bg-gray-50 rounded-4xl text-sm font-bold border-none outline-none focus:ring-2 focus:ring-emerald-500/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span className="absolute left-6 top-1/2 -translate-y-1/2 opacity-30">🔍</span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-6 py-5 rounded-4xl font-black hover:bg-red-600 transition-colors whitespace-nowrap"
              >
                Logout
              </button>
            </div>
          </div>

          {/* TOGGLE NAVIGATION */}
          <div className="flex gap-4 mb-12">
            <button 
              onClick={() => setActiveView('landmarks')}
              className={`px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.15em] transition-all ${activeView === 'landmarks' ? 'bg-[#053225] text-white shadow-xl shadow-emerald-950/20' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
            >Landmarks</button>
            <button 
              onClick={() => setActiveView('guides')}
              className={`px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.15em] transition-all ${activeView === 'guides' ? 'bg-[#053225] text-white shadow-xl shadow-emerald-950/20' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
            >Tour Guides</button>
          </div>

          {/* LANDMARK / GUIDE GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {activeView === 'landmarks' ? (
              landmarks.map((l) => (
                <div key={l.id} className="group flex flex-col bg-white rounded-[3rem] border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500">
                  <div className="relative h-72 overflow-hidden">
                    <img src={l.image_url || 'https://via.placeholder.com/600'} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                    <span className="absolute top-6 left-6 bg-[#C1E1C5] text-[#053225] text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-tighter shadow-lg">
                      {l.category}
                    </span>
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                    <h3 className="text-2xl font-black text-[#053225] mb-3 leading-tight">{l.name.toLowerCase()}</h3>
                    <p className="text-gray-400 text-sm font-medium leading-relaxed mb-8 line-clamp-2">{l.description}</p>
                    <button className="mt-auto w-full bg-[#053225] text-white py-5 rounded-3xl font-black flex items-center justify-center gap-3 hover:bg-emerald-900 transition-all">
                      Get Directions <span className="text-xl">↗</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              guides.map((g) => (
                <div key={g.id} className="bg-white p-6 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col transition-all hover:shadow-xl">
                   <div className="relative mb-6">
                      <img src={g.profile_image || 'https://via.placeholder.com/400'} className="w-full h-64 rounded-[2.5rem] object-cover shadow-inner" alt="" />
                      <div className="absolute top-4 right-4 bg-[#053225] text-white px-4 py-2 rounded-2xl text-[10px] font-black">
                        Nu. {g.price_per_day}/day
                      </div>
                   </div>
                   <div className="px-4 mb-8">
                      <h4 className="text-2xl font-black text-[#053225] mb-1">{g.full_name}</h4>
                      <p className="text-emerald-600 font-black text-[10px] uppercase tracking-widest mb-4">{g.specialization} • {g.experience_years}y Exp</p>
                      <span className="text-gray-400 text-sm font-medium italic">🌐 {g.languages}</span>
                   </div>
                   <button 
                    onClick={() => { setSelectedGuide(g); setIsModalOpen(true); }}
                    className="w-full bg-[#053225] text-white py-5 rounded-2xl font-black shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
                   >Book Appointment</button>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-10 py-5 flex justify-between items-center md:hidden z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
         <div className="flex flex-col items-center gap-1 text-[#053225]">
            <span className="text-xl">🏠</span>
            <span className="text-[10px] font-black uppercase tracking-widest">Home</span>
         </div>
         <div className="flex flex-col items-center gap-1 text-gray-300">
            <span className="text-xl">🛠️</span>
            <span className="text-[10px] font-black uppercase tracking-widest">Services</span>
         </div>
         <div className="flex flex-col items-center gap-1 text-gray-300">
            <span className="text-xl">📖</span>
            <span className="text-[10px] font-black uppercase tracking-widest">Resources</span>
         </div>
         <div className="flex flex-col items-center gap-1 text-gray-300">
            <span className="text-xl">👤</span>
            <span className="text-[10px] font-black uppercase tracking-widest">Profile</span>
         </div>
      </nav>

      {/* BOOKING MODAL */}
      {isModalOpen && selectedGuide && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full">
            <h3 className="text-2xl font-black text-[#053225] mb-6">Book {selectedGuide.full_name}</h3>
            <form onSubmit={handleBooking} className="space-y-4">
              <input
                type="text"
                placeholder="Place/Landmark"
                value={bookingData.place}
                onChange={(e) => setBookingData({...bookingData, place: e.target.value})}
                className="w-full p-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none"
                required
              />
              <input
                type="date"
                value={bookingData.date}
                onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                className="w-full p-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none"
                required
              />
              <input
                type="tel"
                placeholder="Your Phone"
                value={bookingData.phone}
                onChange={(e) => setBookingData({...bookingData, phone: e.target.value})}
                className="w-full p-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#053225] text-white py-4 rounded-2xl font-black disabled:opacity-50"
              >
                {isSubmitting ? 'Booking...' : 'Confirm Booking'}
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-full bg-gray-100 text-gray-700 py-4 rounded-2xl font-black"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}