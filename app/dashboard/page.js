'use client'
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import React from 'react'

const Page = () => {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {session ? (
          <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-purple-500/20">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-4">
                  {session.user?.image && (
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-purple-500 shadow-lg shadow-purple-500/20">
                     <img src={session.user?.image} alt="User Image" className="w-12 h-12 rounded-full" />
                    </div>
                  )}
                  <div>
                    <p className="text-gray-400 text-sm">Welcome back</p>
                    <h1 className="text-xl font-bold text-white">
                      {session.user?.name || 'User'}
                    </h1>
                  </div>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="px-4 py-2 bg-gray-900 hover:bg-gray-950 text-white rounded-lg transition-all duration-300 text-sm border border-gray-700 hover:border-purple-500 shadow-lg hover:shadow-purple-500/20"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-purple-500/20">
            <div className="p-8 flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-purple-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Welcome</h1>
              <p className="text-gray-400 text-center mb-8">Sign in to access your account</p>

              <button
                onClick={() => signIn("google", { callbackUrl: '/dashboard' })}
                className="w-full bg-gray-900 hover:bg-gray-950 text-white rounded-lg py-3 px-4 flex items-center justify-center gap-3 transition-all duration-300 border border-gray-700 hover:border-purple-500 group shadow-lg hover:shadow-purple-500/20"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fillOpacity=".35"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fillOpacity=".45"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fillOpacity=".55"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fillOpacity=".65"
                  />
                </svg>
                <span className="text-sm font-medium">Continue with Google</span>
              </button>

              <div className="mt-6 text-xs text-gray-500 text-center">
                By signing in, you agree to our
                <br />
                <a href="#" className="text-purple-400 hover:text-purple-300">Terms of Service</a> and <a href="#" className="text-purple-400 hover:text-purple-300">Privacy Policy</a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Page
