import { useState } from "react";
import { 
  ArrowLeft, 
  Camera, 
  CheckCircle2, 
  Users, 
  Plus, 
  Trophy, 
  Flame, 
  Target, 
  Calendar,
  TrendingUp,
  Clock,
  ChevronRight,
  Sparkles,
  Crown,
  Medal,
  Star
} from "lucide-react";
import { IOSStatusBar } from "../components/IOSStatusBar";

interface ChallengesScreenProps {
  onNavigate?: (screen: string) => void;
}

interface Challenge {
  id: number;
  name: string;
  emoji: string;
  duration: string;
  daysLeft: number;
  totalDays: number;
  members: { initial: string; color: string }[];
  todayPrompt: string;
  progress: { completed: number; total: number };
  myStatus: 'pending' | 'completed' | 'missed';
  myStreak: number;
  bestStreak: number;
  category: 'fitness' | 'wellness' | 'learning' | 'productivity' | 'social';
}

interface Invite {
  id: number;
  name: string;
  emoji: string;
  inviter: string;
  duration: string;
  members: { initial: string; color: string }[];
  reward?: string;
}

export function ChallengesScreen({ onNavigate }: ChallengesScreenProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'completed'>('active');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [selectedChallengeId, setSelectedChallengeId] = useState<number | null>(null);

  // User stats
  const userStats = {
    totalChallenges: 12,
    activeStreak: 7,
    longestStreak: 21,
    completionRate: 89,
    rank: 3,
    totalMembers: 24
  };

  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([
    {
      id: 1,
      name: 'Morning Workout',
      emoji: '🏋️',
      duration: '30 days',
      daysLeft: 18,
      totalDays: 30,
      members: [
        { initial: 'A', color: 'from-rose-400 to-rose-600' },
        { initial: 'B', color: 'from-blue-400 to-blue-600' },
        { initial: 'C', color: 'from-green-400 to-green-600' },
        { initial: 'D', color: 'from-purple-400 to-purple-600' },
        { initial: 'E', color: 'from-amber-400 to-amber-600' },
      ],
      todayPrompt: 'Post your workout proof by 10 AM',
      progress: { completed: 3, total: 5 },
      myStatus: 'pending',
      myStreak: 7,
      bestStreak: 12,
      category: 'fitness'
    },
    {
      id: 2,
      name: 'Daily Reading',
      emoji: '📚',
      duration: '14 days',
      daysLeft: 6,
      totalDays: 14,
      members: [
        { initial: 'J', color: 'from-indigo-400 to-indigo-600' },
        { initial: 'M', color: 'from-pink-400 to-pink-600' },
        { initial: 'S', color: 'from-teal-400 to-teal-600' },
      ],
      todayPrompt: 'Share what you read today',
      progress: { completed: 3, total: 3 },
      myStatus: 'completed',
      myStreak: 14,
      bestStreak: 14,
      category: 'learning'
    },
    {
      id: 3,
      name: 'No Phone After 9PM',
      emoji: '📵',
      duration: '7 days',
      daysLeft: 3,
      totalDays: 7,
      members: [
        { initial: 'K', color: 'from-orange-400 to-orange-600' },
        { initial: 'L', color: 'from-cyan-400 to-cyan-600' },
      ],
      todayPrompt: 'Log your screen time',
      progress: { completed: 1, total: 2 },
      myStatus: 'pending',
      myStreak: 4,
      bestStreak: 4,
      category: 'wellness'
    },
  ]);

  const [invites, setInvites] = useState<Invite[]>([
    {
      id: 1,
      name: 'Hydration Challenge',
      emoji: '💧',
      inviter: 'Sarah',
      duration: '7 days',
      members: [
        { initial: 'S', color: 'from-cyan-400 to-cyan-600' },
        { initial: 'K', color: 'from-purple-400 to-purple-600' },
        { initial: 'L', color: 'from-green-400 to-green-600' },
      ],
      reward: '🏆 Badge unlock'
    },
  ]);

  const completedChallenges = [
    { id: 101, name: 'January Meditation', emoji: '🧘', completedOn: 'Jan 15', streak: 15 },
    { id: 102, name: 'Gratitude Journal', emoji: '📝', completedOn: 'Jan 10', streak: 30 },
  ];

  const getCategoryColor = (category: Challenge['category']) => {
    switch (category) {
      case 'fitness': return 'bg-rose-100 text-rose-700';
      case 'wellness': return 'bg-purple-100 text-purple-700';
      case 'learning': return 'bg-blue-100 text-blue-700';
      case 'productivity': return 'bg-amber-100 text-amber-700';
      case 'social': return 'bg-green-100 text-green-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-ios-bg pb-32 relative overflow-hidden">
      <IOSStatusBar />
      
      <style>{`
        .hero-card {
          background: linear-gradient(145deg, var(--dark-card-start) 0%, var(--dark-card-middle) 50%, var(--dark-card-end) 100%);
        }
        .streak-glow {
          box-shadow: 0 0 20px rgba(251, 146, 60, 0.3);
        }
        @keyframes flame-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        .flame-animate {
          animation: flame-pulse 1.5s ease-in-out infinite;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .slide-up { animation: slideUp 0.4s ease-out forwards; }
      `}</style>
      
      {/* Ambient glows */}
      <div className="absolute top-20 -right-20 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-80 -left-20 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Header */}
      <div className="px-6 pt-4 pb-2 relative z-10">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => onNavigate?.('hub')}
            className="p-2 rounded-full hover:bg-black/5 transition-colors -ml-2"
          >
            <ArrowLeft className="w-6 h-6 text-slate-600" />
          </button>
          <div className="text-center">
            <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Compete & Grow</p>
            <h1 className="text-[20px] font-bold text-slate-800">Challenges</h1>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="p-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 transition-all shadow-lg shadow-purple-500/30"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Hero Stats Card */}
      <div className="px-4 mb-6 relative z-10">
        <div className="hero-card rounded-[24px] p-5 text-white relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/20 rounded-full blur-2xl" />
          
          <div className="relative">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center streak-glow shadow-lg">
                  <Flame className="w-7 h-7 text-white flame-animate" />
                </div>
                <div>
                  <p className="text-[13px] text-white/60">You're on fire! 🔥</p>
                  <p className="text-[32px] font-black leading-tight">{userStats.activeStreak} days</p>
                </div>
              </div>
              <div className="text-right bg-white/10 rounded-xl p-3">
                <div className="flex items-center gap-1 justify-end mb-0.5">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span className="text-[15px] font-bold text-white">#{userStats.rank}</span>
                </div>
                <p className="text-[11px] text-white/50">of {userStats.totalMembers} members</p>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
                <Trophy className="w-4 h-4 mx-auto mb-1 text-amber-400" />
                <p className="text-[16px] font-bold">{userStats.longestStreak}</p>
                <p className="text-[10px] text-white/50">Best Streak</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
                <Target className="w-4 h-4 mx-auto mb-1 text-purple-400" />
                <p className="text-[16px] font-bold">{userStats.totalChallenges}</p>
                <p className="text-[10px] text-white/50">Challenges</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
                <TrendingUp className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                <p className="text-[16px] font-bold">{userStats.completionRate}%</p>
                <p className="text-[10px] text-white/50">Success</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-6 mb-4">
        <div className="flex gap-2 p-1 bg-slate-100 rounded-full">
          {(['active', 'completed'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`flex-1 px-4 py-2 rounded-full text-[13px] font-medium transition-all ${
                activeFilter === filter
                  ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Invites Section */}
      {invites.length > 0 && activeFilter === 'active' && (
        <div className="px-6 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h2 className="text-[15px] font-semibold text-slate-800">New Invites</h2>
          </div>
          <div className="space-y-3">
            {invites.map(invite => (
              <div
                key={invite.id}
                className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-[20px] p-4 border border-amber-200"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center text-2xl shadow-sm">
                    {invite.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[15px] font-semibold text-slate-800">{invite.name}</h3>
                    <p className="text-[12px] text-slate-500">
                      {invite.inviter} invited you • {invite.duration}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {invite.members.slice(0, 3).map((member, idx) => (
                        <div
                          key={idx}
                          className={`w-6 h-6 rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center text-white text-[10px] font-semibold border-2 border-white`}
                          style={{ marginLeft: idx > 0 ? '-6px' : '0' }}
                        >
                          {member.initial}
                        </div>
                      ))}
                    </div>
                    {invite.reward && (
                      <span className="text-[11px] text-amber-700 font-medium">{invite.reward}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setInvites(invites.filter(i => i.id !== invite.id))}
                      className="px-4 py-1.5 rounded-full bg-slate-200 text-slate-700 text-[13px] font-medium hover:bg-slate-300 transition-colors"
                    >
                      Decline
                    </button>
                    <button 
                      onClick={() => {
                        // Accept invite - move to active challenges
                        setActiveChallenges([...activeChallenges, {
                          id: Date.now(),
                          name: invite.name,
                          emoji: invite.emoji,
                          duration: invite.duration,
                          category: 'fitness',
                          daysLeft: 21,
                          totalDays: 21,
                          members: invite.members,
                          progress: { completed: 0, total: invite.members.length + 1 },
                          myStatus: 'pending' as const,
                          myStreak: 0,
                          bestStreak: 0,
                          todayPrompt: 'Complete your first day!'
                        }]);
                        setInvites(invites.filter(i => i.id !== invite.id));
                      }}
                      className="px-4 py-1.5 rounded-full bg-gradient-to-r from-primary to-secondary text-white text-[13px] font-medium hover:opacity-90 transition-opacity"
                    >
                      Accept
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Challenges */}
      {activeFilter === 'active' && (
        <div className="px-6 mb-8">
          <h2 className="text-[15px] font-semibold text-slate-800 mb-3">Active Challenges</h2>
          <div className="space-y-4">
            {activeChallenges.map(challenge => (
              <div
                key={challenge.id}
                className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-100"
              >
                {/* Header Row */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl">
                    {challenge.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-[16px] font-semibold text-slate-800">{challenge.name}</h3>
                      {challenge.myStatus === 'completed' && (
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${getCategoryColor(challenge.category)}`}>
                        {challenge.category}
                      </span>
                      <span className="text-[12px] text-slate-500">
                        {challenge.daysLeft} days left
                      </span>
                    </div>
                  </div>
                  {/* Streak Badge */}
                  <div className="flex items-center gap-1 bg-amber-100 px-2 py-1 rounded-full">
                    <Flame className="w-3.5 h-3.5 text-amber-600" />
                    <span className="text-[12px] font-semibold text-amber-700">{challenge.myStreak}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
                    <span>Day {challenge.totalDays - challenge.daysLeft} of {challenge.totalDays}</span>
                    <span>{Math.round((1 - challenge.daysLeft / challenge.totalDays) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all"
                      style={{ width: `${(1 - challenge.daysLeft / challenge.totalDays) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Members */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {challenge.members.slice(0, 4).map((member, index) => (
                        <div
                          key={index}
                          className={`w-8 h-8 rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center text-white text-[12px] font-semibold border-2 border-white`}
                          style={{ marginLeft: index > 0 ? '-8px' : '0', zIndex: 4 - index }}
                        >
                          {member.initial}
                        </div>
                      ))}
                    </div>
                    <span className="text-[12px] text-slate-500">
                      {challenge.progress.completed}/{challenge.progress.total} done today
                    </span>
                  </div>
                </div>

                {/* Today's Prompt */}
                <div className="bg-purple-50 rounded-2xl p-3.5 mb-4">
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <p className="text-[13px] text-slate-700">
                      <span className="font-medium text-purple-700">Today:</span> {challenge.todayPrompt}
                    </p>
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex items-center justify-between">
                  {challenge.myStatus === 'pending' ? (
                    <>
                      <button 
                        onClick={() => {
                          setSelectedChallengeId(challenge.id);
                          setShowActivityModal(true);
                        }}
                        className="text-[13px] text-slate-500 hover:text-slate-700 transition-colors"
                      >
                        View activity
                      </button>
                      <button 
                        onClick={() => onNavigate?.('proof-camera')}
                        className="px-5 py-2.5 rounded-full bg-gradient-to-r from-primary to-secondary text-white text-[14px] font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
                      >
                        <Camera className="w-4 h-4" />
                        Submit proof
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => {
                          setSelectedChallengeId(challenge.id);
                          setShowActivityModal(true);
                        }}
                        className="text-[13px] text-slate-500 hover:text-slate-700 transition-colors"
                      >
                        View activity
                      </button>
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="text-[14px] font-medium">Done for today!</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Challenges */}
      {activeFilter === 'completed' && (
        <div className="px-6">
          <h2 className="text-[15px] font-semibold text-slate-800 mb-3">Completed</h2>
          <div className="space-y-3">
            {completedChallenges.map(challenge => (
              <div
                key={challenge.id}
                className="bg-white rounded-[20px] p-4 shadow-sm border border-slate-100 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-green-100 flex items-center justify-center text-xl">
                    {challenge.emoji}
                  </div>
                  <div>
                    <h3 className="text-[15px] font-semibold text-slate-800">{challenge.name}</h3>
                    <p className="text-[12px] text-slate-500">Completed {challenge.completedOn}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Medal className="w-5 h-5 text-amber-500" />
                  <span className="text-[14px] font-semibold text-slate-700">{challenge.streak} days</span>
                </div>
              </div>
            ))}
          </div>

          {completedChallenges.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <Trophy className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-[17px] font-semibold text-slate-800 mb-2">No completed challenges yet</h3>
              <p className="text-[14px] text-slate-500 max-w-xs">Finish your first challenge to see it here!</p>
            </div>
          )}
        </div>
      )}

      {/* Create Challenge Modal */}
      {showCreateModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" 
            onClick={() => setShowCreateModal(false)} 
          />
          <div className="fixed inset-0 flex items-end z-50 pointer-events-none">
            <div 
              className="w-full bg-white rounded-t-[32px] p-6 pointer-events-auto max-h-[85vh] overflow-y-auto"
              style={{ boxShadow: '0 -4px 20px rgba(0,0,0,0.1)' }}
            >
              <div className="w-9 h-1 bg-slate-200 rounded-full mx-auto mb-4" />
              
              <h2 className="text-[22px] font-bold text-slate-800 mb-2">Create Challenge</h2>
              <p className="text-[14px] text-slate-500 mb-6">Start a new challenge with your circle</p>

              {/* Challenge Name */}
              <div className="mb-5">
                <label className="text-[13px] font-medium text-slate-700 mb-2 block">Challenge Name</label>
                <input 
                  type="text"
                  placeholder="e.g., Morning Workout"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[15px] focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              {/* Duration */}
              <div className="mb-5">
                <label className="text-[13px] font-medium text-slate-700 mb-2 block">Duration</label>
                <div className="flex gap-2">
                  {['7 days', '14 days', '21 days', '30 days'].map((duration) => (
                    <button
                      key={duration}
                      className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 text-[13px] font-medium text-slate-700 hover:border-primary hover:text-primary transition-colors"
                    >
                      {duration}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div className="mb-5">
                <label className="text-[13px] font-medium text-slate-700 mb-2 block">Category</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: 'Fitness', emoji: '🏋️' },
                    { name: 'Wellness', emoji: '🧘' },
                    { name: 'Learning', emoji: '📚' },
                    { name: 'Productivity', emoji: '⚡' },
                    { name: 'Social', emoji: '👥' }
                  ].map((cat) => (
                    <button
                      key={cat.name}
                      className="px-4 py-2 rounded-full border border-slate-200 text-[13px] font-medium text-slate-700 hover:border-primary hover:text-primary transition-colors flex items-center gap-1.5"
                    >
                      <span>{cat.emoji}</span>
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Daily Prompt */}
              <div className="mb-6">
                <label className="text-[13px] font-medium text-slate-700 mb-2 block">Daily Check-in Prompt</label>
                <textarea 
                  placeholder="e.g., Share your workout proof"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[15px] focus:outline-none focus:border-primary transition-colors resize-none"
                  rows={2}
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-3.5 rounded-full border border-slate-200 text-[15px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    // Create new challenge (in real app would use form values)
                    setShowCreateModal(false);
                  }}
                  className="flex-1 px-4 py-3.5 rounded-full bg-gradient-to-r from-primary to-secondary text-white text-[15px] font-semibold hover:opacity-90 transition-opacity"
                >
                  Create & Invite
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Activity Modal */}
      {showActivityModal && selectedChallengeId && (
        <>
          <div 
            className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" 
            onClick={() => setShowActivityModal(false)} 
          />
          <div className="fixed inset-0 flex items-end z-50 pointer-events-none">
            <div 
              className="w-full bg-white rounded-t-[32px] p-6 pointer-events-auto max-h-[70vh] overflow-y-auto"
              style={{ boxShadow: '0 -4px 20px rgba(0,0,0,0.1)' }}
            >
              <div className="w-9 h-1 bg-slate-200 rounded-full mx-auto mb-4" />
              
              <h2 className="text-[20px] font-bold text-slate-800 mb-4">Today's Activity</h2>

              {/* Activity Feed */}
              <div className="space-y-4">
                {[
                  { name: 'Alex', time: '8:30 AM', status: 'completed', message: 'Morning jog done! 🏃‍♂️' },
                  { name: 'Sarah', time: '9:15 AM', status: 'completed', message: 'Crushed it at the gym!' },
                  { name: 'Mike', time: '—', status: 'pending', message: null },
                ].map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                      activity.status === 'completed' ? 'bg-gradient-to-br from-green-400 to-green-600' : 'bg-slate-300'
                    }`}>
                      {activity.name[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-800">{activity.name}</span>
                        <span className="text-[12px] text-slate-500">{activity.time}</span>
                      </div>
                      {activity.message ? (
                        <p className="text-[13px] text-slate-600 mt-1">{activity.message}</p>
                      ) : (
                        <p className="text-[13px] text-slate-400 mt-1">Hasn't posted yet</p>
                      )}
                    </div>
                    {activity.status === 'completed' && (
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>

              {/* Close Button */}
              <button 
                onClick={() => setShowActivityModal(false)}
                className="w-full mt-6 py-3.5 rounded-full bg-slate-100 text-slate-700 text-[15px] font-semibold hover:bg-slate-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}