import {
<<<<<<< HEAD
=======
  ArrowLeft,
  Trash2,
>>>>>>> origin/main
  CheckCircle,
  MessageSquare,
  Bell,
  Users,
  Clock,
  Check,
  X,
<<<<<<< HEAD
  AlarmClock,
  ExternalLink,
  MoreHorizontal,
  RotateCcw,
=======
  ChevronRight,
  Sparkles,
  Inbox,
  Zap,
  Reply,
  AlarmClock,
  CheckCheck,
  UserPlus,
  Eye,
  Calendar,
  ArrowRight,
>>>>>>> origin/main
} from "lucide-react";
import { IOSStatusBar } from "../components/IOSStatusBar";
import { useState, useEffect } from "react";

interface InboxScreenProps {
  onNavigate?: (screen: string) => void;
}

type TabType = "all" | "assignments" | "reminders" | "invites";
type AssignmentStatus = "pending" | "accepted" | "declined";

// Assignment data model
interface Assignment {
  import {
    ArrowLeft,
    MoreVertical,
    Trash2,
    CheckCircle,
    MessageSquare,
    Bell,
    Users,
    Heart,
    Clock,
    X,
    ChevronRight,
    Sparkles,
    Inbox,
    Zap,
  } from "lucide-react";
  import { IOSStatusBar } from "../components/IOSStatusBar";
  import { useState, useEffect } from "react";

  interface InboxScreenProps {
    onNavigate?: (screen: string) => void;
  }

  interface Assignment {
    id: number;
    title: string;
    assignedByName: string;
    dueTime?: string;
    status: "pending" | "accepted" | "completed" | "declined";
  }

  type TabType = "all" | "messages" | "reminders" | "invites";

  interface NotificationItem {
    id: number;
    title: string;
    subtitle?: string;
    type: "message" | "reminder" | "invite" | "social";
    time: string;
    isNew?: boolean;
  }

