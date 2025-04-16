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

  // Productivity data state
  const [productivityScore, setProductivityScore] = useState(85);
  const [productivityLevel, setProductivityLevel] = useState(4);
  const [levelProgress, setLevelProgress] = useState(75);
  const [streak, setStreak] = useState(3);
  const [tasksCompleted, setTasksCompleted] = useState(24);
  const [weeklyHours, setWeeklyHours] = useState(20);
  const [weeklyGoal, setWeeklyGoal] = useState(25);
  const [focusScore, setFocusScore] = useState(85);
  const [completionRate, setCompletionRate] = useState(92);

  // Tasks state
  const [upcomingTasks, setUpcomingTasks] = useState({
    today: [
      { id: 1, title: 'Complete client presentation', duration: '1h', completed: false },
      { id: 2, title: 'Team standup meeting', duration: '30m', completed: false },
      { id: 3, title: 'Review project proposal', duration: '2h', completed: false }
    ],
    tomorrow: [
      { id: 4, title: 'Weekly planning session', duration: '1h', completed: false },
      { id: 5, title: 'Client follow-up call', duration: '45m', completed: false }
    ]
  });

  // Achievements state
  const [achievements, setAchievements] = useState([
    { id: 1, icon: '🔥', title: '3-Day Streak', description: 'Completed tasks for 3 days in a row', completed: true },
    { id: 2, icon: '⚡', title: 'Efficiency Pro', description: 'Completed 10 tasks in a single day', completed: true },
    { id: 3, icon: '🎯', title: 'Perfect Week', description: 'Complete all scheduled tasks in a week', completed: false },
    { id: 4, icon: '⭐', title: 'Focus Master', description: 'Maintain focus score above 90% for a week', completed: false },
    { id: 5, icon: '🏆', title: 'Productivity Champion', description: 'Reach Level 10', completed: false }
  ]);

  // Recent activity state
  const [recentActivities, setRecentActivities] = useState([
    { id: 1, icon: '✅', text: 'Completed weekly review', time: '1 hour ago' },
    { id: 2, icon: '🎯', text: 'Finished client presentation', time: '3 hours ago' },
    { id: 3, icon: '📅', text: 'Scheduled team meeting', time: '5 hours ago' },
    { id: 4, icon: '📋', text: 'Updated project timeline', time: '1 day ago' },
    { id: 5, icon: '🔥', text: 'Completed 3-day streak', time: '1 day ago' }
  ]);

  // Load productivity data from localStorage when component mounts
  useEffect(() => {
    const loadProductivityData = () => {
      try {
        const storedData = localStorage.getItem('productivityData');
        if (storedData) {
          const data = JSON.parse(storedData);
          setProductivityScore(data.productivityScore || 85);
          setProductivityLevel(data.productivityLevel || 4);
          setLevelProgress(data.levelProgress || 75);
          setStreak(data.streak || 3);
          setTasksCompleted(data.tasksCompleted || 24);
          setWeeklyHours(data.weeklyHours || 20);
          setWeeklyGoal(data.weeklyGoal || 25);
          setFocusScore(data.focusScore || 85);
          setCompletionRate(data.completionRate || 92);

          // Load tasks if available
          if (data.upcomingTasks) {
            setUpcomingTasks(data.upcomingTasks);
          }

          // Load achievements if available
          if (data.achievements) {
            setAchievements(data.achievements);
          }

          // Load activities if available
          if (data.recentActivities) {
            setRecentActivities(data.recentActivities);
          }
        }
      } catch (error) {
        console.error('Error loading productivity data:', error);
      }
    };

    loadProductivityData();
  }, []);

  // Save productivity data to localStorage when relevant states change
  useEffect(() => {
    const saveProductivityData = () => {
      try {
        const dataToSave = {
          productivityScore,
          productivityLevel,
          levelProgress,
          streak,
          tasksCompleted,
          weeklyHours,
          weeklyGoal,
          focusScore,
          completionRate,
          upcomingTasks,
          achievements,
          recentActivities
        };

        localStorage.setItem('productivityData', JSON.stringify(dataToSave));
      } catch (error) {
        console.error('Error saving productivity data:', error);
      }
    };

    saveProductivityData();
  }, [
    productivityScore,
    productivityLevel,
    levelProgress,
    streak,
    tasksCompleted,
    weeklyHours,
    focusScore,
    completionRate,
    upcomingTasks,
    achievements,
    recentActivities
  ]);

  // Handle task completion
  const handleTaskCompletion = (taskId, isToday) => {
    // Create a deep copy of upcomingTasks
    const updatedTasks = JSON.parse(JSON.stringify(upcomingTasks));

    // Update the completed status in the appropriate day
    const dayKey = isToday ? 'today' : 'tomorrow';
    const taskIndex = updatedTasks[dayKey].findIndex(task => task.id === taskId);

    if (taskIndex !== -1) {
      const newCompletedStatus = !updatedTasks[dayKey][taskIndex].completed;
      updatedTasks[dayKey][taskIndex].completed = newCompletedStatus;

      // Update tasks state
      setUpcomingTasks(updatedTasks);

      // If task was marked as completed, update relevant stats
      if (newCompletedStatus) {
        // Increment tasks completed
        setTasksCompleted(prev => prev + 1);

        // Potentially increase productivity score (random small increase 1-3 points, max 100)
        setProductivityScore(prev => Math.min(100, prev + Math.floor(Math.random() * 3) + 1));

        // Add a new activity entry
        const task = updatedTasks[dayKey][taskIndex];
        const newActivity = {
          id: Date.now(),
          icon: '✅',
          text: `Completed: ${task.title}`,
          time: 'Just now'
        };

        setRecentActivities(prev => [newActivity, ...prev.slice(0, 4)]);

        // Check for potential achievement unlocks
        checkForAchievements();
      }
    }
  };

  // Check for unlocked achievements
  const checkForAchievements = () => {
    const updatedAchievements = [...achievements];
    let achievementUnlocked = false;

    // Check each achievement condition
    updatedAchievements.forEach((achievement) => {
      if (!achievement.completed) {
        switch (achievement.id) {
          case 3: // Perfect Week
            if (completionRate >= 100) {
              achievement.completed = true;
              achievementUnlocked = true;
            }
            break;
          case 4: // Focus Master
            if (focusScore >= 90) {
              achievement.completed = true;
              achievementUnlocked = true;
            }
            break;
          case 5: // Productivity Champion
            if (productivityLevel >= 10) {
              achievement.completed = true;
              achievementUnlocked = true;
            }
            break;
          default:
            break;
        }
      }
    });

    if (achievementUnlocked) {
      setAchievements(updatedAchievements);
      // Potentially increase level progress when achievement is unlocked
      setLevelProgress(prev => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          // Level up!
          setProductivityLevel(prevLevel => prevLevel + 1);
          return newProgress - 100;
        }
        return newProgress;
      });
    }
  };

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

  // Function to fetch tasks from api
  const fetchTasksFromCalendar = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/tasks/process?view=weekly');
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }

      const data = await response.json();

      // Process tasks and update upcoming tasks
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayTasks = [];
      const tomorrowTasks = [];

      const allTasks = [
        ...data.work || [],
        ...data.personal || [],
        ...data.studies || [],
        ...data.health || [],
        ...data.uncategorized || []
      ];

      // Sort tasks by their start time
      allTasks.sort((a, b) => new Date(a.start) - new Date(b.start));

      // Filter tasks for today and tomorrow
      allTasks.forEach(task => {
        const taskDate = new Date(task.start);
        const taskId = task.id;
        const taskTitle = task.title;

        // Calculate duration
        const endTime = new Date(task.end);
        const durationMs = endTime - taskDate;
        const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
        const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
        const durationText = durationHours > 0
          ? `${durationHours}h ${durationMinutes > 0 ? durationMinutes + 'm' : ''}`
          : `${durationMinutes}m`;

        const formattedTask = {
          id: taskId,
          title: taskTitle,
          duration: durationText,
          completed: task.completed || false
        };

        // Check if task is for today
        if (
          taskDate.getDate() === today.getDate() &&
          taskDate.getMonth() === today.getMonth() &&
          taskDate.getFullYear() === today.getFullYear()
        ) {
          todayTasks.push(formattedTask);
        }
        // Check if task is for tomorrow
        else if (
          taskDate.getDate() === tomorrow.getDate() &&
          taskDate.getMonth() === tomorrow.getMonth() &&
          taskDate.getFullYear() === tomorrow.getFullYear()
        ) {
          tomorrowTasks.push(formattedTask);
        }
      });

      // Limit to 5 tasks per day to avoid cluttering the UI
      const updatedUpcomingTasks = {
        today: todayTasks.slice(0, 5),
        tomorrow: tomorrowTasks.slice(0, 5)
      };

      setUpcomingTasks(updatedUpcomingTasks);

      // Update productivity metrics based on task completion
      const completedTasksCount = allTasks.filter(task => task.completed).length;
      const totalTasksCount = allTasks.length;

      if (totalTasksCount > 0) {
        // Update completion rate
        const newCompletionRate = Math.round((completedTasksCount / totalTasksCount) * 100);
        setCompletionRate(newCompletionRate);

        // Update tasks completed
        setTasksCompleted(completedTasksCount);

        // Calculate weekly hours from completed tasks
        const weeklyHoursFromTasks = allTasks.reduce((total, task) => {
          if (task.completed) {
            const start = new Date(task.start);
            const end = new Date(task.end);
            const durationHours = (end - start) / (1000 * 60 * 60);
            return total + durationHours;
          }
          return total;
        }, 0);

        setWeeklyHours(Math.round(weeklyHoursFromTasks * 10) / 10); // Round to 1 decimal place
      }

      // Sync with calendar events if calendar is connected
      if (isCalendarConnected && calendarEvents.length > 0) {
        updateRecentActivitiesFromCalendar();
      }

    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update recent activities based on calendar events
  const updateRecentActivitiesFromCalendar = () => {
    const recentCalendarEvents = calendarEvents
      .filter(event => new Date(event.start?.dateTime || event.start?.date) <= new Date())
      .sort((a, b) => {
        return new Date(b.start?.dateTime || b.start?.date) - new Date(a.start?.dateTime || a.start?.date);
      })
      .slice(0, 3);

    const newActivities = recentCalendarEvents.map(event => {
      const eventTime = new Date(event.start?.dateTime || event.start?.date);
      const now = new Date();
      const diffHours = Math.round((now - eventTime) / (1000 * 60 * 60));

      let timeText;
      if (diffHours < 1) {
        timeText = 'Just now';
      } else if (diffHours === 1) {
        timeText = '1 hour ago';
      } else if (diffHours < 24) {
        timeText = `${diffHours} hours ago`;
      } else {
        timeText = `${Math.floor(diffHours / 24)} day${Math.floor(diffHours / 24) > 1 ? 's' : ''} ago`;
      }

      // Determine icon based on event summary
      let icon = '📅';
      if (event.summary?.toLowerCase().includes('meet')) icon = '👥';
      if (event.summary?.toLowerCase().includes('call')) icon = '📞';
      if (event.summary?.toLowerCase().includes('presentation')) icon = '🎯';
      if (event.summary?.toLowerCase().includes('review')) icon = '✅';

      return {
        id: event.id || Date.now(),
        icon,
        text: `Attended: ${event.summary || 'Calendar event'}`,
        time: timeText
      };
    });

    // Merge with existing activities, removing duplicates and keeping most recent
    const updatedActivities = [...newActivities];

    recentActivities.forEach(activity => {
      // If activity doesn't already exist in the new list, add it
      if (!updatedActivities.some(a => a.text === activity.text)) {
        updatedActivities.push(activity);
      }
    });

    // Sort by recency and limit to 5
    updatedActivities.sort((a, b) => {
      const timeA = a.time;
      const timeB = b.time;

      if (timeA === 'Just now') return -1;
      if (timeB === 'Just now') return 1;

      if (timeA.includes('hour') && timeB.includes('day')) return -1;
      if (timeB.includes('hour') && timeA.includes('day')) return 1;

      const numA = parseInt(timeA.split(' ')[0]);
      const numB = parseInt(timeB.split(' ')[0]);

      return numA - numB;
    });

    setRecentActivities(updatedActivities.slice(0, 5));
  };

  // Fetch tasks when calendar connection status changes
  useEffect(() => {
    if (isCalendarConnected) {
      fetchTasksFromCalendar();
    }
  }, [isCalendarConnected, calendarEvents]);

  // Check calendar connection and fetch events
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

    if (activeTab === 'Dashboard') {
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
                {/* Greeting section with productivity score and refresh button */}
                <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-purple-500/20 mb-6">
                  <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                      <h1 className="text-2xl font-bold text-white mb-2">
                        {getGreeting()}, {session.user?.name?.split(' ')[0]}
                      </h1>
                      <p className="text-gray-400">
                        Ready to maximize your productivity today?
                      </p>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center gap-3">
                      <button
                        onClick={fetchTasksFromCalendar}
                        className="bg-gray-700/50 p-2 rounded-lg border border-purple-500/20 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                        title="Refresh dashboard data"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <svg className="animate-spin h-5 w-5 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        )}
                      </button>
                      <div className="bg-gray-700/50 py-2 px-4 rounded-lg border border-purple-500/20">
                        <div className="flex items-center">
                          <div className="mr-3 bg-purple-500/20 rounded-full p-2">
                            <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-xs text-gray-400">Productivity Score</div>
                            <div className="text-xl font-bold text-white">{productivityScore}%</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Productivity stats & gamification */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Productivity level card */}
                  <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 hover:border-purple-500/30 transition-all duration-300">
                    <div className="p-5">
                      <h2 className="text-lg font-medium text-white mb-4">Your Productivity Level</h2>
                      <div className="flex items-center mb-4">
                        <div className="relative h-16 w-16 mr-4">
                          <div className="absolute inset-0 rounded-full bg-purple-500/20 flex items-center justify-center">
                            <span className="text-2xl font-bold text-purple-400">{productivityLevel}</span>
                          </div>
                          <svg className="absolute inset-0 w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
                            <circle
                              className="text-gray-700"
                              stroke="currentColor"
                              strokeWidth="8"
                              fill="transparent"
                              r="45" cx="50" cy="50"
                            />
                            <circle
                              className="text-purple-500"
                              stroke="currentColor"
                              strokeWidth="8"
                              fill="transparent"
                              r="45" cx="50" cy="50"
                              strokeDasharray="283"
                              strokeDashoffset={283 - (levelProgress / 100) * 283}
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-white font-semibold mb-1">Productivity Master</h3>
                          <div className="text-gray-400 text-sm">{levelProgress}% to Level {productivityLevel + 1}</div>
                          <div className="mt-1 w-40 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-600 rounded-full" style={{ width: `${levelProgress}%` }}></div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-3 text-sm text-gray-400">Recent achievements:</div>
                      <div className="space-y-2">
                        {achievements
                          .filter(a => a.completed)
                          .slice(0, 2)
                          .map((achievement) => (
                            <div key={achievement.id} className="flex items-center bg-gray-700/50 p-2 rounded-lg">
                              <div className="mr-3 text-xl">{achievement.icon}</div>
                              <div>
                                <div className="text-white text-sm font-medium">{achievement.title}</div>
                                <div className="text-gray-400 text-xs">{achievement.description}</div>
                              </div>
                            </div>
                          ))}
                        {achievements.filter(a => a.completed).length > 2 && (
                          <button
                            onClick={() => alert('View all achievements clicked')}
                            className="w-full text-center text-sm text-purple-400 hover:text-purple-300 py-1"
                          >
                            View all {achievements.filter(a => a.completed).length} achievements
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Focus & Time stats */}
                  <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 hover:border-purple-500/30 transition-all duration-300">
                    <div className="p-5">
                      <h2 className="text-lg font-medium text-white mb-4">Productivity Stats</h2>

                      <div className="space-y-5">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">Weekly Productive Hours</span>
                            <span className="text-gray-300">{weeklyHours} hrs / {weeklyGoal} hrs</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2.5">
                            <div
                              className="bg-green-600 h-2.5 rounded-full"
                              style={{ width: `${(weeklyHours / weeklyGoal) * 100}%` }}
                            ></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">Focus Score</span>
                            <span className="text-gray-300">{focusScore}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2.5">
                            <div
                              className="bg-blue-600 h-2.5 rounded-full"
                              style={{ width: `${focusScore}%` }}
                            ></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">Task Completion Rate</span>
                            <span className="text-gray-300">{completionRate}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2.5">
                            <div
                              className="bg-purple-600 h-2.5 rounded-full"
                              style={{ width: `${completionRate}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3 pt-2">
                          <div className="bg-gray-700/50 p-3 rounded-lg border border-gray-600/50 text-center">
                            <div className="text-xl font-bold text-white">{streak}</div>
                            <div className="text-xs text-gray-400">Day Streak</div>
                          </div>
                          <div className="bg-gray-700/50 p-3 rounded-lg border border-gray-600/50 text-center">
                            <div className="text-xl font-bold text-white">{tasksCompleted}</div>
                            <div className="text-xs text-gray-400">Tasks Complete</div>
                          </div>
                          <div className="bg-gray-700/50 p-3 rounded-lg border border-gray-600/50 text-center">
                            <div className="text-xl font-bold text-white">{achievements.filter(a => a.completed).length}</div>
                            <div className="text-xs text-gray-400">Achievements</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Task overview & Activity */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Recent activity card */}
                  <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 hover:border-purple-500/30 transition-all duration-300">
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-medium text-white">Recent Activity</h2>
                        <span className="text-xs text-purple-400 bg-purple-400/10 px-2 py-1 rounded-full">
                          {recentActivities.length} items
                        </span>
                      </div>
                      <div className="space-y-3">
                        {recentActivities.map((activity) => (
                          <div key={activity.id} className="flex items-start space-x-3">
                            <div className="flex-shrink-0 mt-1">{activity.icon}</div>
                            <div>
                              <p className="text-sm text-gray-300">{activity.text}</p>
                              <span className="text-xs text-gray-500">{activity.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Upcoming tasks card */}
                  <div className="md:col-span-2 bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 hover:border-purple-500/30 transition-all duration-300">
                    <div className="p-5">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-medium text-white">Upcoming Tasks</h2>
                        <button
                          onClick={() => setActiveTab('Tasks')}
                          className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                        >
                          View All
                        </button>
                      </div>
                      <div>
                        <div className="mb-3">
                          <h3 className="text-sm font-medium text-gray-400 mb-2">Today</h3>
                          <div className="space-y-2">
                            {upcomingTasks.today.map((task) => (
                              <div key={task.id} className="flex items-center bg-gray-700/50 p-2 rounded-lg">
                                <input
                                  type="checkbox"
                                  checked={task.completed}
                                  onChange={() => handleTaskCompletion(task.id, true)}
                                  className="h-4 w-4 rounded border-gray-600 text-purple-600 focus:ring-purple-500 bg-gray-700 mr-3 cursor-pointer"
                                />
                                <div className="flex-1">
                                  <span className={`text-sm ${task.completed ? 'text-gray-500 line-through' : 'text-gray-300'}`}>
                                    {task.title}
                                  </span>
                                </div>
                                <div className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                  {task.duration}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-400 mb-2">Tomorrow</h3>
                          <div className="space-y-2">
                            {upcomingTasks.tomorrow.map((task) => (
                              <div key={task.id} className="flex items-center bg-gray-700/50 p-2 rounded-lg">
                                <input
                                  type="checkbox"
                                  checked={task.completed}
                                  onChange={() => handleTaskCompletion(task.id, false)}
                                  className="h-4 w-4 rounded border-gray-600 text-purple-600 focus:ring-purple-500 bg-gray-700 mr-3 cursor-pointer"
                                  disabled={true} // Tomorrow's tasks can't be completed yet
                                />
                                <div className="flex-1">
                                  <span className="text-sm text-gray-300">{task.title}</span>
                                </div>
                                <div className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                                  {task.duration}
                                </div>
                              </div>
                            ))}
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
