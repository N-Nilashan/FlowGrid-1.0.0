'use client'
import { signOut } from 'next-auth/react';
import { CalendarIcon, CheckCircleIcon, Cog6ToothIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

const navItems = [
  { name: 'Google Calendar', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { name: 'Tasks', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
];

const bottomNavItems = [
  { name: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', iconExtra: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
  { name: 'Help', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { name: 'Logout', icon: 'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen, activeTab, setActiveTab, calendarConnected }) => {
  const tabs = [
    {
      name: 'Google Calendar',
      icon: CalendarIcon,
      current: activeTab === 'Google Calendar',
      status: calendarConnected ? 'connected' : 'disconnected'
    },
    {
      name: 'Tasks',
      icon: CheckCircleIcon,
      current: activeTab === 'Tasks'
    },
    {
      name: 'Settings',
      icon: Cog6ToothIcon,
      current: activeTab === 'Settings'
    },
    {
      name: 'Help',
      icon: QuestionMarkCircleIcon,
      current: activeTab === 'Help'
    }
  ];

  return (
    <>
      <div
        className={`fixed inset-y-0 left-0 transform z-30 w-64 bg-gray-800 border-r border-gray-700 pt-16 transition-all duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="h-full flex flex-col justify-between py-4">
          <div className="px-4 space-y-1 mt-5">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => {
                  setActiveTab(tab.name);
                  if (window.innerWidth < 768) {
                    setSidebarOpen(false);
                  }
                }}
                className={`${tab.current
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  } group flex items-center justify-between px-2 py-2 text-sm font-medium rounded-md w-full transition-colors duration-150`}
              >
                <div className="flex items-center">
                  <tab.icon
                    className={`${tab.current ? 'text-purple-400' : 'text-gray-400 group-hover:text-gray-300'
                      } mr-3 flex-shrink-0 h-6 w-6`}
                    aria-hidden="true"
                  />
                  {tab.name}
                </div>
                {tab.status && (
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tab.status === 'connected'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                      }`}
                  >
                    {tab.status}
                  </span>
                )}
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

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out ${sidebarOpen ? 'opacity-50 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setSidebarOpen(false)}
      />
    </>
  );
};

export default Sidebar;
