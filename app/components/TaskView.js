'use client'
import { useState, useEffect } from 'react';

const TaskView = () => {
  const [tasks, setTasks] = useState({ studies: [], personal: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('today'); // 'today' or 'weekly'
  const [completedTasks, setCompletedTasks] = useState(new Set());

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
      [...data.studies, ...data.personal].forEach(task => {
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

  useEffect(() => {
    fetchTasks();
  }, [viewMode]);

  const handleTaskCompletion = async (taskId) => {
    try {
      const newCompleted = !completedTasks.has(taskId);

      // Optimistically update UI
      setCompletedTasks(prev => {
        const newSet = new Set(prev);
        if (newCompleted) {
          newSet.add(taskId);
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
        personal: prevTasks.personal.map(task =>
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

  const TaskItem = ({ task }) => (
    <div
      className={`flex items-center space-x-4 p-4 bg-gray-800 rounded-lg mb-3 border border-purple-500/10 hover:border-purple-500/30 transition-all duration-500 ease-in-out cursor-pointer transform ${completedTasks.has(task.id)
        ? 'opacity-75 scale-98 translate-y-2'
        : 'opacity-100 scale-100 translate-y-0'
        }`}
    >
      <input
        type="checkbox"
        checked={completedTasks.has(task.id)}
        onChange={() => handleTaskCompletion(task.id)}
        className="w-5 h-5 rounded border-gray-600 text-purple-600 focus:ring-purple-500 bg-gray-700 cursor-pointer transition-all duration-300"
      />
      <div className="flex-1 transition-all duration-500 ease-in-out">
        <h3 className={`text-base font-medium transition-all duration-500 ease-in-out transform ${completedTasks.has(task.id)
          ? 'text-gray-500 line-through translate-x-2'
          : 'text-white translate-x-0'
          }`}>
          {task.title}
        </h3>
        <p className={`text-sm transition-all duration-500 ease-in-out ${completedTasks.has(task.id) ? 'text-gray-500' : 'text-gray-400'
          }`}>
          {new Date(task.start).toLocaleString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
          })}
        </p>
      </div>
      <div className={`w-3 h-3 rounded-full transition-all duration-500 ${getPriorityColor(task.priority)} ${completedTasks.has(task.id) ? 'opacity-50 scale-90' : 'opacity-100 scale-100'
        }`} />
    </div>
  );

  const TaskGroup = ({ title, tasks }) => {
    const filteredTasks = filterTasksByDate(tasks, viewMode);

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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <span className="text-sm text-gray-400">{filteredTasks.length} tasks</span>
        </div>
        <div>
          {sortedTasks.length > 0 ? (
            sortedTasks.map(task => <TaskItem key={task.id} task={task} />)
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
    <div className="p-6 bg-gray-900 rounded-xl shadow-2xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Task List</h1>
        <div className="flex items-center justify-between">
          <p className="text-gray-400">Your calendar events, intelligently categorized</p>
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('today')}
              className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 ${viewMode === 'today'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
            >
              Today
            </button>
            <button
              onClick={() => setViewMode('weekly')}
              className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 ${viewMode === 'weekly'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
            >
              Weekly
            </button>
          </div>
        </div>
      </div>

      {/* Priority Legend */}
      <PriorityLegend />

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-800 p-4 rounded-lg border border-purple-500/20">
          <h3 className="text-gray-400 text-sm mb-1">Total Tasks</h3>
          <p className="text-2xl font-bold text-white">
            {filterTasksByDate([...tasks.studies, ...tasks.personal], viewMode).length}
          </p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg border border-purple-500/20">
          <h3 className="text-gray-400 text-sm mb-1">Study Tasks</h3>
          <p className="text-2xl font-bold text-white">
            {filterTasksByDate(tasks.studies, viewMode).length}
          </p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg border border-purple-500/20">
          <h3 className="text-gray-400 text-sm mb-1">Personal Tasks</h3>
          <p className="text-2xl font-bold text-white">
            {filterTasksByDate(tasks.personal, viewMode).length}
          </p>
        </div>
      </div>

      {/* Task Groups */}
      <div>
        <TaskGroup title="Studies" tasks={tasks.studies} />
        <TaskGroup title="Personal" tasks={tasks.personal} />
      </div>
    </div>
  );
};

export default TaskView;
