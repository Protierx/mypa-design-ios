import { useState, useRef } from "react";
import {
  ArrowLeft,
  Mic,
  Plus,
  MoreVertical,
  CheckCircle,
  Clock,
  Sparkles,
  Trash2,
  Calendar,
  Bell,
  Target,
  ChevronRight,
  AlertCircle,
  Timer,
  Inbox,
  Star,
  ChevronDown,
  X,
  Check,
  MoveRight,
  Zap,
  ArrowRight
} from "lucide-react";
import { IOSStatusBar } from "../components/IOSStatusBar";

interface TaskSortingProps {
  onNavigate?: (screen: string) => void;
}

interface InboxItem {
  id: number;
  title: string;
  category: "now" | "today" | "later";
  dueTime?: string;
  estimatedTime?: string;
  isNew?: boolean;
  createdAt: string;
  priority?: 'high' | 'medium' | 'low';
  tags?: string[];
  isStarred?: boolean;
}

type TabType = "now" | "today" | "later";

export function TaskSortingScreen({ onNavigate }: TaskSortingProps) {
  const [activeTab, setActiveTab] = useState<TabType>("now");
  const [inputValue, setInputValue] = useState("");
  const [items, setItems] = useState<InboxItem[]>([
    {
      id: 1,
      title: "Call dentist for appointment",
      category: "now",
      dueTime: "2:00 PM",
      isNew: true,
      createdAt: "10m ago",
      priority: 'high',
      tags: ['Health'],
      isStarred: true,
    },
    {
      id: 2,
      title: "Review Q1 metrics report",
      category: "now",
      estimatedTime: "15m",
      createdAt: "5m ago",
      priority: 'medium',
      tags: ['Work'],
    },
    {
      id: 3,
      title: "Book flight for conference",
      category: "today",
      createdAt: "2h ago",
      priority: 'medium',
      tags: ['Travel', 'Work'],
    },
    {
      id: 4,
      title: "Respond to Slack messages",
      category: "today",
      estimatedTime: "20m",
      isNew: true,
      createdAt: "1h ago",
      priority: 'low',
      tags: ['Work'],
    },
    {
      id: 5,
      title: "Learn new React patterns",
      category: "later",
      createdAt: "3h ago",
      tags: ['Learning'],
    },
    {
      id: 6,
      title: "Organize home office",
      category: "later",
      estimatedTime: "1h",
      createdAt: "5h ago",
      tags: ['Home'],
    },
  ]);

  const [showMenuId, setShowMenuId] = useState<number | null>(null);
  const [showAIModal, setShowAIModal] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState<number | null>(null);
  const [showTimeModal, setShowTimeModal] = useState<number | null>(null);
  const [showReminderModal, setShowReminderModal] = useState<number | null>(null);
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredItems = items.filter((item) => item.category === activeTab);
  const totalItems = items.length;
  const nowCount = items.filter(i => i.category === 'now').length;
  const todayCount = items.filter(i => i.category === 'today').length;
  const laterCount = items.filter(i => i.category === 'later').length;

  const handleAddItem = () => {
    if (inputValue.trim()) {
      const newItem: InboxItem = {
        id: Math.max(...items.map((i) => i.id), 0) + 1,
        title: inputValue,
        category: activeTab,
        isNew: true,
        createdAt: "now",
        priority: 'medium',
      };
      setItems([newItem, ...items]);
      setInputValue("");
    }
  };

  const handleComplete = (id: number) => {
    setCompletedTasks([...completedTasks, id]);
    setTimeout(() => {
      setItems(items.filter((item) => item.id !== id));
      setCompletedTasks(completedTasks.filter(t => t !== id));
    }, 500);
    setShowMenuId(null);
  };

  const handleDelete = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
    setShowMenuId(null);
  };

  const handleMoveCategory = (id: number, newCategory: TabType) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, category: newCategory, isNew: false } : item
      )
    );
    setShowMenuId(null);
    setShowMoveModal(null);
  };

  const handleToggleStar = (id: number) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, isStarred: !item.isStarred } : item
      )
    );
  };

  const handleSetTime = (id: number, time: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, dueTime: time } : item
      )
    );
    setShowTimeModal(null);
  };

  const handleSetReminder = (id: number, reminder: string) => {
    // In real app, would set actual reminder
    setShowReminderModal(null);
    // Show confirmation
  };

  const handleSetPriority = (id: number, priority: 'high' | 'medium' | 'low') => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, priority } : item
      )
    );
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'bg-rose-500';
      case 'medium': return 'bg-amber-500';
      case 'low': return 'bg-slate-400';
      default: return 'bg-slate-300';
    }
  };

  const getTabIcon = (tab: TabType) => {
    switch (tab) {
      case 'now': return <AlertCircle className="w-4 h-4" />;
      case 'today': return <Calendar className="w-4 h-4" />;
      case 'later': return <Clock className="w-4 h-4" />;
    }
  };

  const getTabColor = (tab: TabType) => {
    switch (tab) {
      case 'now': return 'text-rose-600 bg-rose-100';
      case 'today': return 'text-amber-600 bg-amber-100';
      case 'later': return 'text-blue-600 bg-blue-100';
    }
  };

  return (
    <div className="h-screen bg-ios-bg flex flex-col overflow-hidden">
      <IOSStatusBar />

      <style>{`
        .ios-glass {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .slide-up { animation: slideUp 0.3s ease-out forwards; }
        @keyframes checkmark {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        .checkmark { animation: checkmark 0.3s ease-out forwards; }
        @keyframes fadeOut {
          to { opacity: 0; transform: translateX(20px); }
        }
        .fade-out { animation: fadeOut 0.3s ease-out forwards; }
      `}</style>

      {/* Header */}
      <div className="px-4 pt-1 pb-2 relative z-10 flex-shrink-0">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate?.('hub')}
            className="w-9 h-9 rounded-xl ios-glass shadow-sm flex items-center justify-center active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600" />
          </button>
          <h1 className="text-[17px] font-bold text-slate-900">Sort Tasks</h1>
          <button 
            onClick={() => setShowAIModal(true)}
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg active:scale-95 transition-transform"
          >
            <Sparkles className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="px-4 mb-3 flex-shrink-0">
        <div className="ios-glass rounded-xl p-3 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                <Inbox className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500">Inbox</p>
                <p className="text-[20px] font-bold text-slate-900 leading-tight">{totalItems}</p>
              </div>
            </div>
            <button 
              onClick={() => onNavigate?.('plan')}
              className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-[12px] font-medium flex items-center gap-1.5 active:scale-95 transition-transform"
            >
              <Target className="w-3.5 h-3.5" />
              Plan
            </button>
          </div>

          {/* Category Pills */}
          <div className="flex gap-1.5">
            <button 
              onClick={() => setActiveTab('now')}
              className={`flex-1 py-2 rounded-lg text-[12px] font-medium flex items-center justify-center gap-1 transition-all ${
                activeTab === 'now' 
                  ? 'bg-rose-500 text-white shadow-sm' 
                  : 'bg-rose-50 text-rose-700'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Now</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === 'now' ? 'bg-white/20' : 'bg-rose-200'}`}>{nowCount}</span>
            </button>
            <button 
              onClick={() => setActiveTab('today')}
              className={`flex-1 py-2 rounded-lg text-[12px] font-medium flex items-center justify-center gap-1 transition-all ${
                activeTab === 'today' 
                  ? 'bg-amber-500 text-white shadow-sm' 
                  : 'bg-amber-50 text-amber-700'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Today</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === 'today' ? 'bg-white/20' : 'bg-amber-200'}`}>{todayCount}</span>
            </button>
            <button 
              onClick={() => setActiveTab('later')}
              className={`flex-1 py-2 rounded-lg text-[12px] font-medium flex items-center justify-center gap-1 transition-all ${
                activeTab === 'later' 
                  ? 'bg-blue-500 text-white shadow-sm' 
                  : 'bg-blue-50 text-blue-700'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Later</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === 'later' ? 'bg-white/20' : 'bg-blue-200'}`}>{laterCount}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Add */}
      <div className="px-4 mb-2 flex-shrink-0">
        <div className="ios-glass rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 p-2">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${getTabColor(activeTab)}`}>
              {getTabIcon(activeTab)}
            </div>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleAddItem();
              }}
              placeholder={`Add to ${activeTab}...`}
              className="flex-1 outline-none bg-transparent text-slate-800 placeholder:text-slate-400 text-[14px]"
            />
            <button 
              className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 active:scale-95"
              onClick={() => {/* Voice input would go here */}}
            >
              <Mic className="w-4 h-4" />
            </button>
            <button
              onClick={handleAddItem}
              disabled={!inputValue.trim()}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all active:scale-95 ${
                inputValue.trim() 
                  ? 'bg-slate-900 text-white' 
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="px-4 flex-1 overflow-y-auto pb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
            {activeTab === 'now' ? '⚡ Do Right Now' : activeTab === 'today' ? '📅 For Today' : '📦 Do Later'}
          </h2>
          <span className="text-[12px] text-slate-400">{filteredItems.length} items</span>
        </div>

        {filteredItems.length === 0 ? (
          <div className="ios-glass rounded-xl p-6 text-center shadow-sm">
            <div className={`w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center ${getTabColor(activeTab)}`}>
              {activeTab === 'now' && <CheckCircle className="w-6 h-6" />}
              {activeTab === 'today' && <Calendar className="w-6 h-6" />}
              {activeTab === 'later' && <Clock className="w-6 h-6" />}
            </div>
            <h3 className="text-[15px] font-semibold text-slate-800 mb-1">
              {activeTab === 'now' ? 'Nothing urgent!' : activeTab === 'today' ? 'Today is clear!' : 'Later is empty'}
            </h3>
            <p className="text-[13px] text-slate-500 mb-3">
              {activeTab === 'now' 
                ? 'No tasks need immediate attention' 
                : activeTab === 'today' 
                  ? 'Add tasks you want to do today'
                  : 'Save tasks for another time'}
            </p>
            <button
              onClick={() => inputRef.current?.focus()}
              className="px-4 py-2 rounded-lg bg-slate-900 text-white text-[13px] font-medium active:scale-95 transition-transform"
            >
              Add Task
            </button>
          </div>
        ) : (
          <div className="space-y-1.5">
            {filteredItems.map((item, index) => (
              <div 
                key={item.id} 
                className={`ios-glass rounded-xl shadow-sm overflow-hidden slide-up ${
                  completedTasks.includes(item.id) ? 'fade-out' : ''
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="p-3">
                  <div className="flex items-start gap-2.5">
                    {/* Complete Button */}
                    <button 
                      onClick={() => handleComplete(item.id)}
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                        completedTasks.includes(item.id)
                          ? 'bg-emerald-500 border-emerald-500'
                          : 'border-slate-300 hover:border-slate-400'
                      }`}
                    >
                      {completedTasks.includes(item.id) && (
                        <Check className="w-3 h-3 text-white checkmark" />
                      )}
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className={`text-[14px] font-medium leading-tight ${
                          completedTasks.includes(item.id) ? 'text-slate-400 line-through' : 'text-slate-800'
                        }`}>
                          {item.title}
                        </h3>
                        <div className="flex items-center flex-shrink-0">
                          <button 
                            onClick={() => handleToggleStar(item.id)}
                            className={`p-1 rounded-md transition-colors active:scale-95 ${
                              item.isStarred ? 'text-amber-500' : 'text-slate-300 hover:text-slate-400'
                            }`}
                          >
                            <Star className="w-3.5 h-3.5" fill={item.isStarred ? 'currentColor' : 'none'} />
                          </button>
                          <button
                            onClick={() => setShowMenuId(showMenuId === item.id ? null : item.id)}
                            className="p-1 rounded-md hover:bg-slate-100 transition-colors text-slate-400 active:scale-95"
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Meta Tags */}
                      <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
                        {/* Priority Dot */}
                        <span className={`w-1.5 h-1.5 rounded-full ${getPriorityColor(item.priority)}`} />
                        
                        {item.dueTime && (
                          <span className="flex items-center gap-0.5 text-[10px] text-rose-600 font-medium bg-rose-50 px-1.5 py-0.5 rounded-full">
                            <Clock className="w-2.5 h-2.5" />
                            {item.dueTime}
                          </span>
                        )}
                        {item.estimatedTime && (
                          <span className="flex items-center gap-0.5 text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-full">
                            <Timer className="w-2.5 h-2.5" />
                            ~{item.estimatedTime}
                          </span>
                        )}
                        {item.tags?.map((tag) => (
                          <span key={tag} className="text-[10px] text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded-full border border-slate-100">
                            {tag}
                          </span>
                        ))}
                        {item.isNew && (
                          <span className="text-[9px] text-violet-600 font-semibold bg-violet-100 px-1.5 py-0.5 rounded-full">
                            NEW
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-slate-100">
                    <button 
                      onClick={() => setShowMoveModal(item.id)}
                      className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium hover:bg-slate-200 transition-colors active:scale-95"
                    >
                      <MoveRight className="w-3 h-3" />
                      Move
                    </button>
                    <button 
                      onClick={() => setShowTimeModal(item.id)}
                      className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium hover:bg-slate-200 transition-colors active:scale-95"
                    >
                      <Clock className="w-3 h-3" />
                      Time
                    </button>
                    <button 
                      onClick={() => setShowReminderModal(item.id)}
                      className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium hover:bg-slate-200 transition-colors active:scale-95"
                    >
                      <Bell className="w-3 h-3" />
                      Remind
                    </button>
                    <button 
                      onClick={() => {
                        onNavigate?.('plan');
                      }}
                      className="flex items-center gap-1 px-2 py-1 rounded-md bg-violet-100 text-violet-700 text-[11px] font-medium hover:bg-violet-200 transition-colors active:scale-95 ml-auto"
                    >
                      <Target className="w-3 h-3" />
                      Plan
                    </button>
                  </div>
                </div>

                {/* Context Menu */}
                {showMenuId === item.id && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowMenuId(null)} />
                    <div 
                      className="absolute right-4 top-12 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 min-w-[200px] overflow-hidden slide-up"
                      style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.15)' }}
                    >
                      <div className="p-2">
                        <button 
                          onClick={() => handleComplete(item.id)} 
                          className="w-full text-left px-4 py-3 text-[14px] text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-3 transition-colors"
                        >
                          <CheckCircle className="w-5 h-5 text-emerald-500" />
                          Mark Complete
                        </button>
                        <button 
                          onClick={() => {
                            setShowMenuId(null);
                            setShowMoveModal(item.id);
                          }}
                          className="w-full text-left px-4 py-3 text-[14px] text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-3 transition-colors"
                        >
                          <MoveRight className="w-5 h-5 text-blue-500" />
                          Move to...
                        </button>
                        <button 
                          onClick={() => {
                            setShowMenuId(null);
                            onNavigate?.('plan');
                          }}
                          className="w-full text-left px-4 py-3 text-[14px] text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-3 transition-colors"
                        >
                          <Target className="w-5 h-5 text-violet-500" />
                          Add to Plan
                        </button>
                      </div>
                      
                      <div className="border-t border-slate-100 p-2">
                        <p className="text-[11px] text-slate-400 uppercase tracking-wide px-4 py-2">Priority</p>
                        <div className="flex gap-2 px-4 pb-2">
                          {(['high', 'medium', 'low'] as const).map((p) => (
                            <button
                              key={p}
                              onClick={() => handleSetPriority(item.id, p)}
                              className={`flex-1 py-2 rounded-lg text-[12px] font-medium transition-all active:scale-95 ${
                                item.priority === p 
                                  ? p === 'high' ? 'bg-rose-500 text-white' : p === 'medium' ? 'bg-amber-500 text-white' : 'bg-slate-500 text-white'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              {p.charAt(0).toUpperCase() + p.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-slate-100 p-2">
                        <button 
                          onClick={() => handleDelete(item.id)} 
                          className="w-full text-left px-4 py-3 text-[14px] text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-3 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Move Modal */}
      {showMoveModal && (
        <div className="fixed inset-0 z-[9999] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowMoveModal(null)} />
          <div className="relative w-full max-w-[390px] bg-white rounded-t-[24px] p-6 pb-10 shadow-2xl">
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-5" />
            <h2 className="text-[18px] font-bold text-slate-900 mb-4">Move Task</h2>
            
            <div className="space-y-2">
              {(['now', 'today', 'later'] as const).map((cat) => {
                const item = items.find(i => i.id === showMoveModal);
                const isCurrentCategory = item?.category === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => !isCurrentCategory && handleMoveCategory(showMoveModal, cat)}
                    disabled={isCurrentCategory}
                    className={`w-full p-4 rounded-xl flex items-center gap-4 transition-all active:scale-[0.98] ${
                      isCurrentCategory
                        ? 'bg-slate-100 opacity-50'
                        : cat === 'now' ? 'bg-rose-50 hover:bg-rose-100' 
                          : cat === 'today' ? 'bg-amber-50 hover:bg-amber-100'
                            : 'bg-blue-50 hover:bg-blue-100'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      cat === 'now' ? 'bg-rose-500 text-white' 
                        : cat === 'today' ? 'bg-amber-500 text-white' 
                          : 'bg-blue-500 text-white'
                    }`}>
                      {cat === 'now' && <AlertCircle className="w-5 h-5" />}
                      {cat === 'today' && <Calendar className="w-5 h-5" />}
                      {cat === 'later' && <Clock className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-[15px] font-semibold text-slate-800">
                        {cat === 'now' ? 'Do Now' : cat === 'today' ? 'Today' : 'Later'}
                      </p>
                      <p className="text-[12px] text-slate-500">
                        {cat === 'now' ? 'Urgent, needs attention' : cat === 'today' ? 'Plan for today' : 'Save for another time'}
                      </p>
                    </div>
                    {isCurrentCategory && (
                      <span className="text-[12px] text-slate-400 font-medium">Current</span>
                    )}
                    {!isCurrentCategory && (
                      <ArrowRight className="w-5 h-5 text-slate-400" />
                    )}
                  </button>
                );
              })}
            </div>

            <button 
              onClick={() => setShowMoveModal(null)}
              className="w-full mt-4 py-3.5 rounded-xl bg-slate-100 text-slate-700 text-[15px] font-semibold active:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Time Modal */}
      {showTimeModal && (
        <div className="fixed inset-0 z-[9999] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowTimeModal(null)} />
          <div className="relative w-full max-w-[390px] bg-white rounded-t-[24px] p-6 pb-10 shadow-2xl">
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-5" />
            <h2 className="text-[18px] font-bold text-slate-900 mb-4">Set Time</h2>
            
            <div className="grid grid-cols-3 gap-2 mb-4">
              {['9:00 AM', '12:00 PM', '3:00 PM', '5:00 PM', '7:00 PM', '9:00 PM'].map((time) => (
                <button
                  key={time}
                  onClick={() => handleSetTime(showTimeModal, time)}
                  className="py-3 rounded-xl bg-slate-100 text-slate-700 text-[14px] font-medium hover:bg-slate-200 transition-colors active:scale-95"
                >
                  {time}
                </button>
              ))}
            </div>
            
            <button 
              onClick={() => {
                handleSetTime(showTimeModal, '');
                setShowTimeModal(null);
              }}
              className="w-full py-3 rounded-xl bg-rose-50 text-rose-600 text-[14px] font-medium hover:bg-rose-100 transition-colors active:scale-95 mb-3"
            >
              Clear Time
            </button>

            <button 
              onClick={() => setShowTimeModal(null)}
              className="w-full py-3.5 rounded-xl bg-slate-100 text-slate-700 text-[15px] font-semibold active:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Reminder Modal */}
      {showReminderModal && (
        <div className="fixed inset-0 z-[9999] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowReminderModal(null)} />
          <div className="relative w-full max-w-[390px] bg-white rounded-t-[24px] p-6 pb-10 shadow-2xl">
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-5" />
            <h2 className="text-[18px] font-bold text-slate-900 mb-4">Set Reminder</h2>
            
            <div className="space-y-2 mb-4">
              {[
                { label: 'In 30 minutes', value: '30m' },
                { label: 'In 1 hour', value: '1h' },
                { label: 'In 3 hours', value: '3h' },
                { label: 'Tomorrow morning', value: 'tomorrow' },
                { label: 'Next week', value: 'week' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSetReminder(showReminderModal, option.value)}
                  className="w-full py-3.5 rounded-xl bg-slate-100 text-slate-700 text-[14px] font-medium hover:bg-slate-200 transition-colors active:scale-95 flex items-center justify-between px-4"
                >
                  <span>{option.label}</span>
                  <Bell className="w-4 h-4 text-slate-400" />
                </button>
              ))}
            </div>

            <button 
              onClick={() => setShowReminderModal(null)}
              className="w-full py-3.5 rounded-xl bg-slate-100 text-slate-700 text-[15px] font-semibold active:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* AI Sort Modal */}
      {showAIModal && (
        <div className="fixed inset-0 z-[9999] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAIModal(false)} />
          <div className="relative w-full max-w-[390px] bg-white rounded-t-[24px] p-6 pb-10 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-5" />
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-[18px] font-bold text-slate-900">AI Sort</h2>
                <p className="text-[13px] text-slate-500">Smart organization suggestions</p>
              </div>
            </div>

            <p className="text-[14px] text-slate-600 mb-5">
              Based on your {totalItems} tasks, here's how I'd organize them:
            </p>

            <div className="space-y-3 mb-6">
              {/* Health Mission */}
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-500 flex items-center justify-center text-lg">
                    🏥
                  </div>
                  <div className="flex-1">
                    <p className="text-[15px] font-semibold text-slate-800">Health Tasks</p>
                    <p className="text-[13px] text-slate-500 mb-2">Call dentist</p>
                    <span className="text-[11px] bg-rose-200 text-rose-700 px-2 py-0.5 rounded-full">Move to Now</span>
                  </div>
                </div>
              </div>

              {/* Work Mission */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-lg">
                    💼
                  </div>
                  <div className="flex-1">
                    <p className="text-[15px] font-semibold text-slate-800">Work Admin</p>
                    <p className="text-[13px] text-slate-500 mb-2">Q1 metrics, Slack, Conference flight</p>
                    <span className="text-[11px] bg-amber-200 text-amber-700 px-2 py-0.5 rounded-full">Move to Today</span>
                  </div>
                </div>
              </div>

              {/* Learning Mission */}
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-lg">
                    📚
                  </div>
                  <div className="flex-1">
                    <p className="text-[15px] font-semibold text-slate-800">Learning & Home</p>
                    <p className="text-[13px] text-slate-500 mb-2">React patterns, Organize office</p>
                    <span className="text-[11px] bg-blue-200 text-blue-700 px-2 py-0.5 rounded-full">Keep in Later</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setShowAIModal(false)}
                className="flex-1 py-3.5 rounded-xl bg-slate-100 text-slate-700 text-[15px] font-semibold active:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  // Apply AI sorting
                  setItems(prev => prev.map(item => {
                    if (item.tags?.includes('Health')) return { ...item, category: 'now' as TabType };
                    if (item.tags?.includes('Work')) return { ...item, category: 'today' as TabType };
                    return { ...item, category: 'later' as TabType };
                  }));
                  setShowAIModal(false);
                }}
                className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white text-[15px] font-semibold active:scale-[0.98] transition-transform"
              >
                Apply Sort
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
