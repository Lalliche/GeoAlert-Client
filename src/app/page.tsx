import Navbar from "@/Components/LandingPage/Navbar";
import Footer from "@/Components/LandingPage/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen  flex justify-between flex-col ">
      <Navbar />
      <main className="flex flex-col items-center text-center px-6 py-12">
        {/* Hero Section */}
        <section className="max-w-3xl">
          <h1 className="text-4xl font-bold text-main mb-4">
            Stay Alert, Stay Safe
          </h1>
          <p className="text-lg text-gray-700">
            GeoAlert provides real-time notifications for emergencies like
            floods, fires, and security threats. Get instant alerts, track
            danger zones, and ensure safety for you and your community.
          </p>
        </section>

        {/* Features */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="p-4 bg-gray-100 rounded-md shadow-md">
            <h2 className="text-lg font-semibold text-main">
              Real-Time Alerts
            </h2>
            <p className="text-gray-700">
              Receive instant emergency notifications via SMS, Email, and App.
            </p>
          </div>
          <div className="p-4 bg-gray-100 rounded-md shadow-md">
            <h2 className="text-lg font-semibold text-main">Interactive Map</h2>
            <p className="text-gray-700">
              Track risk zones and alerts across Algeria with real-time updates.
            </p>
          </div>
          <div className="p-4 bg-gray-100 rounded-md shadow-md">
            <h2 className="text-lg font-semibold text-main">
              User Safety Responses
            </h2>
            <p className="text-gray-700">
              Mark yourself safe or request help in critical situations.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
