'use client'
import { signOut, useSession } from 'next-auth/react';

const Navbar = ({ setSidebarOpen }) => {
  const { data: session } = useSession();

  return (
    <nav className="bg-gray-800 border-b border-gray-700 shadow-lg fixed w-full top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(prevState => !prevState)}
              className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-label="Toggle sidebar"
            >
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex-shrink-0 flex items-center ml-4">
              <span className="text-purple-500 text-2xl font-bold">FlowGrid</span>
            </div>
          </div>
          <div className="flex items-center">
            <div className="ml-4 flex items-center md:ml-6">
              <div className="ml-3 relative flex items-center">
                <div className="flex items-center space-x-3">
                  <div className="text-right hidden sm:block">
                    <div className="text-sm font-medium text-white">{session?.user?.name}</div>
                    <div className="text-xs text-gray-400">{session?.user?.email}</div>
                  </div>
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-purple-500">
                    {session?.user?.image ? (
                      <img src={session.user.image} alt="User" className="w-7 h-7 object-cover" />
                    ) : (
                      <div className="h-full bg-gray-700 flex items-center justify-center">
                        <span className="text-gray-300 text-sm">{session?.user?.name?.[0]}</span>
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
  );
};

export default Navbar;
