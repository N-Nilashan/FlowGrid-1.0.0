import { useState } from 'react';
import { signOut } from 'next-auth/react';

const SettingsTab = () => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const disconnectGoogleCalendar = async () => {
    try {
      setIsDisconnecting(true);
      const response = await fetch('/api/calendar/disconnect', {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to disconnect');
      window.location.reload();
    } catch (error) {
      console.error('Error disconnecting calendar:', error);
    } finally {
      setIsDisconnecting(false);
    }
  };

  const deleteAccount = async () => {
    try {
      setIsDeleting(true);
      const response = await fetch('/api/user/delete', {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete account');
      await signOut({ callbackUrl: '/' });
    } catch (error) {
      console.error('Error deleting account:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-purple-500/20">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Settings</h2>

          {/* Google Calendar Section */}
          <section className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Google Calendar Integration</h3>
            <div className="space-y-4">
              <p className="text-gray-300">
                Disconnecting your Google Calendar will remove access to your calendar events.
                You can always reconnect it later.
              </p>
              <button
                onClick={disconnectGoogleCalendar}
                disabled={isDisconnecting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isDisconnecting ? 'Disconnecting...' : 'Disconnect Google Calendar'}
              </button>
            </div>
          </section>

          {/* Account Section */}
          <section>
            <h3 className="text-xl font-semibold text-white mb-4">Account Management</h3>
            <div className="space-y-4">
              <p className="text-gray-300">
                Deleting your account will permanently remove all your data.
                This action cannot be undone.
              </p>
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Account
                </button>
              ) : (
                <div className="space-y-4">
                  <p className="text-red-400">Are you sure you want to delete your account?</p>
                  <div className="space-x-4">
                    <button
                      onClick={deleteAccount}
                      disabled={isDeleting}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      {isDeleting ? 'Deleting...' : 'Yes, Delete My Account'}
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
