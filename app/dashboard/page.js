'use client'
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import React from 'react'

const page = () => {

  const { data: session } = useSession();

  return (
    <>
      {session ? (
        <>
          <div className="p-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img src={session.user?.image} alt="User Image" className="w-10 h-10 rounded-full" />
                <h1 className="text-3xl text-green-500 font-bold">
                  Welcome Back, {session.user.name}
                </h1>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
              >
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="p-6 flex flex-col items-center justify-center min-h-[50vh]">
            <h1 className="text-2xl font-bold text-red-500 mb-4">You're not logged in</h1>
            <button
              onClick={() => signIn("google")}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
            >
              Sign in with Google
            </button>
          </div>
        </>
      )}

    </>

  )
}

export default page
