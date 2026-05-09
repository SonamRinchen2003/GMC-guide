import { useEffect, useState } from 'react';
import { supabase } from '../../api/supabase';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: 'admin' | 'user' | 'guide';
  created_at: string;
}

export default function ManageUsers() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentAdminId, setCurrentAdminId] = useState<string | null>(null);

  // 1. Fetch All Users and identify current Admin
  const fetchProfiles = async () => {
    setLoading(true);
    
    // Get the ID of the person currently logged in (you)
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentAdminId(user?.id || null);

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching users:", error.message);
    } else {
      setProfiles(data as Profile[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  // 2. Update Role Logic
  const updateRole = async (userId: string, newRole: string) => {
    // PROTECTION: Prevent Admin from changing their own role
    if (userId === currentAdminId) {
      alert("Security: You cannot change your own administrative role to prevent lockouts.");
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);

    if (error) {
      alert("Update failed: " + error.message);
    } else {
      // Refresh list to show updated status
      fetchProfiles();
    }
  };

  // 3. Delete User Logic
  const deleteUser = async (userId: string) => {
    if (userId === currentAdminId) {
      alert("You cannot delete your own admin account while logged in.");
      return;
    }

    if (!confirm("Are you sure you want to remove this user profile?")) return;

    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (error) {
      alert("Delete failed: " + error.message);
    } else {
      fetchProfiles();
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center p-20">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      <span className="ml-3 font-bold text-emerald-800">Syncing Database...</span>
    </div>
  );

  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-emerald-50/50 text-[10px] uppercase font-black tracking-widest text-emerald-800">
          <tr>
            <th className="px-8 py-6">User Identity</th>
            <th className="px-8 py-6">Current Role</th>
            <th className="px-8 py-6">Assign Role</th>
            <th className="px-8 py-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {profiles.map((p) => (
            <tr key={p.id} className={`transition-colors ${p.id === currentAdminId ? 'bg-emerald-50/20' : 'hover:bg-gray-50/50'}`}>
              <td className="px-8 py-5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-800">{p.email}</span>
                  {p.id === currentAdminId && (
                    <span className="text-[9px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-black">YOU</span>
                  )}
                </div>
                <div className="text-xs text-gray-400">{p.full_name || 'No display name'}</div>
              </td>
              <td className="px-8 py-5">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-sm ${
                  p.role === 'admin' ? 'bg-red-100 text-red-600' : 
                  p.role === 'guide' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'
                }`}>
                  {p.role}
                </span>
              </td>
              <td className="px-8 py-5">
                <select 
                  value={p.role}
                  disabled={p.id === currentAdminId}
                  onChange={(e) => updateRole(p.id, e.target.value)}
                  className={`text-xs font-bold p-2 rounded-xl border-none outline-none transition-all ${
                    p.id === currentAdminId 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-gray-50 text-emerald-700 cursor-pointer hover:ring-2 hover:ring-emerald-500'
                  }`}
                >
                  <option value="user">Tourist (User)</option>
                  <option value="guide">Tour Guide</option>
                  <option value="admin">Administrator</option>
                </select>
              </td>
              <td className="px-8 py-5 text-right">
                <button 
                  onClick={() => deleteUser(p.id)}
                  disabled={p.id === currentAdminId}
                  className={`text-xs font-bold transition-colors ${
                    p.id === currentAdminId ? 'text-gray-300 cursor-not-allowed' : 'text-red-400 hover:text-red-600'
                  }`}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {profiles.length === 0 && (
        <div className="p-20 text-center text-gray-400">
          No users found in the profiles table.
        </div>
      )}
    </div>
  );
}