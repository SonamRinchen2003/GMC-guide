import { useEffect, useState } from 'react';
import { supabase } from '../../api/supabase';

export default function GuideApprovals() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchApplications = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('guide_details')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Fetch error:", error.message);
    } else {
      setApplications(data || []);
    }
    setLoading(false);
  };

  useEffect(() => { 
    fetchApplications(); 
  }, []);

  const handleDecision = async (guideId: string, decision: 'approved' | 'rejected') => {
    setProcessingId(guideId);

    try {
      // 1. Update status in guide_details
      const { error: updateError } = await supabase
        .from('guide_details')
        .update({ status: decision })
        .eq('id', guideId);

      if (updateError) throw updateError;

      // 2. Sync Profile Role
      if (decision === 'approved') {
        const { error: roleError } = await supabase
          .from('profiles')
          .update({ role: 'guide' })
          .eq('id', guideId);
        
        if (roleError) {
          console.warn("Role update failed:", roleError.message);
        }
      }

      // 3. UI Update
      setApplications(prev => prev.filter(app => app.id !== guideId));
      
    } catch (err: any) {
      console.error("Action Error:", err);
      alert("Action failed: " + err.message);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-20 text-center">
        <div className="animate-spin h-10 w-10 border-4 border-emerald-950 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="font-bold text-[#053225] tracking-tight text-sm uppercase">Syncing Queue...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* SECTION HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-2xl font-bold text-[#053225] mb-1">Guide Applications</h3>
          <p className="text-gray-400 font-medium">Review and verify professional guides for Gelephu.</p>
        </div>
        
        {/* WAITING BADGE */}
        <div className="flex items-center gap-3 bg-emerald-50 px-6 py-3 rounded-full border border-emerald-100">
          <span className="text-xl font-black text-emerald-600">{applications.length}</span>
          <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">Waiting</span>
        </div>
      </div>

      {/* APPLICATIONS LIST OR EMPTY STATE */}
      {applications.length === 0 ? (
        <div className="w-full bg-white border-2 border-dashed border-gray-100 rounded-[3.5rem] py-24 flex flex-col items-center justify-center shadow-sm animate-in fade-in zoom-in-95 duration-500">
          <div className="mb-6 relative text-6xl">✨</div>
          <h4 className="text-2xl font-black text-[#053225] mb-2 tracking-tight">Inbox Zero</h4>
          <p className="text-gray-400 font-medium text-center max-w-xs">
            No pending guide applications to review.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {applications.map((app) => (
            <div 
              key={app.id} 
              className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center justify-between transition-all hover:shadow-md"
            >
              <div className="flex items-center gap-6">
                <img 
                  src={app.profile_image || 'https://via.placeholder.com/150'} 
                  alt="Profile" 
                  className="w-24 h-24 rounded-4xl object-cover border-4 border-emerald-50 shadow-sm"
                />
                
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="text-xl font-bold text-[#053225]">{app.full_name}</h4>
                    <span className="bg-emerald-100 text-emerald-800 text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-wider">
                      {app.specialization}
                    </span>
                  </div>
                  
                  <div className="flex gap-4 text-xs font-bold">
                    <span className="text-emerald-600">🌐 {app.languages}</span>
                    <span className="text-[#053225]">💰 Nu. {app.price_per_day}/day</span>
                    <span className="text-gray-400 font-medium">📅 {app.experience_years}y Exp</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pr-2">
                <button 
                  onClick={() => handleDecision(app.id, 'approved')}
                  disabled={processingId === app.id}
                  className="bg-[#053225] text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-lg shadow-emerald-950/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                >
                  {processingId === app.id ? '...' : 'Approve'}
                </button>

                <button 
                  onClick={() => handleDecision(app.id, 'rejected')}
                  disabled={processingId === app.id}
                  className="bg-red-50 text-red-500 px-8 py-4 rounded-2xl font-bold text-sm hover:bg-red-500 hover:text-white transition-all active:scale-95 disabled:opacity-50"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}