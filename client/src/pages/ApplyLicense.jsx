import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';

const ApplyLicense = () => {
  const [formData, setFormData] = useState({
    type: '',
    issueDate: '',
    expiryDate: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const licenseResponse = await axios.post('/api/licenses', formData);
      const licenseId = licenseResponse.data._id;

      const applicationResponse = await axios.post('/api/applications', {
        licenseId,
        applicationType: 'new'
      });

      toast.success('License application created successfully');
      navigate(`/applications/${applicationResponse.data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-10">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">Apply for a New License</h1>
          <p className="text-sm text-gray-600 mt-1">Quickly submit your license details — we'll guide you through the next steps.</p>
        </header>

        {/* Stepper */}
        {/* <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-semibold">1</div>
            <div className="text-sm">Details</div>
          </div>
          <div className="h-0.5 bg-gray-200 flex-1" />
          <div className="flex items-center gap-3 text-gray-400">
            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-sm">2</div>
            <div className="text-sm">Documents</div>
          </div>
          <div className="h-0.5 bg-gray-200 flex-1" />
          <div className="flex items-center gap-3 text-gray-400">
            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-sm">3</div>
            <div className="text-sm">Payment</div>
          </div>
        </div> */}

        <div className="bg-white rounded-lg shadow p-6">
          <div className="md:grid md:grid-cols-3 gap-6">
            <form onSubmit={handleSubmit} className="md:col-span-2 space-y-5">
              {/* License Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">License Type <span className="text-red-500">*</span></label>
                <div className="flex items-center gap-3">
                  <select
                    name="type"
                    required
                    value={formData.type}
                    onChange={handleChange}
                    className="flex-1 border rounded-md px-3 py-2 text-sm"
                  >
                    <option value="">Select License Type</option>
                    <option value="trade">Trade</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="service">Service</option>
                    <option value="composite">Composite</option>
                  </select>

                  <div className="px-3 py-2 rounded-md bg-gray-50 text-sm text-gray-600">
                    {formData.type ? formData.type.charAt(0).toUpperCase() + formData.type.slice(1) : 'Type' }
                  </div>
                </div>
              </div>

              {/* Issue Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Issue Date</label>
                <input
                  type="date"
                  name="issueDate"
                  value={formData.issueDate}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Leave blank to use today’s date</p>
              </div>

              {/* Expiry Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Leave blank to set expiry one year from issue date</p>
              </div>

              {/* Info Box */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-md p-4">
                <p className="text-sm text-indigo-700"><strong>Note:</strong> After submitting, you'll need to upload documents and complete payment to finalize your license.</p>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3">
                <button type="button" onClick={() => navigate('/dashboard')} className="px-4 py-2 border rounded-md text-sm text-gray-700">Cancel</button>
                <button type="submit" disabled={loading} className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-sm rounded-md shadow disabled:opacity-50">{loading ? 'Submitting...' : 'Submit Application'}</button>
              </div>
            </form>

            {/* Summary / Tips */}
            <aside className="md:col-span-1">
              <div className="bg-gray-50 rounded-md p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Summary</h3>
                <div className="text-sm text-gray-700 space-y-2">
                  <div><span className="font-medium">Type:</span> {formData.type || '—'}</div>
                  <div><span className="font-medium">Issue:</span> {formData.issueDate || 'Today'}</div>
                  <div><span className="font-medium">Expiry:</span> {formData.expiryDate || '1 year from issue'}</div>
                </div>

                <div className="mt-4 border-t pt-3">
                  <h4 className="text-sm font-semibold mb-2">Tips</h4>
                  <ul className="text-sm text-gray-600 list-disc list-inside space-y-2">
                    <li>Keep registration documents ready for upload.</li>
                    <li>Ensure dates are accurate before submitting.</li>
                    <li>Contact support if you need help with document types.</li>
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
};

export default ApplyLicense;