  export function InboxScreen({ onNavigate }: InboxScreenProps) {
    const [activeTab, setActiveTab] = useState<TabType>("all");
  
    // Assignments assigned to you
    const [assignments, setAssignments] = useState<Assignment[]>([
      {
        id: 1,
        title: "Review Q1 metrics",
        assignedByName: "Alex",
        dueTime: "2:00 PM",
        status: "pending",
      },
      {
        id: 2,
        title: "Grocery run",
        assignedByName: "Blake",
        dueTime: "6:00 PM",
        status: "pending",
      },
    ]);

    const [items, setItems] = useState<NotificationItem[]>([
      {
        id: 1,
        title: "Alice sent you a message",
        subtitle: "Can we reschedule our call to Thursday?",
        type: "message",
        time: "10m ago",
        isNew: true,
      },
      {
        id: 2,
        title: "Reminder: Take medication",
        subtitle: "Daily 8:00 AM",
        type: "reminder",
        time: "1h ago",
      },
      {
        id: 3,
        title: "Circle invite from Dev Team",
        subtitle: "Join the Q1 planning circle",
        type: "invite",
        time: "2h ago",
        isNew: true,
      },
    ]);

    const [menuId, setMenuId] = useState<number | null>(null);
    const [assignMenuId, setAssignMenuId] = useState<number | null>(null);

    const filtered = items.filter((it) =>
      activeTab === "all"
        ? true
        : activeTab === "messages"
        ? it.type === "message"
        : activeTab === "reminders"
        ? it.type === "reminder"
        : activeTab === "invites"
        ? it.type === "invite"
        : true
    );

    const markRead = (id: number) => {
      setItems(items.map((it) => (it.id === id ? { ...it, isNew: false } : it)));
      setMenuId(null);
    };

    const remove = (id: number) => {
      setItems(items.filter((it) => it.id !== id));
      setMenuId(null);
    };

    const updateAssignmentStatus = (id: number, status: "accepted" | "completed" | "declined") => {
      setAssignments(
        assignments.map((a) => (a.id === id ? { ...a, status } : a))
      );
      setAssignMenuId(null);
    };

    const iconFor = (type: NotificationItem["type"]) => {
      switch (type) {
        case "message":
          return <MessageSquare className="w-5 h-5 text-blue-600" />;
        case "reminder":
          return <Bell className="w-5 h-5 text-amber-600" />;
        case "invite":
          return <Users className="w-5 h-5 text-purple-600" />;
        case "social":
          return <Heart className="w-5 h-5 text-pink-600" />;
      }
    };

    const iconBgFor = (type: NotificationItem["type"]) => {
      switch (type) {
        case "message":
          return "bg-blue-100";
        case "reminder":
          return "bg-amber-100";
        case "invite":
          return "bg-purple-100";
        case "social":
          return "bg-pink-100";
      }
    };

    const getAssignmentStatusColor = (status: string) => {
      switch (status) {
        case "pending":
          return "bg-blue-500/10 text-blue-600 border-blue-500/20";
        case "accepted":
          return "bg-amber-500/10 text-amber-600 border-amber-500/20";
        case "completed":
          return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
        case "declined":
          return "bg-red-500/10 text-red-600 border-red-500/20";
        default:
          return "bg-slate-100 text-slate-600";
      }
    };

    const getAssignmentStatusLabel = (status: string) => {
      switch (status) {
        case "pending":
          return "Pending";
        case "accepted":
          return "Accepted";
        case "completed":
          return "Done";
        case "declined":
          return "Declined";
        default:
          return status;
      }
    };

    const newCount = items.filter(i => i.isNew).length;

    return (
      <div className="min-h-screen bg-ios-bg pb-28 relative overflow-hidden">
        <IOSStatusBar />

        <style>{`
          .ios-card {
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-radius: 16px;
          }
          .ios-card:active {
            transform: scale(0.98);
            transition: transform 0.15s ease;
          }
          @keyframes slideIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .slide-in { animation: slideIn 0.3s ease-out forwards; }
          @keyframes gentlePulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }
          .gentle-pulse { animation: gentlePulse 3s ease-in-out infinite; }
        `}</style>

        {/* Ambient background glow */}
        <div className="absolute top-20 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-96 -left-20 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="px-5 pt-2 pb-4 relative z-10">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-[13px] text-slate-500 font-medium">Stay on top of things</p>
              <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">Your Inbox</h1>
            </div>
            {newCount > 0 && (
              <div className="flex items-center gap-1.5 bg-gradient-to-r from-purple-500 to-primary px-3 py-1.5 rounded-full shadow-lg shadow-purple-500/30">
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span className="text-[12px] font-bold text-white">{newCount} new</span>
              </div>
            )}
          </div>

          {/* Smart Summary Card - More Personal */}
          <div className="mt-3 mb-4 rounded-[24px] p-5 shadow-xl relative overflow-hidden" style={{ background: 'linear-gradient(145deg, var(--dark-card-start) 0%, var(--dark-card-middle) 50%, var(--dark-card-end) 100%)' }}>
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl" />
          
            <div className="relative">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <Inbox className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-white text-[16px] font-semibold mb-1">
                    {items.filter(i => i.isNew).length === 0 ? "All caught up! 🎉" : `${items.filter(i => i.isNew).length} things need your attention`}
                  </p>
                  <p className="text-white/60 text-[13px] leading-relaxed">
                    {assignments.filter(a => a.status === 'pending').length > 0 
                      ? `You have ${assignments.filter(a => a.status === 'pending').length} tasks waiting for your response` 
                      : "Looking good - your tasks are under control"}
                  </p>
                </div>
              </div>
            
              {/* Quick action */}
              {items.filter(i => i.isNew).length > 0 && (
                <button 
                  onClick={() => {
                    items.forEach(item => {
                      if (item.isNew) markRead(item.id);
                    });
                  }}
                  className="mt-4 w-full py-3 rounded-xl bg-white/10 text-white text-[14px] font-semibold hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Mark all as read
                </button>
              )}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2">
            {(["all", "messages", "reminders", "invites"] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-all ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md"
                    : "bg-white text-slate-600 shadow-sm"
                }`}
              >
                {tab === "all" ? "All" : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 space-y-4">
          {/* Assigned to You Section */}
          {assignments.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <h2 className="text-[13px] font-semibold text-slate-500 uppercase tracking-wide">
                  Assigned to you
                </h2>
                <span className="text-[12px] font-medium text-slate-400">{assignments.length} tasks</span>
              </div>
              <div className="space-y-2.5">
                {assignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="ios-card p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-md shadow-orange-500/20 flex-shrink-0">
                          <Clock className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-[15px] font-semibold text-slate-900">
                            {assignment.title}
                          </h3>
                          <p className="text-[13px] text-slate-500 mt-0.5">
                            From <span className="font-medium text-slate-600">{assignment.assignedByName}</span>
                          </p>
                          {assignment.dueTime && (
                            <div className="flex items-center gap-1.5 mt-2">
                              <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${getAssignmentStatusColor(assignment.status)}`}>
                                {getAssignmentStatusLabel(assignment.status)}
                              </span>
                              <span className="text-[12px] text-slate-400">• Due {assignment.dueTime}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="relative flex-shrink-0">
                        <button
                          onClick={() =>
                            setAssignMenuId(
                              assignMenuId === assignment.id ? null : assignment.id
                            )
                          }
                          className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-400"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {assignMenuId === assignment.id && (
                          <div className="absolute right-0 top-10 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 min-w-[140px] overflow-hidden">
                            {assignment.status === "pending" && (
                              <>
                                <button
                                  onClick={() => updateAssignmentStatus(assignment.id, "accepted")}
                                  className="block w-full text-left px-4 py-3 text-[14px] font-medium text-slate-700 hover:bg-slate-50 border-b border-slate-100"
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() => updateAssignmentStatus(assignment.id, "declined")}
                                  className="block w-full text-left px-4 py-3 text-[14px] font-medium text-slate-700 hover:bg-slate-50"
                                >
                                  Decline
                                </button>
                              </>
                            )}
                            {assignment.status === "accepted" && (
                              <button
                                onClick={() => updateAssignmentStatus(assignment.id, "completed")}
                                className="block w-full text-left px-4 py-3 text-[14px] font-medium text-emerald-600 hover:bg-emerald-50"
                              >
                                Mark done
                              </button>
                            )}
                            {(assignment.status === "completed" || assignment.status === "declined") && (
                              <button
                                onClick={() => {
                                  setAssignments(assignments.filter((a) => a.id !== assignment.id));
                                  setAssignMenuId(null);
                                }}
                                className="block w-full text-left px-4 py-3 text-[14px] font-medium text-red-600 hover:bg-red-50"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Regular Inbox Items */}
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="text-[13px] font-semibold text-slate-500 uppercase tracking-wide">
                Activity
              </h2>
              <span className="text-[12px] text-slate-400">{filtered.length} items</span>
            </div>
          
            {filtered.length === 0 ? (
              <div className="ios-card p-8 flex flex-col items-center justify-center text-center shadow-sm">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center mb-4 shadow-inner">
                  <span className="text-4xl">✨</span>
                </div>
                <h3 className="text-[18px] font-bold text-slate-900 mb-2">
                  All caught up!
                </h3>
                <p className="text-[14px] text-slate-500 max-w-[240px] leading-relaxed">
                  Great job staying on top of things. New messages and updates will appear here.
                </p>
                <div className="mt-4 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100">
                  <p className="text-[12px] text-emerald-600 font-medium flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    +10 XP for staying organized
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5">
                {filtered.map((it, index) => (
                  <div
                    key={it.id}
                    className={`ios-card p-4 shadow-sm slide-in ${it.isNew ? "ring-2 ring-purple-200 ring-offset-1" : ""}`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex items-start gap-3">
                    <div className={`w-11 h-11 rounded-2xl ${iconBgFor(it.type)} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                      {iconFor(it.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-[15px] font-semibold text-slate-900">
                            {it.title}
                          </h3>
                          {it.subtitle && (
                            <p className="text-[13px] text-slate-500 mt-0.5 truncate">
                              {it.subtitle}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {it.isNew && (
                            <div className="w-2 h-2 rounded-full bg-purple-500" />
                          )}
                          <span className="text-[12px] text-slate-400">{it.time}</span>
                        </div>
                      </div>
                    </div>

                    <div className="relative flex-shrink-0">
                      <button
                        onClick={() => setMenuId(menuId === it.id ? null : it.id)}
                        className="p-1.5 rounded-full hover:bg-slate-100 transition-colors text-slate-400"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {menuId === it.id && (
                        <div className="absolute right-0 top-8 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 min-w-[140px] overflow-hidden">
                          {it.isNew && (
                            <button
                              onClick={() => markRead(it.id)}
                              className="block w-full text-left px-4 py-3 text-[14px] font-medium text-slate-700 hover:bg-slate-50 border-b border-slate-100"
                            >
                              Mark as read
                            </button>
                          )}
                          <button
                            onClick={() => remove(it.id)}
                            className="block w-full text-left px-4 py-3 text-[14px] font-medium text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
          assignedBy: assignment.assignedByName,
          source: 'inbox-assignment',
        };
        
        // Get existing pending tasks and add this one
        const existingPending = localStorage.getItem('pendingPlanTasks');
        const pendingTasks = existingPending ? JSON.parse(existingPending) : [];
        pendingTasks.push(pendingTask);
        localStorage.setItem('pendingPlanTasks', JSON.stringify(pendingTasks));
        
        // Also store a highlight flag so PlanScreen can highlight the new task
        localStorage.setItem('highlightNewTask', JSON.stringify({
          title: assignment.title,
          timestamp: Date.now(),
        }));
      } catch (e) {
        console.error('Error adding task to plan', e);
      }
      
      showFeedback(assignment.id, "Adding to your Plan...", 'success');
      // Update status and auto-remove after feedback
      setAssignments(assignments.map(a => 
        a.id === id ? { ...a, status: 'accepted' as const } : a
      ));
      setTimeout(() => {
        setAssignments(prev => prev.filter(a => a.id !== id));
        onNavigate?.("plan");
      }, 1200);
    }
  };

  // Decline assignment - notifies assigner and removes
  const declineAssignment = (id: number) => {
    const assignment = assignments.find(a => a.id === id);
    showFeedback(id, `Declined - ${assignment?.assignedByName} notified`, 'info');
    setAssignments(assignments.map(a => 
      a.id === id ? { ...a, status: 'declined' as const } : a
    ));
    setTimeout(() => {
      setAssignments(prev => prev.filter(a => a.id !== id));
    }, 1500);
  };

  // Complete assignment - marks done and removes
  const completeAssignment = (id: number) => {
    showFeedback(id, "Completed! Great job 🎉", 'success');
    setAssignments(assignments.map(a => 
      a.id === id ? { ...a, status: 'completed' as const } : a
    ));
    setTimeout(() => {
      setAssignments(prev => prev.filter(a => a.id !== id));
    }, 1500);
  };

  // View assignment in Plan
  const viewAssignmentInPlan = (id: number) => {
    onNavigate?.("plan");
  };

  const iconFor = (type: NotificationItem["type"]) => {
>>>>>>> origin/main
    switch (type) {
      case "reminder":
        return <Bell className="w-5 h-5 text-amber-600" />;
      case "invite":
        return <Users className="w-5 h-5 text-purple-600" />;
      case "message":
        return <MessageSquare className="w-5 h-5 text-blue-600" />;
    }
  };

  const iconBgFor = (type: InboxItem["type"]) => {
    switch (type) {
      case "reminder":
        return "bg-amber-100";
      case "invite":
        return "bg-purple-100";
      case "message":
        return "bg-blue-100";
    }
  };

  return (
    <div className="min-h-screen bg-ios-bg pb-28 relative overflow-hidden">
      <IOSStatusBar />

      <style>{`
        .ios-card {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 16px;
        }
<<<<<<< HEAD
=======
        .ios-card:active {
          transform: scale(0.98);
          transition: transform 0.15s ease;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .slide-in { animation: slideIn 0.3s ease-out forwards; }
        @keyframes gentlePulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .gentle-pulse { animation: gentlePulse 3s ease-in-out infinite; }
>>>>>>> origin/main
      `}</style>

      {/* Ambient background glow */}
      <div className="absolute top-20 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-96 -left-20 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="px-5 pt-2 pb-4 relative z-10">
        <div className="flex items-center justify-between mb-2">
          <div>
<<<<<<< HEAD
            <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">Inbox</h1>
            <p className="text-[13px] text-slate-500 mt-0.5">Incoming items needing your attention</p>
=======
            <p className="text-[13px] text-slate-500 font-medium">Stay on top of things</p>
            <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">Your Inbox</h1>
>>>>>>> origin/main
          </div>
          {newCount > 0 && (
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-purple-500 to-primary px-3 py-1.5 rounded-full shadow-lg shadow-purple-500/30">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span className="text-[12px] font-bold text-white">{newCount} new</span>
            </div>
          )}
        </div>

<<<<<<< HEAD
        {/* Main Filter Tabs */}
        <div className="flex gap-2 mt-3">
          {(["all", "assignments", "reminders", "invites"] as TabType[]).map((tab) => (
=======
        {/* Smart Summary Card - More Personal */}
        <div className="mt-3 mb-4 rounded-[24px] p-5 shadow-xl relative overflow-hidden" style={{ background: 'linear-gradient(145deg, var(--dark-card-start) 0%, var(--dark-card-middle) 50%, var(--dark-card-end) 100%)' }}>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl" />
          
          <div className="relative">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Inbox className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white text-[16px] font-semibold mb-1">
                  {items.filter(i => i.isNew).length === 0 ? "All caught up! 🎉" : `${items.filter(i => i.isNew).length} things need your attention`}
                </p>
                <p className="text-white/60 text-[13px] leading-relaxed">
                  {assignments.filter(a => a.status === 'pending').length > 0 
                    ? `You have ${assignments.filter(a => a.status === 'pending').length} tasks waiting for your response` 
                    : "Looking good - your tasks are under control"}
                </p>
              </div>
            </div>
            
            {/* Quick action */}
            {items.filter(i => i.isNew).length > 0 && (
              <button 
                onClick={() => {
                  items.forEach(item => {
                    if (item.isNew) markRead(item.id);
                  });
                }}
                className="mt-4 w-full py-3 rounded-xl bg-white/10 text-white text-[14px] font-semibold hover:bg-white/20 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Mark all as read
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          {(["all", "messages", "reminders", "invites"] as TabType[]).map((tab) => (
>>>>>>> origin/main
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-all ${
                activeTab === tab
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md"
                  : "bg-white text-slate-600 shadow-sm"
              }`}
            >
              {tab === "all" ? "All" : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

<<<<<<< HEAD
        {/* Assignment Status Filter - Only show when on Assignments tab */}
        {activeTab === "assignments" && (
          <div className="mt-3 p-1 bg-slate-200/60 rounded-full flex gap-1.5">
            {(["pending", "accepted", "declined"] as AssignmentStatus[]).map((status) => (
              <button
                key={status}
                onClick={() => setAssignmentFilter(status)}
                className={`flex-1 py-2 px-3 rounded-full text-[13px] font-semibold transition-all ${
                  assignmentFilter === status
                    ? "bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-sm"
                    : "text-slate-600"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
                {status === "pending" && assignments.filter(a => a.status === "pending").length > 0 && (
                  <span className="ml-1.5 text-[11px] opacity-70">
                    ({assignments.filter(a => a.status === "pending").length})
                  </span>
                )}
              </button>
            ))}
=======
      <div className="px-4 space-y-4">
        {/* Assigned to You Section */}
        {assignments.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="text-[13px] font-semibold text-slate-500 uppercase tracking-wide">
                Assigned to you
              </h2>
              <span className="text-[12px] font-medium text-slate-400">{assignments.length} tasks</span>
            </div>
            <div className="space-y-2.5">
              {assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="ios-card p-4 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-md shadow-orange-500/20 flex-shrink-0">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[15px] font-semibold text-slate-900">
                        {assignment.title}
                      </h3>
                      <p className="text-[13px] text-slate-500 mt-0.5">
                        From <span className="font-medium text-slate-600">{assignment.assignedByName}</span>
                      </p>
                      {assignment.dueTime && (
                        <div className="flex items-center gap-1.5 mt-2">
                          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${getAssignmentStatusColor(assignment.status)}`}>
                            {getAssignmentStatusLabel(assignment.status)}
                          </span>
                          <span className="text-[12px] text-slate-400">• Due {assignment.dueTime}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                    {/* Show feedback message if active */}
                    {actionFeedback?.id === assignment.id ? (
                      <div className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl ${
                        actionFeedback.type === 'success' 
                          ? 'bg-emerald-50 text-emerald-600' 
                          : 'bg-slate-100 text-slate-600'
                      } text-[13px] font-semibold`}>
                        {actionFeedback.type === 'success' && <CheckCircle className="w-4 h-4" />}
                        {actionFeedback.message}
                      </div>
                    ) : (
                      <>
                        {assignment.status === "pending" && (
                          <>
                            <button
                              onClick={() => acceptAssignment(assignment.id)}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-50 text-emerald-600 text-[13px] font-semibold hover:bg-emerald-100 transition-colors"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              Accept & Add to Plan
                            </button>
                            <button
                              onClick={() => declineAssignment(assignment.id)}
                              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 text-slate-500 text-[13px] font-semibold hover:bg-red-50 hover:text-red-500 transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                              Decline
                            </button>
                          </>
                        )}
                        {assignment.status === "accepted" && (
                          <>
                            <button
                              onClick={() => completeAssignment(assignment.id)}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-50 text-emerald-600 text-[13px] font-semibold hover:bg-emerald-100 transition-colors"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              Mark Complete
                            </button>
                            <button
                              onClick={() => viewAssignmentInPlan(assignment.id)}
                              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-blue-50 text-blue-600 text-[13px] font-semibold hover:bg-blue-100 transition-colors"
                            >
                              <Calendar className="w-3.5 h-3.5" />
                              View in Plan
                            </button>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
>>>>>>> origin/main
          </div>
        )}
      </div>

<<<<<<< HEAD
      <div className="px-4 space-y-3">
        {/* Assignments Section */}
        {(activeTab === "all" || activeTab === "assignments") && (
          <>
            {activeTab === "all" ? (
              // Show only pending assignments in "All" tab
              assignments.filter(a => a.status === "pending").length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-[13px] font-semibold text-slate-500 uppercase tracking-wide px-1">
                    Assignments
                  </h2>
                  {assignments.filter(a => a.status === "pending").map((assignment) => (
                    <AssignmentCard
                      key={assignment.id}
                      assignment={assignment}
                      onAccept={handleAccept}
                      onCant={handleCant}
                      onOpen={handleOpenAssignment}
                      onReconsider={handleReconsider}
                    />
                  ))}
                </div>
              )
            ) : (
              // Show filtered assignments in "Assignments" tab
              <>
                {filteredAssignments.length === 0 ? (
                  <div className="ios-card p-8 flex flex-col items-center justify-center text-center shadow-sm">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                      <Clock className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-[17px] font-semibold text-slate-900 mb-1">
                      No {assignmentFilter} assignments
                    </h3>
                    <p className="text-[14px] text-slate-500 max-w-[220px]">
                      {assignmentFilter === "pending" 
                        ? "New assignments will appear here" 
                        : assignmentFilter === "accepted"
                        ? "Assignments you accept will appear here"
                        : "Assignments you decline will appear here"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredAssignments.map((assignment) => (
                      <AssignmentCard
                        key={assignment.id}
                        assignment={assignment}
                        onAccept={handleAccept}
                        onCant={handleCant}
                        onOpen={handleOpenAssignment}
                        onReconsider={handleReconsider}
                      />
                    ))}
                  </div>
                )}

                {/* Show "View declined" link when on Pending filter and there are declined items */}
                {assignmentFilter === "pending" && declinedCount > 0 && (
                  <button
                    onClick={() => setAssignmentFilter("declined")}
                    className="w-full text-center py-3 text-[13px] text-slate-500 hover:text-slate-700"
                  >
                    View declined ({declinedCount})
                  </button>
                )}
              </>
            )}
          </>
        )}

        {/* Other Items Section (Reminders, Invites, Messages) */}
        {(activeTab === "all" || activeTab === "reminders" || activeTab === "invites") && (
          <>
            {activeTab === "all" && filteredItems.length > 0 && (
              <h2 className="text-[13px] font-semibold text-slate-500 uppercase tracking-wide px-1 mt-4">
                Notifications
              </h2>
            )}
            
            {filteredItems.length === 0 && activeTab !== "all" && activeTab !== "assignments" ? (
              <div className="ios-card p-8 flex flex-col items-center justify-center text-center shadow-sm">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-[17px] font-semibold text-slate-900 mb-1">
                  All caught up
                </h3>
                <p className="text-[14px] text-slate-500 max-w-[220px]">
                  New {activeTab} will appear here
                </p>
              </div>
            ) : (
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={`ios-card p-4 shadow-sm ${item.isNew ? "ring-2 ring-purple-500/20" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-11 h-11 rounded-2xl ${iconBgFor(item.type)} flex items-center justify-center flex-shrink-0`}>
                      {iconFor(item.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-[15px] font-semibold text-slate-900 truncate">
                              {item.title}
                            </h3>
                            {item.isNew && (
                              <div className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-[13px] text-slate-500 mt-0.5">
                            {item.subtitle}
                          </p>
                        </div>
                        <span className="text-[11px] text-slate-400 flex-shrink-0">{item.time}</span>
                      </div>

                      <div className="flex items-center gap-2 mt-3">
                        {item.type === "invite" && (
                          <>
                            <button
                              onClick={() => handleJoin(item.id)}
                              className="flex items-center gap-1.5 px-4 py-2 bg-purple-500 text-white rounded-full text-[13px] font-semibold active:scale-95 transition-transform"
                            >
                              <Users className="w-4 h-4" />
                              Join
                            </button>
                            <button
                              onClick={() => handleDeclineInvite(item.id)}
                              className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 text-slate-600 rounded-full text-[13px] font-semibold active:scale-95 transition-transform"
                            >
                              Decline
                            </button>
                          </>
                        )}

                        {item.type === "reminder" && (
                          <>
                            <button
                              onClick={() => handleOpen(item.id)}
                              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-white rounded-full text-[13px] font-semibold active:scale-95 transition-transform"
                            >
                              <ExternalLink className="w-4 h-4" />
                              Open
                            </button>
                            <button
                              onClick={() => handleSnooze(item.id)}
                              className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 text-slate-600 rounded-full text-[13px] font-semibold active:scale-95 transition-transform"
                            >
                              <AlarmClock className="w-4 h-4" />
                              Snooze
                            </button>
                          </>
                        )}

                        {item.type === "message" && (
                          <>
                            <button
                              onClick={() => handleOpen(item.id)}
                              className="flex items-center gap-1.5 px-4 py-2 bg-blue-500 text-white rounded-full text-[13px] font-semibold active:scale-95 transition-transform"
                            >
                              <ExternalLink className="w-4 h-4" />
                              Open
                            </button>
                            <button
                              onClick={() => handleDismiss(item.id)}
                              className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 text-slate-600 rounded-full text-[13px] font-semibold active:scale-95 transition-transform"
                            >
                              Dismiss
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
=======
        {/* Regular Inbox Items */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-[13px] font-semibold text-slate-500 uppercase tracking-wide">
              Activity
            </h2>
            <span className="text-[12px] text-slate-400">{filtered.length} items</span>
          </div>
          
          {filtered.length === 0 ? (
            <div className="ios-card p-8 flex flex-col items-center justify-center text-center shadow-sm">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center mb-4 shadow-inner">
                <span className="text-4xl">✨</span>
              </div>
              <h3 className="text-[18px] font-bold text-slate-900 mb-2">
                All caught up!
              </h3>
              <p className="text-[14px] text-slate-500 max-w-[240px] leading-relaxed">
                Great job staying on top of things. New messages and updates will appear here.
              </p>
              <div className="mt-4 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100">
                <p className="text-[12px] text-emerald-600 font-medium flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  +10 XP for staying organized
                </p>
              </div>
              {/* Navigation shortcuts when inbox is empty */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => onNavigate?.("plan")}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 text-blue-600 text-[13px] font-semibold hover:bg-blue-100 transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  View Plan
                </button>
                <button
                  onClick={() => onNavigate?.("circles")}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-50 text-purple-600 text-[13px] font-semibold hover:bg-purple-100 transition-colors"
                >
                  <Users className="w-4 h-4" />
                  Circles
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filtered.map((it, index) => (
                <div
                  key={it.id}
                  className={`ios-card p-4 shadow-sm slide-in ${it.isNew ? "ring-2 ring-purple-200 ring-offset-1" : ""}`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-11 h-11 rounded-2xl ${iconBgFor(it.type)} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                      {iconFor(it.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-[15px] font-semibold text-slate-900">
                            {it.title}
                          </h3>
                          {it.subtitle && (
                            <p className="text-[13px] text-slate-500 mt-0.5 truncate">
                              {it.subtitle}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {it.isNew && (
                            <div className="w-2 h-2 rounded-full bg-purple-500" />
                          )}
                          <span className="text-[12px] text-slate-400">{it.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contextual Action Buttons */}
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                    {/* Show feedback if active for this item */}
                    {actionFeedback?.id === it.id ? (
                      <div className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl ${
                        actionFeedback.type === 'success' 
                          ? 'bg-emerald-50 text-emerald-600' 
                          : 'bg-slate-100 text-slate-600'
                      } text-[13px] font-semibold`}>
                        {actionFeedback.type === 'success' && <CheckCircle className="w-4 h-4" />}
                        {actionFeedback.message}
                      </div>
                    ) : (
                      <>
                        {it.type === "message" && (
                          <>
                            <button
                              onClick={() => handleMessageReply(it.id)}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-blue-50 text-blue-600 text-[13px] font-semibold hover:bg-blue-100 transition-colors"
                            >
                              <Reply className="w-3.5 h-3.5" />
                              Reply
                            </button>
                            {it.isNew && (
                              <button
                                onClick={() => markRead(it.id)}
                                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 text-slate-600 text-[13px] font-semibold hover:bg-slate-200 transition-colors"
                              >
                                <CheckCheck className="w-3.5 h-3.5" />
                                Read
                              </button>
                            )}
                            <button
                              onClick={() => handleMessageArchive(it.id)}
                              className="flex items-center justify-center p-2.5 rounded-xl bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}

                        {it.type === "reminder" && (
                          <>
                            <button
                              onClick={() => handleReminderDone(it.id)}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-50 text-emerald-600 text-[13px] font-semibold hover:bg-emerald-100 transition-colors"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              Done
                            </button>
                            <button
                              onClick={() => snoozeItem(it.id)}
                              disabled={snoozedItems.has(it.id)}
                              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-[13px] font-semibold transition-colors ${
                                snoozedItems.has(it.id)
                                  ? "bg-amber-100 text-amber-600"
                                  : "bg-amber-50 text-amber-600 hover:bg-amber-100"
                              }`}
                            >
                              <AlarmClock className="w-3.5 h-3.5" />
                              {snoozedItems.has(it.id) ? "Snoozed" : "Snooze 1h"}
                            </button>
                            <button
                              onClick={() => {
                                showFeedback(it.id, "Dismissed", 'info');
                                setTimeout(() => remove(it.id), 600);
                              }}
                              className="flex items-center justify-center p-2.5 rounded-xl bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}

                        {it.type === "invite" && (
                          <>
                            <button
                              onClick={() => acceptInvite(it.id)}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-purple-50 text-purple-600 text-[13px] font-semibold hover:bg-purple-100 transition-colors"
                            >
                              <UserPlus className="w-3.5 h-3.5" />
                              Join Circle
                            </button>
                            <button
                              onClick={() => {
                                markRead(it.id);
                                onNavigate?.("circles");
                              }}
                              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 text-slate-600 text-[13px] font-semibold hover:bg-slate-200 transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              View
                            </button>
                            <button
                              onClick={() => declineInvite(it.id)}
                              className="flex items-center justify-center p-2.5 rounded-xl bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}

                        {it.type === "social" && (
                          <>
                            <button
                              onClick={() => handleSocialView(it.id)}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-pink-50 text-pink-600 text-[13px] font-semibold hover:bg-pink-100 transition-colors"
                            >
                              <Heart className="w-3.5 h-3.5" />
                              View Activity
                            </button>
                            {it.isNew && (
                              <button
                                onClick={() => markRead(it.id)}
                                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 text-slate-600 text-[13px] font-semibold hover:bg-slate-200 transition-colors"
                              >
                                <CheckCheck className="w-3.5 h-3.5" />
                                Read
                              </button>
                            )}
                            <button
                              onClick={() => {
                                showFeedback(it.id, "Archived", 'info');
                                setTimeout(() => remove(it.id), 600);
                              }}
                              className="flex items-center justify-center p-2.5 rounded-xl bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </>
                    )}
                  </div>
>>>>>>> origin/main
                </div>
              ))
            )}
          </>
        )}

        {/* Empty state for All tab */}
        {activeTab === "all" && 
         assignments.filter(a => a.status === "pending").length === 0 && 
         filteredItems.length === 0 && (
          <div className="ios-card p-8 flex flex-col items-center justify-center text-center shadow-sm">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-[17px] font-semibold text-slate-900 mb-1">
              You're all caught up
            </h3>
            <p className="text-[14px] text-slate-500 max-w-[220px]">
              New assignments, reminders, and invites will appear here
            </p>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-32 left-4 right-4 z-[100] flex justify-center pointer-events-none">
          <div className="bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 pointer-events-auto max-w-[340px]">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              toast.icon === "check" ? "bg-emerald-500" : "bg-red-500"
            }`}>
              {toast.icon === "check" ? (
                <Check className="w-4 h-4 text-white" />
              ) : (
                <X className="w-4 h-4 text-white" />
              )}
            </div>
            <span className="text-[14px] font-medium flex-1">{toast.message}</span>
            <button
              onClick={toast.undoAction}
              className="text-[14px] font-semibold text-purple-400 hover:text-purple-300 transition-colors"
            >
              Undo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Assignment Card Component
interface AssignmentCardProps {
  assignment: Assignment;
  onAccept: (id: number) => void;
  onCant: (id: number) => void;
  onOpen: (id: number) => void;
  onReconsider: (id: number) => void;
}

function AssignmentCard({ assignment, onAccept, onCant, onOpen, onReconsider }: AssignmentCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className={`ios-card p-4 shadow-sm ${assignment.unread ? "ring-2 ring-purple-500/20" : ""}`}>
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="w-11 h-11 rounded-2xl bg-orange-100 flex items-center justify-center flex-shrink-0">
          <Clock className="w-5 h-5 text-orange-600" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-[15px] font-semibold text-slate-900 truncate">
                  {assignment.title}
                </h3>
                {assignment.unread && (
                  <div className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0" />
                )}
              </div>
              <p className="text-[13px] text-slate-500 mt-0.5">
                Circle: {assignment.circleName}
              </p>
              <p className="text-[12px] text-slate-400 mt-1">
                From <span className="font-medium text-slate-500">{assignment.fromUser}</span>
                <span> · Due {assignment.dueTime}</span>
              </p>
            </div>
            <span className="text-[11px] text-slate-400 flex-shrink-0">{assignment.createdAt}</span>
          </div>

          {/* Actions based on status */}
          <div className="flex items-center gap-2 mt-3">
            {assignment.status === "pending" && (
              <>
                <button
                  onClick={() => onAccept(assignment.id)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 text-white rounded-full text-[13px] font-semibold active:scale-95 transition-transform"
                >
                  <Check className="w-4 h-4" />
                  Accept
                </button>
                <button
                  onClick={() => onCant(assignment.id)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 text-slate-600 rounded-full text-[13px] font-semibold active:scale-95 transition-transform"
                >
                  <X className="w-4 h-4" />
                  Can't
                </button>
              </>
            )}

            {assignment.status === "accepted" && (
              <>
                <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-[12px] font-semibold">
                  Accepted
                </span>
                <button
                  onClick={() => onOpen(assignment.id)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 text-slate-600 rounded-full text-[13px] font-semibold active:scale-95 transition-transform"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open
                </button>
                <div className="relative ml-auto">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-2 rounded-full hover:bg-slate-100 text-slate-400"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                  {showMenu && (
                    <div className="absolute right-0 top-10 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 min-w-[160px] overflow-hidden">
                      <button
                        onClick={() => {
                          onReconsider(assignment.id);
                          setShowMenu(false);
                        }}
                        className="flex items-center gap-2 w-full text-left px-4 py-3 text-[14px] font-medium text-slate-700 hover:bg-slate-50"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Move to Pending
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {assignment.status === "declined" && (
              <>
                <span className="px-3 py-1.5 bg-red-100 text-red-700 rounded-full text-[12px] font-semibold">
                  Declined
                </span>
                <button
                  onClick={() => onReconsider(assignment.id)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 text-slate-600 rounded-full text-[13px] font-semibold active:scale-95 transition-transform"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reconsider
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}