'use client';
// pages/index.js
import Link from 'next/link';
import { FaCalendarAlt, FaCheckSquare, FaClock, FaChartLine } from 'react-icons/fa';
import { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleWaitlistSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSubmitStatus('success');
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen font-sans overflow-x-hidden">
      {/* Glowing Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-900 rounded-full filter blur-[100px] opacity-20"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-indigo-900 rounded-full filter blur-[120px] opacity-15"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-fuchsia-900 rounded-full filter blur-[150px] opacity-10"></div>
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-fuchsia-500 text-2xl font-bold tracking-tighter">
                  FlowGrid
                </span>
              </div>
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                <Link href="#features" className="text-gray-300 hover:text-purple-400 px-3 py-2 text-sm font-medium hover:bg-gray-800/50 rounded-lg transition-all duration-300">
                  Features
                </Link>
                <Link href="#demo" className="text-gray-300 hover:text-purple-400 px-3 py-2 text-sm font-medium hover:bg-gray-800/50 rounded-lg transition-all duration-300">
                  Demo
                </Link>
                <Link href="#pricing" className="text-gray-300 hover:text-purple-400 px-3 py-2 text-sm font-medium hover:bg-gray-800/50 rounded-lg transition-all duration-300">
                  Pricing
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link href="/sign-in" className="relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-fuchsia-600 shadow-lg hover:shadow-purple-500/30 hover:scale-[1.02] transition-all duration-300">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 py-8 md:py-16 lg:py-24 lg:max-w-2xl lg:w-full">
            <div className="mt-10 sm:mt-12">
              <div className="sm:max-w-xl">
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-100 sm:text-5xl md:text-6xl">
                  <span className="block mb-1">Streamline your</span>
                  <span className="block bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-fuchsia-500">
                    busy schedule
                  </span>
                </h1>
                <p className="mt-6 text-xl text-gray-300">
                  FlowGrid helps you take control of your time and boost productivity by 30% through AI-powered task management, deadline tracking, and seamless calendar integration. Say goodbye to manual to-do lists and hello to effortless organization.
                </p>
                <div className="mt-8 sm:flex space-x-4">
                  <div className="rounded-md shadow-lg shadow-purple-500/20">
                    <Link href="#waitlist" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 md:text-lg transition-all duration-300 hover:shadow-purple-500/30">
                      Join the waitlist
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0">
                    <Link href="#features" className="w-full flex items-center justify-center px-8 py-3 border border-gray-700 text-base font-medium rounded-md text-gray-100 bg-gray-800/50 hover:bg-gray-800/70 md:text-lg transition-all duration-300 hover:border-purple-500/30">
                      Learn more
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="h-56 w-full sm:h-72 lg:h-full rounded-bl-3xl border-l border-b border-gray-800 flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
            <div className="relative w-5/6 h-5/6 border-2 border-gray-800 rounded-lg bg-gray-900/50 shadow-lg transform rotate-2 flex items-center justify-center overflow-hidden backdrop-blur-sm">
              <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-r from-purple-900/50 to-fuchsia-900/50 flex items-center px-4 border-b border-gray-800">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2 shadow-sm shadow-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2 shadow-sm shadow-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm shadow-green-500/50"></div>
                <div className="ml-4 text-xs text-gray-300 font-mono">FlowGrid Dashboard</div>
              </div>
              <div className="pt-8 text-center">
                <img src="/demo.png" alt="FlowGrid Dashboard" className="w-full h-full object-cover rounded-lg" />
              </div>
              <div className="absolute bottom-4 left-4 right-4 h-16 bg-gradient-to-r from-purple-900/20 to-fuchsia-900/20 rounded border border-gray-800 flex items-center px-4">
                <div className="w-3 h-3 rounded-full bg-purple-500 mr-2 animate-pulse"></div>
                <div className="text-xs text-gray-400 font-mono">SYNCING DATA...</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Waitlist Section */}
      <div id="waitlist" className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-lg mx-auto">
            <h2 className="text-3xl font-extrabold text-white text-center sm:text-4xl">
              Join the Waitlist
            </h2>
            <p className="mt-4 text-lg text-gray-400 text-center">
              Be the first to know when we launch. Sign up for our waitlist now!
            </p>
            <form onSubmit={handleWaitlistSubmit} className="mt-8 sm:flex">
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-5 py-3 border border-transparent placeholder-gray-500 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 focus:border-purple-500 sm:max-w-xs rounded-md"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500"
                >
                  {isSubmitting ? 'Submitting...' : 'Notify me'}
                </button>
              </div>
            </form>
            {submitStatus === 'success' && (
              <p className="mt-2 text-green-400">Thanks for signing up!</p>
            )}
            {submitStatus === 'error' && (
              <p className="mt-2 text-red-500">Oops! Something went wrong.</p>
            )}
          </div>
        </div>
      </div>

      {/* Why FlowGrid Section */}
      <div className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Why FlowGrid?</h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-400">
              FlowGrid is the ultimate productivity tool designed to simplify your life and help you achieve more.
            </p>
          </div>

          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="pt-6">
                <div className="flow-root bg-gray-800 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-md shadow-lg">
                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-white tracking-tight">Smart Calendar Integration</h3>
                    <p className="mt-5 text-base text-gray-400">
                      Seamlessly connect with your existing calendar and let FlowGrid automatically categorize your events.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-gray-800 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-md shadow-lg">
                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-white tracking-tight">Intelligent Task Lists</h3>
                    <p className="mt-5 text-base text-gray-400">
                      FlowGrid generates optimized daily task lists based on your calendar events and priorities.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-gray-800 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-md shadow-lg">
                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-white tracking-tight">Deadline Tracking</h3>
                    <p className="mt-5 text-base text-gray-400">
                      Never miss a deadline again with FlowGrid's automated deadline tracking and reminders.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Glowing separator */}
      <div className="relative py-12">
        <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
          <div className="w-3/4 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="px-6 bg-gray-900 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-500 text-sm font-bold tracking-widest">
            FROM CHAOS TO CLARITY
          </span>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-16 bg-gradient-to-b from-gray-900 to-gray-900/70 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:text-center">
            <h2 className="text-base text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-500 font-semibold tracking-wide uppercase">
              Features
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-100 sm:text-4xl">
              Everything you need to excel
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-400 lg:mx-auto">
              Designed with students in mind, our tools help you focus on what matters most.
            </p>
          </div>

          <div className="mt-16">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-12">
              <div className="relative bg-gray-800/50 p-6 rounded-xl border border-gray-800 hover:border-purple-500/30 transition-all duration-300 group">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-br from-purple-600 to-fuchsia-600 text-white shadow-lg shadow-purple-500/30">
                    <FaCalendarAlt className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-200 group-hover:text-purple-400 transition-colors duration-300">
                    Smart Calendar Integration
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-400">
                  Connect with Google Calendar and let our AI distinguish between personal and academic events, organizing them into separate categories automatically.
                </dd>
              </div>

              <div className="relative bg-gray-800/50 p-6 rounded-xl border border-gray-800 hover:border-purple-500/30 transition-all duration-300 group">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-br from-purple-600 to-fuchsia-600 text-white shadow-lg shadow-purple-500/30">
                    <FaCheckSquare className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-200 group-hover:text-purple-400 transition-colors duration-300">
                    Intelligent Task Lists
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-400">
                  Generate daily to-do lists that separate academic tasks from personal responsibilities, helping you maintain work-life balance.
                </dd>
              </div>

              <div className="relative bg-gray-800/50 p-6 rounded-xl border border-gray-800 hover:border-purple-500/30 transition-all duration-300 group">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-br from-purple-600 to-fuchsia-600 text-white shadow-lg shadow-purple-500/30">
                    <FaClock className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-200 group-hover:text-purple-400 transition-colors duration-300">
                    Deadline Tracking
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-400">
                  Never miss another assignment. Track all your deadlines and visualize your progress towards completing each task on time.
                </dd>
              </div>

              <div className="relative bg-gray-800/50 p-6 rounded-xl border border-gray-800 hover:border-purple-500/30 transition-all duration-300 group">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-br from-purple-600 to-fuchsia-600 text-white shadow-lg shadow-purple-500/30">
                    <FaChartLine className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-200 group-hover:text-purple-400 transition-colors duration-300">
                    Productivity Analytics
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-400">
                  See how your productivity changes over time with beautiful visualizations and get personalized tips to improve your study habits.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Demo Section */}
      <div id="demo" className="relative py-20 bg-gradient-to-b from-gray-900/70 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-100 sm:text-4xl">
              See FlowGrid in action
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-400 sm:mt-4">
              Watch how our app transforms student productivity
            </p>
          </div>

          <div className="mt-16 relative max-w-4xl mx-auto">
            <div className="aspect-w-16 aspect-h-9">
              <div className="w-full h-full rounded-xl overflow-hidden shadow-2xl border-2 border-gray-800 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-fuchsia-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="p-8 text-center relative z-10">
                  <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-600/20 to-fuchsia-600/20 border border-purple-500/20 mb-6 group-hover:scale-110 transition-transform duration-500">
                    <svg className="w-10 h-10 text-purple-500 group-hover:text-fuchsia-400 transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-lg text-gray-400 group-hover:text-gray-300 transition-colors duration-500">Demo Video Placeholder</p>
                </div>
              </div>
            </div>

            {/* Floating futuristic elements */}
            <div className="absolute -top-8 -right-12 transform rotate-6">
              <div className="bg-gradient-to-br from-purple-900/80 to-fuchsia-900/80 p-4 rounded-xl shadow-lg w-48 border border-gray-800 backdrop-blur-sm">
                <p className="text-gray-200 text-sm font-mono">Remember to check the dashboard every morning!</p>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-purple-500 rounded-full filter blur-[6px]"></div>
              </div>
            </div>

            <div className="absolute -bottom-10 -left-10 transform -rotate-3">
              <div className="bg-gradient-to-br from-purple-900/80 to-blue-900/80 p-4 rounded-xl shadow-lg w-48 border border-gray-800 backdrop-blur-sm">
                <p className="text-gray-200 text-sm font-mono">30% more productive since using this app!</p>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full filter blur-[6px]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Early Access Benefits Section */}
      <div className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">What do you get from early access?</h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-400">
              Be among the first to experience the power of FlowGrid and unlock exclusive benefits.
            </p>
          </div>

          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="pt-6">
                <div className="flow-root bg-gray-800 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-md shadow-lg">
                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-white tracking-tight">Early Access</h3>
                    <p className="mt-5 text-base text-gray-400">
                      Be among the first to try out FlowGrid before it's available to the public.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-gray-800 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-md shadow-lg">
                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-white tracking-tight">Exclusive Discounts</h3>
                    <p className="mt-5 text-base text-gray-400">
                      Enjoy special early bird pricing and lock in the best deals before launch.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-gray-800 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-md shadow-lg">
                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-white tracking-tight">Priority Support</h3>
                    <p className="mt-5 text-base text-gray-400">
                      Get fast-tracked support and have your voice heard in shaping the future of FlowGrid.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link href="#waitlist" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 transition-all duration-300 hover:scale-[1.02]">
              Join the waitlist
            </Link>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-gradient-to-r from-purple-900 to-fuchsia-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-[size:50px_50px] opacity-10"></div>
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8 lg:flex lg:items-center lg:justify-between relative z-10">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to boost your productivity?</span>
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-fuchsia-300">
              Start your free trial today.
            </span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0 space-x-4">
            <div className="rounded-md shadow-lg shadow-purple-500/30">
              <Link href="/sign-in" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-purple-900 bg-white hover:bg-gray-50 transition-all duration-300 hover:scale-[1.02]">
                Get started
              </Link>
            </div>
            <div className="rounded-md shadow-lg shadow-purple-500/20">
              <Link href="#waitlist" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-800/50 hover:bg-purple-800/70 transition-all duration-300 border border-purple-500/20">
                Join the waitlist
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900/80 backdrop-blur-sm border-t border-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
          <nav className="-mx-5 -my-2 flex flex-wrap justify-center">
            <div className="px-5 py-2">
              <Link href="/about" className="text-base text-gray-400 hover:text-purple-400 transition-colors duration-300">
                About
              </Link>
            </div>
            <div className="px-5 py-2">
              <Link href="/privacy" className="text-base text-gray-400 hover:text-purple-400 transition-colors duration-300">
                Privacy
              </Link>
            </div>
            <div className="px-5 py-2">
              <Link href="/terms" className="text-base text-gray-400 hover:text-purple-400 transition-colors duration-300">
                Terms
              </Link>
            </div>
            <div className="px-5 py-2">
              <Link href="/contact" className="text-base text-gray-400 hover:text-purple-400 transition-colors duration-300">
                Contact
              </Link>
            </div>
          </nav>
          <div className="mt-8 flex justify-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-300">
              <span className="sr-only">Twitter</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-300">
              <span className="sr-only">GitHub</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-300">
              <span className="sr-only">Instagram</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
          <p className="mt-8 text-center text-base text-gray-500">
            &copy; 2025 FlowGrid. All rights reserved.
          </p>
          <p className="mt-8 text-center text-base text-gray-500">
            Made with ❤️ by <a href="https://x.com/N_Nilashan" className="text-purple-400 hover:text-fuchsia-400 transition-colors duration-300">Nimesh Nilashan</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
