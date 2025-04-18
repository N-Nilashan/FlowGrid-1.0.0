'use client'
import { useState, useEffect } from 'react';

const TaskView = () => {
  const [tasks, setTasks] = useState({ studies: [], work: [], health: [], personal: [], uncategorized: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('today'); // 'today' or 'weekly'
  const [completedTasks, setCompletedTasks] = useState(new Set());
  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all', 'studies', 'work', 'health', 'personal', 'uncategorized'
  const [recategorizeTask, setRecategorizeTask] = useState(null); // Store task being recategorized
  const [lastFetchTime, setLastFetchTime] = useState(null);

  // Gamification state
  const [streak, setStreak] = useState(0);
  const [lastCompletedDate, setLastCompletedDate] = useState(null);
  const [experience, setExperience] = useState(0);
  const [level, setLevel] = useState(1);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [achievements, setAchievements] = useState([
    { id: 'first_task', title: 'First Steps', description: 'Complete your first task', completed: false, icon: '🎯' },
    { id: 'five_tasks', title: 'Getting Things Done', description: 'Complete 5 tasks', completed: false, icon: '🏆' },
    { id: 'category_master', title: 'Category Master', description: 'Complete tasks in all categories', completed: false, icon: '🌈' },
    { id: 'streak_3', title: 'On a Roll', description: 'Maintain a 3-day streak', completed: false, icon: '🔥' },
    { id: 'perfect_day', title: 'Perfect Day', description: 'Complete all tasks for a day', completed: false, icon: '⭐' },
  ]);
  const [showAchievement, setShowAchievement] = useState(null);

  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState('');

  const fetchTasks = async () => {
    try {
      const response = await fetch(`/api/tasks/process?view=${viewMode}`);
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await response.json();
      setTasks(data);

      // Set initial completed tasks
      const completed = new Set();
      [...data.studies, ...data.work, ...data.health, ...data.personal, ...data.uncategorized].forEach(task => {
        if (task.completed) {
          completed.add(task.id);
        }
      });
      setCompletedTasks(completed);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGamificationData = async () => {
    try {
      const response = await fetch('/api/gamification');
      const data = await response.json();

      if (!response.ok) {
        // If we get a specific error about multiple rows, try cleaning up
        if (data.error && data.error.includes('multiple')) {
          console.log('Detected multiple rows, attempting cleanup...');
          const cleanupResponse = await fetch('/api/gamification/cleanup');
          if (!cleanupResponse.ok) {
            throw new Error('Cleanup failed');
          }
          // Retry the original fetch after cleanup
          const retryResponse = await fetch('/api/gamification');
          const retryData = await retryResponse.json();
          if (!retryResponse.ok) {
            throw new Error(retryData.error || 'Failed to fetch after cleanup');
          }
          // Use the retry data
          setStreak(retryData.streak || 0);
          setLastCompletedDate(retryData.lastCompletedDate || null);
          setExperience(retryData.experience || 0);
          setLevel(retryData.level || 1);
          setAchievements(retryData.achievements || achievements);
          return;
        }
        throw new Error(data.error || 'Failed to fetch gamification data');
      }

      setStreak(data.streak || 0);
      setLastCompletedDate(data.lastCompletedDate || null);
      setExperience(data.experience || 0);
      setLevel(data.level || 1);
      setAchievements(data.achievements || achievements);
    } catch (error) {
      console.error('Error loading gamification data:', error);
    }
  };

  const updateGamificationData = async () => {
    try {
      const gameData = {
        streak,
        lastCompletedDate: lastCompletedDate ? new Date(lastCompletedDate).toISOString() : null,
        experience,
        level,
        achievements: achievements.map(a => ({
          ...a,
          completed: a.completed || false
        }))
      };

      console.log('Sending update with data:', gameData);

      const response = await fetch('/api/gamification/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update gamification data');
      }

      console.log('Gamification update successful');
    } catch (error) {
      console.error('Error updating gamification data:', error);
    }
  };

  // Debounce the update to avoid too many requests
  useEffect(() => {
    const timer = setTimeout(() => {
      updateGamificationData();
    }, 1000); // Wait 1 second after the last change

    return () => clearTimeout(timer);
  }, [streak, lastCompletedDate, experience, level, achievements]);

  // Calculate level based on experience
  useEffect(() => {
    const newLevel = Math.floor(experience / 100) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 3000);
    }
  }, [experience, level]);

  // Check daily streak
  useEffect(() => {
    const today = new Date().toLocaleDateString();

    if (lastCompletedDate) {
      const lastDate = new Date(lastCompletedDate);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      // If last completed date was yesterday, increment streak when completing a task today
      if (yesterday.toLocaleDateString() === lastDate.toLocaleDateString()) {
        // Streak will be incremented when a task is completed
      }
      // If last completed date was before yesterday, reset streak
      else if (lastDate < yesterday) {
        setStreak(0);
      }
    }
  }, [lastCompletedDate]);

  // Award experience and check achievements
  const awardExperienceAndCheckAchievements = (isTaskCompleted) => {
    if (isTaskCompleted) {
      // Award experience for task completion
      const xpGained = 10;
      setExperience(prev => prev + xpGained);

      // Update daily streak
      const today = new Date().toLocaleDateString();
      if (!lastCompletedDate || new Date(lastCompletedDate).toLocaleDateString() !== today) {
        setLastCompletedDate(today);
        setStreak(prev => prev + 1);
      }

      // Check for achievements
      const completedCount = completedTasks.size + 1; // +1 for the task just completed
      const newAchievements = [...achievements];
      let achievementUnlocked = false;

      // First task achievement
      if (!newAchievements[0].completed && completedCount >= 1) {
        newAchievements[0].completed = true;
        achievementUnlocked = newAchievements[0];
      }

      // Five tasks achievement
      if (!newAchievements[1].completed && completedCount >= 5) {
        newAchievements[1].completed = true;
        achievementUnlocked = newAchievements[1];
      }

      // 3-day streak achievement
      if (!newAchievements[3].completed && streak >= 3) {
        newAchievements[3].completed = true;
        achievementUnlocked = newAchievements[3];
      }

      // Check if all categories have at least one completed task
      const categoriesWithCompletedTasks = new Set();
      for (const category of Object.keys(tasks)) {
        for (const task of tasks[category]) {
          if (completedTasks.has(task.id)) {
            categoriesWithCompletedTasks.add(category);
            break;
          }
        }
      }

      // Category master achievement
      if (!newAchievements[2].completed && categoriesWithCompletedTasks.size >= 4) { // At least 4 categories
        newAchievements[2].completed = true;
        achievementUnlocked = newAchievements[2];
      }

      // Perfect day achievement
      if (!newAchievements[4].completed) {
        const todayTasks = [
          ...filterTasksByDate(tasks.studies, 'today'),
          ...filterTasksByDate(tasks.work, 'today'),
          ...filterTasksByDate(tasks.health, 'today'),
          ...filterTasksByDate(tasks.personal, 'today'),
          ...filterTasksByDate(tasks.uncategorized, 'today'),
        ];

        if (todayTasks.length > 0 && todayTasks.every(task => completedTasks.has(task.id) || task.id === isTaskCompleted)) {
          newAchievements[4].completed = true;
          achievementUnlocked = newAchievements[4];
        }
      }

      if (achievementUnlocked) {
        setShowAchievement(achievementUnlocked);
        setTimeout(() => setShowAchievement(null), 3000);
        // Award extra XP for achievement
        setExperience(prev => prev + 25);
      }

      setAchievements(newAchievements);
    }
  };

  // Handle task completion with gamification
  const handleTaskCompletion = async (taskId) => {
    try {
      const newCompleted = !completedTasks.has(taskId);

      // Optimistically update UI
      setCompletedTasks(prev => {
        const newSet = new Set(prev);
        if (newCompleted) {
          newSet.add(taskId);
          // Award experience and check achievements
          awardExperienceAndCheckAchievements(taskId);
        } else {
          newSet.delete(taskId);
        }
        return newSet;
      });

      // Update through API
      const response = await fetch('/api/tasks/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskId,
          completed: newCompleted
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      // Update the tasks state locally instead of fetching again
      setTasks(prevTasks => ({
        studies: prevTasks.studies.map(task =>
          task.id === taskId ? { ...task, completed: newCompleted } : task
        ),
        work: prevTasks.work.map(task =>
          task.id === taskId ? { ...task, completed: newCompleted } : task
        ),
        health: prevTasks.health.map(task =>
          task.id === taskId ? { ...task, completed: newCompleted } : task
        ),
        personal: prevTasks.personal.map(task =>
          task.id === taskId ? { ...task, completed: newCompleted } : task
        ),
        uncategorized: prevTasks.uncategorized.map(task =>
          task.id === taskId ? { ...task, completed: newCompleted } : task
        ),
      }));

    } catch (err) {
      console.error('Error updating task completion:', err);
      // Revert optimistic update on error
      setCompletedTasks(prev => {
        const newSet = new Set(prev);
        if (completedTasks.has(taskId)) {
          newSet.add(taskId);
        } else {
          newSet.delete(taskId);
        }
        return newSet;
      });
    }
  };

  const filterTasksByDate = (tasks, mode) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endOfToday = new Date(today);
    endOfToday.setHours(23, 59, 59, 999);

    const sevenDaysFromNow = new Date(today);
    sevenDaysFromNow.setDate(today.getDate() + 7);
    sevenDaysFromNow.setHours(23, 59, 59, 999);

    return tasks.filter(task => {
      const taskDate = new Date(task.start);

      if (mode === 'today') {
        return taskDate >= today && taskDate <= endOfToday;
      } else { // weekly
        return taskDate >= today && taskDate <= sevenDaysFromNow;
      }
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryStyle = (category) => {
    switch (category) {
      case 'studies':
        return {
          icon: (
            <svg className="w-4 h-4 text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          ),
          color: 'bg-blue-500/10 border-blue-500/20',
          textColor: 'text-blue-400'
        };
      case 'work':
        return {
          icon: (
            <svg className="w-4 h-4 text-amber-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          ),
          color: 'bg-amber-500/10 border-amber-500/20',
          textColor: 'text-amber-400'
        };
      case 'health':
        return {
          icon: (
            <svg className="w-4 h-4 text-green-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          ),
          color: 'bg-green-500/10 border-green-500/20',
          textColor: 'text-green-400'
        };
      case 'personal':
        return {
          icon: (
            <svg className="w-4 h-4 text-purple-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          ),
          color: 'bg-purple-500/10 border-purple-500/20',
          textColor: 'text-purple-400'
        };
      case 'uncategorized':
        return {
          icon: (
            <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          color: 'bg-gray-500/10 border-gray-500/20',
          textColor: 'text-gray-400'
        };
      default:
        return {
          icon: null,
          color: 'bg-gray-500/10 border-gray-500/20',
          textColor: 'text-gray-400'
        };
    }
  };

  const PriorityLegend = () => (
    <div className="bg-gray-800 p-4 rounded-lg border border-purple-500/20 mb-6">
      <h3 className="text-sm font-medium text-gray-400 mb-3">Priority Levels</h3>
      <div className="flex items-center space-x-6">
        {[
          { level: 'High', color: 'bg-red-500' },
          { level: 'Medium', color: 'bg-yellow-500' },
          { level: 'Low', color: 'bg-green-500' },
        ].map(({ level, color }) => (
          <div key={level} className="flex items-center space-x-2">
            <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
            <span className="text-sm text-gray-300">{level}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const TaskItem = ({ task, category }) => {
    const { icon, color, textColor } = getCategoryStyle(category);

    // Calculate task duration
    const startTime = new Date(task.start);
    const endTime = new Date(task.end);
    const durationMs = endTime - startTime;
    const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
    const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    const durationText = durationHours > 0
      ? `${durationHours}h ${durationMinutes}m`
      : `${durationMinutes}m`;

    // Determine duration badge color based on length
    const getDurationColor = () => {
      if (durationHours >= 2) return 'bg-red-500/20 text-red-400 border-red-500/30'; // Long meeting
      if (durationHours >= 1) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'; // Medium meeting
      if (durationMinutes >= 30) return 'bg-green-500/20 text-green-400 border-green-500/30'; // Short meeting
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30'; // Quick meeting
    };

    return (
      <div className={`flex items-start sm:items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-800 rounded-lg mb-3 border border-purple-500/10 hover:border-purple-500/30 transition-all duration-500 ease-in-out cursor-pointer transform ${completedTasks.has(task.id)
        ? 'opacity-75 scale-98 translate-y-2'
        : 'opacity-100 scale-100 translate-y-0'
        }`}>
        <input
          type="checkbox"
          checked={completedTasks.has(task.id)}
          onChange={() => handleTaskCompletion(task.id)}
          className="mt-1 sm:mt-0 w-4 h-4 sm:w-5 sm:h-5 rounded border-gray-600 text-purple-600 focus:ring-purple-500 bg-gray-700 cursor-pointer transition-all duration-300"
        />
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h3 className={`text-sm sm:text-base font-medium break-words transition-all duration-500 ease-in-out transform ${completedTasks.has(task.id)
              ? 'text-gray-500 line-through translate-x-2'
              : 'text-white translate-x-0'
              }`}>
              {task.title}
            </h3>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDurationColor()}`}>
                {durationText}
              </span>
              <div className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${getPriorityColor(task.priority)} ${completedTasks.has(task.id) ? 'opacity-50 scale-90' : 'opacity-100 scale-100'
                }`} />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
            <p className={`text-xs sm:text-sm transition-all duration-500 ease-in-out ${completedTasks.has(task.id) ? 'text-gray-500' : 'text-gray-400'}`}>
              {new Date(task.start).toLocaleString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </p>
            <div className={`flex items-center gap-1 text-xs sm:text-sm ${completedTasks.has(task.id) ? 'text-gray-500' : 'text-gray-400'}`}>
              <span>{new Date(task.start).toLocaleString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
              <span>-</span>
              <span>{new Date(task.end).toLocaleString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
            </div>
          </div>
        </div>

        {category === 'uncategorized' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setRecategorizeTask(task);
            }}
            className="p-1.5 rounded-full bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors"
            title="Categorize this task"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </button>
        )}
      </div>
    );
  };

  const TaskGroup = ({ title, tasks }) => {
    const filteredTasks = filterTasksByDate(tasks, viewMode);
    const category = title.toLowerCase();
    const { icon, color, textColor } = getCategoryStyle(category);

    // Sort tasks: incomplete first (sorted by priority), then completed
    const sortedTasks = [...filteredTasks].sort((a, b) => {
      const aCompleted = completedTasks.has(a.id);
      const bCompleted = completedTasks.has(b.id);

      if (aCompleted && !bCompleted) return 1;
      if (!aCompleted && bCompleted) return -1;

      // If both are completed or both are incomplete, sort by priority
      if (!aCompleted && !bCompleted) {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }

      return 0;
    });

    return (
      <div className="mb-8">
        <div className={`flex items-center mb-4 ${color} p-2 rounded-lg`}>
          {icon}
          <h2 className={`text-xl font-bold ${textColor}`}>{title}</h2>
          <span className="text-sm text-gray-400 ml-auto">{filteredTasks.length} tasks</span>
        </div>
        <div>
          {sortedTasks.length > 0 ? (
            sortedTasks.map(task => <TaskItem key={task.id} task={task} category={category} />)
          ) : (
            <p className="text-gray-500 text-center py-4">No tasks for this period</p>
          )}
        </div>
      </div>
    );
  };

  const LoadingAnimation = ({ stage }) => (
    <div className="p-6 bg-gray-900 rounded-xl shadow-2xl flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center space-y-6 max-w-md text-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            {stage === 'calendar' ? (
              <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            ) : (
              <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            )}
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">
            {stage === 'calendar' ? 'Fetching Calendar Events' : 'Processing with AI'}
          </h3>
          <p className="text-gray-400">
            {stage === 'calendar'
              ? 'Retrieving your upcoming events from Google Calendar...'
              : 'Using AI to analyze and categorize your events into tasks...'}
          </p>
        </div>
      </div>
    </div>
  );

  // Add this new function to handle filtered categories
  const getFilteredCategories = () => {
    if (categoryFilter === 'all') {
      return ['studies', 'work', 'health', 'personal', 'uncategorized'];
    }
    return [categoryFilter];
  };

  // Add this new component for the category filter
  const CategoryFilter = () => {
    const categories = [
      { id: 'all', name: 'All Categories' },
      { id: 'studies', name: 'Studies' },
      { id: 'work', name: 'Work' },
      { id: 'health', name: 'Health' },
      { id: 'personal', name: 'Personal' },
      { id: 'uncategorized', name: 'Uncategorized' }
    ];

    return (
      <div className="bg-gray-800 p-4 rounded-lg border border-purple-500/20 mb-6">
        <h3 className="text-sm font-medium text-gray-400 mb-3">Filter by Category</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => {
            const { color, textColor } = getCategoryStyle(category.id === 'all' ? 'personal' : category.id);
            return (
              <button
                key={category.id}
                onClick={() => setCategoryFilter(category.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${categoryFilter === category.id
                  ? `${color} ${textColor} border border-${textColor}`
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
              >
                {category.name}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // Add recategorize modal component
  const RecategorizeModal = () => {
    if (!recategorizeTask) return null;

    const categories = [
      { id: 'studies', name: 'Studies' },
      { id: 'work', name: 'Work' },
      { id: 'health', name: 'Health' },
      { id: 'personal', name: 'Personal' }
    ];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-lg p-6 shadow-xl max-w-md w-full border border-purple-500/20">
          <h3 className="text-xl font-bold text-white mb-4">Categorize Task</h3>
          <p className="text-gray-300 mb-6">{recategorizeTask.title}</p>

          <div className="space-y-3 mb-6">
            {categories.map(category => {
              const { icon, color, textColor } = getCategoryStyle(category.id);
              return (
                <button
                  key={category.id}
                  onClick={() => handleRecategorize(recategorizeTask.id, category.id)}
                  className={`flex items-center w-full p-3 rounded-lg ${color} ${textColor} hover:opacity-90 transition-opacity`}
                >
                  {icon}
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setRecategorizeTask(null)}
              className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Add this function to recategorize a task
  const handleRecategorize = async (taskId, newCategory) => {
    try {
      // Close the recategorize dialog
      setRecategorizeTask(null);

      // Optimistically update the UI
      setTasks(prevTasks => {
        const allCategories = ['studies', 'work', 'health', 'personal', 'uncategorized'];
        const updatedTasks = { ...prevTasks };

        // Find the task in all categories
        let taskToMove = null;
        let sourceCategory = null;

        for (const category of allCategories) {
          const taskIndex = updatedTasks[category].findIndex(t => t.id === taskId);
          if (taskIndex >= 0) {
            taskToMove = { ...updatedTasks[category][taskIndex], category: newCategory };
            sourceCategory = category;
            // Remove from source category
            updatedTasks[sourceCategory] = [
              ...updatedTasks[sourceCategory].slice(0, taskIndex),
              ...updatedTasks[sourceCategory].slice(taskIndex + 1)
            ];
            break;
          }
        }

        if (taskToMove && sourceCategory) {
          // Add to target category
          updatedTasks[newCategory] = [...updatedTasks[newCategory], taskToMove];
        }

        return updatedTasks;
      });

      // Update through API
      const response = await fetch('/api/tasks/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskId,
          category: newCategory
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update task category');
      }

    } catch (err) {
      console.error('Error updating task category:', err);
      // If there's an error, fetch all tasks again to reset to server state
      fetchTasks();
    }
  };

  // Gamification UI components
  const GamificationPanel = () => {
    // Calculate weekly stats when in weekly view
    const calculateWeeklyStats = () => {
      if (viewMode !== 'weekly') return null;

      const allWeeklyTasks = [
        ...filterTasksByDate(tasks.studies, 'weekly'),
        ...filterTasksByDate(tasks.work, 'weekly'),
        ...filterTasksByDate(tasks.health, 'weekly'),
        ...filterTasksByDate(tasks.personal, 'weekly'),
        ...filterTasksByDate(tasks.uncategorized, 'weekly')
      ];

      const totalTasks = allWeeklyTasks.length;
      const completedWeeklyTasks = allWeeklyTasks.filter(task => completedTasks.has(task.id)).length;
      const completionRate = totalTasks > 0 ? Math.round((completedWeeklyTasks / totalTasks) * 100) : 0;

      // Calculate total hours of work scheduled this week
      const totalHoursScheduled = allWeeklyTasks.reduce((total, task) => {
        const start = new Date(task.start);
        const end = new Date(task.end);
        const durationHours = (end - start) / (1000 * 60 * 60);
        return total + durationHours;
      }, 0).toFixed(1);

      // Calculate most productive day
      const dayProductivity = [0, 0, 0, 0, 0, 0, 0]; // Sun to Sat
      allWeeklyTasks.forEach(task => {
        if (completedTasks.has(task.id)) {
          const day = new Date(task.start).getDay();
          dayProductivity[day]++;
        }
      });

      const maxProductivity = Math.max(...dayProductivity);
      let mostProductiveDayIndex = dayProductivity.indexOf(maxProductivity);
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const mostProductiveDay = maxProductivity > 0 ? days[mostProductiveDayIndex] : 'None yet';

      return {
        totalTasks,
        completedWeeklyTasks,
        completionRate,
        totalHoursScheduled,
        mostProductiveDay
      };
    };

    const weeklyStats = calculateWeeklyStats();

    return (
      <div className="bg-gray-800 p-4 rounded-lg border border-purple-500/20 mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">
          {viewMode === 'weekly' ? 'Weekly Progress' : 'Your Progress'}
        </h3>

        {viewMode === 'weekly' ? (
          // Weekly progress view
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-700/50 p-3 rounded-lg border border-gray-600/50">
                <div className="text-xs text-gray-400 mb-1">Completion Rate</div>
                <div className="flex items-end">
                  <span className="text-xl font-bold text-white">{weeklyStats.completionRate}%</span>
                  <span className="text-xs text-gray-400 ml-2 mb-0.5">
                    ({weeklyStats.completedWeeklyTasks}/{weeklyStats.totalTasks})
                  </span>
                </div>
                <div className="mt-2 h-1.5 bg-gray-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${weeklyStats.completionRate}%` }}
                  />
                </div>
              </div>

              <div className="bg-gray-700/50 p-3 rounded-lg border border-gray-600/50">
                <div className="text-xs text-gray-400 mb-1">Scheduled Hours</div>
                <div className="text-xl font-bold text-white">{weeklyStats.totalHoursScheduled}h</div>
                <div className="text-xs text-gray-400 mt-1">This week</div>
              </div>

              <div className="bg-gray-700/50 p-3 rounded-lg border border-gray-600/50">
                <div className="text-xs text-gray-400 mb-1">Most Productive</div>
                <div className="text-xl font-bold text-white">{weeklyStats.mostProductiveDay}</div>
                <div className="text-xs text-gray-400 mt-1">Day of the week</div>
              </div>
            </div>

            <div className="bg-gray-700/50 p-3 rounded-lg border border-gray-600/50">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-400">Weekly XP Progress</span>
                <span className="text-xs text-purple-400">{experience % 100}/100</span>
              </div>
              <div className="h-1.5 bg-gray-600 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full"
                  style={{ width: `${experience % 100}%` }}
                />
              </div>
            </div>
          </div>
        ) : (
          // Daily progress view (original)
          <div>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="bg-purple-500/20 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-2">
                  <span className="text-xl font-bold text-purple-400">{level}</span>
                </div>
                <span className="text-sm text-gray-400">Level</span>
              </div>

              <div className="text-center">
                <div className="bg-amber-500/20 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-2">
                  <span className="text-xl font-bold text-amber-400">{experience % 100}/100</span>
                </div>
                <span className="text-sm text-gray-400">XP</span>
              </div>

              <div className="text-center">
                <div className="bg-red-500/20 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-2">
                  <span className="text-xl font-bold text-red-400">{streak}</span>
                </div>
                <span className="text-sm text-gray-400">Streak</span>
              </div>

              <div className="text-center">
                <div className="bg-green-500/20 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-2">
                  <span className="text-xl font-bold text-green-400">
                    {achievements.filter(a => a.completed).length}/{achievements.length}
                  </span>
                </div>
                <span className="text-sm text-gray-400">Achievements</span>
              </div>
            </div>

            {/* XP Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Level {level}</span>
                <span>Level {level + 1}</span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full"
                  style={{ width: `${experience % 100}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Achievement and level-up notifications container
  const NotificationsContainer = () => {
    return (
      <div className="fixed bottom-6 right-6 z-50 space-y-3">
        {showAchievement && (
          <div className="bg-gray-800 rounded-lg p-4 shadow-xl border border-yellow-500 animate-bounce">
            <div className="flex items-center">
              <div className="text-3xl mr-3">{showAchievement.icon}</div>
              <div>
                <h4 className="text-yellow-400 font-bold">{showAchievement.title}</h4>
                <p className="text-gray-300 text-sm">{showAchievement.description}</p>
              </div>
            </div>
          </div>
        )}

        {showLevelUp && (
          <div className="bg-gray-800 rounded-lg p-4 shadow-xl border border-purple-500">
            <div className="flex items-center">
              <div className="text-3xl mr-3">🎮</div>
              <div>
                <h4 className="text-purple-400 font-bold">Level Up!</h4>
                <p className="text-gray-300 text-sm">You reached level {level}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Initialize tasks and gamification data
  useEffect(() => {
    const initializeData = async () => {
      // Only fetch if we haven't fetched in the last 5 minutes
      const now = Date.now();
      if (!lastFetchTime || (now - lastFetchTime) > 5 * 60 * 1000) {
        setIsLoading(true);
        try {
          await Promise.all([
            fetchTasks(),
            fetchGamificationData()
          ]);
          setLastFetchTime(now);
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }
    };

    initializeData();
  }, [viewMode, lastFetchTime]); // Only re-fetch when view mode changes or when enough time has passed

  const TodaysGoals = () => {
    useEffect(() => {
      fetchTodaysGoals();
    }, []);

    const fetchTodaysGoals = async () => {
      try {
        const response = await fetch('/api/goals/today');
        const data = await response.json();
        setGoals(data);
      } catch (error) {
        console.error('Error fetching today\'s goals:', error);
      }
    };

    const addGoal = async (e) => {
      if (e.key === 'Enter' && newGoal.trim() !== '') {
        try {
          const response = await fetch('/api/goals', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ goal: newGoal }),
          });
          if (response.ok) {
            setNewGoal('');
            fetchTodaysGoals();
          }
        } catch (error) {
          console.error('Error adding goal:', error);
        }
      }
    };

    const deleteGoal = async (goalId) => {
      try {
        await fetch(`/api/goals/${goalId}`, { method: 'DELETE' });
        fetchTodaysGoals();
      } catch (error) {
        console.error('Error deleting goal:', error);
      }
    };

    return (
      <div className="bg-gray-800 p-4 rounded-lg border border-purple-500/20 mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">Today's Goals</h3>

        <ul className="space-y-2 mb-4">
          {goals.map((goal) => (
            <li key={goal.id} className="flex items-center justify-between bg-gray-700 p-2 rounded">
              <span className="text-gray-300">{goal.goal}</span>
              <button
                onClick={() => deleteGoal(goal.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </li>
          ))}
        </ul>

        {goals.length < 5 && (
          <input
            type="text"
            placeholder="Add a goal..."
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            onKeyDown={addGoal}
            className="w-full bg-gray-700 text-gray-300 rounded p-2"
          />
        )}
      </div>
    );
  };

  if (isLoading) {
    return <LoadingAnimation stage="calendar" />;
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-900 rounded-xl shadow-2xl">
        <div className="text-center text-red-400">
          <p>Error loading tasks: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 bg-gray-900 rounded-xl shadow-2xl min-h-screen sm:min-h-0">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">Task List</h1>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-sm sm:text-base text-gray-400">Your calendar events, intelligently categorized</p>
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('today')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm transition-all duration-200 ${viewMode === 'today'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
            >
              Today
            </button>
            <button
              onClick={() => setViewMode('weekly')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm transition-all duration-200 ${viewMode === 'weekly'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
            >
              Weekly
            </button>
          </div>
        </div>
      </div>

      {/* Gamification Panel */}
      <GamificationPanel />

      {/* Today's Goals */}
      <TodaysGoals />

      {/* Priority Legend */}
      <PriorityLegend />

      {/* Category Filter */}
      <CategoryFilter />

      {/* Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 mb-6 sm:mb-8">
        {[
          { title: 'Total Tasks', data: filterTasksByDate([...tasks.studies, ...tasks.work, ...tasks.health, ...tasks.personal, ...tasks.uncategorized], viewMode).length },
          { title: 'Study Tasks', data: filterTasksByDate(tasks.studies, viewMode).length },
          { title: 'Work Tasks', data: filterTasksByDate(tasks.work, viewMode).length },
          { title: 'Health Tasks', data: filterTasksByDate(tasks.health, viewMode).length },
          { title: 'Personal', data: filterTasksByDate(tasks.personal, viewMode).length },
          { title: 'Other', data: filterTasksByDate(tasks.uncategorized, viewMode).length }
        ].map(({ title, data }) => (
          <div key={title} className="bg-gray-800 p-3 sm:p-4 rounded-lg border border-purple-500/20">
            <h3 className="text-xs sm:text-sm text-gray-400 mb-1">{title}</h3>
            <p className="text-lg sm:text-2xl font-bold text-white">{data}</p>
          </div>
        ))}
      </div>

      {/* Task Groups */}
      <div className="space-y-6 sm:space-y-8">
        {getFilteredCategories().map(category => {
          const title = category.charAt(0).toUpperCase() + category.slice(1);
          return <TaskGroup key={category} title={title} tasks={tasks[category]} />;
        })}
      </div>

      {/* Recategorize Modal */}
      {recategorizeTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-4 sm:p-6 shadow-xl max-w-md w-full border border-purple-500/20">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Categorize Task</h3>
            <p className="text-sm sm:text-base text-gray-300 mb-6">{recategorizeTask.title}</p>

            <div className="space-y-3 mb-6">
              {['studies', 'work', 'health', 'personal'].map(category => {
                const { icon, color, textColor } = getCategoryStyle(category);
                return (
                  <button
                    key={category}
                    onClick={() => handleRecategorize(recategorizeTask.id, category)}
                    className={`flex items-center w-full p-3 rounded-lg ${color} ${textColor} hover:opacity-90 transition-opacity`}
                  >
                    {icon}
                    <span className="capitalize">{category}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setRecategorizeTask(null)}
                className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors text-sm sm:text-base"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications */}
      <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 space-y-3">
        {showAchievement && (
          <div className="bg-gray-800 rounded-lg p-3 sm:p-4 shadow-xl border border-yellow-500 animate-bounce max-w-[90vw] sm:max-w-md">
            <div className="flex items-center">
              <div className="text-2xl sm:text-3xl mr-3">{showAchievement.icon}</div>
              <div>
                <h4 className="text-yellow-400 font-bold text-sm sm:text-base">{showAchievement.title}</h4>
                <p className="text-gray-300 text-xs sm:text-sm">{showAchievement.description}</p>
              </div>
            </div>
          </div>
        )}

        {showLevelUp && (
          <div className="bg-gray-800 rounded-lg p-3 sm:p-4 shadow-xl border border-purple-500 max-w-[90vw] sm:max-w-md">
            <div className="flex items-center">
              <div className="text-2xl sm:text-3xl mr-3">🎮</div>
              <div>
                <h4 className="text-purple-400 font-bold text-sm sm:text-base">Level Up!</h4>
                <p className="text-gray-300 text-xs sm:text-sm">You reached level {level}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskView;
