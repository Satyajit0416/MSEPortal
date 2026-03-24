import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return toast.error('Please complete name, email, and message');
    setSending(true);
    try {
      const res = await axios.post('/api/contact', form);
      toast.success(res?.data?.message || 'Message sent');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      const msg = error?.response?.data?.message || error.message || 'Failed to send message';
      toast.error(msg);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Navbar />

      {/* HERO */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="md:flex md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Help & Support</h1>
              <p className="text-indigo-100 max-w-2xl">Need assistance? Our support team is ready to help with account, application, and technical queries.</p>
            </div>

            <div className="mt-8 md:mt-0">
              <div className="bg-white/10 px-4 py-2 rounded-md inline-flex items-center gap-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 10-8 0v4"/></svg>
                <div className="text-sm">
                  <div className="font-semibold">Need immediate help?</div>
                  <div className="text-indigo-100 text-xs">Call us: +91 9310304060</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Contact details */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-xl p-6 shadow">
            <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
            <p className="text-sm text-gray-700 mb-3">We are here to help with licensing, renewals, and technical questions.</p>

            <div className="space-y-3 text-sm text-gray-700">
              <div>
                <div className="font-medium">Email</div>
                <a href="mailto:satyajitofficical16@gmail.com" className="text-indigo-600">satyajitofficical16@gmail.com</a>
                <br />
                <a href="mailto:rishabhy7520@gmail.com" className="text-indigo-600">rishabhy7520@gmail.com</a>
              </div>

              <div>
                <div className="font-medium">Phone</div>
                <div className="text-indigo-600">+91 9310304060</div>
              </div>

              <div>
                <div className="font-medium">Hours</div>
                <div className="text-gray-600">Mon–Fri, 10:00 AM – 5:00 PM</div>
              </div>

              <div>
                <div className="font-medium">Address</div>
                <div className="text-gray-600">Lovely Professional University, Punjab</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow">
            <h3 className="text-lg font-semibold mb-3">Frequently Asked</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>How do I check my application status? — Visit your Dashboard.</li>
              <li>How do I upload documents? — Use the Application page upload section.</li>
              <li>Need more help? — Use the form to send us a message.</li>
            </ul>
          </div>
        </div>

        {/* Right: Form + Map */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl p-6 shadow">
            <h3 className="text-lg font-semibold mb-4">Send us a message</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" className="border rounded-lg px-3 py-2" />
              <input name="email" value={form.email} onChange={handleChange} placeholder="Email address" className="border rounded-lg px-3 py-2" />
              <input name="subject" value={form.subject} onChange={handleChange} placeholder="Subject" className="md:col-span-2 border rounded-lg px-3 py-2" />
              <textarea name="message" value={form.message} onChange={handleChange} placeholder="Message" className="md:col-span-2 border rounded-lg px-3 py-2 h-36"></textarea>

              <div className="md:col-span-2 flex justify-between items-center">
                <div className="text-sm text-gray-600">We typically respond within 1-2 business days.</div>
                <button type="submit" disabled={sending} className="bg-indigo-600 text-white px-5 py-2 rounded-md">{sending ? 'Sending...' : 'Send Message'}</button>
              </div>
            </form>
          </div>

          {/* <div className="bg-white rounded-xl p-0 overflow-hidden shadow"> */}
            {/* <div className="h-64"> */}
              {/* Placeholder map — replace with real embed if desired */}
              {/* <iframe title="map" src="https://www.openstreetmap.org/export/embed.html?bbox=85.3%2C27.6%2C85.4%2C27.8" className="w-full h-full border-0" /> */}
            {/* </div> */}
          {/* </div> */}
        </div>
      </div>

      {/* Footer note */}
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-sm text-gray-600">For urgent issues, please call support during working hours.</p>
      </div>
    </>
  );
};

export default Contact;
