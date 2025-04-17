const HelpTab = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-purple-500/20">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Help Center</h2>

          {/* Google Calendar Section */}
          <section className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Google Calendar Integration</h3>
            <div className="space-y-4 text-gray-300">
              <div>
                <h4 className="text-lg font-medium text-white mb-2">Connecting Your Calendar</h4>
                <p>To connect your Google Calendar:</p>
                <ol className="list-decimal pl-5 space-y-2 mt-2">
                  <li>Click on the "Connect Calendar" button in the Google Calendar tab</li>
                  <li>Sign in with your Google account</li>
                  <li>Review and accept the permissions</li>
                  <li>Your calendar events will automatically sync</li>
                </ol>
              </div>

              <div>
                <h4 className="text-lg font-medium text-white mb-2">Managing Calendar Access</h4>
                <p>You can manage your Google Calendar integration in the Settings tab:</p>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>Disconnect your calendar at any time</li>
                  <li>Reconnect using the same or a different Google account</li>
                  <li>Your calendar data is automatically synced when connected</li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-medium text-white mb-2">Troubleshooting</h4>
                <p>If you encounter issues:</p>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>Try disconnecting and reconnecting your calendar</li>
                  <li>Ensure you're signed in to the correct Google account</li>
                  <li>Check your internet connection</li>
                  <li>Clear your browser cache and try again</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Account Management */}
          <section className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Account Management</h3>
            <div className="space-y-4 text-gray-300">
              <div>
                <h4 className="text-lg font-medium text-white mb-2">Your Data</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li>All your data is stored securely</li>
                  <li>You can export your data at any time</li>
                  <li>Delete your account and data from the Settings tab</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Contact Support */}
          <section>
            <h3 className="text-xl font-semibold text-white mb-4">Need More Help?</h3>
            <div className="space-y-4 text-gray-300">
              <p>Contact our support team at:</p>
              <p className="text-purple-400">informal.nimesh@gmail.com</p>
              <p>We typically respond within 24 hours.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default HelpTab;
