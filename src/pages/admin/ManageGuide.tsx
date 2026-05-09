import { useState, useEffect } from 'react';
import { supabase } from '../../api/supabase';

interface Guide {
  id: string;
  full_name: string;
  profile_image?: string;
  price_per_day: number;
  phone: string;
  bio?: string;
  status: string;
  experience_years?: number;
}

export default function ManageGuide() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGuides();
  }, []);

  // Fetch approved guides from guide_details
  const fetchGuides = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('guide_details')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });
    
    if (data) setGuides(data);
    if (error) console.error('Error fetching guides:', error.message);
    setLoading(false);
  };

  // Handle deleting a guide
  const deleteGuide = async (guide: Guide) => {
    if(!window.confirm(`Are you sure you want to remove ${guide.full_name}?`)) return;
    
    try {
      const { error } = await supabase.from('guide_details').delete().eq('id', guide.id);
      if (error) {
        alert("Delete failed: " + error.message);
      } else {
        fetchGuides();
      }
    } catch (err: any) {
      alert("Failed to delete: " + err.message);
    }
  };

  return (
    <div className="space-y-12 p-4">
      {/* LIST MANAGEMENT */}
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-black text-emerald-950 tracking-tighter">Manage Guides</h2>
          <p className="text-gray-500 font-medium mt-2">Approved guides currently active on user dashboard</p>
        </div>
        
        {loading ? (
            <div className='text-center py-10 text-gray-400'>Fetching guides list...</div>
        ) : guides.length === 0 ? (
            <div className="bg-white p-20 rounded-[3.5rem] text-center border-2 border-dashed border-gray-100 shadow-sm">
              <div className="text-5xl mb-4">📋</div>
              <p className="text-xl font-black text-emerald-950">No Approved Guides Yet</p>
              <p className="text-gray-400 font-medium mt-1">Guides will appear here once they are approved.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {guides.map(guide => (
                    <div key={guide.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-md transition-shadow">
                        <div className='flex items-start gap-4 mb-4 pb-4 border-b'>
                            {guide.profile_image ? (
                                <img src={guide.profile_image} alt={guide.full_name} className="w-16 h-16 rounded-full object-cover border-2 border-emerald-50" />
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl font-bold">
                                    {guide.full_name.charAt(0)}
                                </div>
                            )}
                            <div>
                                <h4 className="font-bold text-lg text-gray-800">{guide.full_name}</h4>
                                <p className="text-emerald-700 font-medium text-sm">${guide.price_per_day} / Day</p>
                            </div>
                        </div>
                        <p className='text-gray-500 text-sm mb-6 flex-1 line-clamp-3 italic'>
                          {guide.bio || 'No biography provided.'}
                        </p>
                        
                        <div className="flex justify-between items-center pt-4 mt-auto border-t">
                            <a href={`tel:${guide.phone}`} className='text-emerald-600 font-bold hover:text-emerald-800 flex items-center gap-1'>
                              <span>📞</span> Call
                            </a>
                            <button 
                              onClick={() => deleteGuide(guide)} 
                              className='text-red-500 hover:text-red-700 font-medium transition-colors'
                            >
                              Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}