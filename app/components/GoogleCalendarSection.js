'use client'
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';

const GoogleCalendarView = dynamic(
  () => import('./GoogleCalendarView'),
  { ssr: false }
);

const GoogleCalendarSection = () => {
  const [isCalendarConnected, setIsCalendarConnected] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();

  // Check calendar connection and fetch events
  const checkCalendarConnection = async () => {
    try {
      const response = await fetch('/api/calendar/events');
      if (response.ok) {
        setIsCalendarConnected(true);
        const events = await response.json();
        setCalendarEvents(events);
      }
    } catch (error) {
      console.error('Error checking calendar connection:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle calendar connection
  const handleConnectCalendar = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/calendar/auth');
      const data = await response.json();
      window.location.href = data.url; // Redirect to Google auth
    } catch (error) {
      console.error('Error connecting calendar:', error);
      setIsLoading(false);
    }
  };

  // Check connection status on mount and when URL parameters change
  useEffect(() => {
    const connected = searchParams.get('connected');
    if (connected === 'true') {
      checkCalendarConnection();
    } else {
      checkCalendarConnection();
    }
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-purple-500/20">
          <div className="p-8">
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white mb-2">Checking Calendar Connection</h3>
                <p className="text-gray-400 max-w-md">
                  Verifying your Google Calendar access...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isCalendarConnected) {
    return <GoogleCalendarView events={calendarEvents} />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-purple-500/20">
        <div className="p-8">
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white text-center mb-4">
            Connect Your Google Calendar
          </h2>

          <p className="text-gray-400 text-center mb-8 max-w-lg mx-auto">
            Link your Google Calendar to automatically sync your schedule and create smart study plans based on your availability.
          </p>

          <div className="space-y-6 max-w-md mx-auto">
            <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
              <h3 className="text-white font-medium mb-2">What you'll get:</h3>
              <ul className="space-y-3">
                {[
                  'Turn your Google Calendar events into to-do lists',
                  'Automatic event synchronization',
                  'Smart study schedules with deadline tracking',
                  'Real-time calendar updates'
                ].map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 text-purple-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={handleConnectCalendar}
              disabled={isLoading}
              className={`w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-4 py-3 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-purple-500/20 ${
                isLoading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.372 0 0 5.373 0 12s5.372 12 12 12c6.627 0 12-5.373 12-12S18.627 0 12 0zm.14 19.018c-3.868 0-7-3.14-7-7.018c0-3.878 3.132-7.018 7-7.018c1.89 0 3.47.697 4.682 1.829l-1.974 1.978v-.004c-.735-.702-1.667-1.062-2.708-1.062c-2.31 0-4.187 1.956-4.187 4.273c0 2.315 1.877 4.277 4.187 4.277c2.096 0 3.522-1.202 3.816-2.852H12.14v-2.737h6.585c.088.47.135.96.135 1.474c0 4.01-2.677 6.86-6.72 6.86z" />
                  </svg>
                  <span>Connect with Google Calendar</span>
                </>
              )}
            </button>

            <p className="text-gray-500 text-sm text-center">
              You can disconnect your calendar at any time from the settings
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleCalendarSection;
