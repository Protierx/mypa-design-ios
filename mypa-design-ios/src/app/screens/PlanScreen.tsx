import { useState, useRef, useEffect } from "react";
import { Plus, Clock, ChevronRight, Calendar as CalendarIcon, Sparkles, Play, Pause, Square, Trash2, Check, Mic, MicOff, ChevronDown, RotateCcw, ArrowRight, Zap, Target } from "lucide-react";
import { IOSStatusBar } from "../components/IOSStatusBar";
import { Calendar } from "../components/ui/calendar";

interface PlanScreenProps {
  onNavigate?: (screen: string) => void;
}

interface Task {
  id: number;
  date: string;
  time: string;
  duration: string;
  durationMin: number;
  title: string;
  category: string;
  priority: 'High' | 'Normal' | 'Low';
  completed: boolean;
  isFixed: boolean;
}

interface FocusSession {
  id: number;
  taskId: number;
  taskTitle: string;
  category: string;
  date: string;
  startTime: string;
  elapsedSeconds: number;
  targetSeconds: number;
  percentComplete: number;
  wasCompleted: boolean;
  wasAbandoned: boolean;
}

interface FocusStats {
  totalSessions: number;
  completedSessions: number;
  abandonedSessions: number;
  totalFocusMinutes: number;
  currentStreak: number;
  bestStreak: number;
  averageCompletion: number;
  lastSessionDate: string | null;
}

// Helper to get focus sessions from localStorage
const getStoredSessions = (): FocusSession[] => {
  try {
    const stored = localStorage.getItem('focusSessions');
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error('Error reading stored sessions', e);
  }
  return [];
};

// Helper to save sessions to localStorage
const saveSessionsToStorage = (sessions: FocusSession[]) => {
  try {
    localStorage.setItem('focusSessions', JSON.stringify(sessions));
  } catch (e) {
    console.error('Error saving sessions', e);
  }
};

// Helper to get focus stats from localStorage
const getStoredStats = (): FocusStats => {
  try {
    const stored = localStorage.getItem('focusStats');
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error('Error reading stored stats', e);
  }
  return {
    totalSessions: 0,
    completedSessions: 0,
    abandonedSessions: 0,
    totalFocusMinutes: 0,
    currentStreak: 0,
    bestStreak: 0,
    averageCompletion: 0,
    lastSessionDate: null,
  };
};

// Helper to save stats to localStorage
const saveStatsToStorage = (stats: FocusStats) => {
  try {
    localStorage.setItem('focusStats', JSON.stringify(stats));
  } catch (e) {
    console.error('Error saving stats', e);
  }
};

// Helper to get tasks from localStorage
const getStoredTasks = (): Task[] | null => {
  try {
    const stored = localStorage.getItem('planTasks');
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error('Error reading stored tasks', e);
  }
  return null;
};

// Helper to save tasks to localStorage
const saveTasksToStorage = (tasks: Task[]) => {
  try {
    localStorage.setItem('planTasks', JSON.stringify(tasks));
  } catch (e) {
    console.error('Error saving tasks', e);
  }
};

