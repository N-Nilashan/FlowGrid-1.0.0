'use client';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Privacy Policy</h1>
        <div className="space-y-6 text-gray-300">
          <section className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">1. Information We Collect</h2>
            <p className="mb-4">When you use FlowGrid, we collect:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Account information (email, name) through Google Sign-In</li>
              <li>Calendar data from your Google Calendar</li>
              <li>Task completion and interaction data</li>
              <li>Usage statistics and preferences</li>
            </ul>
          </section>

          <section className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
            <p className="mb-4">We use your information to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Provide and improve our task management services</li>
              <li>Personalize your experience</li>
              <li>Send important updates about our service</li>
              <li>Analyze usage patterns to improve our platform</li>
            </ul>
          </section>

          <section className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">3. Data Storage and Security</h2>
            <p className="mb-4">We prioritize your data security by:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Using encryption for data transmission</li>
              <li>Storing data securely with Supabase</li>
              <li>Regular security audits and updates</li>
              <li>Limited access to personal information</li>
            </ul>
          </section>

          <section className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">4. Google OAuth Scopes</h2>
            <p className="mb-4">We request the following Google OAuth scopes to provide our core functionality:</p>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-white">Calendar Access</h3>
                <p className="text-gray-300 mt-2">We request calendar access to:</p>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>Read your calendar events to display them alongside tasks</li>
                  <li>Create and modify events when you schedule tasks</li>
                  <li>Ensure task deadlines don't conflict with existing commitments</li>
                </ul>
                <p className="text-gray-300 mt-2">More limited scopes (read-only access) would prevent us from automatically scheduling tasks and managing your calendar events, which are core features of our productivity platform.</p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-white">Profile Information</h3>
                <p className="text-gray-300 mt-2">We request basic profile information to:</p>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>Create and personalize your account</li>
                  <li>Display your name and profile picture</li>
                  <li>Enable secure authentication</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-white">Data Usage & Security</h3>
                <p className="text-gray-300 mt-2">We commit to:</p>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>Only accessing the minimum data required for requested features</li>
                  <li>Never sharing or selling your Google account data</li>
                  <li>Storing data securely with industry-standard encryption</li>
                  <li>Allowing you to revoke access at any time</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">5. Your Rights</h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Access your personal data</li>
              <li>Request data deletion</li>
              <li>Opt-out of communications</li>
              <li>Export your data</li>
            </ul>
          </section>

          <section className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">6. Contact Us</h2>
            <p>If you have any questions about our Privacy Policy, please contact us at:</p>
            <p className="mt-2">Email: informal.nimesh@gmail.com</p>
          </section>

          <div className="text-sm text-gray-400 mt-8">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
