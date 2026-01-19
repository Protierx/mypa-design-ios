import { useState } from "react";
import { Plus, Clock, MoreVertical, Lock, Unlock, ChevronRight } from "lucide-react";
import { IOSStatusBar } from "../components/IOSStatusBar";
import { VoicePill } from "../components/VoicePill";
import { Calendar } from "../components/ui/calendar";

export function PlanScreen() {
  const [timeBlocks, setTimeBlocks] = useState(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return [
      { id: 1, date: todayStr, time: '9:00 AM', duration: '1h', durationMin: 60, durationMax: 60, title: 'Team standup', category: 'Work', isOverdue: false, isFixed: true, priority: 'High' as const, completed: false },
      { id: 2, date: todayStr, time: '11:00 AM', duration: '2h', durationMin: 120, durationMax: 120, title: 'Deep work: Design review', category: 'Work', isOverdue: false, isFixed: false, priority: 'Normal' as const, completed: false },
      { id: 3, date: todayStr, time: '2:00 PM', duration: '30m', durationMin: 30, durationMax: 30, title: 'Lunch break', category: 'Personal', isOverdue: false, isFixed: false, priority: 'Low' as const, completed: false },
      { id: 4, date: todayStr, time: '3:00 PM', duration: '1h', durationMin: 60, durationMax: 60, title: 'Team sync', category: 'Work', isOverdue: true, isFixed: true, priority: 'High' as const, completed: false },
      { id: 5, date: todayStr, time: '5:00 PM', duration: '45m', durationMin: 45, durationMax: 45, title: 'Gym session', category: 'Health', isOverdue: false, isFixed: false, priority: 'Low' as const, completed: false },
    ];
  });

  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('');
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

  const formatDurationRange = (min: number, max: number) => {
    if (min === max) {
      const h = Math.floor(min / 60);
      const m = min % 60;
      if (h > 0 && m === 0) return `${h}h`;
      if (h > 0) return `${h}h ${m}m`;
      return `${m}m`;
    }
    const minH = Math.floor(min / 60);
    const minM = min % 60;
    const maxH = Math.floor(max / 60);
    const maxM = max % 60;
    
    const minStr = minH > 0 && minM === 0 ? `${minH}h` : minH > 0 ? `${minH}h ${minM}m` : `${minM}m`;
    const maxStr = maxH > 0 && maxM === 0 ? `${maxH}h` : maxH > 0 ? `${maxH}h ${maxM}m` : `${maxM}m`;
    return `${minStr}–${maxStr}`;
  };

  const formatCapacityLine = (cap: ReturnType<typeof getCapacityForDate>) => {
    const fh = Math.floor(cap.free / 60);
    const fm = cap.free % 60;
    const ph = Math.floor(cap.planned / 60);
    const pm = cap.planned % 60;
    const free = fh > 0 ? `${fh}h ${fm}m` : `${fm}m`;
    const planned = ph > 0 ? `${ph}h ${pm}m` : `${pm}m`;
    
    if (cap.isOverCapacity) {
      const oh = Math.floor(Math.abs(cap.difference) / 60);
      const om = Math.abs(cap.difference) % 60;
      const over = oh > 0 ? `${oh}h ${om}m` : `${om}m`;
      return { free, planned, status: `Over by ${over}`, isOver: true };
    } else {
      const uh = Math.floor(cap.difference / 60);
      const um = cap.difference % 60;
      const under = uh > 0 ? `${uh}h ${um}m` : `${um}m`;
      return { free, planned, status: `Under by ${under}`, isOver: false };
    }
  };

  const formatDate = (d: Date) => d.toISOString().split('T')[0];
  const formatDisplayDate = (dateStr: string) => {
    const dd = new Date(dateStr);
    return dd.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

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

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    setVisibleMonth(day);
    setIsAdding(true);
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
      `}</style>
      
      {/* Header */}
      <div className="px-6 pt-4 pb-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[28px] font-bold text-slate-900">
            Plan
          </h1>
        </div>
        <VoicePill placeholder="Let's plan your future..." />
      </div>

      {/* Month Selector */}
      <div className="px-6 mb-6 relative">
        <div className="flex items-center justify-between">
          <button className="text-[17px] font-semibold text-slate-900">
            {visibleMonth.toLocaleString(undefined, { month: 'long', year: 'numeric' })}
          </button>
          <button onClick={() => setShowMonthView(prev => !prev)} className="text-[15px] text-purple-600 font-medium">
            {showMonthView ? 'Close' : 'View Month'}
          </button>
        </div>

        {showMonthView && (
          <div className="mt-3">
            <Calendar
              month={visibleMonth}
              onMonthChange={setVisibleMonth}
              onDayClick={handleDayClick}
              selected={selectedDate || undefined}
            />

            {selectedDate && (
              <div className="mt-3 ios-card p-4">
                <div className="text-[14px] text-slate-500 mb-2">
                  Add block for <span className="text-slate-900 font-medium">{formatDisplayDate(formatDate(selectedDate))}</span>
                </div>

                <div className="flex gap-2 mb-3">
                  {['Work', 'Personal', 'Health', 'Other'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setNewCategory(cat)}
                      className={`px-3 py-1 rounded-full text-[13px] ${newCategory === cat ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <div className="flex gap-2">
                    {['High','Normal','Low'].map(p => (
                      <button key={p} onClick={() => setNewPriority(p as any)} className={`px-3 py-1 rounded-full text-[13px] ${newPriority === p ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                        {p}
                      </button>
                    ))}
                  </div>
                  <label className="ml-2 flex items-center gap-2 text-[13px] text-slate-500">
                    <input type="checkbox" checked={newFixed} onChange={e => setNewFixed(e.target.checked)} />
                    Fixed time
                  </label>
                </div>

                <textarea
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="Type your plan..."
                  className="w-full resize-none bg-transparent outline-none text-slate-900 placeholder:text-slate-400 text-[15px]"
                  rows={3}
                />

                <div className="flex gap-2 mt-3">
                  <input
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    placeholder="Category (e.g., Work, Personal)"
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-100 text-[13px] placeholder:text-slate-400 outline-none"
                  />
                  <input
                    value={newDuration}
                    onChange={e => setNewDuration(e.target.value)}
                    placeholder="Duration (e.g., 30m)"
                    className="w-28 px-3 py-2 rounded-xl bg-slate-100 text-[13px] placeholder:text-slate-400 outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 mt-3">
                  <button onClick={handleCancel} className="px-4 py-2 rounded-full text-[14px] text-slate-500 hover:bg-slate-100">Cancel</button>
                  <button onClick={handleAdd} className="px-4 py-2 rounded-full bg-purple-600 text-white text-[14px]">Add</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Today Timeline */}
      <div className="px-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-[20px] font-semibold text-slate-900">
              Today
            </h2>
            <p className="text-[15px] text-slate-500 mt-1">
              Thursday
            </p>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => autoPlan()} className="text-[14px] px-3 py-1 rounded-full bg-purple-100 text-purple-600 mr-6 font-medium">
              Auto Plan
            </button>
            <button 
              onClick={() => setIsAdding(true)}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-[#B58CFF] to-[#64C7FF] flex items-center justify-center hover:scale-110 active:scale-95 transition-transform shadow-md"
              style={{
                background: 'linear-gradient(135deg, #B58CFF 0%, #64C7FF 100%)',
              }}
            >
              <Plus className="w-5 h-5 text-white" strokeWidth={3} />
            </button>
          </div>
        </div>

        {/* Capacity Line */}
        {(() => {
          const todayStr = formatDate(new Date());
          const capacity = getCapacityForDate(todayStr);
          const capacityLineInfo = formatCapacityLine(capacity);
          
          return (
            <div 
              className={`mb-4 px-4 py-2.5 rounded-full text-[13px] font-medium flex items-center justify-between cursor-pointer transition-colors ${
                capacity.isOverCapacity
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-slate-100 text-slate-500'
              }`}
              onClick={() => capacity.isOverCapacity && setShowSmartFixMenu(!showSmartFixMenu)}
            >
              <span className="text-[12px]">
                Free: {capacityLineInfo.free} · Planned: {capacityLineInfo.planned} · {capacityLineInfo.status}
              </span>
              {capacity.isOverCapacity && <ChevronRight className="w-4 h-4 ml-2" />}
            </div>
          );
        })()}

        {/* Smart Fix Suggestion */}
        {(() => {
          const todayStr = formatDate(new Date());
          const capacity = getCapacityForDate(todayStr);
          if (!capacity.isOverCapacity || !showSmartFixMenu) return null;
          
          const suggestion = getSmartFixSuggestion(todayStr);
          if (!suggestion) return null;
          
          return (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-2xl">
              <p className="text-[13px] text-amber-900 font-medium mb-2">
                Suggested: Move <span className="font-semibold">{suggestion.task.title}</span> to tomorrow
              </p>
              <button 
                onClick={() => handleAutoFit(suggestion.task.id)}
                className="text-[13px] px-3 py-1.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-medium transition-colors"
              >
                Auto-fit
              </button>
            </div>
          );
        })()}

        {showAutoplanConfirm && autoplanSummary && (
          <div className="mb-4 p-4 ios-card shadow-md">
            <div className="text-[14px] text-slate-800 font-medium mb-3 whitespace-pre-line">{autoplanSummary}</div>
            <div className="flex gap-2 justify-end">
              <button onClick={handleUndoAutoplan} className="px-4 py-2 rounded-full text-[14px] text-slate-500 hover:bg-slate-100 border border-slate-200">
                Undo
              </button>
              <button onClick={handleAcceptAutoplan} className="px-4 py-2 rounded-full bg-purple-600 text-white text-[14px]">
                Accept
              </button>
            </div>
          </div>
        )}
        <div className="space-y-3">
          {timeBlocks.map(block => (
            <div
              key={block.id}
              className="ios-card p-4 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 text-center pt-0.5">
                  <p className="text-[15px] font-semibold text-slate-900">
                    {block.time.split(' ')[0]}
                  </p>
                  <p className="text-[12px] text-slate-500">
                    {block.time.split(' ')[1]}
                  </p>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`text-[17px] font-medium flex items-center gap-2 ${block.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                      <span>{block.title}</span>
                      {block.isFixed && (
                        <button onClick={() => handleToggleLock(block.id)} className="p-1 hover:bg-slate-100 rounded transition-colors" title="Tap to unlock">
                          <Lock className="w-4 h-4 text-slate-400" />
                        </button>
                      )}
                      {!block.isFixed && (
                        <button onClick={() => handleToggleLock(block.id)} className="p-1 hover:bg-slate-100 rounded transition-colors opacity-50" title="Tap to lock">
                          <Unlock className="w-4 h-4 text-slate-400" />
                        </button>
                      )}
                      {block.priority && (
                        <span onClick={() => cycleTaskPriority(block.id)} className={`text-[12px] px-2 py-0.5 rounded-full font-medium cursor-pointer transition-colors ${block.priority === 'High' ? 'bg-red-100 text-red-700' : block.priority === 'Low' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                          {block.priority}
                        </span>
                      )}
                      {block.date && block.date !== formatDate(new Date()) && (
                        <span className="ml-2 text-[12px] text-slate-500">
                          {formatDisplayDate(block.date)}
                        </span>
                      )}
                    </h3>
                    {block.isOverdue && (
                      <span className="flex items-center gap-1 text-[12px] text-amber-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                        Overdue
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded-full text-[12px] font-medium ${getCategoryColor(block.category)}`}>
                      {block.category}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-purple-100 text-purple-600">
                      {formatDurationRange(block.durationMin || parseDurationToMinutes(block.duration), block.durationMax || parseDurationToMinutes(block.duration))}
                    </span>
                  </div>
                  {editingId === block.id && editField && (
                    <div className="mt-2 p-2 bg-slate-50 rounded-xl">
                      {editField === 'time' && (
                        <div className="flex gap-2">
                          <input value={editValue} onChange={e => setEditValue(e.target.value)} className="flex-1 px-2 py-1 rounded-lg text-sm bg-white border border-slate-200" />
                          <button onClick={() => saveEdit(block.id)} className="px-3 py-1 bg-purple-600 text-white text-sm rounded-lg">Save</button>
                          <button onClick={() => { setEditingId(null); setEditField(null); }} className="px-3 py-1 text-sm text-slate-500 hover:bg-slate-100 rounded-lg">Cancel</button>
                        </div>
                      )}
                      {editField === 'duration' && (
                        <div className="flex gap-2">
                          <input value={editValue} onChange={e => setEditValue(e.target.value)} className="flex-1 px-2 py-1 rounded-lg text-sm bg-white border border-slate-200" />
                          <button onClick={() => saveEdit(block.id)} className="px-3 py-1 bg-purple-600 text-white text-sm rounded-lg">Save</button>
                          <button onClick={() => { setEditingId(null); setEditField(null); }} className="px-3 py-1 text-sm text-slate-500 hover:bg-slate-100 rounded-lg">Cancel</button>
                        </div>
                      )}
                      {editField === 'priority' && (
                        <div className="flex gap-2">
                          {['High', 'Normal', 'Low'].map(p => (
                            <button key={p} onClick={() => { setEditValue(p); saveEdit(block.id); }} className={`px-3 py-1 text-sm rounded-lg ${editValue === p ? 'bg-purple-600 text-white' : 'bg-white border border-slate-200'}`}>
                              {p}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <button onClick={() => setOpenActionMenuId(openActionMenuId === block.id ? null : block.id)} className="p-2 text-slate-400 hover:text-slate-600">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  {openActionMenuId === block.id && (
                    <div className="absolute right-0 top-8 bg-white border border-slate-200 rounded-2xl shadow-lg z-10 min-w-max overflow-hidden">
                      <button onClick={() => handleCompleteTask(block.id)} className="block w-full text-left px-4 py-2.5 text-[14px] hover:bg-slate-50 text-slate-700">
                        {block.completed ? '✓ Completed' : 'Mark Complete'}
                      </button>
                      <button onClick={() => startEditField(block.id, 'time')} className="block w-full text-left px-4 py-2.5 text-[14px] hover:bg-slate-50 text-slate-700 border-t border-slate-100">
                        Edit time
                      </button>
                      <button onClick={() => startEditField(block.id, 'duration')} className="block w-full text-left px-4 py-2.5 text-[14px] hover:bg-slate-50 text-slate-700 border-t border-slate-100">
                        Edit duration
                      </button>
                      <button onClick={() => startEditField(block.id, 'priority')} className="block w-full text-left px-4 py-2.5 text-[14px] hover:bg-slate-50 text-slate-700 border-t border-slate-100">
                        Change priority
                      </button>
                      <button onClick={() => handleToggleLock(block.id)} className="block w-full text-left px-4 py-2.5 text-[14px] hover:bg-slate-50 text-slate-700 border-t border-slate-100">
                        {block.isFixed ? 'Unlock time' : 'Lock time'}
                      </button>
                      <button onClick={() => handleMoveToTomorrow(block.id)} className="block w-full text-left px-4 py-2.5 text-[14px] hover:bg-slate-50 text-slate-700 border-t border-slate-100">
                        Move to Tomorrow
                      </button>
                      <button onClick={() => handleShareTask(block.id)} className="block w-full text-left px-4 py-2.5 text-[14px] hover:bg-slate-50 text-slate-700 border-t border-slate-100">
                        Share to Circles
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

        {/* Add Block Button / Form */}
        {!isAdding ? null : (
          <>
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/40 z-40 transition-opacity backdrop-blur-sm rounded-[48px]"
              onClick={handleCancel}
            />
            
            {/* Fun Modal */}
            <div className="absolute inset-0 flex items-end z-50 pointer-events-none rounded-[48px] overflow-hidden">
              <div 
                className="w-full bg-white rounded-t-[32px] p-6 pointer-events-auto animate-in slide-in-from-bottom-4 duration-300"
                style={{
                  boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
                }}
              >
                <style>{`
                  @keyframes slide-in-from-bottom {
                    from {
                      opacity: 0;
                      transform: translateY(100%);
                    }
                    to {
                      opacity: 1;
                      transform: translateY(0);
                    }
                  }
                  .animate-in {
                    animation: slide-in-from-bottom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                  }
                `}</style>
                
                {/* Drag handle */}
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-1 bg-slate-200 rounded-full" />
                </div>

                {/* Title */}
                <h2 className="text-[24px] font-bold text-slate-900 mb-6">
                  What's on your mind?
                </h2>

                {/* Main Input - Full width textarea */}
                <div className="mb-6">
                  <textarea
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="e.g., Finish project report, Morning yoga..."
                    className="w-full px-4 py-3 rounded-2xl bg-slate-100 outline-none text-slate-900 placeholder:text-slate-400 text-[16px] resize-none"
                    rows={2}
                    autoFocus
                  />
                </div>

                {/* Category Selector - Visual pills */}
                <div className="mb-6">
                  <label className="text-[13px] text-slate-500 font-medium block mb-2">Category</label>
                  <div className="flex gap-2">
                    {[
                      { name: 'Work' },
                      { name: 'Personal' },
                      { name: 'Health' },
                      { name: 'Other' }
                    ].map(cat => (
                      <button
                        key={cat.name}
                        onClick={() => setNewCategory(cat.name)}
                        className={`px-4 py-2 rounded-full text-[14px] font-medium flex items-center gap-1.5 transition-all ${
                          newCategory === cat.name 
                            ? 'bg-purple-600 text-white shadow-md scale-105' 
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration & Priority - Side by side */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {/* Duration */}
                  <div>
                    <label className="text-[13px] text-slate-500 font-medium block mb-2">Estimated time</label>
                    <div className="flex gap-1.5">
                      {[
                        { dur: '10m', min: 10, max: 10 },
                        { dur: '25m', min: 25, max: 25 },
                        { dur: '45m', min: 45, max: 45 },
                        { dur: '1h', min: 60, max: 60 }
                      ].map(opt => (
                        <button
                          key={opt.dur}
                          onClick={() => {
                            setNewDuration(opt.dur);
                            setNewDurationMin(opt.min);
                            setNewDurationMax(opt.max);
                          }}
                          className={`flex-1 px-3 py-2 rounded-xl text-[13px] font-medium transition-all ${
                            newDuration === opt.dur
                              ? 'bg-purple-600 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {opt.dur}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="text-[13px] text-slate-500 font-medium block mb-2">Priority</label>
                    <div className="flex gap-1.5">
                      {[
                        { label: 'High', value: 'High' },
                        { label: 'Normal', value: 'Normal' },
                        { label: 'Low', value: 'Low' }
                      ].map(p => (
                        <button
                          key={p.value}
                          onClick={() => setNewPriority(p.value as any)}
                          className={`flex-1 px-3 py-2 rounded-xl text-[13px] font-medium transition-all ${
                            newPriority === p.value
                              ? 'bg-purple-600 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Fixed Time Toggle */}
                <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 mb-6 cursor-pointer hover:bg-slate-100 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={newFixed} 
                    onChange={e => setNewFixed(e.target.checked)}
                    className="w-5 h-5 rounded cursor-pointer"
                  />
                  <span className="text-[14px] text-slate-800 font-medium">Lock to this time</span>
                  <span className="text-[12px] text-slate-500 ml-auto">Won't be moved by Auto Plan</span>
                </label>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button 
                    onClick={handleCancel}
                    className="flex-1 px-4 py-3 rounded-full text-[15px] font-semibold text-slate-500 hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleAdd}
                    disabled={!newTitle.trim()}
                    className="flex-1 px-4 py-3 rounded-full bg-gradient-to-r from-[#B58CFF] to-[#64C7FF] text-white text-[15px] font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    style={{
                      background: newTitle.trim() ? 'linear-gradient(135deg, #B58CFF 0%, #64C7FF 100%)' : undefined,
                      backgroundColor: !newTitle.trim() ? '#e2e8f0' : undefined,
                    }}
                  >
                    ✨ Add to plan
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
