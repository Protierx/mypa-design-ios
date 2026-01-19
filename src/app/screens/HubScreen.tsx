import { Calendar, Inbox, Trophy, User, Clock, CheckCircle2, Wallet, Play, Sparkles, ChevronRight, Bell, TrendingUp, AlertCircle } from "lucide-react";
import { IOSStatusBar } from "../components/IOSStatusBar";
import { MYPAOrb } from "../components/MYPAOrb";
import { useState, useRef } from "react";
import "../../styles/cards.css";

interface HubScreenProps {
  onNavigate?: (screen: string) => void;
}

// Briefing items data
const briefingItems = [
  { id: 1, icon: "🏋️", label: "Gym at 6 PM", type: "event", priority: "high" },
  { id: 2, icon: "📧", label: "2 urgent emails", type: "inbox", priority: "high" },
  { id: 3, icon: "✅", label: "3 tasks remaining", type: "task", priority: "medium" },
  { id: 4, icon: "💰", label: "+42 min saved today", type: "positive", priority: "low" },
];

export function HubScreen({ onNavigate }: HubScreenProps) {
  const [showBriefingOrb, setShowBriefingOrb] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const playButtonRef = useRef<HTMLButtonElement>(null);

  const handlePlayBriefing = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setShowBriefingOrb(true);
      setIsTransitioning(false);
    }, 400);
  };

  const handleCloseBriefing = () => {
    setShowBriefingOrb(false);
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] pb-24 relative">
      <IOSStatusBar />
      
      <style>{`
        .ios-card {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 20px;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .ios-card:active {
          transform: scale(0.98);
        }
        .briefing-card {
          background: linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
        }
        .pulse-ring {
          animation: pulse-ring 2s ease-out infinite;
        }
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        .status-dot {
          animation: status-pulse 2s ease-in-out infinite;
        }
        @keyframes status-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.95); }
        }
        .quick-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }
        .quick-card:active {
          transform: scale(0.97);
        }
        .play-btn-morph {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .play-btn-morph.transitioning {
          transform: scale(2.5);
          opacity: 0;
        }
        @keyframes float-orb {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 30px rgba(181, 140, 255, 0.4), 0 0 60px rgba(100, 199, 255, 0.2); }
          50% { box-shadow: 0 0 50px rgba(181, 140, 255, 0.6), 0 0 80px rgba(100, 199, 255, 0.4); }
        }
        .orb-container {
          animation: float-orb 3s ease-in-out infinite;
        }
        .orb-glow {
          animation: glow-pulse 2s ease-in-out infinite;
        }
        .briefing-item {
          animation: slide-in 0.3s ease-out forwards;
          opacity: 0;
          transform: translateX(-10px);
        }
        @keyframes slide-in {
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
      
      {/* Header - Cleaner iOS style */}
      <div className="px-5 pt-2 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[13px] text-slate-500 font-medium">Thursday, Jan 11</p>
            <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">Good afternoon</h1>
          </div>
          <button
            onClick={() => onNavigate?.('profile')}
            className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/20 active:scale-95 transition-transform"
          >
            <User className="w-5 h-5 text-white" />
          </button>
        </div>
        
        {/* Status Pills - More informative */}
        <div className="flex items-center gap-2 mt-3">
          <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
            <div className="w-2 h-2 rounded-full bg-emerald-500 status-dot" />
            <span className="text-[12px] font-semibold text-emerald-700">On Track</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full">
            <CheckCircle2 className="w-3 h-3 text-slate-500" />
            <span className="text-[12px] font-medium text-slate-600">4/7 done</span>
          </div>
          <div className="flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/20 px-3 py-1.5 rounded-full">
            <TrendingUp className="w-3 h-3 text-purple-600" />
            <span className="text-[12px] font-semibold text-purple-700">+42m</span>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-3">
        
        {/* Daily Briefing Card - Dark, elegant with preview list */}
        <div className="briefing-card rounded-[24px] overflow-hidden shadow-xl">
          {/* Header with play button */}
          <div className="p-4 pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider">Daily Briefing</span>
                </div>
                <h2 className="text-white text-[20px] font-bold">Your Morning Update</h2>
                <p className="text-[13px] text-slate-400 mt-0.5">4 important items • ~2 min</p>
              </div>
              
              {/* Play Button with morphing animation */}
              <button
                ref={playButtonRef}
                onClick={handlePlayBriefing}
                className={`play-btn-morph w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/30 active:scale-95 relative ${isTransitioning ? 'transitioning' : ''}`}
              >
                <div className="absolute inset-0 rounded-full bg-purple-400/30 pulse-ring" />
                <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
              </button>
            </div>
          </div>
          
          {/* Briefing Preview List */}
          <div className="px-4 pb-4">
            <div className="bg-white/5 backdrop-blur rounded-2xl divide-y divide-white/5">
              {briefingItems.map((item, index) => (
                <div 
                  key={item.id} 
                  className="flex items-center gap-3 px-3 py-2.5"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <span className="text-[16px]">{item.icon}</span>
                  <span className="text-[14px] text-white/90 font-medium flex-1">{item.label}</span>
                  {item.priority === 'high' && (
                    <div className="w-2 h-2 rounded-full bg-orange-400" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Next Up Card - Cleaner design */}
        <button
          onClick={() => onNavigate?.('plan')}
          className="ios-card w-full p-4 shadow-sm text-left"
        >
          <div className="flex items-center gap-4">
            {/* Time indicator - visual countdown */}
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex flex-col items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="text-[20px] font-bold text-white leading-none">45</span>
                <span className="text-[9px] text-white/80 font-medium uppercase">min</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center">
                <Clock className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
            
            {/* Event details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wide">Up Next</span>
              </div>
              <p className="text-[17px] font-semibold text-slate-900 truncate">Gym Session</p>
              <p className="text-[13px] text-slate-500">6:00 PM • Downtown Fitness</p>
            </div>
            
            <ChevronRight className="w-5 h-5 text-slate-300" />
          </div>
        </button>

        {/* Quick Access Grid - Cleaner 2x2 */}
        <div className="grid grid-cols-2 gap-2.5">
          
          {/* Plan */}
          <button
            onClick={() => onNavigate?.('plan')}
            className="quick-card rounded-2xl p-4 text-left transition-all shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 rounded-[14px] bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="text-[11px] font-semibold text-slate-400">5 today</span>
            </div>
            <h3 className="text-[15px] font-semibold text-slate-900">Plan</h3>
            <p className="text-[12px] text-slate-500">View schedule</p>
          </button>

          {/* Inbox */}
          <button
            onClick={() => onNavigate?.('inbox')}
            className="quick-card rounded-2xl p-4 text-left transition-all shadow-sm relative"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 rounded-[14px] bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-md shadow-purple-500/20 relative">
                <Inbox className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center gap-1.5 bg-red-500 px-2 py-0.5 rounded-full">
                <Bell className="w-3 h-3 text-white" />
                <span className="text-[11px] font-bold text-white">2</span>
              </div>
            </div>
            <h3 className="text-[15px] font-semibold text-slate-900">Inbox</h3>
            <p className="text-[12px] text-red-500 font-medium">2 urgent</p>
          </button>

          {/* Challenges */}
          <button
            onClick={() => onNavigate?.('challenges')}
            className="quick-card rounded-2xl p-4 text-left transition-all shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 rounded-[14px] bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-md shadow-orange-500/20">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <span className="text-[11px] font-semibold text-orange-500">🔥 3</span>
            </div>
            <h3 className="text-[15px] font-semibold text-slate-900">Challenges</h3>
            <p className="text-[12px] text-slate-500">1 active</p>
          </button>

          {/* Wallet */}
          <button
            onClick={() => onNavigate?.('wallet')}
            className="quick-card rounded-2xl p-4 text-left transition-all shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 rounded-[14px] bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-md shadow-green-500/20">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <h3 className="text-[15px] font-semibold text-slate-900">Wallet</h3>
            <p className="text-[12px] text-emerald-600 font-semibold">+42 min</p>
          </button>
        </div>

        {/* Secondary Actions Row */}
        <div className="flex gap-2.5">
          {/* Sort Tasks */}
          <button
            onClick={() => onNavigate?.('sort')}
            className="flex-1 quick-card rounded-2xl p-3.5 flex items-center gap-3 shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-md shadow-violet-500/20">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <p className="text-[14px] font-semibold text-slate-900">Sort Tasks</p>
              <p className="text-[11px] text-slate-500">Organize</p>
            </div>
          </button>

          {/* Reset */}
          <button
            onClick={() => onNavigate?.('reset')}
            className="flex-1 quick-card rounded-2xl p-3.5 flex items-center gap-3 shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center shadow-md">
              <span className="text-[18px]">🔄</span>
            </div>
            <div className="text-left">
              <p className="text-[14px] font-semibold text-slate-900">Reset</p>
              <p className="text-[11px] text-slate-500">Recalibrate</p>
            </div>
          </button>
        </div>

        {/* Ask MYPA - Floating action with mini orb */}
        <button
          onClick={() => onNavigate?.('ask')}
          className="w-full ios-card p-3 shadow-md flex items-center gap-3"
        >
          <MYPAOrb size="sm" showGlow={false} />
          <div className="flex-1 text-left">
            <p className="text-[15px] font-semibold text-slate-900">Ask MYPA</p>
            <p className="text-[12px] text-slate-500">Try: "Rearrange my evening"</p>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-300" />
        </button>
      </div>

      {/* Animated Briefing Orb Overlay */}
      {showBriefingOrb && (
        <div className="absolute inset-0 z-50 flex flex-col pointer-events-auto rounded-[48px] overflow-hidden">
          {/* Backdrop with gradient */}
          <div
            onClick={handleCloseBriefing}
            className="absolute inset-0 bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-900/95 backdrop-blur-xl transition-opacity animate-in fade-in duration-300"
          />
          
          {/* Content Container */}
          <div className="relative z-10 flex flex-col h-full pt-16 px-5">
            
            {/* Orb Section */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                {/* MYPA Orb */}
                <MYPAOrb size="lg" showGlow={true} />
                
                {/* Speaking indicator */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-white/10 backdrop-blur-md rounded-full px-3 py-1.5">
                  <div className="flex items-center gap-0.5">
                    <div className="w-1 h-3 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                    <div className="w-1 h-4 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                    <div className="w-1 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                    <div className="w-1 h-5 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '450ms' }} />
                    <div className="w-1 h-3 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '600ms' }} />
                  </div>
                  <span className="text-[11px] text-white/80 font-medium ml-1">Speaking</span>
                </div>
              </div>
              
              <h2 className="text-white text-[22px] font-bold mt-8 text-center">Your Daily Briefing</h2>
              <p className="text-white/60 text-[14px] mt-1">Here's what you need to know</p>
            </div>

            {/* Briefing Items - Full detail view */}
            <div className="flex-1 overflow-auto scrollbar-hide">
              <div className="space-y-3">
                {/* Up Next */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 animate-in slide-in-from-bottom-2" style={{ animationDelay: '100ms' }}>
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wide">Up Next</span>
                        <div className="px-1.5 py-0.5 rounded bg-blue-500/20 text-[10px] text-blue-400 font-medium">45 min</div>
                      </div>
                      <p className="text-[16px] font-semibold text-white mt-0.5">Gym Session</p>
                      <p className="text-[13px] text-white/60">6:00 PM at Downtown Fitness</p>
                    </div>
                  </div>
                </div>

                {/* Urgent Attention */}
                <div className="bg-orange-500/10 backdrop-blur-md rounded-2xl p-4 border border-orange-500/20 animate-in slide-in-from-bottom-2" style={{ animationDelay: '200ms' }}>
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="w-5 h-5 text-orange-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-orange-400 uppercase tracking-wide">Needs Attention</span>
                      </div>
                      <p className="text-[16px] font-semibold text-white mt-0.5">2 Urgent Emails</p>
                      <p className="text-[13px] text-white/60">From Sarah & Project Team</p>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 animate-in slide-in-from-bottom-2" style={{ animationDelay: '300ms' }}>
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wide">Today's Progress</span>
                      </div>
                      <p className="text-[16px] font-semibold text-white mt-0.5">4 of 7 Tasks Complete</p>
                      <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full w-[57%] bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Time Saved */}
                <div className="bg-purple-500/10 backdrop-blur-md rounded-2xl p-4 animate-in slide-in-from-bottom-2" style={{ animationDelay: '400ms' }}>
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wide">Time Wallet</span>
                      </div>
                      <p className="text-[16px] font-semibold text-white mt-0.5">+42 Minutes Saved</p>
                      <p className="text-[13px] text-white/60">MYPA optimized 3 routines today</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-4 pb-6">
              <button
                onClick={handleCloseBriefing}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 text-white text-[16px] font-semibold shadow-lg shadow-purple-500/25 active:scale-[0.98] transition-transform"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}