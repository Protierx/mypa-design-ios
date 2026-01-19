import { useState } from "react";
import { Plus, Clock, MoreVertical, Lock, ChevronRight, CheckCircle2, Calendar as CalendarIcon, Sparkles, Play, TrendingUp, Target, Zap } from "lucide-react";
import { IOSStatusBar } from "../components/IOSStatusBar";
import { Calendar } from "../components/ui/calendar";
import { MYPAOrb } from "../components/MYPAOrb";

interface PlanScreenProps {
  onNavigate?: (screen: string) => void;
}

export function PlanScreen({ onNavigate }: PlanScreenProps) {
  const [timeBlocks, setTimeBlocks] = useState(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return [
      { id: 1, date: todayStr, time: '9:00 AM', duration: '1h', durationMin: 60, durationMax: 60, title: 'Team standup', category: 'Work', isOverdue: false, isFixed: true, priority: 'High' as const, completed: true },
      { id: 2, date: todayStr, time: '11:00 AM', duration: '2h', durationMin: 120, durationMax: 120, title: 'Deep work: Design review', category: 'Work', isOverdue: false, isFixed: false, priority: 'Normal' as const, completed: true },
      { id: 3, date: todayStr, time: '2:00 PM', duration: '30m', durationMin: 30, durationMax: 30, title: 'Lunch break', category: 'Personal', isOverdue: false, isFixed: false, priority: 'Low' as const, completed: false },
      { id: 4, date: todayStr, time: '3:00 PM', duration: '1h', durationMin: 60, durationMax: 60, title: 'Team sync', category: 'Work', isOverdue: true, isFixed: true, priority: 'High' as const, completed: false },
      { id: 5, date: todayStr, time: '5:00 PM', duration: '45m', durationMin: 45, durationMax: 45, title: 'Gym session', category: 'Health', isOverdue: false, isFixed: false, priority: 'Low' as const, completed: false },
    ];
  });

  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Personal');
  const [newDuration, setNewDuration] = useState('30m');
  const [newDurationMin, setNewDurationMin] = useState(30);
  const [newDurationMax, setNewDurationMax] = useState(30);
  const [newPriority, setNewPriority] = useState<'High' | 'Normal' | 'Low'>('Normal');
  const [newFixed, setNewFixed] = useState(false);

  const [showMonthView, setShowMonthView] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [openActionMenuId, setOpenActionMenuId] = useState<number | null>(null);
  const [showSmartFixMenu, setShowSmartFixMenu] = useState(false);
  
  const [previousState, setPreviousState] = useState<typeof timeBlocks | null>(null);
  const [autoplanSummary, setAutoplanSummary] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editField, setEditField] = useState<'time' | 'duration' | 'priority' | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showAutoplanConfirm, setShowAutoplanConfirm] = useState(false);

  // Computed values
  const completedCount = timeBlocks.filter(b => b.completed).length;
  const totalCount = timeBlocks.length;
  const totalMinutes = timeBlocks.reduce((sum, b) => sum + b.durationMin, 0);
  const completedMinutes = timeBlocks.filter(b => b.completed).reduce((sum, b) => sum + b.durationMin, 0);
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const nextTask = timeBlocks.find(b => !b.completed);

  
  // Capacity planning helpers
  const FREE_TIME_MINUTES = 9 * 60; // 9am-6pm = 9 hours = 540 minutes
  
  const getCapacityForDate = (dateStr: string) => {
    const tasksForDate = timeBlocks.filter(b => b.date === dateStr && !b.completed);
    const plannedMinutes = tasksForDate.reduce((sum, task) => sum + (task.durationMin || parseDurationToMinutes(task.duration)), 0);
    const difference = FREE_TIME_MINUTES - plannedMinutes;
    return {
      free: FREE_TIME_MINUTES,
      planned: plannedMinutes,
      difference,
      isOverCapacity: plannedMinutes > FREE_TIME_MINUTES
    };
  };

  const getSmartFixSuggestion = (dateStr: string) => {
    const tasksForDate = timeBlocks.filter(b => b.date === dateStr && !b.completed && !b.isFixed);
    if (tasksForDate.length === 0) return null;
    
    // Sort by priority: Low → Normal → High (we want to move/split the least important)
    const sortedByPriority = [...tasksForDate].sort((a, b) => {
      const priorityOrder = { Low: 0, Normal: 1, High: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    
    const candidate = sortedByPriority[0];
    if (!candidate) return null;
    
    return {
      task: candidate,
      action: 'move' // 'move' to tomorrow or 'split' into smaller pieces
    };
  };

  const formatDuration = (min: number) => {
    const h = Math.floor(min / 60);
    const m = min % 60;
    if (h > 0 && m === 0) return `${h}h`;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  const formatDurationRange = (min: number, max: number) => {
    if (min === max) return formatDuration(min);
    return `${formatDuration(min)}–${formatDuration(max)}`;
  };

  const getCategoryDot = (category: string) => {
    switch (category) {
      case 'Work': return 'bg-blue-500';
      case 'Health': return 'bg-emerald-500';
      case 'Personal': return 'bg-purple-500';
      default: return 'bg-slate-400';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Work':
        return 'bg-blue-100 text-blue-700';
      case 'Health':
        return 'bg-green-100 text-green-700';
      case 'Personal':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  const formatDate = (d: Date) => d.toISOString().split('T')[0];

  const parseDurationToMinutes = (dur: string) => {
    if (!dur) return 0;
    if (dur.includes('h')) return parseFloat(dur) * 60;
    if (dur.includes('m')) return parseFloat(dur.replace('m',''));
    return 0;
  };

  const timeStringToDate = (timeStr: string) => {
    const [time, ampm] = timeStr.split(' ');
    const [hh, mm] = time.split(':').map(Number);
    let h = hh % 12;
    if (ampm === 'PM') h += 12;
    const d = new Date();
    d.setHours(h, mm, 0, 0);
    return d;
  };

  const formatCurrentTime = () => {
    const d = new Date();
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const h = ((hours + 11) % 12) + 1; // convert to 1-12
    const mm = minutes < 10 ? `0${minutes}` : minutes;
    return `${h}:${mm} ${ampm}`;
  };

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    const dateForBlock = selectedDate ? formatDate(selectedDate) : formatDate(new Date());
    const newBlock = {
      id: Date.now(),
      date: dateForBlock,
      time: formatCurrentTime(),
      duration: newDuration,
      durationMin: newDurationMin,
      durationMax: newDurationMax,
      title: newTitle.trim(),
      category: newCategory || 'Personal',
      isOverdue: false,
      isFixed: newFixed,
      priority: newPriority,
      completed: false,
    };
    setTimeBlocks(prev => [newBlock, ...prev]);
    setNewTitle('');
    setNewCategory('');
    setNewDuration('30m');
    setNewDurationMin(30);
    setNewDurationMax(30);
    setNewPriority('Normal');
    setNewFixed(false);
    setIsAdding(false);
    setSelectedDate(null);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setNewTitle('');
    setNewCategory('');
    setNewDuration('30m');
    setNewDurationMin(30);
    setNewDurationMax(30);
    setNewPriority('Normal');
    setNewFixed(false);
    setSelectedDate(null);
  };

  const autoPlan = () => {
    const now = new Date();
    const todayStr = formatDate(new Date());

    // Save state for undo
    setPreviousState(JSON.parse(JSON.stringify(timeBlocks)));

    // Fixed events: never move
    const fixedEvents = timeBlocks.filter(b => b.date === todayStr && b.isFixed);

    // Flexible slots: available time periods (non-fixed tasks that could be rearranged)
    const flexibleSlots = timeBlocks
      .filter(b => b.date === todayStr && !b.isFixed)
      .sort((a, b) => timeStringToDate(a.time).getTime() - timeStringToDate(b.time).getTime());

    if (flexibleSlots.length === 0) {
      setAutoplanSummary('No flexible tasks to auto-plan for today.');
      setShowAutoplanConfirm(true);
      return;
    }

    // Separate flexible tasks by priority, keeping original order within each group
    const priorityGroups = {
      High: flexibleSlots.filter(t => t.priority === 'High'),
      Normal: flexibleSlots.filter(t => t.priority === 'Normal'),
      Low: flexibleSlots.filter(t => t.priority === 'Low'),
    };

    // Build the ordered task list: High → Normal → Low (respecting original order within each priority)
    const orderedTasks = [...priorityGroups.High, ...priorityGroups.Normal, ...priorityGroups.Low];

    // Assign ordered tasks to earliest available slots
    const assignments: Array<{ taskId: number; time: string }> = [];
    const exceeding: typeof orderedTasks = [];

    for (let i = 0; i < orderedTasks.length; i++) {
      if (i < flexibleSlots.length) {
        assignments.push({ taskId: orderedTasks[i].id, time: flexibleSlots[i].time });
      } else {
        exceeding.push(orderedTasks[i]);
      }
    }

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = formatDate(tomorrow);

    // Apply the rearrangement to state
    const newState = timeBlocks.map(b => {
      // Fixed items never move
      if (b.isFixed) return b;

      // Reassign flexible task to new slot time
      const assign = assignments.find(a => a.taskId === b.id);
      if (assign) return { ...b, time: assign.time };

      // Tasks that don't fit go to tomorrow
      if (exceeding.find(e => e.id === b.id)) return { ...b, date: tomorrowStr };

      return b;
    });

    setTimeBlocks(newState);

    // Summary: count kept High priority and tasks moved
    const keptHigh = assignments.filter(a => {
      const t = orderedTasks.find(t => t.id === a.taskId);
      return t && t.priority === 'High';
    }).length;
    const movedCount = exceeding.length;

    const summary = `Reordered: High → Normal → Low.\nKept ${keptHigh} High priority tasks. Moved ${movedCount} tasks to tomorrow.`;
    setAutoplanSummary(summary);
    setShowAutoplanConfirm(true);
  };

  const handleUndoAutoplan = () => {
    if (previousState) {
      setTimeBlocks(previousState);
      setPreviousState(null);
    }
    setAutoplanSummary(null);
    setShowAutoplanConfirm(false);
  };

  const handleAcceptAutoplan = () => {
    setAutoplanSummary(null);
    setShowAutoplanConfirm(false);
    setPreviousState(null);
  };

  const handleCompleteTask = (id: number) => {
    setTimeBlocks(prev => prev.map(b => b.id === id ? { ...b, completed: !b.completed } : b));
    setOpenActionMenuId(null);
  };

  const handleDeleteTask = (id: number) => {
    setTimeBlocks(prev => prev.filter(b => b.id !== id));
    setOpenActionMenuId(null);
  };

  const handleShareTask = (id: number) => {
    const task = timeBlocks.find(b => b.id === id);
    if (task) {
      alert(`Share "${task.title}" to Circles?\n\nThis will allow you to share your achievement with a friend or family member.`);
    }
    setOpenActionMenuId(null);
  };

  const handleToggleLock = (id: number) => {
    setTimeBlocks(prev => prev.map(b => b.id === id ? { ...b, isFixed: !b.isFixed } : b));
    setOpenActionMenuId(null);
  };

  const handleMoveToTomorrow = (id: number) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = formatDate(tomorrow);
    setTimeBlocks(prev => prev.map(b => b.id === id ? { ...b, date: tomorrowStr } : b));
    setOpenActionMenuId(null);
  };

  const handleAutoFit = (taskId: number) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = formatDate(tomorrow);
    
    setTimeBlocks(prev => prev.map(b => 
      b.id === taskId ? { ...b, date: tomorrowStr } : b
    ));
    setShowSmartFixMenu(false);
  };

  const startEditField = (id: number, field: 'time' | 'duration' | 'priority') => {
    const task = timeBlocks.find(b => b.id === id);
    if (!task) return;
    setEditingId(id);
    setEditField(field);
    setEditValue(field === 'priority' ? task.priority : field === 'time' ? task.time : task.duration);
    setOpenActionMenuId(null);
  };

  const saveEdit = (id: number) => {
    if (!editField || !editValue.trim()) {
      setEditingId(null);
      setEditField(null);
      return;
    }
    setTimeBlocks(prev => prev.map(b => {
      if (b.id === id) {
        if (editField === 'time') return { ...b, time: editValue };
        if (editField === 'duration') return { ...b, duration: editValue };
        if (editField === 'priority') return { ...b, priority: editValue as 'High' | 'Normal' | 'Low' };
      }
      return b;
    }));
    setEditingId(null);
    setEditField(null);
  };

  const cycleTaskPriority = (id: number) => {
    const nextPriority = { High: 'Normal', Normal: 'Low', Low: 'High' } as const;
    setTimeBlocks(prev => prev.map(b => {
      if (b.id === id) return { ...b, priority: nextPriority[b.priority] };
      return b;
    }));
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] pb-28 relative">
      <IOSStatusBar />
      
      <style>{`
        .ios-card {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 20px;
        }
        .ios-card:active {
          transform: scale(0.98);
          transition: transform 0.15s ease;
        }
        .hero-card {
          background: linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
        }
        .quick-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }
        .task-card {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }
        .status-dot {
          animation: status-pulse 2s ease-in-out infinite;
        }
        @keyframes status-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.95); }
        }
      `}</style>
      
      {/* Header */}
      <div className="px-5 pt-2 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[13px] text-slate-500 font-medium">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</p>
            <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">Your Plan</h1>
          </div>
          <button
            onClick={() => setShowMonthView(!showMonthView)}
            className="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-sm active:scale-95 transition-transform"
          >
            <CalendarIcon className="w-5 h-5 text-slate-600" />
          </button>
        </div>
        
        {/* Status Pills */}
        <div className="flex items-center gap-2 mt-3">
          <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
            <div className="w-2 h-2 rounded-full bg-emerald-500 status-dot" />
            <span className="text-[12px] font-semibold text-emerald-700">{completedCount}/{totalCount} done</span>
          </div>
          <div className="flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-full">
            <Clock className="w-3 h-3 text-blue-600" />
            <span className="text-[12px] font-semibold text-blue-700">{formatDuration(totalMinutes)} planned</span>
          </div>
        </div>
      </div>

      {/* Calendar View (collapsible) */}
      {showMonthView && (
        <div className="px-4 mb-4">
          <div className="ios-card p-4 shadow-sm">
            <Calendar
              month={visibleMonth}
              onMonthChange={setVisibleMonth}
              onDayClick={(day: Date) => {
                setSelectedDate(day);
                setVisibleMonth(day);
                setIsAdding(true);
              }}
              selected={selectedDate || undefined}
            />
          </div>
        </div>
      )}

      <div className="px-4 space-y-3">
        
        {/* Hero Card - Today's Progress */}
        <div className="hero-card rounded-[24px] overflow-hidden shadow-xl">
          <div className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <Target className="w-4 h-4 text-purple-400" />
                  <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider">Today's Progress</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-[42px] font-bold text-white leading-none">{completedCount}</span>
                  <span className="text-[20px] text-white/50">/ {totalCount}</span>
                </div>
                <p className="text-[13px] text-slate-400 mt-1">tasks completed</p>
              </div>
              
              {/* Progress Ring */}
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="6"
                    fill="none"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    stroke="url(#progressGradient)"
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 34 * (completedCount / Math.max(totalCount, 1))} ${2 * Math.PI * 34}`}
                  />
                  <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#B58CFF" />
                      <stop offset="100%" stopColor="#64C7FF" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[18px] font-bold text-white">{progressPercent}%</span>
                </div>
              </div>
            </div>
            
            {/* Time Stats */}
            <div className="flex gap-3">
              <div className="flex-1 bg-white/5 backdrop-blur rounded-xl p-3">
                <p className="text-[11px] text-slate-400 uppercase tracking-wide">Completed</p>
                <p className="text-[18px] font-bold text-emerald-400">{formatDuration(completedMinutes)}</p>
              </div>
              <div className="flex-1 bg-white/5 backdrop-blur rounded-xl p-3">
                <p className="text-[11px] text-slate-400 uppercase tracking-wide">Remaining</p>
                <p className="text-[18px] font-bold text-white">{formatDuration(totalMinutes - completedMinutes)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Up Card */}
        {nextTask && (
          <button
            onClick={() => handleCompleteTask(nextTask.id)}
            className="ios-card w-full p-4 shadow-sm text-left active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex flex-col items-center justify-center shadow-lg shadow-purple-500/20">
                  <Play className="w-6 h-6 text-white" fill="white" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wide">Up Next</span>
                  <span className="text-[11px] text-slate-400">• {nextTask.time}</span>
                </div>
                <p className="text-[17px] font-semibold text-slate-900 truncate">{nextTask.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className={`w-2 h-2 rounded-full ${getCategoryDot(nextTask.category)}`} />
                  <span className="text-[12px] text-slate-500">{nextTask.category}</span>
                  <span className="text-[12px] text-slate-400">• {formatDuration(nextTask.durationMin)}</span>
                </div>
              </div>
              
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-slate-400" />
              </div>
            </div>
          </button>
        )}

        {/* Quick Actions Row */}
        <div className="flex gap-2.5">
          <button
            onClick={() => setIsAdding(true)}
            className="flex-1 quick-card rounded-2xl p-3.5 flex items-center gap-3 shadow-sm active:scale-[0.97] transition-transform"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <p className="text-[14px] font-semibold text-slate-900">Add Task</p>
              <p className="text-[11px] text-slate-500">Quick add</p>
            </div>
          </button>

          <button
            onClick={() => autoPlan()}
            className="flex-1 quick-card rounded-2xl p-3.5 flex items-center gap-3 shadow-sm active:scale-[0.97] transition-transform"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-md shadow-violet-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <p className="text-[14px] font-semibold text-slate-900">Auto Plan</p>
              <p className="text-[11px] text-slate-500">Optimize</p>
            </div>
          </button>
        </div>

        {/* Auto Plan Confirmation */}
        {showAutoplanConfirm && autoplanSummary && (
          <div className="ios-card p-4 shadow-md">
            <div className="text-[14px] text-slate-800 font-medium mb-3 whitespace-pre-line">{autoplanSummary}</div>
            <div className="flex gap-2 justify-end">
              <button onClick={handleUndoAutoplan} className="px-4 py-2 rounded-full text-[14px] text-slate-500 hover:bg-slate-100 border border-slate-200">
                Undo
              </button>
              <button onClick={handleAcceptAutoplan} className="px-4 py-2 rounded-full bg-slate-900 text-white text-[14px]">
                Accept
              </button>
            </div>
          </div>
        )}

        {/* Section Header */}
        <div className="flex items-center justify-between pt-2">
          <h2 className="text-[15px] font-semibold text-slate-900">All Tasks</h2>
          <span className="text-[12px] text-slate-500">{timeBlocks.length} items</span>
        </div>

        {/* Task List */}
        <div className="space-y-2">
          {timeBlocks.map(block => (
            <div
              key={block.id}
              className={`task-card rounded-2xl p-4 shadow-sm ${block.completed ? 'opacity-60' : ''}`}
            >
              <div className="flex items-center gap-3">
                {/* Completion Toggle */}
                <button
                  onClick={() => handleCompleteTask(block.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    block.completed 
                      ? 'bg-emerald-500 border-emerald-500' 
                      : 'border-slate-300 hover:border-slate-400'
                  }`}
                >
                  {block.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
                </button>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className={`text-[15px] font-medium ${block.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                      {block.title}
                    </h3>
                    {block.isFixed && (
                      <Lock className="w-3 h-3 text-slate-400" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${getCategoryDot(block.category)}`} />
                    <span className="text-[12px] text-slate-500">{block.time}</span>
                    <span className="text-[12px] text-slate-400">• {formatDuration(block.durationMin)}</span>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="relative flex-shrink-0">
                  <button 
                    onClick={() => setOpenActionMenuId(openActionMenuId === block.id ? null : block.id)} 
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  {openActionMenuId === block.id && (
                    <div className="absolute right-0 top-8 bg-white rounded-2xl shadow-lg z-10 min-w-[140px] overflow-hidden border border-slate-100">
                      <button onClick={() => handleCompleteTask(block.id)} className="block w-full text-left px-4 py-2.5 text-[14px] hover:bg-slate-50 text-slate-700">
                        {block.completed ? 'Undo' : 'Done'}
                      </button>
                      <button onClick={() => handleMoveToTomorrow(block.id)} className="block w-full text-left px-4 py-2.5 text-[14px] hover:bg-slate-50 text-slate-700 border-t border-slate-100">
                        Tomorrow
                      </button>
                      <button onClick={() => handleDeleteTask(block.id)} className="block w-full text-left px-4 py-2.5 text-[14px] hover:bg-red-50 text-red-600 border-t border-slate-100">
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Ask MYPA */}
        <button
          onClick={() => onNavigate?.('ask')}
          className="w-full ios-card p-3 shadow-md flex items-center gap-3 active:scale-[0.98] transition-transform"
        >
          <MYPAOrb size="sm" showGlow={false} />
          <div className="flex-1 text-left">
            <p className="text-[15px] font-semibold text-slate-900">Ask MYPA</p>
            <p className="text-[12px] text-slate-500">Try: "Move gym to tomorrow"</p>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-300" />
        </button>
      </div>

      {/* Add Task Modal */}
      {isAdding && (
        <>
          <div 
            className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
            onClick={handleCancel}
          />
          
          <div className="fixed inset-0 flex items-end z-50 pointer-events-none">
            <div 
              className="w-full bg-white rounded-t-[28px] p-5 pointer-events-auto"
              style={{ boxShadow: '0 -4px 20px rgba(0,0,0,0.1)' }}
            >
              {/* Handle bar */}
              <div className="flex justify-center mb-4">
                <div className="w-9 h-1 bg-slate-300 rounded-full" />
              </div>

              <h2 className="text-[20px] font-bold text-slate-900 mb-5">
                Add Task
              </h2>

              {/* Title Input */}
              <input
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="What do you need to do?"
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 outline-none text-slate-900 placeholder:text-slate-400 text-[16px] mb-4"
                autoFocus
              />

              {/* Category Selector */}
              <div className="mb-4">
                <label className="text-[13px] text-slate-500 font-medium block mb-2">Category</label>
                <div className="flex gap-2">
                  {['Work', 'Personal', 'Health'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setNewCategory(cat)}
                      className={`flex-1 px-4 py-2.5 rounded-xl text-[14px] font-medium transition-all ${
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

              {/* Duration Selector */}
              <div className="mb-6">
                <label className="text-[13px] text-slate-500 font-medium block mb-2">Duration</label>
                <div className="flex gap-2">
                  {[
                    { dur: '15m', min: 15 },
                    { dur: '30m', min: 30 },
                    { dur: '1h', min: 60 },
                    { dur: '2h', min: 120 }
                  ].map(opt => (
                    <button
                      key={opt.dur}
                      onClick={() => {
                        setNewDuration(opt.dur);
                        setNewDurationMin(opt.min);
                        setNewDurationMax(opt.min);
                      }}
                      className={`flex-1 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all ${
                        newDuration === opt.dur
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {opt.dur}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button 
                  onClick={handleCancel}
                  className="flex-1 py-3.5 rounded-2xl text-[15px] font-semibold text-slate-700 bg-slate-100"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAdd}
                  disabled={!newTitle.trim()}
                  className="flex-1 py-3.5 rounded-2xl bg-slate-900 text-white text-[15px] font-semibold disabled:opacity-40"
                >
                  Add Task
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
