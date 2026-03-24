import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';

const RenewLicense = () => {
  const [licenses, setLicenses] = useState([]);
  const [selectedLicense, setSelectedLicense] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLicenses();
  }, []);

  const fetchLicenses = async () => {
    try {
      const response = await axios.get('/api/licenses');
      const renewable = response.data.filter(
        lic => lic.status === 'active' || lic.status === 'expired'
      );
      setLicenses(renewable);
    } catch {
      toast.error('Failed to load licenses');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLicense) return toast.error('Please select a license');

    setLoading(true);
    try {
      const res = await axios.post('/api/applications', {
        licenseId: selectedLicense,
        applicationType: 'renewal'
      });
      toast.success('Renewal application created');
      navigate(`/applications/${res.data._id}`);
    } catch (error) {
      console.error('Create renewal error:', error);
      const msg = error?.response?.data?.message || error?.message || 'Failed to create renewal application';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center text-gray-600">
          Loading licenses...
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* HERO */}
        <div className="bg-gradient-to-r from-green-50 to-white rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">Renew License</h1>
              <p className="text-gray-600 mt-1">Pick a license and submit a renewal application — we’ll guide you through document uploads and payment.</p>
            </div>
            <div>
              <button onClick={() => navigate('/apply-license')} className="px-4 py-2 bg-blue-600 text-white rounded-md shadow">Apply for New License</button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          {licenses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No licenses available for renewal.</p>
              <button
                onClick={() => navigate('/apply-license')}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Apply for New License
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Select License (keep select for accessibility) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select License <span className="text-red-500">*</span></label>
                <select
                  required
                  value={selectedLicense}
                  onChange={(e) => setSelectedLicense(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm mb-4"
                >
                  <option value="">Choose a license</option>
                  {licenses.map((license) => (
                    <option key={license._id} value={license._id}>
                      {license.licenseId} ({license.type}) – Exp: {new Date(license.expiryDate).toLocaleDateString()}
                      {license.status === 'expired' && ' [EXPIRED]'}
                    </option>
                  ))}
                </select>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {licenses.map(lic => (
                    <button
                      key={lic._id}
                      type="button"
                      onClick={() => setSelectedLicense(lic._id)}
                      className={`text-left p-4 rounded-lg border hover:shadow-sm transition ${selectedLicense === lic._id ? 'ring-2 ring-green-300 bg-green-50' : 'bg-white'}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{lic.licenseId}</div>
                          <div className="text-sm text-gray-600">{lic.type} • Expires {new Date(lic.expiryDate).toLocaleDateString()}</div>
                        </div>
                        <div className="text-right">
                          <div className={`px-2 py-1 rounded-full text-xs font-semibold ${lic.status === 'expired' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>{lic.status}</div>
                          <div className="text-sm text-gray-500 mt-2">₹{lic.renewalFee}</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 mt-3">Click to select this license for renewal.</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* License Info */}
              {selectedLicense && (() => {
                const lic = licenses.find(l => l._id === selectedLicense);
                return lic && (
                  <div className="bg-green-50 border border-green-100 rounded-md p-4 text-sm">
                    <p><strong>License ID:</strong> {lic.licenseId}</p>
                    <p><strong>Type:</strong> {lic.type}</p>
                    <p><strong>Expiry Date:</strong> {new Date(lic.expiryDate).toLocaleDateString()}</p>
                    <p><strong>Renewal Fee:</strong> ₹{lic.renewalFee}</p>
                    <p className="mt-2 text-gray-600">After submission, upload documents and complete payment as requested.</p>
                  </div>
                );
              })()}

              {/* Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="px-4 py-2 border rounded-md text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-md disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit Renewal'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default RenewLicense;
