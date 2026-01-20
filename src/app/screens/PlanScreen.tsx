import { useState, useRef } from "react";
import { Plus, Clock, MoreVertical, Lock, ChevronRight, CheckCircle2, Calendar as CalendarIcon, Sparkles, Play, Target, Trash2, ArrowRight, Check } from "lucide-react";
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
  const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null);
  const [swipedTaskId, setSwipedTaskId] = useState<number | null>(null);
  const touchStartX = useRef<number>(0);

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
    <div className="min-h-screen bg-ios-bg pb-28 relative overflow-hidden">
      <IOSStatusBar />
      
      <style>{`
        .ios-glass {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .task-card {
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          transition: all 0.2s ease;
        }
        .task-card.swiped {
          transform: translateX(-80px);
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .slide-up { animation: slideUp 0.3s ease-out forwards; }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .fade-in { animation: fadeIn 0.2s ease-out forwards; }
      `}</style>
      
      {/* Header */}
      <div className="px-5 pt-2 pb-3 relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">Plan</h1>
            <p className="text-[13px] text-slate-500 font-medium">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowMonthView(!showMonthView)}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center active:scale-95 transition-all ${showMonthView ? 'bg-slate-900 text-white' : 'ios-glass shadow-sm text-slate-600'}`}
            >
              <CalendarIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsAdding(true)}
              className="w-11 h-11 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg active:scale-95 transition-transform"
            >
              <Plus className="w-5 h-5 text-white" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar View (collapsible) */}
      {showMonthView && (
        <div className="px-4 mb-4 relative z-10">
          <div className="ios-glass rounded-2xl p-4 shadow-sm">
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

      <div className="px-4 space-y-3 relative z-10">
        
        {/* Progress Card - Compact */}
        <div className="ios-glass rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            {/* Progress Info */}
            <div className="flex items-center gap-4">
              {/* Circular Progress */}
              <div className="relative w-14 h-14">
                <svg className="w-14 h-14 transform -rotate-90">
                  <circle cx="28" cy="28" r="24" stroke="#e2e8f0" strokeWidth="4" fill="none" />
                  <circle
                    cx="28" cy="28" r="24"
                    stroke="#10b981"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 24 * (completedCount / Math.max(totalCount, 1))} ${2 * Math.PI * 24}`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[14px] font-bold text-slate-900">{progressPercent}%</span>
                </div>
              </div>
              <div>
                <p className="text-[18px] font-bold text-slate-900">{completedCount} of {totalCount}</p>
                <p className="text-[13px] text-slate-500">tasks completed</p>
              </div>
            </div>
            
            {/* Time Stats */}
            <div className="flex gap-4">
              <div className="text-right">
                <p className="text-[16px] font-bold text-emerald-600">{formatDuration(completedMinutes)}</p>
                <p className="text-[11px] text-slate-500">Done</p>
              </div>
              <div className="text-right">
                <p className="text-[16px] font-bold text-slate-900">{formatDuration(totalMinutes - completedMinutes)}</p>
                <p className="text-[11px] text-slate-500">Left</p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Up Card */}
        {nextTask && (
          <div className="ios-glass rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
                  <Play className="w-5 h-5 text-violet-600" fill="currentColor" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[11px] font-semibold text-violet-600 uppercase">Up Next</span>
                    <span className="text-[11px] text-slate-400">• {nextTask.time}</span>
                  </div>
                  <p className="text-[16px] font-semibold text-slate-900 truncate">{nextTask.title}</p>
                </div>
                <button
                  onClick={() => handleCompleteTask(nextTask.id)}
                  className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center active:bg-emerald-200 transition-colors"
                >
                  <Check className="w-5 h-5 text-emerald-600" />
                </button>
              </div>
            </div>
            <div className="flex border-t border-slate-100">
              <button
                onClick={() => handleMoveToTomorrow(nextTask.id)}
                className="flex-1 py-2.5 text-[13px] font-medium text-slate-600 active:bg-slate-50 transition-colors flex items-center justify-center gap-1.5"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                Tomorrow
              </button>
              <div className="w-px bg-slate-100" />
              <button
                onClick={() => autoPlan()}
                className="flex-1 py-2.5 text-[13px] font-medium text-violet-600 active:bg-violet-50 transition-colors flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Auto Plan
              </button>
            </div>
          </div>
        )}

        {/* Auto Plan Confirmation */}
        {showAutoplanConfirm && autoplanSummary && (
          <div className="ios-glass rounded-2xl p-4 shadow-sm border border-violet-200 bg-violet-50/50">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-violet-600" />
              </div>
              <div className="text-[13px] text-slate-700 font-medium whitespace-pre-line flex-1">{autoplanSummary}</div>
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={handleUndoAutoplan} className="px-4 py-2 rounded-xl text-[13px] text-slate-600 bg-white shadow-sm active:bg-slate-50">
                Undo
              </button>
              <button onClick={handleAcceptAutoplan} className="px-4 py-2 rounded-xl bg-slate-900 text-white text-[13px] font-medium active:scale-95 transition-transform">
                Accept
              </button>
            </div>
          </div>
        )}

        {/* Section Header */}
        <div className="flex items-center justify-between pt-1">
          <h2 className="text-[15px] font-semibold text-slate-900">Today's Tasks</h2>
          <span className="text-[12px] text-slate-500">{timeBlocks.length} tasks</span>
        </div>

        {/* Task List */}
        <div className="space-y-2">
          {timeBlocks.map((block, index) => (
            <div
              key={block.id}
              className="relative slide-up"
              style={{ animationDelay: `${index * 0.03}s` }}
            >
              {/* Swipe Actions Background */}
              <div className="absolute inset-y-0 right-0 w-20 flex items-center justify-center rounded-r-2xl bg-red-500">
                <Trash2 className="w-5 h-5 text-white" />
              </div>
              
              {/* Task Card */}
              <div
                className={`task-card rounded-2xl shadow-sm relative ${block.completed ? 'opacity-50' : ''} ${swipedTaskId === block.id ? 'swiped' : ''}`}
                onTouchStart={(e) => {
                  touchStartX.current = e.touches[0].clientX;
                }}
                onTouchMove={(e) => {
                  const diff = touchStartX.current - e.touches[0].clientX;
                  if (diff > 50) setSwipedTaskId(block.id);
                  else if (diff < -20) setSwipedTaskId(null);
                }}
                onTouchEnd={() => {
                  if (swipedTaskId === block.id) {
                    // Could trigger delete after a delay
                  }
                }}
              >
                <button
                  onClick={() => {
                    if (swipedTaskId === block.id) {
                      handleDeleteTask(block.id);
                      setSwipedTaskId(null);
                    } else {
                      setExpandedTaskId(expandedTaskId === block.id ? null : block.id);
                    }
                  }}
                  className="w-full p-4 text-left"
                >
                  <div className="flex items-center gap-3">
                    {/* Completion Toggle */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCompleteTask(block.id);
                      }}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        block.completed 
                          ? 'bg-emerald-500 border-emerald-500' 
                          : 'border-slate-300'
                      }`}
                    >
                      {block.completed && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className={`text-[15px] font-medium ${block.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                          {block.title}
                        </h3>
                        {block.isFixed && <Lock className="w-3 h-3 text-slate-400" />}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${getCategoryDot(block.category)}`} />
                        <span className="text-[12px] text-slate-500">{block.time}</span>
                        <span className="text-[12px] text-slate-400">• {formatDuration(block.durationMin)}</span>
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${getCategoryColor(block.category)}`}>
                          {block.category}
                        </span>
                      </div>
                    </div>
                    
                    {/* Chevron */}
                    <ChevronRight className={`w-4 h-4 text-slate-300 transition-transform ${expandedTaskId === block.id ? 'rotate-90' : ''}`} />
                  </div>
                </button>
                
                {/* Expanded Actions */}
                {expandedTaskId === block.id && (
                  <div className="px-4 pb-4 pt-0 fade-in">
                    <div className="flex gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => handleCompleteTask(block.id)}
                        className="flex-1 py-2 rounded-xl bg-emerald-100 text-emerald-700 text-[13px] font-medium active:bg-emerald-200 transition-colors"
                      >
                        {block.completed ? 'Undo' : 'Complete'}
                      </button>
                      <button
                        onClick={() => handleMoveToTomorrow(block.id)}
                        className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 text-[13px] font-medium active:bg-slate-200 transition-colors"
                      >
                        Tomorrow
                      </button>
                      <button
                        onClick={() => handleDeleteTask(block.id)}
                        className="py-2 px-4 rounded-xl bg-red-100 text-red-600 text-[13px] font-medium active:bg-red-200 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Ask MYPA */}
        <button
          onClick={() => onNavigate?.('ask')}
          className="w-full ios-glass rounded-2xl p-3.5 shadow-sm flex items-center gap-3 active:scale-[0.98] transition-transform"
        >
          <MYPAOrb size="sm" showGlow={false} />
          <div className="flex-1 text-left">
            <p className="text-[14px] font-semibold text-slate-900">Ask MYPA</p>
            <p className="text-[12px] text-slate-500">"Move gym to tomorrow"</p>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-300" />
        </button>
      </div>

      {/* Add Task Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-[9999] flex items-end justify-center">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm fade-in"
            onClick={handleCancel}
          />
          
          <div className="relative w-full max-w-[390px] bg-white rounded-t-[24px] p-6 pb-10 shadow-2xl">
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-5" />

            <h2 className="text-[20px] font-bold text-slate-900 mb-5">Add Task</h2>

            {/* Title Input */}
            <input
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="What do you need to do?"
              className="w-full px-4 py-3.5 rounded-xl bg-slate-100 outline-none text-slate-900 placeholder:text-slate-400 text-[15px] mb-4"
              autoFocus
            />

            {/* Category Selector */}
            <div className="mb-4">
              <label className="text-[12px] text-slate-500 font-semibold uppercase tracking-wide block mb-2">Category</label>
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
              <label className="text-[12px] text-slate-500 font-semibold uppercase tracking-wide block mb-2">Duration</label>
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
                className="flex-1 py-3.5 rounded-xl text-[15px] font-semibold text-slate-700 bg-slate-100 active:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAdd}
                disabled={!newTitle.trim()}
                className="flex-1 py-3.5 rounded-xl bg-slate-900 text-white text-[15px] font-semibold disabled:opacity-40 active:scale-[0.98] transition-transform"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
