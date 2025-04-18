'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const Settings = () => {
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const router = useRouter();

  const handleDisconnectCalendar = async () => {
    setIsDisconnecting(true);
    try {
      const response = await fetch('/api/calendar/disconnect', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to disconnect calendar');
      }

      // Refresh the page to update the UI
      router.refresh();
    } catch (error) {
      console.error('Error disconnecting calendar:', error);
    } finally {
      setIsDisconnecting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-purple-500/20">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-white mb-8">Settings</h2>

          {/* Google Calendar Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Google Calendar</h3>
            <div className="space-y-4">
              <p className="text-gray-400">
                Manage your Google Calendar integration settings here. You can disconnect your calendar
                if you no longer want to sync your events with FlowGrid.
              </p>
              <button
                onClick={handleDisconnectCalendar}
                disabled={isDisconnecting}
                className={`px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-300 flex items-center space-x-2 ${isDisconnecting ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
              >
                {isDisconnecting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Disconnecting...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Disconnect Google Calendar</span>
                  </>
                )}
              </button>
              <p className="text-sm text-gray-500">
                Note: Disconnecting your calendar will remove all synced events from FlowGrid.
                You can always reconnect your calendar later.
              </p>
            </div>
          </div>

          {/* Add more settings sections here */}
        </div>
      </div>
    </div>
  );
};

export default Settings;
