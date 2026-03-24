import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const API_BASE = import.meta.env.VITE_API_URL || '';

const BusinessProfile = () => {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);

  const { refreshUser } = useAuth();

  useEffect(() => {
    fetchProfile();

    return () => {
      // Revoke preview URL on unmount to avoid leaks
      if (logoPreview && logoPreview.startsWith('blob:')) URL.revokeObjectURL(logoPreview);
    };
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/api/users/profile');
      const user = res.data;

      // Normalize address to a single string for editing (handles object or string from server)
      let addressStr = '';
      if (user?.address) {
        if (typeof user.address === 'string') {
          addressStr = user.address;
        } else if (typeof user.address === 'object') {
          const { street, city, state, pincode } = user.address;
          addressStr = [street, city, state, pincode].filter(Boolean).join(', ');
        }
      }

      // Logo URL from server may be relative (e.g. /uploads/xyz)
      if (user?.logoUrl) {
        const lp = user.logoUrl.startsWith('http') ? user.logoUrl : API_BASE + user.logoUrl;
        setLogoPreview(lp);
      }

      // Normalize businessType to match select options if present
      const normalizedBusinessType = user.businessType && typeof user.businessType === 'string' ? user.businessType.toLowerCase() : '';

      setProfile({ ...user, address: addressStr, businessType: normalizedBusinessType });
    } catch {
      toast.error('Failed to load profile');
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const [saving, setSaving] = useState(false);

  const handleLogoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // create a temporary preview
    const blobUrl = URL.createObjectURL(file);
    // revoke previous blob preview to avoid leaks
    if (logoPreview && logoPreview.startsWith('blob:')) URL.revokeObjectURL(logoPreview);
    setLogoPreview(blobUrl);
    setProfile((p) => ({ ...(p || {}), logoFile: file, logoName: file.name }));

    // upload immediately and persist to DB
    try {
      setSaving(true);
      const fd = new FormData();
      fd.append('logo', file);
      const uploadRes = await axios.post('/api/users/profile/logo', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const logoUrl = uploadRes?.data?.logoUrl;
      if (logoUrl) {
        const lp = logoUrl.startsWith('http') ? logoUrl : API_BASE + logoUrl;
        setLogoPreview(lp);
        setProfile((p) => ({ ...(p || {}), logoUrl }));
      }

      toast.success(uploadRes?.data?.message || 'Logo uploaded');

      // refresh global auth user so Navbar shows avatar
      try { await refreshUser(); } catch (e) { /* ignore */ }
    } catch (error) {
      console.error('Logo upload error:', error);
      const msg = error?.response?.data?.message || error?.message || 'Logo upload failed';
      toast.error(msg);
      // revert preview if upload failed
      setLogoPreview(profile?.logoUrl || null);
    } finally {
      setSaving(false);
    }
  };

  const exportProfile = () => {
    const blob = new Blob([JSON.stringify(profile, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'business-profile.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // If there is a new logo file, upload it first
      if (profile?.logoFile) {
        const fd = new FormData();
        fd.append('logo', profile.logoFile);
        const uploadRes = await axios.post('/api/users/profile/logo', fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success(uploadRes?.data?.message || 'Logo uploaded');
        // Update preview and profile (logoUrl is set on server)
        if (uploadRes?.data?.logoUrl) {
          setLogoPreview(uploadRes.data.logoUrl);
        }
      }

      // Only send fields expected by the server
      const payload = {
        name: profile.name,
        businessName: profile.businessName,
        businessType: profile.businessType,
        registrationNumber: profile.registrationNumber,
        // send address as string; server will save as { street }
        address: profile.address,
        phone: profile.phone
      };

      console.log('Profile update payload:', payload);
      const res = await axios.put('/api/users/profile', payload);
      console.log('Profile update response:', res?.data);
      toast.success(res?.data?.message || 'Profile updated successfully');
      setEditing(false);

      // Refresh both local profile and global auth user so Navbar updates
      await fetchProfile();
      // call auth refresh if available
      try { await refreshUser(); } catch (e) { /* ignore */ }
    } catch (error) {
      console.error('Profile save error:', error);
      const msg = error?.response?.data?.message || error.message || 'Failed to update profile';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (!profile) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center text-gray-600">
          Loading profile...
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      {/* Header */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <h1 className="text-3xl font-semibold text-gray-900">
            Business Profile
          </h1>
          <p className="text-gray-600">
            View and manage your registered business information
          </p>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="md:grid md:grid-cols-3 gap-6">
          {/* LEFT: Profile Card */}
          <div className="col-span-1">
            <div className="bg-white rounded-xl p-6 shadow">
              <div className="flex flex-col items-center text-center">
                <div className="w-28 h-28 rounded-full bg-indigo-50 flex items-center justify-center mb-4 overflow-hidden">
                  {logoPreview ? (
                    // eslint-disable-next-line jsx-a11y/img-redundant-alt
                    <img src={logoPreview} alt="logo preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-indigo-700 font-bold text-2xl">{(profile.businessName || 'B')[0]}</div>
                  )}
                </div>

                <div className="font-semibold text-lg">{profile.businessName || 'Untitled Business'}</div>
                <div className="text-sm text-gray-500">Reg#: {profile.registrationNumber || '—'}</div>

                <div className="mt-4 inline-flex items-center gap-2">
                  <div className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm">Active</div>
                  <div className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm">Verified</div>
                </div>



                <div className="mt-6 w-full">
                  <label className="block text-sm text-gray-600 mb-2">Upload Logo</label>
                  <input type="file" accept="image/*" onChange={handleLogoChange} className="text-sm" />
                </div>

                {/* <div className="mt-6 w-full flex gap-2">
                  <button onClick={exportProfile} className="flex-1 px-4 py-2 bg-gray-100 rounded-md text-sm">Export JSON</button>
                  <button onClick={() => window.print()} className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm">Print</button>
                </div> */}
              </div>
            </div>
          </div>

          {/* RIGHT: Form */}
          <div className="col-span-2">
            <div className="bg-white rounded-xl p-6 shadow space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Business Details</h2>
                <div className="text-sm text-gray-500">Last updated: {profile.updatedAt ? new Date(profile.updatedAt).toLocaleDateString() : '—'}</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Full Name</label>
                  <input type="text" name="name" value={profile.name || ''} disabled={!editing} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-200" />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Business Name</label>
                  <input type="text" name="businessName" value={profile.businessName || ''} disabled={!editing} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-200" />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Business Type</label>
                  <input type="text" name="businessType" value={profile.businessType || ''} disabled={!editing} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-200" />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Contact Email</label>
                  <input type="email" name="email" value={profile.email || ''} disabled className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50" />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Phone</label>
                  <input type="text" name="phone" value={profile.phone || ''} disabled={!editing} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-200" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Address</label>
                <textarea name="address" value={profile.address || ''} disabled={!editing} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-200 h-24" />
              </div>



              <div className="flex justify-end gap-3">
                {!editing ? (
                  <button onClick={() => setEditing(true)} className="px-5 py-2 bg-indigo-600 text-white rounded-md">Edit Profile</button>
                ) : (
                  <>
                    <button onClick={() => { setEditing(false); fetchProfile(); }} className="px-5 py-2 border rounded-md">Cancel</button>
                    <button onClick={handleSave} disabled={saving} className="px-5 py-2 bg-green-600 text-white rounded-md">{saving ? 'Saving...' : 'Save Changes'}</button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BusinessProfile;
