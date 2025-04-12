'use client'
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// Dynamically import the calendar component to avoid SSR issues
const GoogleCalendarView = dynamic(
  () => import('../components/GoogleCalendarView'),
  { ssr: false }
);

// Dynamically import the TaskView component
const TaskView = dynamic(
  () => import('../components/TaskView'),
  { ssr: false }
);

const Dashboard = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isCalendarConnected, setIsCalendarConnected] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

  // Toggle sidebar function
  const toggleSidebar = () => {
    setSidebarOpen(prevState => !prevState);
  };

  // Check if calendar is connected and fetch events
  useEffect(() => {
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
      }
    };

    if (activeTab === 'Google Calendar') {
      checkCalendarConnection();
    }
  }, [activeTab]);

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

  // Get current time for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const navItems = [
    { name: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Google Calendar', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { name: 'Tasks', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    { name: 'Study Sessions', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { name: 'Notes', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
  ];

  const bottomNavItems = [
    { name: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', iconExtra: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
    { name: 'Help', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { name: 'Logout', icon: 'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' },
  ];

  const renderGoogleCalendarSection = () => {
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
                className={`w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-4 py-3 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-purple-500/20 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''
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

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Navbar */}
      <nav className="bg-gray-800 border-b border-gray-700 shadow-lg fixed w-full top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                aria-label="Toggle sidebar"
              >
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="flex-shrink-0 flex items-center ml-4">
                <span className="text-purple-500 text-2xl font-bold">StudyFlow</span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="ml-4 flex items-center md:ml-6">
                <div className="ml-3 relative flex items-center">
                  <div className="flex items-center space-x-3">
                    <div className="text-right hidden sm:block">
                      <div className="text-sm font-medium text-white">{session.user?.name}</div>
                      <div className="text-xs text-gray-400">{session.user?.email}</div>
                    </div>
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-purple-500">
                      {session.user?.image ? (
                        <img src={session.user?.image} alt="User" className="w-7 h-7 object-cover" />
                      ) : (
                        <div className="h-full bg-gray-700 flex items-center justify-center">
                          <span className="text-gray-300 text-sm">{session.user?.name?.[0]}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 transform z-30 w-64 bg-gray-800 border-r border-gray-700 pt-16 transition-all duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
        >
          <div className="h-full flex flex-col justify-between py-4">
            <div className="px-4 space-y-1 mt-5">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    setActiveTab(item.name);
                    if (window.innerWidth < 768) {
                      setSidebarOpen(false);
                    }
                  }}
                  className={`group flex items-center w-full px-2 py-2.5 text-sm font-medium rounded-md text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-200 ${activeTab === item.name ? 'bg-gray-700 text-white' : ''
                    }`}
                >
                  <svg
                    className={`mr-3 h-5 w-5 ${activeTab === item.name ? 'text-purple-400' : 'text-gray-400 group-hover:text-purple-400'
                      }`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                    {item.iconExtra && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.iconExtra} />}
                  </svg>
                  {item.name}
                </button>
              ))}
            </div>
            <div className="px-4 space-y-1 mt-auto">
              {bottomNavItems.map((item) => (
                item.name === 'Logout' ? (
                  <button
                    key={item.name}
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="group flex items-center px-2 py-3 text-sm font-medium rounded-md text-gray-300 hover:text-white hover:bg-gray-700 w-full text-left transition-all duration-200"
                  >
                    <svg
                      className="text-gray-400 group-hover:text-purple-400 mr-3 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                      {item.iconExtra && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.iconExtra} />}
                    </svg>
                    {item.name}
                  </button>
                ) : (
                  <button
                    key={item.name}
                    onClick={() => setActiveTab(item.name)}
                    className={`group flex items-center w-full px-2 py-3 text-sm font-medium rounded-md text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-200 ${activeTab === item.name ? 'bg-gray-700 text-white' : ''
                      }`}
                  >
                    <svg
                      className={`mr-3 h-5 w-5 ${activeTab === item.name ? 'text-purple-400' : 'text-gray-400 group-hover:text-purple-400'
                        }`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                      {item.iconExtra && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.iconExtra} />}
                    </svg>
                    {item.name}
                  </button>
                )
              ))}
            </div>
          </div>
        </div>

        {/* Overlay - show on all devices when sidebar is open */}
        <div
          className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out ${sidebarOpen ? 'opacity-50 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Main content - adjust margin based on sidebar state */}
        <div className={`flex-1 overflow-auto w-full transition-all duration-300 ease-in-out`}>
          <main className="px-4 py-6 sm:px-6 lg:px-8">
            {activeTab === 'Google Calendar' ? (
              renderGoogleCalendarSection()
            ) : activeTab === 'Tasks' ? (
              <TaskView />
            ) : (
              <>
                {/* Greeting section */}
                <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-purple-500/20 mb-6">
                  <div className="p-6">
                    <h1 className="text-2xl font-bold text-white mb-2">
                      {getGreeting()}, {session.user?.name?.split(' ')[0]}
                    </h1>
                    <p className="text-gray-400">
                      Welcome to your StudyFlow dashboard. Ready to be productive today?
                    </p>
                  </div>
                </div>

                {/* Dashboard content placeholder */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {/* Recent activity card */}
                  <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 hover:border-purple-500/30 transition-all duration-300">
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-medium text-white">Recent Activity</h2>
                        <span className="text-xs text-purple-400 bg-purple-400/10 px-2 py-1 rounded-full">5 new</span>
                      </div>
                      <div className="space-y-3">
                        {['Created new study notes', 'Completed practice exam', 'Updated schedule'].map((activity, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <div className="h-2 w-2 mt-2 rounded-full bg-purple-500"></div>
                            <div>
                              <p className="text-sm text-gray-300">{activity}</p>
                              <span className="text-xs text-gray-500">{index + 1} hour{index !== 0 ? 's' : ''} ago</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Upcoming tasks card */}
                  <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 hover:border-purple-500/30 transition-all duration-300">
                    <div className="p-5">
                      <h2 className="text-lg font-medium text-white mb-4">Upcoming Tasks</h2>
                      <div className="space-y-3">
                        {['Complete Math Assignment', 'Review Literature Notes', 'Prepare Presentation'].map((task, index) => (
                          <div key={index} className="flex items-center">
                            <input type="checkbox" className="h-4 w-4 rounded border-gray-600 text-purple-600 focus:ring-purple-500 bg-gray-700" />
                            <span className="ml-3 text-sm text-gray-300">{task}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Study stats card */}
                  <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 hover:border-purple-500/30 transition-all duration-300">
                    <div className="p-5">
                      <h2 className="text-lg font-medium text-white mb-4">Study Stats</h2>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">Weekly Goal</span>
                            <span className="text-gray-300">20 hrs / 25 hrs</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2.5">
                            <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '80%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">Focus Score</span>
                            <span className="text-gray-300">85%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2.5">
                            <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
