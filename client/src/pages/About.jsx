import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const About = () => {
  return (
    <>
      <Navbar />

      {/* HERO */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="md:flex md:items-center md:justify-between gap-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold mb-3">About the Portal</h1>
              <p className="text-indigo-100 max-w-2xl mb-6">Our mission is to empower Micro and Small Enterprises with a digital, transparent, and fast license management experience — from application to approval.</p>

              <div className="flex gap-3">
                <Link to="/register" className="bg-white text-indigo-600 px-5 py-2 rounded-md font-medium shadow">Get Started</Link>
                <Link to="/contact" className="border border-white/40 text-white px-5 py-2 rounded-md">Contact Us</Link>
              </div>

              <div className="mt-8 flex gap-6">
                {/* <div className="text-center">
                  <div className="text-2xl font-bold">14k+</div>
                  <div className="text-sm text-indigo-100">Applications processed</div>
                </div> */}
                {/* <div className="text-center">
                  <div className="text-2xl font-bold">98%</div>
                  <div className="text-sm text-indigo-100">Avg satisfaction</div>
                </div> */}
                {/* <div className="text-center">
                  <div className="text-2xl font-bold">99%</div>
                  <div className="text-sm text-indigo-100">Availability</div>
                </div> */}
              </div>
            </div>

            <div className="mt-8 md:mt-0 flex justify-center">
              <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-lg text-indigo-700">
                <svg viewBox="0 0 600 360" className="w-full h-44" xmlns="http://www.w3.org/2000/svg" fill="none">
                  <rect x="0" y="0" width="600" height="360" rx="16" fill="#EEF2FF" />
                  <g transform="translate(28,28)">
                    <rect x="0" y="0" width="240" height="120" rx="8" fill="#fff" stroke="#E0E7FF" />
                    <rect x="8" y="12" width="80" height="12" rx="6" fill="#EEF2FF" />
                    <rect x="8" y="34" width="160" height="10" rx="6" fill="#F8FAFF" />
                    <rect x="0" y="140" width="160" height="80" rx="8" fill="#fff" stroke="#E0E7FF" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-6xl mx-auto px-4 py-16 space-y-10">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">What is this Portal?</h2>
            <p className="text-gray-700 text-sm leading-relaxed">This portal is a dedicated web-based platform for Micro and Small Enterprises to manage license registration and renewals. It helps reduce visits to government offices and provides a secure place to upload documents and monitor progress.</p>
          </div>

          <div className="bg-white border rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Why we built it</h2>
            <p className="text-gray-700 text-sm leading-relaxed">To minimize paperwork, speed up approvals, and bring transparency to the process for both businesses and administrators. The portal streamlines tasks like renewals, payments, and status updates.</p>

            <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <li className="bg-indigo-50 text-indigo-700 p-3 rounded">Transparent tracking</li>
              <li className="bg-indigo-50 text-indigo-700 p-3 rounded">Secure uploads</li>
              <li className="bg-indigo-50 text-indigo-700 p-3 rounded">Role-based access</li>
              <li className="bg-indigo-50 text-indigo-700 p-3 rounded">Automated reminders</li>
            </ul>
          </div>
        </div>

        {/* Mission / Vision / Values */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow">
            <h3 className="font-semibold text-gray-900 mb-2">Our Mission</h3>
            <p className="text-sm text-gray-700">To empower MSEs by providing easy access to license services, reducing friction and promoting compliance.</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow">
            <h3 className="font-semibold text-gray-900 mb-2">Our Vision</h3>
            <p className="text-sm text-gray-700">A future where licensing is completely digital, efficient, and accessible to every small business.</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow">
            <h3 className="font-semibold text-gray-900 mb-2">Our Values</h3>
            <p className="text-sm text-gray-700">Transparency, reliability, user-first design, and continuous improvement.</p>
          </div>
        </div>

        {/* Team */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Meet the Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 text-center shadow">
              <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto font-semibold mb-3">RY</div>
              <div className="font-medium">Rishabh Yadav</div>
              <div className="text-sm text-gray-600">Project Lead</div>
            </div>

            <div className="bg-white rounded-xl p-6 text-center shadow">
              <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto font-semibold mb-3">SR</div>
              <div className="font-medium">Satyajit Rout</div>
              <div className="text-sm text-gray-600">Fullstack Developer</div>
            </div>

            <div className="bg-white rounded-xl p-6 text-center shadow">
              <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto font-semibold mb-3">AD</div>
              <div className="font-medium">Ashish Duhan</div>
              <div className="text-sm text-gray-600">Support & Ops</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-indigo-50 p-8 rounded-xl text-center">
          <h3 className="text-xl font-semibold mb-2">Ready to get started?</h3>
          <p className="text-gray-700 mb-4">Create an account and manage your licensing today.</p>
          <Link to="/register" className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-md shadow">Create Account</Link>
        </div>
      </div>
    </>
  );
};

export default About;
