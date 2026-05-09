import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-900 rounded-lg flex items-center justify-center text-white font-bold">G</div>
          <span className="text-xl font-black text-emerald-950 tracking-tighter">GMC Guide</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-emerald-100 overflow-hidden border-2 border-emerald-900/10">
          <img src="https://via.placeholder.com/150" alt="Profile" className="w-full h-full object-cover" />
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative h-[80vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80" 
            alt="Hero Background" 
            className="w-full h-full object-cover grayscale brightness-[0.2]" 
          />
          <div className="absolute inset-0 bg-linear-to-b from-emerald-950/40 to-emerald-950/80" />
        </div>

        <div className="relative z-10 max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6">
            GMC Guide
          </h1>
          <p className="text-lg md:text-xl text-emerald-50/80 mb-10 leading-relaxed font-medium">
            Your premier destination for navigating high-stakes services with calm confidence and expert precision.
          </p>
          <button 
            onClick={() => navigate('/login')}
            className="px-10 py-4 bg-emerald-100 text-emerald-950 font-black rounded-xl hover:bg-white transition-all shadow-xl hover:scale-105 active:scale-95"
          >
            Get Started
          </button>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="py-24 px-6 md:px-20 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-xs font-black text-emerald-600 uppercase tracking-[0.2em] mb-4">About the Platform</p>
            <h2 className="text-4xl md:text-5xl font-black text-emerald-950 leading-tight tracking-tighter">
              The ultimate resource for navigating GMC services and resources.
            </h2>
          </div>
          <div className="space-y-6 text-gray-500 leading-relaxed text-lg">
            <p>
              At GMC Guide, we believe that complex processes require clarity and authority. Our platform is meticulously organized to ensure that every user feels they are in expert hands from the moment they arrive.
            </p>
            <p>
              We leverage high-quality information architecture and generous visual breathing room to let our guidance lead the way, providing a stable and enduring environment for your most important professional decisions.
            </p>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="bg-white py-24 px-6 md:px-20">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-black text-emerald-600 uppercase tracking-[0.2em] mb-4">Our Services</p>
          <h2 className="text-4xl font-black text-emerald-950 mb-16 tracking-tighter">Comprehensive Support</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Expert Consultations */}
            <div className="bg-gray-50 rounded-[2.5rem] p-10 border border-gray-100 hover:shadow-2xl transition-all group lg:col-span-2 lg:row-span-2">
              <div className="w-14 h-14 bg-emerald-950 rounded-2xl flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform">
                👥
              </div>
              <h3 className="text-3xl font-black text-emerald-950 mb-4">Expert Consultations</h3>
              <p className="text-gray-500 mb-8 leading-relaxed">
                Direct access to industry-leading professionals who provide tailored guidance for your specific requirements and goals.
              </p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3 font-bold text-emerald-900">
                  <span className="w-5 h-5 flex items-center justify-center rounded-full bg-emerald-100 text-[10px]">✓</span> 1-on-1 Strategy Sessions
                </li>
                <li className="flex items-center gap-3 font-bold text-emerald-900">
                  <span className="w-5 h-5 flex items-center justify-center rounded-full bg-emerald-100 text-[10px]">✓</span> Document Review
                </li>
              </ul>
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80" alt="Consultation" className="w-full h-64 object-cover" />
              </div>
            </div>

            {/* Resource Library */}
            <div className="bg-emerald-950 rounded-[2.5rem] p-10 text-white flex flex-col justify-between hover:shadow-2xl transition-all">
              <div>
                <div className="w-12 h-12 bg-emerald-800/50 backdrop-blur rounded-xl flex items-center justify-center mb-8">
                  📄
                </div>
                <h3 className="text-2xl font-black mb-4">Resource Library</h3>
                <p className="text-emerald-100/70 leading-relaxed">
                  A curated repository of guides, templates, and regulatory documents updated weekly.
                </p>
              </div>
            </div>

            {/* Real-time Updates */}
            <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm hover:shadow-2xl transition-all">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-8">
                📡
              </div>
              <h3 className="text-2xl font-black text-emerald-950 mb-4">Real-time Updates</h3>
              <p className="text-gray-500 leading-relaxed">
                Instant notifications on policy changes and procedural shifts across all GMC departments.
              </p>
            </div>

            {/* Community Support */}
            <div className="bg-emerald-900 rounded-[2.5rem] p-10 text-white lg:col-span-2 hover:shadow-2xl transition-all">
              <h3 className="text-3xl font-black mb-4">Community Support</h3>
              <p className="text-emerald-50/70 mb-8 max-w-md">
                Connect with a network of peers navigating similar journeys. Share insights, troubleshoot challenges, and grow together.
              </p>
              <div className="flex items-center -space-x-3">
                {[1,2,3,4].map(i => (
                  <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} className="w-12 h-12 rounded-full border-4 border-emerald-900" alt="User" />
                ))}
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-950 flex items-center justify-center font-black text-xs border-4 border-emerald-900">
                  +2k
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-100 py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div>
            <h4 className="font-black text-emerald-950 text-xl mb-2 tracking-tighter">GMC Guide</h4>
            <p className="text-gray-500 text-sm">© 2026 GMC Guide. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap gap-8 text-sm font-bold text-gray-500">
            <a href="#" className="hover:text-emerald-950 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-950 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-emerald-950 transition-colors">Contact Support</a>
          </div>
        </div>
      </footer>

      {/* BOTTOM NAV (Mobile Style as seen in design) */}
      <div className="md:hidden fixed bottom-6 left-6 right-6 bg-emerald-950 text-white py-4 px-8 rounded-3xl shadow-2xl flex justify-between items-center z-50">
        <div className="flex flex-col items-center gap-1 opacity-100">
           <span className="text-lg">🏠</span>
           <span className="text-[10px] font-black uppercase tracking-tighter">Home</span>
        </div>
        <div className="flex flex-col items-center gap-1 opacity-50">
           <span className="text-lg">🗺️</span>
           <span className="text-[10px] font-black uppercase tracking-tighter">Services</span>
        </div>
        <div className="flex flex-col items-center gap-1 opacity-50">
           <span className="text-lg">📚</span>
           <span className="text-[10px] font-black uppercase tracking-tighter">Resources</span>
        </div>
        <div className="flex flex-col items-center gap-1 opacity-50">
           <span className="text-lg">👤</span>
           <span className="text-[10px] font-black uppercase tracking-tighter">Profile</span>
        </div>
      </div>
    </div>
  );
}