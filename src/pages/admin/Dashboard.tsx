import { useState } from 'react';
import ManagePlace from './ManagePlace';
import ManageUsers from './ManageUsers';
import GuideApprovals from './GuideApprovals';
import { supabase } from '../../api/supabase';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'places' | 'users' | 'approvals' | 'insights'>('places');
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* SIDEBAR */}
      <aside className="w-72 bg-[#053225] text-white flex flex-col fixed h-full shadow-2xl">
        <div className="p-8 pb-4">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
               <span className="text-[#053225] font-black text-xl">G</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight">GMC Guide</h1>
          </div>
          
          <p className="text-[10px] font-black text-emerald-500/50 uppercase tracking-[0.2em] mb-6">Admin Panel</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <button
            onClick={() => setActiveTab('places')}
            className={`w-full flex items-center gap-4 p-4 rounded-xl font-bold transition-all ${
              activeTab === 'places' ? 'bg-[#124235] text-white' : 'text-gray-400 hover:bg-[#124235]/50'
            }`}
          >
            <span className="text-lg">📍</span> Manage Places
          </button>

          <button
            onClick={() => setActiveTab('approvals')}
            className={`w-full flex items-center gap-4 p-4 rounded-xl font-bold transition-all ${
              activeTab === 'approvals' ? 'bg-[#124235] text-white' : 'text-gray-400 hover:bg-[#124235]/50'
            }`}
          >
            <span className="text-lg">📜</span> Pending Approvals
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-4 p-4 rounded-xl font-bold transition-all ${
              activeTab === 'users' ? 'bg-[#124235] text-white' : 'text-gray-400 hover:bg-[#124235]/50'
            }`}
          >
            <span className="text-lg">👥</span> Manage Users
          </button>

          <button
            onClick={() => setActiveTab('insights')}
            className={`w-full flex items-center gap-4 p-4 rounded-xl font-bold transition-all ${
              activeTab === 'insights' ? 'bg-[#124235] text-white' : 'text-gray-400 hover:bg-[#124235]/50'
            }`}
          >
            <span className="text-lg">📊</span> Insights
          </button>
        </nav>

        <div className="p-6">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 p-4 bg-[#C62828] text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg">
            <span>🚪</span> LOGOUT SESSION
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 ml-72 flex flex-col min-h-screen">
        {/* TOP NAVIGATION BAR */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-12 sticky top-0 z-40">
          <h2 className="text-xl font-bold text-[#053225]">
            {activeTab === 'places' && 'Landmark Inventory'}
            {activeTab === 'users' && 'System Users'}
            {activeTab === 'approvals' && 'Verification Queue'}
            {activeTab === 'insights' && 'Analytics Overview'}
          </h2>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-gray-400 hover:text-emerald-600 transition-colors">
              <span className="text-xl">🔔</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
              <div className="text-right">
                <p className="text-xs font-black text-[#053225]">Admin User</p>
                <p className="text-[10px] text-gray-400 font-bold">Super Admin</p>
              </div>
              <div className="w-10 h-10 bg-emerald-100 rounded-full overflow-hidden border-2 border-white shadow-sm">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Profile" />
              </div>
            </div>
          </div>
        </header>

        {/* DASHBOARD CONTENT */}
        <div className="p-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* STATS OVERVIEW - Always visible at top of Places tab to match image */}
          {activeTab === 'places' && (
            <div className="grid grid-cols-4 gap-6 mb-10">
              {[
                { label: 'Total Landmarks', value: '1,284', change: '+12% this month', color: 'emerald' },
                { label: 'Pending Approvals', value: '42', change: 'Requires review', color: 'red' },
                { label: 'Active Users', value: '8.5k', change: 'Global reach', color: 'emerald' },
                { label: 'Reported Issues', value: '07', change: 'Tickets assigned', color: 'gray' },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{stat.label}</p>
                  <h3 className="text-3xl font-black text-[#053225] mb-1">{stat.value}</h3>
                  <p className={`text-[10px] font-bold ${stat.color === 'red' ? 'text-red-500' : 'text-emerald-500'}`}>
                    {stat.change}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* ACTIVE TAB CONTENT */}
          <section className="relative">
            {activeTab === 'places' && <ManagePlace />}
            {activeTab === 'users' && <ManageUsers />}
            {activeTab === 'approvals' && <GuideApprovals />}
            {activeTab === 'insights' && (
              <div className="bg-white p-12 rounded-[2.5rem] border border-gray-100 text-center">
                 <p className="text-gray-400 font-bold">Analytics module is loading...</p>
              </div>
            )}
          </section>
        </div>
        
        {/* FOOTER - Matching your brand style */}
        <footer className="mt-auto p-12 flex justify-between items-center text-[11px] font-bold text-gray-400 border-t border-gray-100">
          <p>GMC Guide Admin | © 2024 GMC Guide. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-emerald-900 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-900 transition-colors">Terms of Service</a>
          </div>
        </footer>
      </main>
    </div>
  );
}