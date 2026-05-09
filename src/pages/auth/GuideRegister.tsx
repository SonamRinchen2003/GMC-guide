import { useState } from 'react';
import { supabase } from '../../api/supabase';
import { useNavigate } from 'react-router-dom';

export default function GuideRegister() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    licenseNo: '',
    experience: '',
    specialization: '',
    languages: '',
    price: ''
  });
  
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create Auth User
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      // If user already exists, signUp might return an error or an existing user
      if (authError) throw authError;
      if (!authData.user) throw new Error("Authentication failed");

      const userId = authData.user.id;
      let documentUrl = '';
      let profileImageUrl = '';

      // 2. Upload License Document
      if (licenseFile) {
        const fileExt = licenseFile.name.split('.').pop();
        const fileName = `${userId}-license-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('guide-documents')
          .upload(fileName, licenseFile);

        if (!uploadError) {
          const { data: urlData } = supabase.storage.from('guide-documents').getPublicUrl(fileName);
          documentUrl = urlData.publicUrl;
        }
      }

      // 3. Upload Profile Image
      if (profileImage) {
        const fileExt = profileImage.name.split('.').pop();
        const fileName = `${userId}-profile-${Date.now()}.${fileExt}`;
        const { error: photoError } = await supabase.storage
          .from('guide-photos')
          .upload(fileName, profileImage);

        if (!photoError) {
          const { data: photoUrlData } = supabase.storage.from('guide-photos').getPublicUrl(fileName);
          profileImageUrl = photoUrlData.publicUrl;
        }
      }

      // 4. UPSERT Profile (Crucial fix for Duplicate Key Errors)
      // This ensures that if the profile record already exists, it updates it instead of crashing.
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: userId,
        email: formData.email,
        role: 'user', // Default role until approved
        full_name: formData.fullName
      }, { onConflict: 'id' });
      
      if (profileError) throw profileError;

      // 5. Insert or Update Professional Details
      // We use upsert here too to ensure the data reaches 'guide_details' even on a retry
      const { error: detailError } = await supabase.from('guide_details').upsert({
        id: userId,
        full_name: formData.fullName,
        license_number: formData.licenseNo,
        experience_years: parseInt(formData.experience) || 0,
        specialization: formData.specialization,
        languages: formData.languages,
        price_per_day: parseFloat(formData.price) || 0,
        profile_image: profileImageUrl,
        document_url: documentUrl,
        status: 'pending'
      }, { onConflict: 'id' });

      if (detailError) throw detailError;

      // SUCCESS
      alert("Application submitted! Redirecting to login. Please wait for admin approval.");
      navigate('/login', { replace: true });

    } catch (err: any) {
      alert("Submission Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6 font-medium">
      <form 
        onSubmit={handleRegister} 
        className="bg-white p-10 rounded-[3rem] shadow-xl max-w-3xl w-full border border-gray-100 animate-in fade-in zoom-in duration-500"
      >
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-emerald-950 tracking-tighter">Guide Application</h2>
          <p className="text-gray-500 mt-2 font-medium">Join the Gelephu Mindfulness City professional network.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <input 
            type="text" placeholder="Full Name" required 
            className="p-4 bg-gray-50 rounded-2xl border border-transparent outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-bold text-sm"
            onChange={e => setFormData({...formData, fullName: e.target.value})} 
          />
          
          <input 
            type="email" placeholder="Email Address" required 
            className="p-4 bg-gray-50 rounded-2xl border border-transparent outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-bold text-sm"
            onChange={e => setFormData({...formData, email: e.target.value})} 
          />

          <input 
            type="password" placeholder="Password" required 
            className="p-4 bg-gray-50 rounded-2xl border border-transparent outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-bold text-sm"
            onChange={e => setFormData({...formData, password: e.target.value})} 
          />

          <input 
            type="text" placeholder="License Number" required 
            className="p-4 bg-gray-50 rounded-2xl border border-transparent outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-bold text-sm"
            onChange={e => setFormData({...formData, licenseNo: e.target.value})} 
          />

          <input 
            type="number" placeholder="Daily Rate (USD)" required 
            className="p-4 bg-gray-50 rounded-2xl border border-transparent outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-bold text-sm"
            onChange={e => setFormData({...formData, price: e.target.value})} 
          />

          <input 
            type="text" placeholder="Languages (e.g. English, Dzongkha)" required 
            className="p-4 bg-gray-50 rounded-2xl border border-transparent outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-bold text-sm"
            onChange={e => setFormData({...formData, languages: e.target.value})} 
          />

          <input 
            type="number" placeholder="Years of Experience" 
            className="p-4 bg-gray-50 rounded-2xl border border-transparent outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-bold text-sm"
            onChange={e => setFormData({...formData, experience: e.target.value})} 
          />

          <select 
            className="p-4 bg-gray-50 rounded-2xl border border-transparent outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-bold text-sm text-gray-500"
            onChange={e => setFormData({...formData, specialization: e.target.value})}
          >
            <option value="">Specialization</option>
            <option value="Cultural">Cultural Heritage</option>
            <option value="Nature">Nature & Trekking</option>
            <option value="Spiritual">Spiritual & Mindfulness</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <div className="p-5 border-2 border-dashed border-emerald-100 rounded-3xl bg-emerald-50/30">
            <label className="block text-[10px] font-black text-emerald-800 mb-2 uppercase tracking-widest text-center">Profile Photo</label>
            <input 
              type="file" accept="image/*" required 
              onChange={e => setProfileImage(e.target.files ? e.target.files[0] : null)}
              className="text-[10px] text-gray-500 file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-emerald-900 file:text-white cursor-pointer" 
            />
          </div>

          <div className="p-5 border-2 border-dashed border-emerald-100 rounded-3xl bg-emerald-50/30">
            <label className="block text-[10px] font-black text-emerald-800 mb-2 uppercase tracking-widest text-center">License Document</label>
            <input 
              type="file" required 
              onChange={e => setLicenseFile(e.target.files ? e.target.files[0] : null)}
              className="text-[10px] text-gray-500 file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-emerald-900 file:text-white cursor-pointer" 
            />
          </div>
        </div>

        <button 
          disabled={loading} 
          className="w-full mt-10 bg-emerald-900 text-white py-5 rounded-2xl font-black hover:bg-emerald-800 transition-all shadow-xl shadow-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing Application...' : 'Submit Professional Application'}
        </button>
      </form>
    </div>
  );
}