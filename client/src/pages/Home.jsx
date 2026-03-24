import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <>
      <Navbar />

      {/* HERO */}
      <div className="bg-gradient-to-b from-indigo-50 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
                Simplify business licensing for Micro & Small Enterprises
              </h1>
              <p className="text-gray-700 max-w-2xl mb-6">
                Fast, secure, and transparent: apply for licenses, renew registrations,
                and track application status — all from your dashboard.
              </p>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                {!user ? (
                  <>
                    <Link to="/login" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium shadow">
                      Get Started
                    </Link>
                    <Link to="/about" className="px-6 py-3 border border-indigo-600 text-indigo-600 rounded-md font-medium">
                      Learn More
                    </Link>
                  </>
                ) : (
                  <Link to="/dashboard" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium shadow">
                    Go to Dashboard
                  </Link>
                )}
              </div>

              <div className="mt-8 flex items-center gap-6 justify-center md:justify-start">
                {/* <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">14k+</div>
                  <div className="text-sm text-gray-600">Applications processed</div>
                </div> */}

                {/* <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">98%</div>
                  <div className="text-sm text-gray-600">Average satisfaction</div>
                </div> */}
              </div>
            </div>

            <div className="flex justify-center md:justify-end">
              {/* illustration */}
              <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
                <svg viewBox="0 0 600 400" className="w-full h-56" xmlns="http://www.w3.org/2000/svg" fill="none">
                  <rect x="0" y="0" width="600" height="400" rx="20" fill="#EEF2FF" />
                  <g transform="translate(40,30)">
                    <rect x="0" y="0" width="220" height="140" rx="8" fill="#fff" stroke="#E0E7FF" />
                    <rect x="8" y="12" width="80" height="12" rx="6" fill="#EEF2FF" />
                    <rect x="8" y="34" width="160" height="10" rx="6" fill="#F8FAFF" />
                    <rect x="8" y="50" width="120" height="10" rx="6" fill="#F8FAFF" />

                    <rect x="240" y="0" width="220" height="140" rx="8" fill="#fff" stroke="#E0E7FF" />
                    <rect x="248" y="12" width="80" height="12" rx="6" fill="#EEF2FF" />
                    <rect x="248" y="34" width="160" height="10" rx="6" fill="#F8FAFF" />
                    <rect x="248" y="50" width="120" height="10" rx="6" fill="#F8FAFF" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-semibold text-gray-900 text-center mb-8">Key Features</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition transform hover:-translate-y-1">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2v2m6-2c0-1.105-1.343-2-3-2m0 0V6m0 12v-2m0 2c1.657 0 3-.895 3-2m-6 2c0 1.105 1.343 2 3 2"/></svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Apply Online</h3>
            <p className="text-sm text-gray-600">Submit your application and documents securely through the portal.</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition transform hover:-translate-y-1">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M3 12h18M3 17h18"/></svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Renew Easily</h3>
            <p className="text-sm text-gray-600">Manage renewals with reminders and a streamlined submission flow.</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition transform hover:-translate-y-1">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3"/></svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Track Status</h3>
            <p className="text-sm text-gray-600">Receive live updates and admin remarks directly on your dashboard.</p>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="bg-indigo-50">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-semibold text-gray-900 text-center mb-8">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold mb-4">1</div>
              <h4 className="font-semibold mb-1">Create an account</h4>
              <p className="text-sm text-gray-600">Sign up and complete your business profile to get started.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold mb-4">2</div>
              <h4 className="font-semibold mb-1">Submit application</h4>
              <p className="text-sm text-gray-600">Fill out the application form and upload required documents.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold mb-4">3</div>
              <h4 className="font-semibold mb-1">Track & receive license</h4>
              <p className="text-sm text-gray-600">Monitor status and download your license once approved.</p>
            </div>
          </div>
        </div>
      </div>

      {/* TESTIMONIALS */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-semibold text-gray-900 text-center mb-8">What users say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-700 mb-4">"The portal made renewing our license so easy — saved us time and hassle."</p>
            <div className="text-sm text-gray-600">— A. Gomez, Small bakery owner</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-700 mb-4">"Fast approvals and clear status updates. Highly recommended."</p>
            <div className="text-sm text-gray-600">— M. Rahman, Electronics shop</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-700 mb-4">"Great support and the documentation upload feature is very convenient."</p>
            <div className="text-sm text-gray-600">— S. Koirala, Tailor</div>
          </div>
        </div>
      </div>

      {/* FOOTER INFO */}
      <div className="bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-12 text-center text-gray-700">
          <p>Our mission is to empower micro and small enterprises through digital services that reduce paperwork and improve access.</p>
        </div>
      </div>
    </>
  );
};

export default Home;
