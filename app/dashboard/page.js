'use client'
import { signIn, useSession } from 'next-auth/react';
import React from 'react'

const page = () => {

  const { data: session } = useSession();

  return (
    <>
    {session ?(
      <>
         <div>
        <h1 className='text-3xl text-green-500 font-bold'>
          Welcome Back, {session.user.name}
        </h1>
        </div>
      </>
    ):(
      <>
      <div>
      <h1 className='text-2xl font-bold text-red-500'>You're not logged in</h1>
      <button onClick={() => signIn("google")}>Sign in with Google</button>
     </div>
   </>
    )}

    </>

  )
}

export default page
