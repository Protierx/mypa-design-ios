import { Calendar, Inbox, Trophy, Clock, CheckCircle2, Wallet, Sparkles, ChevronRight, Bell, Zap, Sun, Moon, CloudSun, Target, ArrowRight, MessageCircle, Check, Flame, X, Volume2 } from "lucide-react";
import { IOSStatusBar } from "../components/IOSStatusBar";
import { useState, useEffect, useRef } from "react";
import "../../styles/cards.css";

interface HubScreenProps {
  onNavigate?: (screen: string) => void;
  onVoiceClick?: () => void;
}

export function HubScreen({ onNavigate, onVoiceClick }: HubScreenProps) {
  const [greeting, setGreeting] = useState({ text: '', icon: Sun, period: 'day' });
  const [completedPriorities, setCompletedPriorities] = useState<number[]>([]);
  const [showBriefing, setShowBriefing] = useState(false);
  const [briefingStep, setBriefingStep] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const briefingTimer = useRef<NodeJS.Timeout | null>(null);

  // Daily briefing content
  const briefingItems = [
    { icon: '👋', text: `${greeting.text}, Alex! Here's your day at a glance.`, delay: 2000 },
    { icon: '📋', text: `You have ${7 - 4} tasks remaining today. 2 are marked as priority.`, delay: 2500 },
    { icon: '🏋️', text: 'Reminder: Gym session at 6:00 PM today.', delay: 2000 },
    { icon: '🔥', text: `Amazing! You're on a 7-day streak. Keep it going!`, delay: 2000 },
    { icon: '⚡', text: `You've saved 42 minutes this week. That's 67% more efficient!`, delay: 2500 },
    { icon: '✨', text: 'Ready to make today great? Let\'s do this!', delay: 2000 },
  ];

  // Dynamic greeting based on time
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting({ text: 'Good morning', icon: Sun, period: 'morning' });
    } else if (hour < 17) {
      setGreeting({ text: 'Good afternoon', icon: CloudSun, period: 'afternoon' });
    } else {
      setGreeting({ text: 'Good evening', icon: Moon, period: 'evening' });
    }
  }, []);

  // Start briefing animation
  const startBriefing = () => {
    setShowBriefing(true);
    setBriefingStep(0);
    setIsSpeaking(true);
    playBriefingSequence(0);
  };

  const playBriefingSequence = (step: number) => {
    if (step >= briefingItems.length) {
      setIsSpeaking(false);
      return;
    }
    setBriefingStep(step);
    setIsSpeaking(true);
    briefingTimer.current = setTimeout(() => {
      playBriefingSequence(step + 1);
    }, briefingItems[step].delay);
  };

  const closeBriefing = () => {
    setShowBriefing(false);
    setBriefingStep(0);
    setIsSpeaking(false);
    if (briefingTimer.current) {
      clearTimeout(briefingTimer.current);
    }
  };

  // Today's data
  const today = {
    date: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
    userName: 'Alex',
    streak: 7,
    level: 12,
    xp: 2460,
    xpToNext: 340,
    tasksCompleted: 4,
    totalTasks: 7,
    timeSaved: 42,
    focusMinutes: 180,
    mood: 'great',
  };

  // Priority items for today
  const priorityItems = [
    { id: 1, type: 'event', title: 'Gym Session', time: '6:00 PM', icon: '🏋️', urgent: true },
    { id: 2, type: 'task', title: 'Review Q1 metrics', time: 'By 5 PM', icon: '📊', urgent: true },
    { id: 3, type: 'reminder', title: 'Call Mom', time: 'Evening', icon: '📞', urgent: false },
  ];

  // Insights/nudges from MYPA
  const insight = {
    message: "You're crushing it! 67% more productive than last week.",
    type: 'positive',
  };

  const GreetingIcon = greeting.icon;

  return (
    <div className="min-h-screen bg-ios-bg pb-24 relative overflow-hidden">
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
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .fade-in { animation: fadeIn 0.2s ease-out forwards; }
        @keyframes orbPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.4); }
          50% { transform: scale(1.05); box-shadow: 0 0 20px 10px rgba(139, 92, 246, 0.2); }
        }
        .orb-pulse { animation: orbPulse 2s ease-in-out infinite; }
        @keyframes orbSpeak {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.1); }
          50% { transform: scale(0.95); }
          75% { transform: scale(1.08); }
        }
        .orb-speaking { animation: orbSpeak 0.6s ease-in-out infinite; }
        @keyframes waveform {
          0%, 100% { height: 8px; }
          50% { height: 20px; }
        }
        .wave-bar { animation: waveform 0.5s ease-in-out infinite; }
        @keyframes typeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .type-in { animation: typeIn 0.4s ease-out forwards; }
      `}</style>
      
      {/* Header Section */}
      <div className="relative px-5 pt-2 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <GreetingIcon className="w-4 h-4 text-amber-500" />
              <span className="text-[13px] text-slate-500 font-medium">{greeting.text}</span>
            </div>
            <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">{today.userName}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate?.('profile')}
              className="relative w-11 h-11 rounded-2xl ios-glass shadow-sm flex items-center justify-center active:scale-95 transition-transform"
            >
              <Bell className="w-5 h-5 text-slate-600" />
              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <button
              onClick={() => onNavigate?.('profile')}
              className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg active:scale-95 transition-transform"
            >
              <span className="text-[16px] font-bold text-white">{today.userName[0]}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-3">
        
        {/* Daily Briefing Orb Card */}
        <button
          onClick={startBriefing}
          className="w-full ios-glass rounded-2xl p-4 shadow-sm flex items-center gap-4 active:scale-[0.98] transition-transform"
        >
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 flex items-center justify-center shadow-lg orb-pulse">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
              <Volume2 className="w-3 h-3 text-white" />
            </div>
          </div>
          <div className="flex-1 text-left">
            <p className="text-[16px] font-semibold text-slate-900">Daily Briefing</p>
            <p className="text-[13px] text-slate-500">Tap to hear your day summary</p>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1 h-3 bg-violet-400 rounded-full" />
            <div className="w-1 h-5 bg-violet-500 rounded-full" />
            <div className="w-1 h-4 bg-violet-400 rounded-full" />
          </div>
        </button>
        
        {/* Compact Progress Card */}
        <div className="ios-glass rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            {/* Progress Ring & Stats */}
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14">
                <svg className="w-14 h-14 transform -rotate-90">
                  <circle cx="28" cy="28" r="24" stroke="#e2e8f0" strokeWidth="4" fill="none" />
                  <circle
                    cx="28" cy="28" r="24"
                    stroke="#10b981"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 24 * (today.tasksCompleted / today.totalTasks)} ${2 * Math.PI * 24}`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[14px] font-bold text-slate-900">{Math.round((today.tasksCompleted / today.totalTasks) * 100)}%</span>
                </div>
              </div>
              <div>
                <p className="text-[18px] font-bold text-slate-900">{today.tasksCompleted} of {today.totalTasks}</p>
                <p className="text-[13px] text-slate-500">tasks done today</p>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-orange-100">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-[14px] font-bold text-orange-600">{today.streak}</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-violet-100">
                <Zap className="w-4 h-4 text-violet-500" />
                <span className="text-[14px] font-bold text-violet-600">{today.level}</span>
              </div>
            </div>
          </div>
          
          {/* XP Progress */}
          <div className="mt-3 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[12px] text-slate-500">Level {today.level} Progress</span>
              <span className="text-[12px] font-medium text-violet-600">{today.xpToNext} XP to next</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all"
                style={{ width: `${((today.xp % 500) / 500) * 100}%` }}
              />
            </div>
          </div>
        </div>
        
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2">
          <div className="ios-glass rounded-xl p-3 text-center shadow-sm">
            <Clock className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
            <p className="text-[16px] font-bold text-slate-900">+{today.timeSaved}m</p>
            <p className="text-[10px] text-slate-500">Saved</p>
          </div>
          <div className="ios-glass rounded-xl p-3 text-center shadow-sm">
            <Target className="w-4 h-4 text-blue-500 mx-auto mb-1" />
            <p className="text-[16px] font-bold text-slate-900">{today.focusMinutes}m</p>
            <p className="text-[10px] text-slate-500">Focus</p>
          </div>
          <div className="ios-glass rounded-xl p-3 text-center shadow-sm">
            <Trophy className="w-4 h-4 text-amber-500 mx-auto mb-1" />
            <p className="text-[16px] font-bold text-slate-900">#3</p>
            <p className="text-[10px] text-slate-500">Rank</p>
          </div>
        </div>

        {/* Priority Focus Section */}
        <div>
          <div className="flex items-center justify-between px-1 mb-2">
            <h3 className="text-[15px] font-semibold text-slate-900">Priority Focus</h3>
            <button 
              onClick={() => onNavigate?.('plan')}
              className="text-[13px] font-medium text-violet-600 flex items-center gap-0.5"
            >
              All tasks <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-2">
            {priorityItems.map((item, index) => {
              const isCompleted = completedPriorities.includes(item.id);
              return (
                <div
                  key={item.id}
                  className={`ios-glass rounded-2xl shadow-sm overflow-hidden slide-up ${isCompleted ? 'opacity-50' : ''}`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="p-3 flex items-center gap-3">
                    {/* Check Button */}
                    <button
                      onClick={() => {
                        if (isCompleted) {
                          setCompletedPriorities(prev => prev.filter(id => id !== item.id));
                        } else {
                          setCompletedPriorities(prev => [...prev, item.id]);
                        }
                      }}
                      className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        isCompleted 
                          ? 'bg-emerald-500 border-emerald-500' 
                          : 'border-slate-300'
                      }`}
                    >
                      {isCompleted && <Check className="w-4 h-4 text-white" />}
                    </button>
                    
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${
                      item.urgent && !isCompleted
                        ? 'bg-rose-100' 
                        : 'bg-slate-100'
                    }`}>
                      {item.icon}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-[15px] font-medium ${isCompleted ? 'line-through text-slate-400' : 'text-slate-900'}`}>{item.title}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] text-slate-500">{item.time}</span>
                        {item.urgent && !isCompleted && (
                          <span className="text-[9px] font-bold text-rose-600 bg-rose-100 px-1.5 py-0.5 rounded">PRIORITY</span>
                        )}
                      </div>
                    </div>
                    
                    {/* Navigate */}
                    <button
                      onClick={() => onNavigate?.('plan')}
                      className="p-2 -mr-1 rounded-xl active:bg-slate-100 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 text-slate-300" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div>
          <h3 className="text-[15px] font-semibold text-slate-900 px-1 mb-2">Quick Actions</h3>
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => onNavigate?.('plan')}
              className="ios-glass rounded-2xl p-3 text-center shadow-sm active:scale-95 transition-transform"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center mx-auto mb-1.5">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <p className="text-[11px] font-medium text-slate-700">Plan</p>
            </button>

            <button
              onClick={() => onNavigate?.('inbox')}
              className="ios-glass rounded-2xl p-3 text-center shadow-sm active:scale-95 transition-transform relative"
            >
              <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-[9px] font-bold text-white">2</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-violet-500 flex items-center justify-center mx-auto mb-1.5">
                <Inbox className="w-5 h-5 text-white" />
              </div>
              <p className="text-[11px] font-medium text-slate-700">Inbox</p>
            </button>

            <button
              onClick={() => onNavigate?.('challenges')}
              className="ios-glass rounded-2xl p-3 text-center shadow-sm active:scale-95 transition-transform"
            >
              <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center mx-auto mb-1.5">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <p className="text-[11px] font-medium text-slate-700">Challenges</p>
            </button>

            <button
              onClick={() => onNavigate?.('wallet')}
              className="ios-glass rounded-2xl p-3 text-center shadow-sm active:scale-95 transition-transform"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center mx-auto mb-1.5">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <p className="text-[11px] font-medium text-slate-700">Wallet</p>
            </button>
          </div>
        </div>

        {/* Secondary Actions */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onNavigate?.('sort')}
            className="ios-glass rounded-2xl p-3.5 shadow-sm flex items-center gap-3 active:scale-[0.98] transition-transform"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div className="text-left flex-1">
              <p className="text-[14px] font-semibold text-slate-900">Sort Tasks</p>
              <p className="text-[11px] text-slate-500">6 pending</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate?.('daily-life-card')}
            className="ios-glass rounded-2xl p-3.5 shadow-sm flex items-center gap-3 active:scale-[0.98] transition-transform relative overflow-hidden"
          >
            <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-md bg-violet-500">
              <span className="text-[9px] font-bold text-white">+50 XP</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-500 flex items-center justify-center">
              <span className="text-[18px]">📤</span>
            </div>
            <div className="text-left flex-1">
              <p className="text-[14px] font-semibold text-slate-900">Share Day</p>
              <p className="text-[11px] text-slate-500">To circles</p>
            </div>
          </button>
        </div>

        {/* Talk to MYPA */}
        <button
          onClick={() => onVoiceClick?.()}
          className="w-full ios-glass rounded-2xl p-4 shadow-sm flex items-center gap-3 active:scale-[0.98] transition-transform"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-[15px] font-semibold text-slate-900">Talk to MYPA</p>
            <p className="text-[12px] text-slate-500">Ask anything or get help</p>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400" />
        </button>

        {/* Reset Day */}
        <button
          onClick={() => onNavigate?.('reset')}
          className="w-full py-2 text-center"
        >
          <span className="text-[13px] text-slate-500">Overwhelmed? <span className="text-violet-600 font-medium">Reset day</span></span>
        </button>
      </div>

      {/* Daily Briefing Overlay */}
      {showBriefing && (
        <div className="fixed inset-0 z-[9999] flex flex-col">
          {/* Dark gradient background */}
          <div 
            className="absolute inset-0 fade-in"
            style={{
              background: 'radial-gradient(ellipse at 50% 30%, #1e1b4b 0%, #0f0a1e 40%, #030014 100%)'
            }}
          />
          
          {/* Close button */}
          <button
            onClick={closeBriefing}
            className="absolute top-14 right-5 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center active:scale-95 transition-transform"
          >
            <X className="w-5 h-5 text-white/80" />
          </button>
          
          {/* Main content */}
          <div className="relative flex-1 flex flex-col items-center justify-center px-6">
            
            {/* Speaking Orb */}
            <div className="relative mb-8">
              {/* Outer glow rings */}
              <div className={`absolute inset-0 rounded-full bg-violet-500/20 ${isSpeaking ? 'animate-ping' : ''}`} style={{ animationDuration: '1.5s' }} />
              <div className={`absolute -inset-4 rounded-full bg-violet-500/10 ${isSpeaking ? 'animate-pulse' : ''}`} />
              
              {/* Main orb */}
              <div className={`relative w-32 h-32 rounded-full bg-gradient-to-br from-violet-400 via-purple-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-violet-500/50 ${isSpeaking ? 'orb-speaking' : 'orb-pulse'}`}>
                {/* Inner glow */}
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/30 to-transparent" />
                
                {/* Waveform bars when speaking */}
                {isSpeaking ? (
                  <div className="flex items-center gap-1">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-2 bg-white rounded-full wave-bar"
                        style={{ 
                          animationDelay: `${i * 0.1}s`,
                          height: '12px'
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <Sparkles className="w-14 h-14 text-white" />
                )}
              </div>
            </div>
            
            {/* MYPA Label */}
            <p className="text-violet-300 text-[14px] font-semibold uppercase tracking-widest mb-6">MYPA</p>
            
            {/* Briefing Messages */}
            <div className="w-full max-w-sm min-h-[120px] flex flex-col items-center justify-center">
              {briefingItems.slice(0, briefingStep + 1).map((item, index) => (
                <div
                  key={index}
                  className={`w-full bg-white/10 backdrop-blur-md rounded-2xl p-4 mb-3 type-in ${index === briefingStep ? 'border border-violet-400/30' : 'opacity-50'}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-[24px]">{item.icon}</span>
                    <p className="text-white text-[15px] font-medium leading-relaxed flex-1">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Progress dots */}
            <div className="flex items-center gap-2 mt-4">
              {briefingItems.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index <= briefingStep 
                      ? 'bg-violet-400 w-3' 
                      : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>
          
          {/* Bottom action */}
          <div className="relative p-6 pb-10">
            <button
              onClick={closeBriefing}
              className="w-full py-4 rounded-2xl bg-white text-slate-900 text-[16px] font-semibold active:scale-[0.98] transition-transform"
            >
              {briefingStep >= briefingItems.length - 1 ? "Let's go!" : 'Skip briefing'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