export function PlanScreen({ onNavigate }: PlanScreenProps) {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const storedTasks = getStoredTasks();
    if (storedTasks && storedTasks.length > 0) return storedTasks;
    
    return [
      { id: 1, date: todayStr, time: '9:00 AM', duration: '30m', durationMin: 30, title: 'Morning planning', category: 'Personal', priority: 'Normal', completed: true, isFixed: false },
      { id: 2, date: todayStr, time: '10:00 AM', duration: '1h', durationMin: 60, title: 'Review Q1 metrics', category: 'Work', priority: 'High', completed: false, isFixed: false },
      { id: 3, date: todayStr, time: '2:00 PM', duration: '45m', durationMin: 45, title: 'Gym session', category: 'Health', priority: 'Normal', completed: false, isFixed: true },
    ];
  });

  // UI State
  const [isAdding, setIsAdding] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // Swipe state
  const [swipeStates, setSwipeStates] = useState<Record<number, number>>({});
  const touchStartX = useRef<Record<number, number>>({});
  const touchStartY = useRef<Record<number, number>>({});
  
  // Timer state
  const [activeTimerId, setActiveTimerId] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Focus session tracking
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>(getStoredSessions);
  const [focusStats, setFocusStats] = useState<FocusStats>(getStoredStats);
  const [showAbandonConfirm, setShowAbandonConfirm] = useState(false);
  const [showSessionSummary, setShowSessionSummary] = useState<FocusSession | null>(null);
  const sessionStartTime = useRef<string | null>(null);

  // New task state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Personal');
  const [newDuration, setNewDuration] = useState('30m');
  
  // Track highlighted (newly added) task
  const [highlightedTaskTitle, setHighlightedTaskTitle] = useState<string | null>(null);
  const [showAddedBanner, setShowAddedBanner] = useState<string | null>(null);

  // Check for pending tasks from Brain Dump or Inbox
  useEffect(() => {
    const checkForNewTasks = () => {
      try {
        const pendingTasks = localStorage.getItem('pendingPlanTasks');
        if (pendingTasks) {
          const pending = JSON.parse(pendingTasks);
          if (pending && pending.length > 0) {
            const todayStr = new Date().toISOString().split('T')[0];
            const newTasks = pending.map((task: any, index: number) => ({
              id: Date.now() + index,
              date: todayStr,
              time: task.suggestedTime || '10:00 AM',
              duration: task.estimatedTime || '30m',
              durationMin: parseDuration(task.estimatedTime || '30m'),
              title: task.title,
              category: mapCategory(task.aiCategory),
              priority: mapPriority(task.aiPriority),
              completed: false,
              isFixed: false,
              assignedBy: task.assignedBy, // Track who assigned it
            }));
            setTasks(prev => [...prev, ...newTasks]);
            localStorage.removeItem('pendingPlanTasks');
            
            // Check for highlight flag
            const highlightFlag = localStorage.getItem('highlightNewTask');
            if (highlightFlag) {
              const highlight = JSON.parse(highlightFlag);
              setHighlightedTaskTitle(highlight.title);
              setShowAddedBanner(highlight.title);
              localStorage.removeItem('highlightNewTask');
              
              // Clear highlight after 5 seconds
              setTimeout(() => {
                setHighlightedTaskTitle(null);
                setShowAddedBanner(null);
              }, 5000);
            }
          }
        }
      } catch (e) {
        console.error('Error checking for new tasks', e);
      }
    };
    checkForNewTasks();
    const interval = setInterval(checkForNewTasks, 500);
    return () => clearInterval(interval);
  }, []);

  // Save tasks whenever they change
  useEffect(() => {
    saveTasksToStorage(tasks);
  }, [tasks]);

  // Timer effect - only runs when recording
  useEffect(() => {
    if (activeTimerId !== null && isRecording) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeTimerId, isRecording]);

  // Helpers
  const parseDuration = (dur: string): number => {
    if (dur.includes('h')) {
      const parts = dur.split('h');
      return (parseInt(parts[0]) || 0) * 60 + (parseInt(parts[1]) || 0);
    }
    return parseInt(dur) || 30;
  };

  const mapCategory = (cat?: string): string => {
    const map: Record<string, string> = {
      work: 'Work', health: 'Health', learning: 'Learning',
      finance: 'Finance', social: 'Social', home: 'Home'
    };
    return map[cat || ''] || 'Personal';
  };

  const mapPriority = (pri?: string): 'High' | 'Normal' | 'Low' => {
    if (pri === 'urgent' || pri === 'important') return 'High';
    if (pri === 'low') return 'Low';
    return 'Normal';
  };

  const formatDuration = (min: number) => {
    const h = Math.floor(min / 60);
    const m = min % 60;
    if (h > 0 && m === 0) return `${h}h`;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  const formatTimer = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCategoryStyle = (category: string) => {
    const styles: Record<string, { bg: string; text: string; dot: string }> = {
      Work: { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
      Health: { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
      Personal: { bg: 'bg-violet-100', text: 'text-violet-700', dot: 'bg-violet-500' },
      Learning: { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
    };
    return styles[category] || styles.Personal;
  };

  // Computed
  const todayStr = selectedDate.toISOString().split('T')[0];
  const todayTasks = tasks.filter(t => t.date === todayStr);
  const completedCount = todayTasks.filter(t => t.completed).length;
  const totalCount = todayTasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const nextTask = todayTasks.find(t => !t.completed);
  const totalMinutes = todayTasks.reduce((sum, t) => sum + t.durationMin, 0);
  const completedMinutes = todayTasks.filter(t => t.completed).reduce((sum, t) => sum + t.durationMin, 0);

  // Swipe handlers
  const handleTouchStart = (taskId: number, e: React.TouchEvent) => {
    touchStartX.current[taskId] = e.touches[0].clientX;
    touchStartY.current[taskId] = e.touches[0].clientY;
  };

  const handleTouchMove = (taskId: number, e: React.TouchEvent) => {
    const startX = touchStartX.current[taskId];
    const startY = touchStartY.current[taskId];
    if (startX === undefined) return;

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - startX;
    const diffY = Math.abs(currentY - startY);

    // Only allow horizontal swipe if not scrolling vertically
    if (diffY > 30) return;

    // Clamp swipe between -100 (delete) and 100 (complete)
    const clampedDiff = Math.max(-100, Math.min(100, diffX));
    setSwipeStates(prev => ({ ...prev, [taskId]: clampedDiff }));
  };

  const handleTouchEnd = (taskId: number) => {
    const swipeDistance = swipeStates[taskId] || 0;
    
    if (swipeDistance > 60) {
      // Swipe right - Complete
      handleComplete(taskId);
    } else if (swipeDistance < -60) {
      // Swipe left - Delete
      handleDelete(taskId);
    }
    
    // Reset swipe state
    setSwipeStates(prev => ({ ...prev, [taskId]: 0 }));
    delete touchStartX.current[taskId];
    delete touchStartY.current[taskId];
  };

  // Task actions
  const handleComplete = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    if (activeTimerId === id) {
      setActiveTimerId(null);
      setElapsedSeconds(0);
    }
  };

  const handleDelete = (id: number) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    if (activeTimerId === id) {
      setActiveTimerId(null);
      setElapsedSeconds(0);
    }
  };

  const handleMoveToTomorrow = (id: number) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    setTasks(prev => prev.map(t => t.id === id ? { ...t, date: tomorrowStr } : t));
  };

  const startTimer = (taskId: number) => {
    setActiveTimerId(taskId);
    setElapsedSeconds(0);
    setIsRecording(true);
    sessionStartTime.current = new Date().toISOString();
  };

  const pauseTimer = () => {
    // Pausing doesn't end the session, just pauses
    setIsRecording(false);
  };
  
  const resumeTimer = () => {
    setIsRecording(true);
  };

  const saveSession = (wasCompleted: boolean, wasAbandoned: boolean) => {
    if (activeTimerId === null || elapsedSeconds < 5) return; // Don't save sessions < 5 seconds
    
    const task = tasks.find(t => t.id === activeTimerId);
    if (!task) return;
    
    const targetSeconds = task.durationMin * 60;
    const percentComplete = Math.min(Math.round((elapsedSeconds / targetSeconds) * 100), 100);
    const today = new Date().toISOString().split('T')[0];
    
    const newSession: FocusSession = {
      id: Date.now(),
      taskId: activeTimerId,
      taskTitle: task.title,
      category: task.category,
      date: today,
      startTime: sessionStartTime.current || new Date().toISOString(),
      elapsedSeconds,
      targetSeconds,
      percentComplete,
      wasCompleted,
      wasAbandoned,
    };
    
    const updatedSessions = [newSession, ...focusSessions].slice(0, 50); // Keep last 50 sessions
    setFocusSessions(updatedSessions);
    saveSessionsToStorage(updatedSessions);
    
    // Update stats
    const isNewDay = focusStats.lastSessionDate !== today;
    const isConsecutiveDay = focusStats.lastSessionDate === getYesterdayStr();
    
    const newStats: FocusStats = {
      totalSessions: focusStats.totalSessions + 1,
      completedSessions: focusStats.completedSessions + (wasCompleted ? 1 : 0),
      abandonedSessions: focusStats.abandonedSessions + (wasAbandoned ? 1 : 0),
      totalFocusMinutes: focusStats.totalFocusMinutes + Math.round(elapsedSeconds / 60),
      currentStreak: wasCompleted 
        ? (isConsecutiveDay || !isNewDay ? focusStats.currentStreak + 1 : 1)
        : (wasAbandoned && percentComplete < 25 ? 0 : focusStats.currentStreak),
      bestStreak: Math.max(
        focusStats.bestStreak, 
        wasCompleted ? (isConsecutiveDay || !isNewDay ? focusStats.currentStreak + 1 : 1) : focusStats.currentStreak
      ),
      averageCompletion: Math.round(
        ((focusStats.averageCompletion * focusStats.totalSessions) + percentComplete) / (focusStats.totalSessions + 1)
      ),
      lastSessionDate: today,
    };
    
    setFocusStats(newStats);
    saveStatsToStorage(newStats);
    
    // Show session summary
    setShowSessionSummary(newSession);
    
    return newSession;
  };
  
  const getYesterdayStr = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  };

  const stopTimer = (confirmed = false) => {
    if (!confirmed && elapsedSeconds > 30) {
      // Show confirmation if more than 30 seconds elapsed
      setShowAbandonConfirm(true);
      return;
    }
    
    const task = tasks.find(t => t.id === activeTimerId);
    const targetSeconds = (task?.durationMin || 30) * 60;
    const percentComplete = Math.round((elapsedSeconds / targetSeconds) * 100);
    
    // Save as abandoned if stopped before 80% complete
    if (elapsedSeconds >= 5) {
      saveSession(percentComplete >= 80, percentComplete < 80);
    }
    
    setActiveTimerId(null);
    setElapsedSeconds(0);
    setIsRecording(false);
    setShowAbandonConfirm(false);
    sessionStartTime.current = null;
  };

  const completeTimedTask = (taskId: number) => {
    saveSession(true, false);
    handleComplete(taskId);
    setActiveTimerId(null);
    setElapsedSeconds(0);
    setIsRecording(false);
    sessionStartTime.current = null;
  };

  const handleAddTask = () => {
    if (!newTitle.trim()) return;
    const newTask: Task = {
      id: Date.now(),
      date: todayStr,
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      duration: newDuration,
      durationMin: parseDuration(newDuration),
      title: newTitle.trim(),
      category: newCategory,
      priority: 'Normal',
      completed: false,
      isFixed: false,
    };
    setTasks(prev => [newTask, ...prev]);
    setNewTitle('');
    setNewCategory('Personal');
    setNewDuration('30m');
    setIsAdding(false);
  };

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good Morning', emoji: '\u2600\uFE0F' };
    if (hour < 17) return { text: 'Good Afternoon', emoji: '\u26C5' };
    if (hour < 21) return { text: 'Good Evening', emoji: '\uD83C\uDF05' };
    return { text: 'Good Night', emoji: '\uD83C\uDF19' };
  };

  const greeting = getGreeting();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-28 relative">
      <IOSStatusBar />
      
      <style>{`
        .glass {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-recording {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.15); opacity: 0.8; }
        }
        @keyframes waveform {
          0%, 100% { height: 4px; }
          50% { height: 16px; }
        }
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(80px) rotate(720deg); opacity: 0; }
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.08); opacity: 1; }
        }
        @keyframes ring-pulse {
          0%, 100% { filter: drop-shadow(0 0 8px rgba(16, 185, 129, 0.4)); }
          50% { filter: drop-shadow(0 0 20px rgba(16, 185, 129, 0.8)); }
        }
        @keyframes milestone-pop {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .slide-up { animation: slideUp 0.35s ease-out forwards; }
        .pulse-recording { animation: pulse-recording 1.5s ease-in-out infinite; }
        .wave-bar { animation: waveform 0.6s ease-in-out infinite; }
        .breathe { animation: breathe 4s ease-in-out infinite; }
        .ring-pulse { animation: ring-pulse 2s ease-in-out infinite; }
        .milestone-pop { animation: milestone-pop 0.4s ease-out forwards; }
        .float { animation: float 3s ease-in-out infinite; }
        .confetti { animation: confetti 1.5s ease-out forwards; }
        .task-swipe {
          transition: transform 0.15s ease-out;
        }
        .swipe-hint {
          transition: opacity 0.2s ease;
        }
      `}</style>

      {/* Header */}
      <div className="px-5 pt-3 pb-2">
        <div className="flex items-center justify-between mb-1">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">{greeting.emoji}</span>
              <span className="text-[13px] text-slate-500 font-medium">{greeting.text}</span>
            </div>
            <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">Your Plan</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all active:scale-95 ${
                showCalendar ? 'bg-slate-900 text-white' : 'glass shadow-sm text-slate-600'
              }`}
            >
              <CalendarIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsAdding(true)}
              className="w-10 h-10 rounded-2xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-600/30 active:scale-95 transition-transform"
            >
              <Plus className="w-5 h-5 text-white" strokeWidth={2.5} />
            </button>
          </div>
        </div>
        
        {/* Date Selector */}
        <button 
          onClick={() => setShowCalendar(!showCalendar)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 mt-1"
        >
          <span className="text-[13px] font-medium text-slate-700">
            {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
          <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${showCalendar ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Calendar */}
      {showCalendar && (
        <div className="px-4 mb-4 slide-up">
          <div className="glass rounded-2xl p-4 shadow-lg">
            <Calendar
              month={selectedDate}
              onMonthChange={setSelectedDate}
              onDayClick={(day: Date) => {
                setSelectedDate(day);
                setShowCalendar(false);
              }}
              selected={selectedDate}
            />
          </div>
        </div>
      )}

      <div className="px-4 space-y-3">
        
        {/* Progress Card */}
        <div className="glass rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-4">
            {/* Progress Ring */}
            <div className="relative w-16 h-16 flex-shrink-0">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle cx="32" cy="32" r="28" stroke="#e2e8f0" strokeWidth="5" fill="none" />
                <circle
                  cx="32" cy="32" r="28"
                  stroke="url(#progressGrad)"
                  strokeWidth="5"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 28 * (progressPercent / 100)} ${2 * Math.PI * 28}`}
                  className="transition-all duration-700"
                />
                <defs>
                  <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[16px] font-bold text-slate-900">{progressPercent}%</span>
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex-1">
              <p className="text-[18px] font-bold text-slate-900">{completedCount} of {totalCount} done</p>
              <p className="text-[12px] text-slate-500 mt-0.5">
                {formatDuration(completedMinutes)} completed • {formatDuration(totalMinutes - completedMinutes)} left
              </p>
            </div>
            
            {/* Quick Actions */}
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => onNavigate?.('sort')}
                className="px-3 py-1.5 rounded-lg bg-violet-100 text-violet-700 text-[11px] font-semibold active:scale-95 transition-transform flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                Dump
              </button>
            </div>
          </div>
        </div>

        {/* Focus Session Card - Premium Timer Experience */}
        {activeTimerId !== null && (() => {
          const activeTask = tasks.find(t => t.id === activeTimerId);
          const taskDurationSec = (activeTask?.durationMin || 30) * 60;
          const progressPct = Math.min((elapsedSeconds / taskDurationSec) * 100, 100);
          const remainingSec = Math.max(taskDurationSec - elapsedSeconds, 0);
          const isOvertime = elapsedSeconds > taskDurationSec;
          const milestone25 = progressPct >= 25;
          const milestone50 = progressPct >= 50;
          const milestone75 = progressPct >= 75;
          const milestone100 = progressPct >= 100;
          
          const getMotivationalMessage = () => {
            if (isOvertime) return { text: 'Overtime! Wrap it up', emoji: '🔥' };
            if (progressPct >= 90) return { text: 'Almost there!', emoji: '🏁' };
            if (progressPct >= 75) return { text: 'Final stretch!', emoji: '💪' };
            if (progressPct >= 50) return { text: 'Halfway done!', emoji: '⭐' };
            if (progressPct >= 25) return { text: 'Great momentum!', emoji: '🚀' };
            return { text: 'Stay focused', emoji: '🧘' };
          };
          const motivation = getMotivationalMessage();
          
          const formatRemaining = (sec: number) => {
            const m = Math.floor(sec / 60);
            const s = sec % 60;
            return `${m}:${s.toString().padStart(2, '0')}`;
          };
          
          const circumference = 2 * Math.PI * 54;
          const strokeDashoffset = circumference - (progressPct / 100) * circumference;
          
          return (
            <div className="rounded-3xl overflow-hidden shadow-2xl slide-up relative">
              {/* Animated Background */}
              <div className={`absolute inset-0 ${isOvertime ? 'bg-gradient-to-br from-orange-500 via-red-500 to-pink-500' : 'bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500'}`}>
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 rounded-full blur-3xl breathe" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/20 rounded-full blur-3xl breathe" style={{ animationDelay: '2s' }} />
                </div>
              </div>
              
              <div className="relative p-5">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {isRecording ? (
                      <div className={`w-2.5 h-2.5 rounded-full ${isOvertime ? 'bg-orange-200' : 'bg-white'} pulse-recording`} />
                    ) : (
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-300" />
                    )}
                    <span className="text-white/90 text-[11px] font-bold uppercase tracking-wider">
                      {isRecording ? 'Focus Session' : 'Paused'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur">
                    {focusStats.currentStreak > 0 && (
                      <>
                        <span className="text-sm">🔥</span>
                        <span className="text-white text-[11px] font-bold">{focusStats.currentStreak}</span>
                        <div className="w-px h-3 bg-white/30 mx-1" />
                      </>
                    )}
                    <span className="text-lg">{motivation.emoji}</span>
                    <span className="text-white text-[11px] font-medium">{motivation.text}</span>
                  </div>
                </div>
                
                {/* Task Title */}
                <p className="text-white font-semibold text-[15px] text-center mb-5 truncate px-4">
                  {activeTask?.title}
                </p>
                
                {/* Central Progress Ring */}
                <div className="flex justify-center mb-5">
                  <div className="relative">
                    {/* Glow Effect */}
                    <div className={`absolute inset-0 rounded-full ${isOvertime ? 'bg-orange-400/30' : 'bg-emerald-400/30'} blur-xl breathe`} />
                    
                    {/* Progress Ring */}
                    <svg className="w-36 h-36 transform -rotate-90 ring-pulse" viewBox="0 0 120 120">
                      {/* Background Ring */}
                      <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
                      
                      {/* Progress Ring */}
                      <circle
                        cx="60" cy="60" r="54"
                        fill="none"
                        stroke={isOvertime ? "#fbbf24" : "white"}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-500"
                      />
                      
                      {/* Milestone Markers */}
                      {[25, 50, 75, 100].map((pct) => {
                        const angle = ((pct / 100) * 360 - 90) * (Math.PI / 180);
                        const x = 60 + 54 * Math.cos(angle);
                        const y = 60 + 54 * Math.sin(angle);
                        const reached = progressPct >= pct;
                        return (
                          <circle
                            key={pct}
                            cx={x} cy={y} r={reached ? 5 : 3}
                            fill={reached ? 'white' : 'rgba(255,255,255,0.4)'}
                            className={reached ? 'milestone-pop' : ''}
                          />
                        );
                      })}
                    </svg>
                    
                    {/* Center Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className="text-[11px] text-white/70 font-medium mb-0.5">
                        {isOvertime ? 'OVERTIME' : 'REMAINING'}
                      </p>
                      <p className={`text-[32px] font-bold text-white tabular-nums leading-none ${isOvertime ? 'text-yellow-200' : ''}`}>
                        {isOvertime ? '+' : ''}{formatRemaining(isOvertime ? elapsedSeconds - taskDurationSec : remainingSec)}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Time Stats Bar */}
                <div className="flex items-center justify-center gap-6 mb-5">
                  <div className="text-center">
                    <p className="text-[10px] text-white/60 uppercase tracking-wide">Elapsed</p>
                    <p className="text-[18px] font-bold text-white tabular-nums">{formatTimer(elapsedSeconds)}</p>
                  </div>
                  <div className="w-px h-8 bg-white/20" />
                  <div className="text-center">
                    <p className="text-[10px] text-white/60 uppercase tracking-wide">Target</p>
                    <p className="text-[18px] font-bold text-white tabular-nums">{activeTask?.duration}</p>
                  </div>
                  <div className="w-px h-8 bg-white/20" />
                  <div className="text-center">
                    <p className="text-[10px] text-white/60 uppercase tracking-wide">Progress</p>
                    <p className="text-[18px] font-bold text-white tabular-nums">{Math.round(progressPct)}%</p>
                  </div>
                </div>
                
                {/* Milestone Badges */}
                <div className="flex items-center justify-center gap-2 mb-5">
                  {[
                    { pct: 25, reached: milestone25, label: '25%' },
                    { pct: 50, reached: milestone50, label: '50%' },
                    { pct: 75, reached: milestone75, label: '75%' },
                    { pct: 100, reached: milestone100, label: '✓' },
                  ].map(({ pct, reached, label }) => (
                    <div
                      key={pct}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-[12px] font-bold transition-all duration-300 ${
                        reached 
                          ? 'bg-white text-emerald-600 shadow-lg scale-100' 
                          : 'bg-white/10 text-white/40 scale-90'
                      }`}
                    >
                      {label}
                    </div>
                  ))}
                </div>
                
                {/* Control Buttons */}
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => stopTimer(false)}
                    className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center active:scale-95 transition-all hover:bg-white/25"
                  >
                    <Square className="w-5 h-5 text-white" fill="currentColor" />
                  </button>
                  <button
                    onClick={isRecording ? pauseTimer : resumeTimer}
                    className="w-18 h-18 rounded-full bg-white flex items-center justify-center active:scale-95 transition-all shadow-xl shadow-black/20 float"
                    style={{ width: '72px', height: '72px' }}
                  >
                    {isRecording ? (
                      <Pause className={`w-8 h-8 ${isOvertime ? 'text-orange-500' : 'text-emerald-600'}`} fill="currentColor" />
                    ) : (
                      <Play className={`w-8 h-8 ${isOvertime ? 'text-orange-500' : 'text-emerald-600'} ml-1`} fill="currentColor" />
                    )}
                  </button>
                  <button
                    onClick={() => completeTimedTask(activeTimerId)}
                    className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center active:scale-95 transition-all hover:bg-white/25"
                  >
                    <Check className="w-6 h-6 text-white" strokeWidth={3} />
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Next Task Card - Only show when not recording */}
        {nextTask && activeTimerId === null && (
          <div className="glass rounded-2xl p-4 shadow-sm border-l-4 border-violet-500 slide-up">
            <div className="flex items-center gap-3">
              <button
                onClick={() => startTimer(nextTask.id)}
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30 active:scale-95 transition-transform"
              >
                <Play className="w-6 h-6 text-white ml-0.5" fill="currentColor" />
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-violet-600 uppercase">Up Next</p>
                <p className="text-[16px] font-semibold text-slate-900 truncate">{nextTask.title}</p>
                <p className="text-[12px] text-slate-500">{nextTask.time} • {nextTask.duration}</p>
              </div>
              <button
                onClick={() => handleComplete(nextTask.id)}
                className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center active:scale-95 transition-transform"
              >
                <Check className="w-5 h-5 text-emerald-600" />
              </button>
            </div>
          </div>
        )}

        {/* Swipe Instructions */}
        {todayTasks.length > 0 && (
          <div className="flex items-center justify-center gap-6 py-2">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <ArrowRight className="w-3 h-3 rotate-180" />
              <span>Swipe left to delete</span>
            </div>
            <div className="w-px h-3 bg-slate-200" />
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <span>Swipe right to complete</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        )}

        {/* Added from Inbox Banner */}
        {showAddedBanner && (
          <div className="mb-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-4 shadow-lg shadow-emerald-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Check className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold text-[14px]">Task Added Successfully!</p>
                <p className="text-white/80 text-[12px]">"{showAddedBanner}" is now in your plan</p>
              </div>
            </div>
          </div>
        )}

        {/* Task List */}
        <div className="space-y-2">
          {todayTasks.map((task, index) => {
            const swipeDistance = swipeStates[task.id] || 0;
            const catStyle = getCategoryStyle(task.category);
            const isSwipingRight = swipeDistance > 20;
            const isSwipingLeft = swipeDistance < -20;
            const isHighlighted = highlightedTaskTitle === task.title;
            
            return (
              <div
                key={task.id}
                className={`relative slide-up overflow-hidden rounded-2xl ${isHighlighted ? 'ring-2 ring-emerald-400 ring-offset-2' : ''}`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Newly Added Badge */}
                {isHighlighted && (
                  <div className="absolute top-0 right-0 z-10 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-xl rounded-tr-2xl">
                    NEW
                  </div>
                )}
                
                {/* Swipe Background - Complete (Right) */}
                <div 
                  className={`absolute inset-y-0 left-0 w-24 flex items-center justify-start pl-4 rounded-l-2xl transition-colors ${
                    isSwipingRight ? 'bg-emerald-500' : 'bg-emerald-100'
                  }`}
                >
                  <Check className={`w-6 h-6 ${isSwipingRight ? 'text-white' : 'text-emerald-500'}`} />
                </div>
                
                {/* Swipe Background - Delete (Left) */}
                <div 
                  className={`absolute inset-y-0 right-0 w-24 flex items-center justify-end pr-4 rounded-r-2xl transition-colors ${
                    isSwipingLeft ? 'bg-red-500' : 'bg-red-100'
                  }`}
                >
                  <Trash2 className={`w-6 h-6 ${isSwipingLeft ? 'text-white' : 'text-red-500'}`} />
                </div>
                
                {/* Task Card */}
                <div
                  className={`glass rounded-2xl shadow-sm relative task-swipe ${task.completed ? 'opacity-60' : ''}`}
                  style={{ transform: `translateX(${swipeDistance}px)` }}
                  onTouchStart={(e) => handleTouchStart(task.id, e)}
                  onTouchMove={(e) => handleTouchMove(task.id, e)}
                  onTouchEnd={() => handleTouchEnd(task.id)}
                >
                  <div className="p-4 flex items-center gap-3">
                    {/* Start/Complete Button */}
                    {!task.completed ? (
                      <button
                        onClick={() => {
                          if (activeTimerId === task.id) {
                            pauseTimer();
                          } else {
                            if (activeTimerId) stopTimer();
                            startTimer(task.id);
                          }
                        }}
                        className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 active:scale-95 transition-all ${
                          activeTimerId === task.id
                            ? 'bg-emerald-500 shadow-md shadow-emerald-500/30'
                            : 'bg-violet-100'
                        }`}
                      >
                        {activeTimerId === task.id ? (
                          <Pause className="w-5 h-5 text-white" fill="currentColor" />
                        ) : (
                          <Play className="w-5 h-5 text-violet-600" fill="currentColor" />
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleComplete(task.id)}
                        className="w-11 h-11 rounded-xl bg-emerald-500 flex items-center justify-center flex-shrink-0 active:scale-95"
                      >
                        <Check className="w-5 h-5 text-white" strokeWidth={3} />
                      </button>
                    )}
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className={`text-[15px] font-medium ${task.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                          {task.title}
                        </h3>
                        {task.priority === 'High' && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-100 text-red-600">!</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className={`w-1.5 h-1.5 rounded-full ${catStyle.dot}`} />
                        <span className="text-[12px] text-slate-500">{task.time}</span>
                        <span className="text-[12px] text-slate-400">•</span>
                        <span className="text-[12px] text-slate-500">{task.duration}</span>
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${catStyle.bg} ${catStyle.text}`}>
                          {task.category}
                        </span>
                      </div>
                    </div>
                    
                    {/* Move to Tomorrow */}
                    {!task.completed && (
                      <button
                        onClick={() => handleMoveToTomorrow(task.id)}
                        className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors"
                      >
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {todayTasks.length === 0 && (
          <div className="glass rounded-2xl p-8 shadow-sm text-center slide-up">
            <div className="w-16 h-16 rounded-2xl bg-violet-100 mx-auto mb-4 flex items-center justify-center">
              <Target className="w-8 h-8 text-violet-500" />
            </div>
            <h3 className="text-[18px] font-bold text-slate-900 mb-1">No tasks for today</h3>
            <p className="text-[13px] text-slate-500 mb-5">Add tasks or use Brain Dump to get organized</p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setIsAdding(true)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-[14px] font-semibold active:scale-95 transition-transform"
              >
                Add Task
              </button>
              <button
                onClick={() => onNavigate?.('sort')}
                className="px-5 py-2.5 rounded-xl bg-violet-100 text-violet-700 text-[14px] font-semibold active:scale-95 transition-transform flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                Brain Dump
              </button>
            </div>
          </div>
        )}

        {/* All Complete Celebration */}
        {totalCount > 0 && completedCount === totalCount && (
          <div className="glass rounded-2xl p-6 shadow-sm text-center relative overflow-hidden slide-up">
            <div className="absolute top-2 left-4 text-[20px] confetti" style={{ animationDelay: '0s' }}>🎉</div>
            <div className="absolute top-3 right-6 text-[16px] confetti" style={{ animationDelay: '0.2s' }}>✨</div>
            <div className="absolute top-1 left-1/3 text-[14px] confetti" style={{ animationDelay: '0.4s' }}>⭐</div>
            
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 mx-auto mb-3 flex items-center justify-center shadow-lg">
              <Check className="w-8 h-8 text-white" strokeWidth={3} />
            </div>
            <h3 className="text-[18px] font-bold text-slate-900 mb-1">You crushed it! 🎊</h3>
            <p className="text-[13px] text-slate-500 mb-4">All {totalCount} tasks completed</p>
            <button
              onClick={() => onNavigate?.('challenges')}
              className="px-5 py-2.5 rounded-xl bg-emerald-100 text-emerald-700 text-[13px] font-semibold active:scale-95 transition-transform"
            >
              View XP Earned +{completedCount * 25}
            </button>
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-[9999] flex items-end justify-center">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsAdding(false)}
          />
          
          <div className="relative w-full max-w-[390px] bg-white rounded-t-[28px] p-6 pb-10 shadow-2xl slide-up">
            <div className="w-10 h-1.5 bg-slate-200 rounded-full mx-auto mb-6" />

            <h2 className="text-[22px] font-bold text-slate-900 mb-5">Add Task</h2>

            {/* Title Input - Large Touch Target */}
            <input
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="What do you need to do?"
              className="w-full px-4 py-4 rounded-xl bg-slate-100 outline-none text-slate-900 placeholder:text-slate-400 text-[16px] mb-5"
              autoFocus
            />

            {/* Category - Horizontal Scroll */}
            <div className="mb-5">
              <label className="text-[12px] text-slate-500 font-semibold uppercase tracking-wide block mb-2">Category</label>
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
                {['Personal', 'Work', 'Health', 'Learning'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setNewCategory(cat)}
                    className={`px-5 py-3 rounded-xl text-[14px] font-medium whitespace-nowrap transition-all active:scale-95 ${
                      newCategory === cat 
                        ? 'bg-slate-900 text-white' 
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration - Large Buttons */}
            <div className="mb-6">
              <label className="text-[12px] text-slate-500 font-semibold uppercase tracking-wide block mb-2">Duration</label>
              <div className="grid grid-cols-4 gap-2">
                {['15m', '30m', '1h', '2h'].map(dur => (
                  <button
                    key={dur}
                    onClick={() => setNewDuration(dur)}
                    className={`py-3 rounded-xl text-[15px] font-semibold transition-all active:scale-95 ${
                      newDuration === dur
                        ? 'bg-violet-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {dur}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions - Large Touch Targets */}
            <div className="flex gap-3">
              <button 
                onClick={() => setIsAdding(false)}
                className="flex-1 py-4 rounded-xl text-[16px] font-semibold text-slate-700 bg-slate-100 active:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddTask}
                disabled={!newTitle.trim()}
                className="flex-1 py-4 rounded-xl bg-violet-600 text-white text-[16px] font-semibold disabled:opacity-40 active:scale-[0.98] transition-transform"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Abandon Session Confirmation Modal */}
      {showAbandonConfirm && activeTimerId !== null && (() => {
        const task = tasks.find(t => t.id === activeTimerId);
        const targetSeconds = (task?.durationMin || 30) * 60;
        const percentComplete = Math.round((elapsedSeconds / targetSeconds) * 100);
        const isLowProgress = percentComplete < 25;
        
        return (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAbandonConfirm(false)} />
            <div className="relative w-full max-w-md bg-white rounded-t-3xl p-6 pb-10 slide-up">
              {/* Warning Icon */}
              <div className="flex justify-center mb-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isLowProgress ? 'bg-red-100' : 'bg-amber-100'}`}>
                  <span className="text-3xl">{isLowProgress ? '⚠️' : '🤔'}</span>
                </div>
              </div>
              
              <h3 className="text-[20px] font-bold text-slate-900 text-center mb-2">
                {isLowProgress ? 'Leaving So Soon?' : 'End Session Early?'}
              </h3>
              
              <p className="text-[14px] text-slate-500 text-center mb-4">
                {isLowProgress 
                  ? `You're only ${percentComplete}% through. Abandoning now will break your streak.`
                  : `You've completed ${percentComplete}% of this task. Keep going?`
                }
              </p>
              
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${percentComplete < 25 ? 'bg-red-500' : percentComplete < 50 ? 'bg-amber-500' : percentComplete < 75 ? 'bg-emerald-400' : 'bg-emerald-500'}`}
                    style={{ width: `${percentComplete}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-[11px] text-slate-400">
                  <span>{formatTimer(elapsedSeconds)} elapsed</span>
                  <span>{formatTimer(targetSeconds - elapsedSeconds)} remaining</span>
                </div>
              </div>
              
              {/* Accountability Stats */}
              {focusStats.currentStreak > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5 flex items-center gap-3">
                  <span className="text-2xl">🔥</span>
                  <div>
                    <p className="text-[13px] font-semibold text-amber-800">
                      {focusStats.currentStreak} session streak at risk!
                    </p>
                    <p className="text-[11px] text-amber-600">
                      Don't break your momentum
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowAbandonConfirm(false)}
                  className="flex-1 py-4 rounded-xl bg-emerald-500 text-white text-[16px] font-bold active:scale-[0.98] transition-transform"
                >
                  Keep Going 💪
                </button>
                <button 
                  onClick={() => stopTimer(true)}
                  className="flex-1 py-4 rounded-xl bg-slate-100 text-slate-600 text-[16px] font-semibold active:bg-slate-200 transition-colors"
                >
                  End Session
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Session Summary Modal */}
      {showSessionSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowSessionSummary(null)} />
          <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 slide-up">
            {/* Result Icon */}
            <div className="flex justify-center mb-4">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                showSessionSummary.wasCompleted 
                  ? 'bg-gradient-to-br from-emerald-400 to-teal-500' 
                  : showSessionSummary.percentComplete >= 50 
                    ? 'bg-gradient-to-br from-amber-400 to-orange-500'
                    : 'bg-gradient-to-br from-slate-300 to-slate-400'
              }`}>
                <span className="text-4xl">
                  {showSessionSummary.wasCompleted ? '🎉' : showSessionSummary.percentComplete >= 50 ? '👍' : '😔'}
                </span>
              </div>
            </div>
            
            <h3 className="text-[22px] font-bold text-slate-900 text-center mb-1">
              {showSessionSummary.wasCompleted 
                ? 'Great Work!' 
                : showSessionSummary.percentComplete >= 50 
                  ? 'Good Effort!'
                  : 'Session Ended'
              }
            </h3>
            
            <p className="text-[14px] text-slate-500 text-center mb-5">
              {showSessionSummary.taskTitle}
            </p>
            
            {/* Session Stats Grid */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-slate-50 rounded-xl p-3 text-center">
                <p className="text-[10px] text-slate-400 uppercase tracking-wide">Time</p>
                <p className="text-[18px] font-bold text-slate-900">{formatTimer(showSessionSummary.elapsedSeconds)}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 text-center">
                <p className="text-[10px] text-slate-400 uppercase tracking-wide">Progress</p>
                <p className={`text-[18px] font-bold ${showSessionSummary.percentComplete >= 80 ? 'text-emerald-600' : showSessionSummary.percentComplete >= 50 ? 'text-amber-600' : 'text-slate-600'}`}>
                  {showSessionSummary.percentComplete}%
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 text-center">
                <p className="text-[10px] text-slate-400 uppercase tracking-wide">Status</p>
                <p className="text-[14px] font-bold text-slate-900">
                  {showSessionSummary.wasCompleted ? '✅' : showSessionSummary.wasAbandoned ? '❌' : '⏸️'}
                </p>
              </div>
            </div>
            
            {/* Streak & Stats Update */}
            <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-4 mb-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🔥</span>
                  <div>
                    <p className="text-[13px] font-bold text-violet-900">
                      {focusStats.currentStreak} Session Streak
                    </p>
                    <p className="text-[11px] text-violet-600">
                      Best: {focusStats.bestStreak} • Avg: {focusStats.averageCompletion}%
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-violet-600">Total Focus</p>
                  <p className="text-[14px] font-bold text-violet-900">
                    {focusStats.totalFocusMinutes >= 60 
                      ? `${Math.floor(focusStats.totalFocusMinutes / 60)}h ${focusStats.totalFocusMinutes % 60}m`
                      : `${focusStats.totalFocusMinutes}m`
                    }
                  </p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setShowSessionSummary(null)}
              className="w-full py-4 rounded-xl bg-slate-900 text-white text-[16px] font-bold active:scale-[0.98] transition-transform"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
