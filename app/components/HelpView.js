import React from 'react';

const HelpView = () => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>

      <div>
        <h3 className="text-xl font-semibold mb-2">How do I connect my Google Calendar?</h3>
        <p className="text-gray-300">
          To connect your Google Calendar, go to the Settings tab and click the "Connect Google Calendar" button.
          You will be prompted to sign in with your Google account and grant permission to access your calendar.
        </p>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">How do I create a new task?</h3>
        <p className="text-gray-300">
          Navigate to the Tasks tab and click the "Add Task" button. Fill in the task details such as title,
          description, due date, and priority. Then click "Create Task" to add it to your task list.
        </p>
      </div>

      <h2 className="text-2xl font-bold mb-4">Support</h2>
      <p className="text-gray-300">
        If you need further assistance, please contact our support team at{' '}
        <a href="mailto:support@example.com" className="text-purple-400 hover:underline">
          support@example.com
        </a>
        . We're here to help!
      </p>
    </div>
  );
};

export default HelpView;
