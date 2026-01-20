import { useState, useRef } from "react";
import {
  ArrowLeft,
  Mic,
  Plus,
  MoreVertical,
  CheckCircle,
  Clock,
  Zap,
  Sparkles,
  Trash2,
  Calendar,
  Bell,
  Target,
  ChevronRight,
  GripVertical,
  AlertCircle,
  Timer,
  ListTodo,
  Inbox,
  Star,
  ArrowUpRight,
  Filter,
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
  const [showAIHelper, setShowAIHelper] = useState(false);
  const [showQuickAddOptions, setShowQuickAddOptions] = useState(false);
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
      };
      setItems([newItem, ...items]);
      setInputValue("");
      setShowQuickAddOptions(false);
    }
  };

  const handleDone = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
    setShowMenuId(null);
  };

  const handleDelete = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
    setShowMenuId(null);
  };

  const handleMoveCategory = (id: number, newCategory: TabType) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, category: newCategory } : item
      )
    );
    setShowMenuId(null);
  };

  const handleToggleStar = (id: number) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, isStarred: !item.isStarred } : item
      )
    );
  };

  const handleSnooze = (id: number) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, category: "later" } : item))
    );
    setShowMenuId(null);
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'low': return 'bg-slate-100 text-slate-600 border-slate-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getPriorityDot = (priority?: string) => {
    switch (priority) {
      case 'high': return 'bg-rose-500';
      case 'medium': return 'bg-amber-500';
      case 'low': return 'bg-slate-400';
      default: return 'bg-slate-300';
    }
  };

  return (
    <div className="min-h-screen bg-ios-bg relative overflow-hidden">
      <IOSStatusBar />

      <style>{`
        .hero-card {
          background: linear-gradient(145deg, var(--dark-card-start) 0%, var(--dark-card-middle) 50%, var(--dark-card-end) 100%);
        }
        .task-item {
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .task-item:active {
          transform: scale(0.98);
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .slide-up {
          animation: slide-up 0.2s ease-out;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .float { animation: float 3s ease-in-out infinite; }
      `}</style>

      {/* Ambient glows */}
      <div className="absolute top-32 -right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-80 -left-20 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="sticky top-0 z-40 bg-ios-bg/80 backdrop-blur-xl">
        <div className="px-6 pt-4 pb-3">
          {/* Back + Title */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate?.("hub")}
                className="p-2 rounded-full hover:bg-black/5 transition-colors -ml-2"
              >
                <ArrowLeft className="w-6 h-6 text-slate-700" />
              </button>
              <div>
                <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Organize</p>
                <h1 className="text-[24px] font-bold text-slate-800">Sort Tasks</h1>
              </div>
            </div>
            <button className="p-2 rounded-xl hover:bg-black/5 transition-colors border border-slate-100 bg-white shadow-sm">
              <Filter className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Hero Stats Card */}
      <div className="px-4 mb-5">
        <div className="hero-card rounded-[24px] p-5 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[13px] text-white/60">Total items to sort</p>
              <p className="text-[32px] font-bold">{totalItems}</p>
            </div>
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Inbox className="w-7 h-7 text-white" />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2">
            <button 
              onClick={() => setActiveTab('now')}
              className={`p-3 rounded-xl transition-all ${activeTab === 'now' ? 'bg-white/20' : 'bg-white/10 hover:bg-white/15'}`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                <span className="text-[11px] text-white/60 uppercase tracking-wide">Now</span>
              </div>
              <p className="text-[20px] font-bold">{nowCount}</p>
            </button>
            <button 
              onClick={() => setActiveTab('today')}
              className={`p-3 rounded-xl transition-all ${activeTab === 'today' ? 'bg-white/20' : 'bg-white/10 hover:bg-white/15'}`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] text-white/60 uppercase tracking-wide">Today</span>
              </div>
              <p className="text-[20px] font-bold">{todayCount}</p>
            </button>
            <button 
              onClick={() => setActiveTab('later')}
              className={`p-3 rounded-xl transition-all ${activeTab === 'later' ? 'bg-white/20' : 'bg-white/10 hover:bg-white/15'}`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-[11px] text-white/60 uppercase tracking-wide">Later</span>
              </div>
              <p className="text-[20px] font-bold">{laterCount}</p>
            </button>
          </div>
        </div>
      </div>

      {/* Segmented Control - Tabs */}
      <div className="px-6 mb-4">
        <div className="flex gap-2 p-1 bg-slate-100 rounded-full">
          {(["now", "today", "later"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-4 py-2 rounded-full text-[13px] font-medium transition-all flex items-center justify-center gap-1.5 ${
                activeTab === tab
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              {tab === 'now' && <AlertCircle className="w-3.5 h-3.5" />}
              {tab === 'today' && <Calendar className="w-3.5 h-3.5" />}
              {tab === 'later' && <Clock className="w-3.5 h-3.5" />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pt-2 pb-32">
        {/* Quick Capture Bar */}
        <div className="bg-white rounded-[20px] px-4 py-3 shadow-sm border border-slate-100 mb-4">
          <div className="flex items-center gap-3">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleAddItem();
                }
              }}
              onFocus={() => setShowQuickAddOptions(true)}
              placeholder="✏️ Add task, idea, or reminder..."
              className="flex-1 outline-none bg-transparent text-slate-800 placeholder:text-slate-400 text-[15px]"
            />
            <button className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-500">
              <Mic className="w-5 h-5" />
            </button>
            <button
              onClick={handleAddItem}
              disabled={!inputValue.trim()}
              className={`p-2 rounded-full transition-colors ${inputValue.trim() ? 'bg-gradient-to-r from-primary to-secondary text-white' : 'bg-slate-100 text-slate-400'}`}
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Add Options */}
          {showQuickAddOptions && inputValue && (
            <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100 slide-up">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 text-rose-700 text-[12px] font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                High priority
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-[12px] font-medium">
                <Clock className="w-3.5 h-3.5" />
                Set time
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-[12px] font-medium">
                <Bell className="w-3.5 h-3.5" />
                Remind
              </button>
            </div>
          )}
        </div>

        {/* AI Helper Button */}
        {filteredItems.length > 0 && (
          <button
            onClick={() => setShowAIHelper(true)}
            className="w-full mb-5 px-4 py-3.5 rounded-[16px] bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 flex items-center justify-between hover:from-purple-100 hover:to-blue-100 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <p className="text-[14px] font-semibold text-slate-800">AI Sort</p>
                <p className="text-[12px] text-slate-500">Auto-organize into missions</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </button>
        )}

        {/* Content list */}
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-[18px] font-semibold text-slate-800 mb-2">
              {activeTab === 'now' ? '🎯 Nothing urgent!' : activeTab === 'today' ? '✨ Today is planned!' : '📦 Later box is empty'}
            </h3>
            <p className="text-[14px] text-slate-500 mb-6 max-w-[260px]">
              {activeTab === 'now' ? 'Great job staying on top of urgent tasks.' : activeTab === 'today' ? "You've sorted everything for today." : 'Add items you want to tackle someday.'}
            </p>
            <button
              onClick={() => inputRef.current?.focus()}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-primary to-secondary text-white text-[14px] font-semibold hover:opacity-90 transition-all"
            >
              Add item to {activeTab}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <div key={item.id} className="relative task-item">
                <div className="bg-white rounded-[20px] p-4 shadow-sm border border-slate-100 hover:border-slate-200 transition-colors">
                  <div className="flex items-start gap-3">
                    {/* Drag Handle & Priority Dot */}
                    <div className="flex flex-col items-center gap-2 pt-1">
                      <div className={`w-2.5 h-2.5 rounded-full ${getPriorityDot(item.priority)}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-[15px] font-medium text-slate-800 leading-tight">{item.title}</h3>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button 
                            onClick={() => handleToggleStar(item.id)}
                            className={`p-1.5 rounded-full transition-colors ${item.isStarred ? 'text-amber-500' : 'text-slate-300 hover:text-slate-400'}`}
                          >
                            <Star className="w-4 h-4" fill={item.isStarred ? 'currentColor' : 'none'} />
                          </button>
                          <button
                            onClick={() => setShowMenuId(showMenuId === item.id ? null : item.id)}
                            className="p-1.5 rounded-full hover:bg-slate-100 transition-colors text-slate-400"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Meta Info */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {item.dueTime && (
                          <span className="flex items-center gap-1 text-[12px] text-rose-600 font-medium bg-rose-50 px-2 py-0.5 rounded-full">
                            <Clock className="w-3 h-3" />
                            {item.dueTime}
                          </span>
                        )}
                        {item.estimatedTime && (
                          <span className="flex items-center gap-1 text-[12px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                            <Timer className="w-3 h-3" />
                            ~{item.estimatedTime}
                          </span>
                        )}
                        {item.tags?.map((tag) => (
                          <span key={tag} className="text-[11px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                            {tag}
                          </span>
                        ))}
                        {item.isNew && (
                          <span className="text-[10px] text-primary font-semibold bg-primary/10 px-2 py-0.5 rounded-full">
                            NEW
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions Row */}
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-50">
                    <button 
                      onClick={() => handleDone(item.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-[12px] font-medium hover:bg-green-100 transition-colors"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Done
                    </button>
                    <button 
                      onClick={() => {
                        onNavigate?.('plan');
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 text-slate-600 text-[12px] font-medium hover:bg-slate-100 transition-colors"
                    >
                      <Target className="w-3.5 h-3.5" />
                      To Plan
                    </button>
                    <button 
                      onClick={() => handleSnooze(item.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 text-slate-600 text-[12px] font-medium hover:bg-slate-100 transition-colors"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      Snooze
                    </button>
                  </div>

                  {/* Context Menu */}
                  {showMenuId === item.id && (
                    <div 
                      className="absolute right-4 top-14 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 min-w-[200px] overflow-hidden slide-up"
                      style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.12)' }}
                    >
                      <div className="p-2">
                        <button onClick={() => handleDone(item.id)} className="w-full text-left px-4 py-3 text-[14px] text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-3 transition-colors">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          Mark as Done
                        </button>
                        <button 
                          onClick={() => {
                            setShowMenuId(null);
                            onNavigate?.('plan');
                          }}
                          className="w-full text-left px-4 py-3 text-[14px] text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-3 transition-colors"
                        >
                          <Target className="w-5 h-5 text-blue-600" />
                          Add to Plan
                        </button>
                        <button 
                          onClick={() => {
                            handleDone(item.id);
                            // Mark as "mission" for future use
                          }}
                          className="w-full text-left px-4 py-3 text-[14px] text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-3 transition-colors"
                        >
                          <Sparkles className="w-5 h-5 text-purple-600" />
                          Convert to Mission
                        </button>
                        <button 
                          onClick={() => {
                            handleSnooze(item.id);
                          }}
                          className="w-full text-left px-4 py-3 text-[14px] text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-3 transition-colors"
                        >
                          <Bell className="w-5 h-5 text-amber-600" />
                          Set Reminder
                        </button>
                      </div>

                      <div className="border-t border-slate-100 p-2">
                        <p className="text-[11px] text-slate-400 uppercase tracking-wide px-4 py-2">Move to</p>
                        {(["now", "today", "later"] as const).map((cat) =>
                          cat !== item.category ? (
                            <button 
                              key={cat} 
                              onClick={() => handleMoveCategory(item.id, cat)} 
                              className="w-full text-left px-4 py-2.5 text-[14px] text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-3 transition-colors"
                            >
                              {cat === 'now' && <AlertCircle className="w-4 h-4 text-rose-500" />}
                              {cat === 'today' && <Calendar className="w-4 h-4 text-amber-500" />}
                              {cat === 'later' && <Clock className="w-4 h-4 text-blue-500" />}
                              {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </button>
                          ) : null
                        )}
                      </div>

                      <div className="border-t border-slate-100 p-2">
                        <button onClick={() => handleDelete(item.id)} className="w-full text-left px-4 py-3 text-[14px] text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-3 transition-colors">
                          <Trash2 className="w-5 h-5" />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Click outside to close menu */}
      {showMenuId && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowMenuId(null)}
        />
      )}

      {/* AI Helper Modal */}
      {showAIHelper && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={() => setShowAIHelper(false)} />
          <div className="fixed inset-0 flex items-end z-50 pointer-events-none">
            <div 
              className="w-full bg-white rounded-t-[32px] p-6 pointer-events-auto max-h-[85vh] overflow-y-auto" 
              style={{ boxShadow: "0 -4px 20px rgba(0,0,0,0.1)" }}
            >
              <div className="w-9 h-1 bg-slate-200 rounded-full mx-auto mb-4" />
              
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-[20px] font-bold text-slate-800">AI Suggested Missions</h2>
                  <p className="text-[13px] text-slate-500">Based on {items.length} inbox items</p>
                </div>
              </div>

              <p className="text-[14px] text-slate-500 mb-5">Group your inbox items into focused missions for better productivity.</p>

              <div className="space-y-3 mb-6">
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-[20px] p-4">
                  <div className="flex items-start gap-3">
                    <input type="checkbox" defaultChecked className="mt-1 w-5 h-5 rounded-md accent-primary" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">🏥</span>
                        <p className="text-[15px] font-semibold text-slate-800">Health & Wellness</p>
                      </div>
                      <p className="text-[13px] text-slate-600 mb-2">Dentist appointment, Slack wellness check-ins</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">High priority</span>
                        <span className="text-[11px] text-slate-500">2 tasks • ~30min</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-[20px] p-4">
                  <div className="flex items-start gap-3">
                    <input type="checkbox" defaultChecked className="mt-1 w-5 h-5 rounded-md accent-primary" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">💼</span>
                        <p className="text-[15px] font-semibold text-slate-800">Work Admin</p>
                      </div>
                      <p className="text-[13px] text-slate-600 mb-2">Q1 metrics review, Book conference flight</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Medium priority</span>
                        <span className="text-[11px] text-slate-500">2 tasks • ~45min</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-[20px] p-4">
                  <div className="flex items-start gap-3">
                    <input type="checkbox" className="mt-1 w-5 h-5 rounded-md accent-primary" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">📚</span>
                        <p className="text-[15px] font-semibold text-slate-800">Learning & Growth</p>
                      </div>
                      <p className="text-[13px] text-slate-600 mb-2">React patterns, Home office organization</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">Low priority</span>
                        <span className="text-[11px] text-slate-500">2 tasks • ~1h30m</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setShowAIHelper(false)} className="flex-1 px-4 py-3.5 rounded-full text-[15px] font-semibold text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200">Cancel</button>
                <button 
                  onClick={() => {
                    // Move selected items to missions/done
                    setItems(prev => prev.filter(item => item.category === 'later'));
                    setShowAIHelper(false);
                  }}
                  className="flex-1 px-4 py-3.5 rounded-full bg-gradient-to-r from-primary to-secondary text-white text-[15px] font-semibold hover:opacity-90 transition-all"
                >
                  Create Missions
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
