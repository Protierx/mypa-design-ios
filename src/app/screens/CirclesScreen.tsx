import { Users, Plus, Flame, TrendingUp, Search, X, Copy, Share2, Check, ChevronRight } from "lucide-react";
import { IOSStatusBar } from "../components/IOSStatusBar";
import { useState, useEffect } from "react";

interface CirclesScreenProps {
  onNavigate?: (screen: string) => void;
  onModalStateChange?: (isOpen: boolean) => void;
}

// Generate a random invite code (e.g., MYPA-7K2P)
function generateInviteCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `MYPA-${code}`;
}

export function CirclesScreen({ onNavigate, onModalStateChange }: CirclesScreenProps) {
  const [activeTab, setActiveTab] = useState<'circles' | 'feed'>('circles');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterChip, setFilterChip] = useState<'all' | 'active' | 'your-turn'>('all');
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [joinError, setJoinError] = useState('');
  const [joinSuccess, setJoinSuccess] = useState(false);
  
  const [circles, setCircles] = useState([
    {
      id: 1,
      name: 'Morning Warriors',
      members: [
        { initial: 'A', posted: true },
        { initial: 'B', posted: true },
        { initial: 'C', posted: false },
        { initial: 'D', posted: true },
      ],
      challenge: '30-day fitness streak',
      posted: 3,
      total: 4,
      streak: 12,
      lastActivity: '24m ago',
      inviteCode: 'MYPA-7K2P',
      inviteLink: 'https://mypa.app/invite/MYPA-7K2P',
    },
    {
      id: 2,
      name: 'Product Team',
      members: [
        { initial: 'J', posted: true },
        { initial: 'M', posted: true },
        { initial: 'S', posted: false },
      ],
      challenge: 'Daily standup attendance',
      posted: 2,
      total: 3,
      streak: 8,
      lastActivity: '12m ago',
      inviteCode: 'MYPA-9F4L',
      inviteLink: 'https://mypa.app/invite/MYPA-9F4L',
    },
    {
      id: 3,
      name: 'Book Club',
      members: [
        { initial: 'E', posted: true },
        { initial: 'R', posted: false },
        { initial: 'L', posted: true },
        { initial: 'K', posted: false },
        { initial: 'P', posted: true },
      ],
      challenge: 'Read 15min daily',
      posted: 3,
      total: 5,
      streak: 5,
      lastActivity: '2h ago',
      inviteCode: 'MYPA-2X8Q',
      inviteLink: 'https://mypa.app/invite/MYPA-2X8Q',
    },
  ]);

  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newMembers, setNewMembers] = useState('');
  const [newPrivacy, setNewPrivacy] = useState<'public' | 'private'>('public');

  // Update parent about modal state
  useEffect(() => {
    const isAnyModalOpen = joinModalOpen || createOpen;
    onModalStateChange?.(isAnyModalOpen);
  }, [joinModalOpen, createOpen, onModalStateChange]);

  function handleCreateCircle() {
    if (!newName.trim()) return;

    const nextId = Math.max(0, ...circles.map(c => c.id)) + 1;
    const memberInitials = newMembers
      .split(',')
      .map(s => s.trim().charAt(0).toUpperCase())
      .filter(Boolean);

    const inviteCode = generateInviteCode();
    const newCircle = {
      id: nextId,
      name: newName.trim(),
      members: memberInitials.length ? memberInitials.map(initial => ({ initial, posted: false })) : [{ initial: 'A', posted: false }],
      challenge: '',
      posted: 0,
      total: memberInitials.length || 1,
      streak: 0,
      lastActivity: 'just now',
      privacy: newPrivacy,
      inviteCode: inviteCode,
      inviteLink: `https://mypa.app/invite/${inviteCode}`,
    } as any;

    setCircles([newCircle, ...circles]);
    setNewName('');
    setNewMembers('');
    setNewPrivacy('public');
    setCreateOpen(false);
  }

  function handleJoinCircle() {
    if (!joinCode.trim()) return;

    setJoinError('');
    const normalizedCode = joinCode.trim().toUpperCase();
    const foundCircle = circles.find(c => c.inviteCode === normalizedCode);

    if (!foundCircle) {
      setJoinError('Invalid code. Please check and try again.');
      return;
    }

    const updatedCircles = circles.map(c => {
      if (c.id === foundCircle.id) {
        if (c.members.some(m => m.initial === 'U')) {
          setJoinError('You are already a member of this circle.');
          return c;
        }
        return {
          ...c,
          members: [...c.members, { initial: 'U', posted: false }],
          total: c.total + 1,
        };
      }
      return c;
    });

    setCircles(updatedCircles);
    setJoinSuccess(true);
    setJoinCode('');
    
    setTimeout(() => {
      setJoinSuccess(false);
      setJoinModalOpen(false);
    }, 1500);
  }

  // Calculate filtered circles based on search and filter
  let filteredCircles = [...circles];

  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filteredCircles = filteredCircles.filter(circle =>
      circle.name.toLowerCase().includes(query)
    );
  }

  if (filterChip === 'active') {
    filteredCircles = filteredCircles.filter(c => c.posted > 0);
  } else if (filterChip === 'your-turn') {
    filteredCircles = filteredCircles.filter(c => c.posted < c.total);
  }

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
        .ios-card:active {
          transform: scale(0.98);
          transition: transform 0.15s ease;
        }
        .circle-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }
      `}</style>
      
      {/* Header */}
      <div className="px-5 pt-2 pb-4">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">Circles</h1>
          <div className="flex gap-2">
            <button 
              onClick={() => setJoinModalOpen(true)}
              className="px-4 py-2 rounded-full bg-white text-slate-700 text-[14px] font-semibold shadow-sm active:scale-95 transition-transform"
            >
              Join
            </button>
            <button 
              onClick={() => setCreateOpen(true)}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/20 active:scale-95 transition-transform"
            >
              <Plus className="w-5 h-5 text-white" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mt-3">
          {[
            { id: 'all', label: 'All' },
            { id: 'active', label: 'Active' },
            { id: 'your-turn', label: 'Your turn' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterChip(tab.id as any)}
              className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-all ${
                filterChip === tab.id
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-600 shadow-sm"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 mb-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search circles…"
            className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-white shadow-sm border-0 outline-none text-slate-900 placeholder-slate-400 text-[15px]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          )}
        </div>
      </div>

      {/* Circles List */}
      <div className="px-4 space-y-3">
        {filteredCircles.length === 0 ? (
          <div className="ios-card p-8 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-purple-500" />
            </div>
            <h3 className="text-[17px] font-semibold text-slate-900 mb-1">No circles found</h3>
            <p className="text-[14px] text-slate-500">Create or join a circle to get started</p>
          </div>
        ) : (
          filteredCircles.map(circle => (
            <button
              key={circle.id}
              onClick={() => onNavigate?.('circle-home')}
              className="w-full circle-card rounded-2xl p-4 shadow-sm text-left active:scale-[0.98] transition-transform"
            >
              <div className="flex items-center gap-4">
                {/* Circle Avatar */}
                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/20 flex-shrink-0">
                  <Users className="w-6 h-6 text-white" />
                  {/* Streak badge */}
                  <div className="absolute -top-1 -right-1 flex items-center gap-0.5 bg-orange-500 px-1.5 py-0.5 rounded-full">
                    <Flame className="w-2.5 h-2.5 text-white" />
                    <span className="text-[10px] font-bold text-white">{circle.streak}</span>
                  </div>
                </div>
                
                {/* Circle Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-[16px] font-semibold text-slate-900 truncate">{circle.name}</h3>
                  <p className="text-[13px] text-slate-500 mt-0.5">{circle.challenge || `${circle.total} members`}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1.5">
                      <div className={`text-[12px] font-semibold px-2 py-0.5 rounded-full ${
                        circle.posted === circle.total 
                          ? 'bg-emerald-500/10 text-emerald-600' 
                          : 'bg-amber-500/10 text-amber-600'
                      }`}>
                        {circle.posted}/{circle.total} posted
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400">{circle.lastActivity}</span>
                  </div>
                </div>

                {/* Member Avatars */}
                <div className="flex -space-x-2">
                  {circle.members.slice(0, 3).map((member, i) => (
                    <div 
                      key={i} 
                      className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[12px] font-semibold text-slate-600 border-2 ${
                        member.posted ? 'border-emerald-400' : 'border-slate-200'
                      }`}
                    >
                      {member.initial}
                    </div>
                  ))}
                  {circle.members.length > 3 && (
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-semibold text-slate-500 border-2 border-slate-200">
                      +{circle.members.length - 3}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Create Circle Modal */}
      {createOpen && (
        <div className="fixed inset-0 z-[9999] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setCreateOpen(false)} />

          <div className="relative w-full max-w-[390px] bg-white rounded-t-[28px] p-6 pb-10 shadow-2xl animate-in slide-in-from-bottom">
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-5" />
            <h2 className="text-[20px] font-bold text-slate-900 mb-5">Create Circle</h2>

            <label className="block text-[13px] font-semibold text-slate-500 uppercase tracking-wide mb-2">Name</label>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full mb-4 px-4 py-3.5 rounded-2xl bg-slate-100 outline-none text-slate-900 placeholder-slate-400 text-[15px]"
              placeholder="e.g. Weekend Runners"
            />

            <label className="block text-[13px] font-semibold text-slate-500 uppercase tracking-wide mb-2">Invite Members</label>
            <input
              value={newMembers}
              onChange={(e) => setNewMembers(e.target.value)}
              className="w-full mb-4 px-4 py-3.5 rounded-2xl bg-slate-100 outline-none text-slate-900 placeholder-slate-400 text-[15px]"
              placeholder="Alex, Sam, Priya"
            />

            <label className="block text-[13px] font-semibold text-slate-500 uppercase tracking-wide mb-2">Privacy</label>
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setNewPrivacy('public')}
                className={`flex-1 py-3 rounded-2xl text-[14px] font-semibold transition-all ${
                  newPrivacy === 'public' 
                    ? 'bg-slate-900 text-white' 
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                Public
              </button>
              <button
                onClick={() => setNewPrivacy('private')}
                className={`flex-1 py-3 rounded-2xl text-[14px] font-semibold transition-all ${
                  newPrivacy === 'private' 
                    ? 'bg-slate-900 text-white' 
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                Private
              </button>
            </div>

            <button
              onClick={handleCreateCircle}
              disabled={!newName.trim()}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold text-[16px] disabled:opacity-50 shadow-lg shadow-purple-500/25 active:scale-[0.98] transition-transform"
            >
              Create Circle
            </button>
          </div>
        </div>
      )}

      {/* Join Circle Modal */}
      {joinModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => {
            setJoinModalOpen(false);
            setJoinError('');
            setJoinCode('');
          }} />

          <div className="relative w-full max-w-[390px] bg-white rounded-t-[28px] p-6 pb-10 shadow-2xl animate-in slide-in-from-bottom">
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-5" />
            
            {joinSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-[20px] font-bold text-slate-900">You're in!</h3>
                <p className="text-[14px] text-slate-500 mt-1">Successfully joined the circle</p>
              </div>
            ) : (
              <>
                <h2 className="text-[20px] font-bold text-slate-900 mb-2">Join Circle</h2>
                <p className="text-[14px] text-slate-500 mb-5">Enter the invite code to join</p>

                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => {
                    setJoinCode(e.target.value.toUpperCase());
                    setJoinError('');
                  }}
                  placeholder="e.g. MYPA-7K2P"
                  className="w-full mb-4 px-4 py-4 rounded-2xl bg-slate-100 outline-none text-slate-900 placeholder-slate-400 text-[17px] font-semibold text-center tracking-wider"
                />

                {joinError && (
                  <p className="text-[13px] text-red-500 mb-4 text-center">{joinError}</p>
                )}

                <button
                  onClick={handleJoinCircle}
                  disabled={!joinCode.trim()}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold text-[16px] disabled:opacity-50 shadow-lg shadow-purple-500/25 active:scale-[0.98] transition-transform"
                >
                  Join Circle
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}