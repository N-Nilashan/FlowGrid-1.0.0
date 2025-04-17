'use client'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Import components
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import GoogleCalendarSection from '../components/GoogleCalendarSection';
import SettingsTab from '../components/SettingsTab';
import HelpTab from '../components/HelpTab';

// Dynamically import the TaskView component
const TaskView = dynamic(
  () => import('../components/TaskView'),
  { ssr: false }
);

const Dashboard = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Google Calendar');
  const [calendarConnected, setCalendarConnected] = useState(false);

  // Check calendar connection status
  useEffect(() => {
    const checkCalendarStatus = async () => {
      try {
        const response = await fetch('/api/calendar/status');
        const data = await response.json();
        setCalendarConnected(data.connected);
      } catch (error) {
        console.error('Error checking calendar status:', error);
        setCalendarConnected(false);
      }
    };

    if (session) {
      checkCalendarStatus();
    }
  }, [session]);

  // Remove the screen size effect since we want consistent behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

  // If no session, redirect to sign in
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center p-6">
          <p className="text-gray-400 mb-4">Please sign in to access your dashboard</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-300"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'Google Calendar':
        return <GoogleCalendarSection isConnected={calendarConnected} />;
      case 'Tasks':
        return <TaskView />;
      case 'Settings':
        return <SettingsTab />;
      case 'Help':
        return <HelpTab />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Navbar setSidebarOpen={setSidebarOpen} />

      <div className="flex flex-1 pt-16">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          calendarConnected={calendarConnected}
        />

        {/* Main content */}
        <div className={`flex-1 overflow-auto w-full transition-all duration-300 ease-in-out`}>
          <main className="px-4 py-6 sm:px-6 lg:px-8">
            {renderActiveTab()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
