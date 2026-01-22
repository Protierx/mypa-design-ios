import { Calendar, Inbox, Trophy, Clock, CheckCircle2, Wallet, Sparkles, ChevronRight, Zap, Sun, Moon, CloudSun, Target, ArrowRight, MessageCircle, Check, Flame, X, Volume2, Award, TrendingUp, Play, Star, Gift, Mic, ArrowUpRight, Pause, SkipForward, Brain, Timer, Rocket } from "lucide-react";
import { IOSStatusBar } from "../components/IOSStatusBar";
import { useState, useEffect, useRef } from "react";
import "../../styles/cards.css";

interface HubScreenProps {
  onNavigate?: (screen: string) => void;
  onVoiceClick?: () => void;
}

interface Achievement {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlockedToday: boolean;
}

export function HubScreen({ onNavigate, onVoiceClick }: HubScreenProps) {
  const [greeting, setGreeting] = useState({ text: '', emoji: '☀️', period: 'day', timeOfDay: 'morning' });
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
  const [showBriefing, setShowBriefing] = useState(false);
  const [briefingStep, setBriefingStep] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [showXpPopup, setShowXpPopup] = useState(false);
  const [lastXpGain, setLastXpGain] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeInsightIndex, setActiveInsightIndex] = useState(0);
  const [orbHovered, setOrbHovered] = useState(false);
  const briefingTimer = useRef<NodeJS.Timeout | null>(null);

  // Live clock
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Load localStorage data
  useEffect(() => {
    const stored = localStorage.getItem('hubData');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setXpEarned(data.xpEarned || 0);
      } catch (e) {
        console.error('Error loading hub data:', e);
      }
    }
  }, []);

  // Dynamic greeting
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting({ text: 'Good morning', emoji: '☀️', period: 'morning', timeOfDay: 'morning' });
    } else if (hour < 17) {
      setGreeting({ text: 'Good afternoon', emoji: '🌤️', period: 'afternoon', timeOfDay: 'afternoon' });
    } else if (hour < 21) {
      setGreeting({ text: 'Good evening', emoji: '🌅', period: 'evening', timeOfDay: 'evening' });
    } else {
      setGreeting({ text: 'Good night', emoji: '🌙', period: 'night', timeOfDay: 'night' });
    }
  }, []);

  // Rotating insights
  const insights = [
    { icon: '🎯', text: "Peak focus hours: 9-11am", color: 'blue' },
    { icon: '⚡', text: "You're 67% more productive today", color: 'emerald' },
    { icon: '��', text: '7-day streak active!', color: 'orange' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveInsightIndex(prev => (prev + 1) % insights.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Briefing items
  const briefingItems = [
    { icon: '👋', text: greeting.text + "! I'm MYPA, your AI life organizer. Let me brief you.", delay: 2500 },
    { icon: '📊', text: 'You have 3 tasks remaining today, with 2 marked priority. Very achievable!', delay: 3000 },
    { icon: '⏰', text: "Your peak focus window is 9-11am. I've scheduled your hardest tasks then.", delay: 2800 },
    { icon: '🎯', text: 'Next up: "Review Q1 metrics" at 5PM. You usually finish these in 15 mins.', delay: 2800 },
    { icon: '📈', text: "Exciting! You're 67% above last week. Your consistency is remarkable!", delay: 2500 },
    { icon: '🔥', text: 'Your 7-day streak gives you 1.5x XP multiplier. Push to 14 days!', delay: 2300 },
    { icon: '🚀', text: "With your pace, you'll hit 85% completion. Ready to make it 100%?", delay: 2500 },
  ];

  const startBriefing = () => {
    setShowBriefing(true);
    setBriefingStep(0);
    setIsSpeaking(true);
    playBriefingSequence(0);
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(briefingItems[0].text);
      utterance.rate = 0.95;
      utterance.pitch = 1;
      window.speechSynthesis.cancel();
      try {
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.log('Speech synthesis not available');
      }
    }
  };

  const playBriefingSequence = (step: number) => {
    if (step >= briefingItems.length) {
      setIsSpeaking(false);
      const bonusXp = 10;
      awardXp(bonusXp);
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
    if (briefingTimer.current) clearTimeout(briefingTimer.current);
    window.speechSynthesis?.cancel();
  };

  const awardXp = (amount: number) => {
    setLastXpGain(amount);
    setShowXpPopup(true);
    setXpEarned(prev => {
      const newXp = prev + amount;
      localStorage.setItem('hubData', JSON.stringify({ xpEarned: newXp }));
      return newXp;
    });
    setTimeout(() => setShowXpPopup(false), 2000);
  };

  // Today's data
  const today = {
    date: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
    userName: 'Alex',
    streak: 7,
    level: 12,
    xp: 2460 + xpEarned,
    xpToNext: 340 - xpEarned,
    tasksCompleted: 4 + completedTasks.length,
    totalTasks: 7,
    timeSaved: 42,
    focusMinutes: 180,
  };

  const progressPercent = Math.round((today.tasksCompleted / today.totalTasks) * 100);

  // Priority tasks
  const tasks = [
    { id: 1, title: 'Review Q1 metrics', time: '5:00 PM', icon: '📊', category: 'Work', duration: '15m', priority: true },
    { id: 2, title: 'Gym Session', time: '6:00 PM', icon: '🏋️', category: 'Health', duration: '1h', priority: true },
    { id: 3, title: 'Call Mom', time: 'Evening', icon: '📞', category: 'Personal', duration: '15m', priority: false },
  ];

  // Achievements
  const recentAchievements = [
    { id: 1, icon: '🌅', name: 'Early Bird', new: true },
    { id: 2, icon: '🔥', name: '7-Day Streak', new: true },
    { id: 3, icon: '⚡', name: 'Speed Runner', new: false },
  ];

  const formattedTime = currentTime.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 pb-24 relative overflow-hidden">
      <IOSStatusBar />
      
      <style>{`
        @keyframes float { 
          0%, 100% { transform: translateY(0px); } 
          50% { transform: translateY(-8px); } 
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.3), 0 0 40px rgba(139, 92, 246, 0.1); }
          50% { box-shadow: 0 0 30px rgba(139, 92, 246, 0.5), 0 0 60px rgba(139, 92, 246, 0.2); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes slide-up { 
          from { opacity: 0; transform: translateY(12px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        @keyframes scale-in { 
          from { opacity: 0; transform: scale(0.9); } 
          to { opacity: 1; transform: scale(1); } 
        }
        @keyframes badge-bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes xp-float {
          0% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-40px); }
        }
        @keyframes progress-fill {
          from { stroke-dashoffset: 251; }
        }
        @keyframes ripple {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        @keyframes waveform {
          0%, 100% { height: 8px; }
          50% { height: 24px; }
        }
        @keyframes orb-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .float { animation: float 4s ease-in-out infinite; }
        .pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
        .shimmer { 
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        .slide-up { animation: slide-up 0.4s ease-out forwards; }
        .scale-in { animation: scale-in 0.3s ease-out forwards; }
        .badge-bounce { animation: badge-bounce 2s ease-in-out infinite; }
        .xp-float { animation: xp-float 1.5s ease-out forwards; }
        .ripple { animation: ripple 1s ease-out infinite; }
        .wave-bar { animation: waveform 0.5s ease-in-out infinite; }
        .orb-breathe { animation: orb-breathe 4s ease-in-out infinite; }
        .gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 8s ease infinite;
        }
        .glass {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .glass-dark {
          background: rgba(15, 23, 42, 0.9);
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
        }
      `}</style>

      {/* Ambient Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -right-20 w-64 h-64 bg-violet-200/30 rounded-full blur-3xl" />
        <div className="absolute top-60 -left-20 w-48 h-48 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-10 w-32 h-32 bg-amber-200/30 rounded-full blur-2xl" />
      </div>

      {/* XP Popup */}
      {showXpPopup && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 xp-float">
          <div className="px-4 py-2 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold shadow-xl flex items-center gap-2">
            <Star className="w-4 h-4" />
            +{lastXpGain} XP
          </div>
        </div>
      )}

      {/* Header - Premium Hero Section */}
      <div className="relative px-5 pt-3 pb-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">{greeting.emoji}</span>
            <span className="text-[13px] text-slate-500 font-medium">{formattedTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate?.('inbox')}
              className="relative w-10 h-10 rounded-2xl glass shadow-sm flex items-center justify-center active:scale-95 transition-all"
            >
              <Inbox className="w-5 h-5 text-slate-600" />
              <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-[9px] font-bold text-white">3</span>
              </div>
            </button>
            <button
              onClick={() => onNavigate?.('profile')}
              className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30 active:scale-95 transition-all"
            >
              <span className="text-[15px] font-bold text-white">{today.userName[0]}</span>
            </button>
          </div>
        </div>

        {/* Greeting Hero */}
        <div className="mb-2">
          <p className="text-[14px] text-slate-500 font-medium">{greeting.text}</p>
          <h1 className="text-[32px] font-bold text-slate-900 tracking-tight leading-tight">{today.userName}</h1>
        </div>

        {/* Live Insight Ticker */}
        <div className="flex items-center gap-2 py-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-violet-100 to-purple-100 border border-violet-200/50">
            <span className="text-sm">{insights[activeInsightIndex].icon}</span>
            <span className="text-[12px] font-medium text-violet-700">{insights[activeInsightIndex].text}</span>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-4 relative z-10">
        
        {/* MYPA AI Orb - The Star of the Show */}
        <div 
          className="relative rounded-3xl overflow-hidden shadow-xl"
          style={{
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)'
          }}
        >
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-violet-500/20 to-transparent" />
            <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-gradient-to-tl from-purple-500/20 to-transparent" />
          </div>
          
          <div className="relative p-5">
            <div className="flex items-center gap-4">
              {/* Animated Orb */}
              <button
                onClick={startBriefing}
                onMouseEnter={() => setOrbHovered(true)}
                onMouseLeave={() => setOrbHovered(false)}
                className="relative flex-shrink-0 active:scale-95 transition-transform"
              >
                {/* Outer rings */}
                <div className="absolute inset-0 rounded-full bg-violet-400/20 ripple" />
                <div className={`absolute -inset-2 rounded-full border border-violet-400/30 ${orbHovered ? 'scale-110' : ''} transition-transform`} />
                
                {/* Main orb */}
                <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-violet-400 via-purple-500 to-indigo-600 flex items-center justify-center shadow-lg pulse-glow orb-breathe">
                  <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/30 to-transparent" />
                  <Sparkles className="w-7 h-7 text-white relative z-10" />
                </div>
              </button>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white font-semibold text-[15px]">MYPA</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-violet-400/30 text-violet-200">AI</span>
                </div>
                <p className="text-violet-200/80 text-[13px] leading-snug">Your daily briefing is ready. Tap to hear your personalized summary.</p>
              </div>

              {/* Play Button */}
              <button
                onClick={startBriefing}
                className="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-lg active:scale-95 transition-transform"
              >
                <Play className="w-5 h-5 text-violet-600 ml-0.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Progress Dashboard - Premium Card */}
        <div className="glass rounded-3xl p-4 shadow-lg border border-white/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-bold text-slate-900">Today's Progress</h2>
            <span className="text-[12px] text-slate-500">{today.date}</span>
          </div>

          <div className="flex items-center gap-5">
            {/* Animated Progress Ring */}
            <div className="relative w-24 h-24 flex-shrink-0">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle cx="48" cy="48" r="40" stroke="#e2e8f0" strokeWidth="8" fill="none" />
                <circle
                  cx="48" cy="48" r="40"
                  stroke="url(#progressGradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray="251"
                  strokeDashoffset={251 - (251 * progressPercent / 100)}
                  className="transition-all duration-1000"
                  style={{ animation: 'progress-fill 1.5s ease-out' }}
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[24px] font-bold text-slate-900">{progressPercent}%</span>
                <span className="text-[10px] text-slate-500 font-medium">COMPLETE</span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="flex-1 grid grid-cols-2 gap-3">
              <div className="text-center p-2 rounded-xl bg-emerald-50">
                <p className="text-[20px] font-bold text-emerald-600">{today.tasksCompleted}</p>
                <p className="text-[10px] text-emerald-600/70 font-medium">DONE</p>
              </div>
              <div className="text-center p-2 rounded-xl bg-blue-50">
                <p className="text-[20px] font-bold text-blue-600">{today.totalTasks - today.tasksCompleted}</p>
                <p className="text-[10px] text-blue-600/70 font-medium">LEFT</p>
              </div>
              <div className="text-center p-2 rounded-xl bg-violet-50">
                <p className="text-[20px] font-bold text-violet-600">{today.focusMinutes}m</p>
                <p className="text-[10px] text-violet-600/70 font-medium">FOCUS</p>
              </div>
              <div className="text-center p-2 rounded-xl bg-amber-50">
                <p className="text-[20px] font-bold text-amber-600">{today.timeSaved}m</p>
                <p className="text-[10px] text-amber-600/70 font-medium">SAVED</p>
              </div>
            </div>
          </div>
        </div>

        {/* Streak & Level Row - Gamification Spotlight */}
        <div className="grid grid-cols-2 gap-3">
          {/* Streak Card */}
          <div className="glass rounded-2xl p-4 shadow-md border border-orange-200/50 bg-gradient-to-br from-orange-50/50 to-transparent relative overflow-hidden">
            <div className="absolute -top-4 -right-4 text-[60px] opacity-10">🔥</div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl badge-bounce">🔥</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500 text-white">1.5x XP</span>
              </div>
              <p className="text-[28px] font-bold text-slate-900 leading-none">{today.streak}</p>
              <p className="text-[11px] text-slate-500 font-medium mt-1">Day Streak</p>
            </div>
          </div>

          {/* Level Card */}
          <div className="glass rounded-2xl p-4 shadow-md border border-violet-200/50 bg-gradient-to-br from-violet-50/50 to-transparent relative overflow-hidden">
            <div className="absolute -top-4 -right-4 text-[60px] opacity-10">⭐</div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">⭐</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-500 text-white">{today.xpToNext > 0 ? today.xpToNext : 0} to next</span>
              </div>
              <p className="text-[28px] font-bold text-slate-900 leading-none">Lv {today.level}</p>
              <p className="text-[11px] text-slate-500 font-medium mt-1">{today.xp.toLocaleString()} XP</p>
            </div>
          </div>
        </div>

        {/* Achievements Banner */}
        <div className="glass rounded-2xl p-3 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] font-bold text-slate-600 uppercase tracking-wide">Recent Achievements</span>
            <button 
              onClick={() => onNavigate?.('challenges')}
              className="text-[11px] font-medium text-violet-600 flex items-center gap-0.5"
            >
              View all <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="flex gap-2">
            {recentAchievements.map((badge, idx) => (
              <div
                key={badge.id}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl ${
                  badge.new 
                    ? 'bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 shadow-sm' 
                    : 'bg-slate-50 border border-slate-200'
                } scale-in`}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <span className="text-lg">{badge.icon}</span>
                <div>
                  <p className="text-[11px] font-semibold text-slate-800">{badge.name}</p>
                  {badge.new && <span className="text-[8px] font-bold text-amber-600">NEW!</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Tasks - Clean List */}
        <div>
          <div className="flex items-center justify-between px-1 mb-3">
            <h3 className="text-[15px] font-bold text-slate-900">Up Next</h3>
            <button 
              onClick={() => onNavigate?.('plan')}
              className="text-[12px] font-medium text-violet-600 flex items-center gap-0.5"
            >
              See plan <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {tasks.map((task, index) => {
              const isCompleted = completedTasks.includes(task.id);
              return (
                <div
                  key={task.id}
                  className={`glass rounded-2xl shadow-sm overflow-hidden slide-up transition-all ${
                    isCompleted ? 'opacity-60 scale-[0.98]' : ''
                  } ${task.priority && !isCompleted ? 'border-l-4 border-violet-500' : ''}`}
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  <div className="p-3 flex items-center gap-3">
                    {/* Check Button */}
                    <button
                      onClick={() => {
                        if (isCompleted) {
                          setCompletedTasks(prev => prev.filter(id => id !== task.id));
                        } else {
                          setCompletedTasks(prev => [...prev, task.id]);
                          awardXp(50);
                        }
                      }}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all active:scale-90 ${
                        isCompleted 
                          ? 'bg-emerald-500 border-emerald-500 shadow-sm shadow-emerald-500/30' 
                          : 'border-slate-300 hover:border-violet-400'
                      }`}
                    >
                      {isCompleted && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                    
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${
                      task.priority && !isCompleted ? 'bg-violet-100' : 'bg-slate-100'
                    }`}>
                      {task.icon}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-[14px] font-medium ${isCompleted ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-slate-500">{task.time}</span>
                        <span className="text-[11px] text-slate-400">•</span>
                        <span className="text-[11px] text-slate-500">{task.duration}</span>
                      </div>
                    </div>
                    
                    {/* Action */}
                    <button
                      onClick={() => onNavigate?.('plan')}
                      className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions - Premium Grid */}
        <div>
          <h3 className="text-[13px] font-bold text-slate-600 uppercase tracking-wide px-1 mb-3">Quick Actions</h3>
          <div className="grid grid-cols-4 gap-2">
            {[
              { icon: Calendar, label: 'Plan', color: 'from-blue-500 to-cyan-500', screen: 'plan' },
              { icon: Brain, label: 'Dump', color: 'from-slate-700 to-slate-900', screen: 'sort' },
              { icon: Trophy, label: 'Compete', color: 'from-orange-500 to-amber-500', screen: 'challenges' },
              { icon: Wallet, label: 'Wallet', color: 'from-emerald-500 to-teal-500', screen: 'wallet' },
            ].map((action, idx) => (
              <button
                key={action.label}
                onClick={() => onNavigate?.(action.screen)}
                className="glass rounded-2xl p-3 text-center shadow-sm active:scale-95 transition-all hover:shadow-md scale-in"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mx-auto mb-1.5 shadow-sm`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-[11px] font-semibold text-slate-700">{action.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Ask MYPA CTA */}
        <button
          onClick={() => onVoiceClick?.()}
          className="w-full rounded-2xl p-4 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 shadow-lg shadow-violet-500/25 flex items-center justify-center gap-3 active:scale-[0.98] transition-all gradient-shift relative overflow-hidden"
        >
          <div className="absolute inset-0 shimmer" />
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Mic className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <p className="text-white font-semibold text-[15px]">Ask MYPA Anything</p>
            <p className="text-white/70 text-[12px]">"What should I focus on next?"</p>
          </div>
          <ArrowUpRight className="w-5 h-5 text-white/70 ml-auto" />
        </button>

        {/* Reset Day Link */}
        <button
          onClick={() => onNavigate?.('reset')}
          className="w-full py-2 text-center"
        >
          <span className="text-[12px] text-slate-400">Overwhelmed? <span className="text-violet-500 font-medium">Reset your day</span></span>
        </button>
      </div>

      {/* AI Briefing Overlay */}
      {showBriefing && (
        <div className="fixed inset-0 z-[9999] flex flex-col">
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at 50% 30%, #1e1b4b 0%, #0f0a1e 40%, #030014 100%)'
            }}
          />
          
          {/* Close */}
          <button
            onClick={closeBriefing}
            className="absolute top-14 right-5 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center active:scale-95 transition-transform"
          >
            <X className="w-5 h-5 text-white/80" />
          </button>

          {/* Skip */}
          <button
            onClick={() => {
              if (briefingTimer.current) clearTimeout(briefingTimer.current);
              if (briefingStep < briefingItems.length - 1) {
                playBriefingSequence(briefingItems.length - 1);
              }
            }}
            className="absolute top-14 left-5 z-10 px-3 py-2 rounded-full bg-white/10 backdrop-blur-md flex items-center gap-1 active:scale-95 transition-transform"
          >
            <SkipForward className="w-4 h-4 text-white/80" />
            <span className="text-[12px] text-white/80 font-medium">Skip</span>
          </button>
          
          <div className="relative flex-1 flex flex-col items-center justify-center px-6">
            {/* Speaking Orb */}
            <div className="relative mb-8">
              <div className={`absolute -inset-8 rounded-full bg-violet-500/10 ${isSpeaking ? 'animate-ping' : ''}`} style={{ animationDuration: '2s' }} />
              <div className={`absolute -inset-4 rounded-full bg-violet-500/20 ${isSpeaking ? 'animate-pulse' : ''}`} />
              
              <div className={`relative w-28 h-28 rounded-full bg-gradient-to-br from-violet-400 via-purple-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-violet-500/50 ${isSpeaking ? 'scale-105' : 'orb-breathe'} transition-transform`}>
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/30 to-transparent" />
                
                {isSpeaking ? (
                  <div className="flex items-center gap-1">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-1.5 bg-white rounded-full wave-bar"
                        style={{ animationDelay: `${i * 0.1}s`, height: '12px' }}
                      />
                    ))}
                  </div>
                ) : (
                  <Sparkles className="w-12 h-12 text-white" />
                )}
              </div>
            </div>
            
            <p className="text-violet-300 text-[13px] font-semibold uppercase tracking-widest mb-6">AI Life Organizer</p>
            
            {/* Briefing Messages */}
            <div className="w-full max-w-sm min-h-[160px]">
              {briefingItems.slice(Math.max(0, briefingStep - 1), briefingStep + 1).map((item, index) => {
                const actualIndex = Math.max(0, briefingStep - 1) + index;
                const isCurrent = actualIndex === briefingStep;
                return (
                  <div
                    key={actualIndex}
                    className={`w-full bg-white/10 backdrop-blur-md rounded-2xl p-4 mb-3 transition-all duration-300 ${
                      isCurrent ? 'border border-violet-400/50 scale-100 opacity-100' : 'scale-95 opacity-40'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-[22px] flex-shrink-0">{item.icon}</span>
                      <p className="text-white text-[14px] font-medium leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Progress */}
            <div className="flex items-center gap-2 mt-4">
              {briefingItems.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    index <= briefingStep ? 'bg-violet-400 w-4' : 'bg-white/20 w-2'
                  }`}
                />
              ))}
            </div>
          </div>
          
          <div className="relative p-6 pb-10">
            <button
              onClick={closeBriefing}
              className="w-full py-4 rounded-2xl bg-white text-slate-900 text-[16px] font-bold active:scale-[0.98] transition-transform shadow-xl flex items-center justify-center gap-2"
            >
              {briefingStep >= briefingItems.length - 1 ? (
                <>
                  <Rocket className="w-5 h-5" />
                  Let's Crush Today!
                </>
              ) : (
                'Close Briefing'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
