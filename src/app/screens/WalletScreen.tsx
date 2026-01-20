import { ArrowLeft, Clock, Sparkles, TrendingUp, Gift, ChevronRight, Flame, Target, Calendar, Share2, Star, Trophy, Zap } from "lucide-react";
import { IOSStatusBar } from "../components/IOSStatusBar";
import { useState } from "react";

interface WalletScreenProps {
  onNavigate?: (screen: string) => void;
}

export function WalletScreen({ onNavigate }: WalletScreenProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('week');
  const [showShareModal, setShowShareModal] = useState(false);
  
  const stats = {
    today: { saved: '42m', tasks: 8, streak: 6, efficiency: 87 },
    week: { saved: '2h 40m', tasks: 34, streak: 6, efficiency: 92 },
    month: { saved: '12h 20m', tasks: 142, streak: 6, efficiency: 89 },
  };

  const recentSaves = [
    { id: 1, action: 'Completed "Morning workout" early', time: '+15m', when: '2h ago', icon: '🏃', xp: 25 },
    { id: 2, action: 'Batched 3 errands together', time: '+12m', when: '4h ago', icon: '📦', xp: 20 },
    { id: 3, action: 'Auto-rescheduled conflicts', time: '+8m', when: 'Yesterday', icon: '🔄', xp: 15 },
    { id: 4, action: 'Optimized commute route', time: '+7m', when: 'Yesterday', icon: '🚗', xp: 15 },
  ];

  const milestones = [
    { id: 1, title: '1 Hour', reached: true, reward: '🎉', description: 'First hour saved!' },
    { id: 2, title: '5 Hours', reached: true, reward: '⭐', description: 'Productivity pro!' },
    { id: 3, title: '10 Hours', reached: true, reward: '🏆', description: 'Time master!' },
    { id: 4, title: '24 Hours', reached: false, reward: '👑', progress: 51, description: 'Unlock premium' },
  ];

  // Weekly goal tracking
  const weeklyGoal = {
    target: '4h',
    current: '2h 40m',
    percentage: 67,
    daysLeft: 3,
  };

  const currentStats = stats[selectedPeriod];

  return (
    <div className="min-h-screen bg-ios-bg pb-32 relative overflow-hidden">
      <IOSStatusBar />

      <style>{`
        .ios-card {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 20px;
        }
        .time-glow {
          text-shadow: 0 0 40px rgba(16, 185, 129, 0.4);
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .float { animation: float 3s ease-in-out infinite; }
        @keyframes celebrate {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.1) rotate(-5deg); }
          75% { transform: scale(1.1) rotate(5deg); }
        }
        .celebrate { animation: celebrate 0.5s ease-in-out; }
      `}</style>
      
      {/* Ambient background glows */}
      <div className="absolute top-32 -right-20 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-80 -left-20 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Header */}
      <div className="px-6 pt-4 pb-2 relative z-10">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate?.('hub')}
            className="p-2 rounded-full hover:bg-black/5 transition-colors -ml-2"
          >
            <ArrowLeft className="w-6 h-6 text-slate-600" />
          </button>
          <div className="text-center">
            <p className="text-[12px] text-slate-400 font-medium">Your Progress</p>
            <h1 className="text-[20px] font-bold text-slate-900">Time Wallet</h1>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
            <Star className="w-5 h-5 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* Hero Time Saved Card */}
      <div className="px-4 mb-5 relative z-10">
        <div 
          className="relative overflow-hidden rounded-[28px] p-6"
          style={{
            background: 'linear-gradient(145deg, var(--success-gradient-start) 0%, var(--success-gradient-middle) 50%, var(--success-gradient-end) 100%)',
          }}
        >
          {/* Decorative elements */}
          <div className="absolute top-4 right-4 w-24 h-24 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute top-1/2 right-8 w-16 h-16 rounded-full bg-yellow-400/20 blur-xl" />
          
          <div className="relative">
            {/* Period Selector */}
            <div className="flex bg-white/20 rounded-full p-1 mb-6 w-fit">
              {(['today', 'week', 'month'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all ${
                    selectedPeriod === period
                      ? 'bg-white text-emerald-700 shadow-sm'
                      : 'text-white/90 hover:bg-white/10'
                  }`}
                >
                  {period === 'today' ? 'Today' : period === 'week' ? 'This Week' : 'This Month'}
                </button>
              ))}
            </div>

            {/* Main Time Display */}
            <div className="mb-6">
              <p className="text-white/80 text-[14px] font-medium mb-1 flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                You've saved
              </p>
              <div className="flex items-end gap-2">
                <p className="text-[60px] font-black text-white leading-none time-glow">
                  {currentStats.saved}
                </p>
                <div className="mb-3 float">
                  <span className="text-3xl">⏰</span>
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-white/15 backdrop-blur rounded-2xl p-3 text-center">
                <Zap className="w-5 h-5 text-yellow-300 mx-auto mb-1" />
                <p className="text-white text-[20px] font-bold">{currentStats.tasks}</p>
                <p className="text-white/70 text-[11px]">Tasks Done</p>
              </div>
              <div className="bg-white/15 backdrop-blur rounded-2xl p-3 text-center">
                <Flame className="w-5 h-5 text-orange-400 mx-auto mb-1" />
                <p className="text-white text-[20px] font-bold">{currentStats.streak}</p>
                <p className="text-white/70 text-[11px]">Day Streak</p>
              </div>
              <div className="bg-white/15 backdrop-blur rounded-2xl p-3 text-center">
                <TrendingUp className="w-5 h-5 text-emerald-300 mx-auto mb-1" />
                <p className="text-white text-[20px] font-bold">{currentStats.efficiency}%</p>
                <p className="text-white/70 text-[11px]">Efficiency</p>
              </div>
            </div>

            {/* Motivational message */}
            <div className="pt-4 border-t border-white/20 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-yellow-300" />
              </div>
              <p className="text-white/95 text-[14px] font-medium flex-1">
                {selectedPeriod === 'today' 
                  ? "Amazing start! Keep this momentum going 🚀" 
                  : selectedPeriod === 'week'
                  ? "That's like getting a free lunch break this week! 🍕"
                  : "You've earned back half a work day this month! 💪"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Goal Progress */}
      <div className="px-4 mb-5">
        <div className="ios-card p-4 border-2 border-purple-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[15px] font-semibold text-slate-800">Weekly Goal</p>
                <p className="text-[12px] text-slate-500">{weeklyGoal.daysLeft} days left</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[18px] font-bold text-slate-800">{weeklyGoal.current}</p>
              <p className="text-[12px] text-slate-500">of {weeklyGoal.target}</p>
            </div>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
              style={{ width: `${weeklyGoal.percentage}%` }}
            />
          </div>
          <p className="text-[12px] text-purple-600 font-medium mt-2 text-center">
            {weeklyGoal.percentage >= 100 ? '🎉 Goal achieved!' : `${100 - weeklyGoal.percentage}% more to hit your goal!`}
          </p>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="px-4 mb-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="ios-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-[12px] text-slate-500">Weekly Goal</p>
                <p className="text-[17px] font-bold text-slate-900">67%</p>
              </div>
            </div>
            <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full w-[67%] bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" />
            </div>
          </div>
          
          <div className="ios-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <span className="text-[20px]">🏆</span>
              </div>
              <div>
                <p className="text-[12px] text-slate-500">Total Saved</p>
                <p className="text-[17px] font-bold text-slate-900">12h 20m</p>
              </div>
            </div>
            <p className="text-[11px] text-emerald-600 font-medium mt-2">+2h 40m this week</p>
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div className="px-4 mb-5">
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-[13px] font-semibold text-slate-500 uppercase tracking-wide">Your Achievements</h2>
          <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-full">
            <Trophy className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-[11px] font-semibold text-amber-700">3/4 Unlocked</span>
          </div>
        </div>
        <div className="ios-card p-4 shadow-sm">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {milestones.map((milestone) => (
              <div 
                key={milestone.id}
                className={`flex-shrink-0 w-[88px] text-center ${!milestone.reached ? 'opacity-70' : ''}`}
              >
                <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-2xl mb-2 transition-all ${
                  milestone.reached 
                    ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30 hover:scale-105 cursor-pointer' 
                    : 'bg-slate-100 relative overflow-hidden border-2 border-dashed border-slate-200'
                }`}>
                  {milestone.reached ? (
                    milestone.reward
                  ) : (
                    <>
                      <span className="text-slate-300 text-xl relative z-10">🔒</span>
                      <div 
                        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-400 to-purple-300"
                        style={{ height: `${milestone.progress}%` }}
                      />
                    </>
                  )}
                </div>
                <p className="text-[12px] font-semibold text-slate-800">{milestone.title}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{milestone.description}</p>
                {!milestone.reached && milestone.progress && (
                  <div className="mt-1 px-2 py-0.5 bg-purple-100 rounded-full">
                    <p className="text-[10px] text-purple-700 font-bold">{milestone.progress}%</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Saves */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-[13px] font-semibold text-slate-500 uppercase tracking-wide">How You Saved Time</h2>
          <span className="text-[11px] text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-full">Today +42m</span>
        </div>
        <div className="space-y-2.5">
          {recentSaves.map((save, index) => (
            <div key={save.id} className="ios-card p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center text-2xl shadow-inner">
                  {save.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] text-slate-800 font-semibold truncate">{save.action}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[12px] text-slate-400">{save.when}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span className="text-[11px] bg-gradient-to-r from-purple-500 to-primary text-white px-2 py-0.5 rounded-full font-semibold">+{save.xp} XP</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[18px] font-bold text-emerald-600">{save.time}</p>
                  <p className="text-[10px] text-emerald-500">saved</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Share Achievement */}
      <div className="px-4 mt-5">
        <button 
          onClick={() => setShowShareModal(true)}
          className="w-full ios-card p-4 flex items-center gap-4 shadow-sm active:scale-[0.98] transition-transform"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Share2 className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-[15px] font-semibold text-slate-800">Share your progress</p>
            <p className="text-[13px] text-slate-500">Brag about your time savings to circles!</p>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </button>
      </div>

      {/* Redeem Section */}
      <div className="px-4 mt-5">
        <div 
          onClick={() => {/* Future: Navigate to rewards screen */}}
          className="ios-card p-4 border-2 border-dashed border-slate-200 cursor-pointer active:scale-[0.98] transition-transform"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-[15px] font-semibold text-slate-800">Unlock rewards</p>
              <p className="text-[13px] text-slate-500">Save 24 hours to unlock premium features</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" 
            onClick={() => setShowShareModal(false)} 
          />
          <div className="fixed inset-0 flex items-end z-50 pointer-events-none">
            <div 
              className="w-full bg-white rounded-t-[32px] p-6 pointer-events-auto"
              style={{ boxShadow: '0 -4px 20px rgba(0,0,0,0.1)' }}
            >
              <div className="w-9 h-1 bg-slate-200 rounded-full mx-auto mb-4" />
              
              <h2 className="text-[22px] font-bold text-slate-800 mb-2 text-center">Share Your Progress</h2>
              <p className="text-[14px] text-slate-500 mb-6 text-center">Show off your time-saving achievements!</p>

              {/* Share Card Preview */}
              <div 
                className="rounded-[20px] p-5 mb-6 text-center"
                style={{ background: 'linear-gradient(145deg, var(--success-gradient-start) 0%, var(--success-gradient-middle) 50%, var(--success-gradient-end) 100%)' }}
              >
                <p className="text-white/80 text-[14px] mb-1">I saved</p>
                <p className="text-[36px] font-black text-white">{currentStats.saved}</p>
                <p className="text-white/80 text-[14px] mt-1">this {selectedPeriod} with MYPA! 🎉</p>
                <div className="flex items-center justify-center gap-4 mt-4">
                  <div className="text-center">
                    <p className="text-white text-[18px] font-bold">{currentStats.tasks}</p>
                    <p className="text-white/70 text-[11px]">Tasks</p>
                  </div>
                  <div className="w-px h-8 bg-white/20" />
                  <div className="text-center">
                    <p className="text-white text-[18px] font-bold">🔥 {currentStats.streak}</p>
                    <p className="text-white/70 text-[11px]">Day Streak</p>
                  </div>
                </div>
              </div>

              {/* Share Options */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <button 
                  onClick={() => onNavigate?.('daily-life-card')}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                    <span className="text-lg">📝</span>
                  </div>
                  <span className="text-[12px] font-medium text-slate-700">Daily Card</span>
                </button>
                <button 
                  onClick={() => onNavigate?.('circles')}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center">
                    <span className="text-lg">👥</span>
                  </div>
                  <span className="text-[12px] font-medium text-slate-700">Circles</span>
                </button>
                <button 
                  onClick={() => {
                    // Copy to clipboard simulation
                    setShowShareModal(false);
                  }}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                    <span className="text-lg">📋</span>
                  </div>
                  <span className="text-[12px] font-medium text-slate-700">Copy Link</span>
                </button>
              </div>

              <button 
                onClick={() => setShowShareModal(false)}
                className="w-full py-3.5 rounded-full bg-slate-100 text-slate-700 text-[15px] font-semibold hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}