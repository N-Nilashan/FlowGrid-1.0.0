'use client';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Terms of Service</h1>
        <div className="space-y-6 text-gray-300">
          <section className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing and using FlowGrid, you agree to be bound by these Terms of Service and our Privacy Policy.
              If you disagree with any part of these terms, you may not access our service.
            </p>
          </section>

          <section className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">2. Description of Service</h2>
            <p className="mb-4">FlowGrid provides:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Task management and organization tools</li>
              <li>Calendar integration services</li>
              <li>Productivity tracking features</li>
              <li>Personal data analytics</li>
            </ul>
          </section>

          <section className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">3. User Responsibilities</h2>
            <p className="mb-4">You agree to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Provide accurate information</li>
              <li>Maintain the security of your account</li>
              <li>Not misuse or abuse the service</li>
              <li>Comply with all applicable laws</li>
            </ul>
          </section>

          <section className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">4. Intellectual Property</h2>
            <p className="mb-4">
              The service and its original content, features, and functionality are owned by FlowGrid and are protected by
              international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
          </section>

          <section className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">5. Termination</h2>
            <p className="mb-4">
              We may terminate or suspend your account and bar access to the Service immediately, without prior notice or
              liability, under our sole discretion, for any reason whatsoever and without limitation.
            </p>
          </section>

          <section className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">6. Limitation of Liability</h2>
            <p className="mb-4">
              In no event shall FlowGrid, nor its directors, employees, partners, agents, suppliers, or affiliates, be
              liable for any indirect, incidental, special, consequential or punitive damages.
            </p>
          </section>

          <section className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">7. Changes to Terms</h2>
            <p className="mb-4">
              We reserve the right to modify or replace these Terms at any time. We will provide notice of any changes by
              posting the new Terms on this page.
            </p>
          </section>

          <section className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">8. Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us at:</p>
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

export default TermsOfService;
