'use client'
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    { name: 'Study Sessions', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { name: 'Notes', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
    { name: 'Tasks', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    { name: 'Calendar', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  ];

  const bottomNavItems = [
    { name: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', iconExtra: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
    { name: 'Help', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { name: 'Logout', icon: 'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Navbar */}
      <nav className="bg-gray-800 border-b border-gray-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="inline-flex md:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
              >
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="flex-shrink-0 flex items-center">
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
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-purple-500 shadow-lg shadow-purple-500/20">
                      {session.user?.image ? (
                        <img src={session.user?.image} alt="User Image" className="w-8 h-8 rounded-full" />
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

      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className={`bg-gray-800 border-r border-gray-700 shadow-lg ${sidebarOpen ? 'block' : 'hidden'} md:block w-64 flex-shrink-0`}>
          <div className="h-full flex flex-col justify-between py-4">
            <div className="px-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href="#"
                  className="group flex items-center px-2 py-3 text-sm font-medium rounded-md text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-200"
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
                </Link>
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
                  <Link
                    key={item.name}
                    href="#"
                    className="group flex items-center px-2 py-3 text-sm font-medium rounded-md text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-200"
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
                  </Link>
                )
              ))}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <main className="px-4 py-6 sm:px-6 lg:px-8">
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
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
