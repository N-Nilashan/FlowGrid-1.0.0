'use client'
import { useState } from 'react';
import GoogleCalendarView from './GoogleCalendarView';

const GoogleCalendarSection = ({ isConnected }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  const connectGoogleCalendar = async () => {
    try {
      setIsConnecting(true);
      setError(null);
      const response = await fetch('/api/calendar/connect', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to connect to Google Calendar');
      }

      const data = await response.json();
      // Redirect to Google OAuth consent screen
      window.location.href = data.authUrl;
    } catch (err) {
      setError(err.message);
    } finally {
      setIsConnecting(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-purple-500/20">
          <div className="p-8">
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-semibold text-white mb-4">Connect Google Calendar</h3>
                <p className="text-gray-400 max-w-md mb-6">
                  Connect your Google Calendar to view and manage your events alongside your tasks.
                </p>
                {error && (
                  <div className="text-red-400 mb-4 p-4 bg-red-900/20 rounded-lg">
                    {error}
                  </div>
                )}
                <button
                  onClick={connectGoogleCalendar}
                  disabled={isConnecting}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  {isConnecting ? 'Connecting...' : 'Connect Calendar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <GoogleCalendarView />;
};

export default GoogleCalendarSection;
