import {
  CheckCircle,
  MessageSquare,
  Bell,
  Users,
  Clock,
  Check,
  X,
  AlarmClock,
  ExternalLink,
  MoreHorizontal,
  RotateCcw,
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
  id: number;
  title: string;
  circleName: string;
  fromUser: string;
  dueTime: string;
  createdAt: string;
  status: AssignmentStatus;
  unread: boolean;
}

// Other inbox items
interface InboxItem {
  id: number;
  type: "reminder" | "invite" | "message";
  title: string;
  subtitle: string;
  from?: string;
  time: string;
  isNew: boolean;
}

// Toast state
interface Toast {
  id: number;
  message: string;
  icon: "check" | "x";
  undoAction: () => void;
}

export function InboxScreen({ onNavigate }: InboxScreenProps) {
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [assignmentFilter, setAssignmentFilter] = useState<AssignmentStatus>("pending");
  const [toast, setToast] = useState<Toast | null>(null);
  
  // Assignments with full data model
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: 1,
      title: "Review Q1 metrics",
      circleName: "Work Team",
      fromUser: "Alex",
      dueTime: "2:00 PM",
      createdAt: "5m ago",
      status: "pending",
      unread: true,
    },
    {
      id: 2,
      title: "Grocery run",
      circleName: "Family",
      fromUser: "Blake",
      dueTime: "6:00 PM",
      createdAt: "15m ago",
      status: "pending",
      unread: true,
    },
    {
      id: 3,
      title: "Book team dinner",
      circleName: "Work Team",
      fromUser: "Jordan",
      dueTime: "Tomorrow",
      createdAt: "1h ago",
      status: "accepted",
      unread: false,
    },
  ]);

  // Other inbox items (reminders, invites, messages)
  const [items, setItems] = useState<InboxItem[]>([
    {
      id: 101,
      type: "reminder",
      title: "Take medication",
      subtitle: "Daily at 8:00 AM",
      time: "1h ago",
      isNew: false,
    },
    {
      id: 102,
      type: "invite",
      title: "Dev Team",
      subtitle: "Alex invited you to join",
      from: "Alex",
      time: "2h ago",
      isNew: true,
    },
    {
      id: 103,
      type: "message",
      title: "Message from Alice",
      subtitle: "Can we reschedule our call to Thursday?",
      from: "Alice",
      time: "3h ago",
      isNew: true,
    },
  ]);

  // Auto-dismiss toast after 5 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Handle Accept assignment
  const handleAccept = (id: number) => {
    const assignment = assignments.find(a => a.id === id);
    if (!assignment) return;

    // Store previous state for undo
    const previousStatus = assignment.status;
    
    // Update status
    setAssignments(assignments.map(a => 
      a.id === id ? { ...a, status: "accepted", unread: false } : a
    ));

    // Show toast with undo
    setToast({
      id: Date.now(),
      message: `Accepted "${assignment.title}"`,
      icon: "check",
      undoAction: () => {
        setAssignments(prev => prev.map(a => 
          a.id === id ? { ...a, status: previousStatus, unread: true } : a
        ));
        setToast(null);
      }
    });
  };

  // Handle Can't (decline) assignment
  const handleCant = (id: number) => {
    const assignment = assignments.find(a => a.id === id);
    if (!assignment) return;

    const previousStatus = assignment.status;
    
    setAssignments(assignments.map(a => 
      a.id === id ? { ...a, status: "declined", unread: false } : a
    ));

    setToast({
      id: Date.now(),
      message: `Marked Can't`,
      icon: "x",
      undoAction: () => {
        setAssignments(prev => prev.map(a => 
          a.id === id ? { ...a, status: previousStatus, unread: true } : a
        ));
        setToast(null);
      }
    });
  };

  // Handle Reconsider (move back to pending)
  const handleReconsider = (id: number) => {
    setAssignments(assignments.map(a => 
      a.id === id ? { ...a, status: "pending", unread: true } : a
    ));
  };

  // Handle Open assignment
  const handleOpenAssignment = (id: number) => {
    setAssignments(assignments.map(a => 
      a.id === id ? { ...a, unread: false } : a
    ));
    // In real app: navigate to circle task detail
  };

  // Other item handlers
  const handleJoin = (id: number) => {
    setItems(items.filter((it) => it.id !== id));
  };

  const handleDeclineInvite = (id: number) => {
    setItems(items.filter((it) => it.id !== id));
  };

  const handleOpen = (id: number) => {
    setItems(items.map((it) => (it.id === id ? { ...it, isNew: false } : it)));
  };

  const handleSnooze = (id: number) => {
    setItems(items.filter((it) => it.id !== id));
  };

  const handleDismiss = (id: number) => {
    setItems(items.filter((it) => it.id !== id));
  };

  // Filter assignments by status
  const filteredAssignments = assignments.filter(a => a.status === assignmentFilter);
  const declinedCount = assignments.filter(a => a.status === "declined").length;

  // Filter other items by tab
  const filteredItems = items.filter((it) =>
    activeTab === "all"
      ? true
      : activeTab === "reminders"
      ? it.type === "reminder"
      : activeTab === "invites"
      ? it.type === "invite"
      : false
  );

  // Count for "X new" badge - only pending assignments + new invites + new reminders
  const pendingAssignmentCount = assignments.filter(a => a.status === "pending").length;
  const newItemsCount = items.filter(i => i.isNew).length;
  const newCount = pendingAssignmentCount + newItemsCount;

  const iconFor = (type: InboxItem["type"]) => {
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
    <div className="min-h-screen bg-[#F2F2F7] pb-28 relative">
      <IOSStatusBar />

      <style>{`
        .ios-card {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 16px;
        }
      `}</style>

      {/* Header */}
      <div className="px-5 pt-2 pb-4">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">Inbox</h1>
            <p className="text-[13px] text-slate-500 mt-0.5">Incoming items needing your attention</p>
          </div>
          {newCount > 0 && (
            <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-[12px] font-semibold text-red-600">{newCount} new</span>
            </div>
          )}
        </div>

        {/* Main Filter Tabs */}
        <div className="flex gap-2 mt-3">
          {(["all", "assignments", "reminders", "invites"] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-all ${
                activeTab === tab
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-600 shadow-sm"
              }`}
            >
              {tab === "all" ? "All" : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

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
          </div>
        )}
      </div>

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