import { ArrowLeft, Camera, CheckCircle2, User, Users } from "lucide-react";
import { IOSStatusBar } from "../components/IOSStatusBar";
import { VoicePill } from "../components/VoicePill";

interface ChallengesScreenProps {
  onNavigate?: (screen: string) => void;
}

export function ChallengesScreen({ onNavigate }: ChallengesScreenProps) {
  const activeChallenges = [
    {
      id: 1,
      name: 'Morning Workout Streak',
      duration: '30 days',
      members: ['A', 'B', 'C', 'D', 'E'],
      todayPrompt: 'Post your workout proof',
      progress: { completed: 3, total: 5 },
      myStatus: 'pending'
    },
    {
      id: 2,
      name: 'Daily Reading',
      duration: '14 days',
      members: ['J', 'M', 'S'],
      todayPrompt: 'Share what you read today',
      progress: { completed: 2, total: 3 },
      myStatus: 'completed'
    },
  ];

  const invites = [
    {
      id: 1,
      name: 'Hydration Challenge',
      inviter: 'Sarah',
      duration: '7 days',
      members: ['S', 'K', 'L'],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F6F7FA] pb-32">
      <IOSStatusBar />
      
      {/* Header */}
      <div className="px-6 pt-4 pb-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => onNavigate?.('hub')}
            className="p-2 rounded-full hover:bg-black/5 transition-colors -ml-2"
          >
            <ArrowLeft className="w-6 h-6 text-slate-600" />
          </button>
          <h1 className="text-[20px] font-semibold text-slate-800">Challenges</h1>
          <div className="w-10" /> {/* Spacer */}
        </div>

        <VoicePill placeholder="Create a new challenge..." />
      </div>

      {/* Active Challenges */}
      <div className="px-6 mb-8">
        <h2 className="text-[17px] font-semibold text-slate-800 mb-4">Active</h2>
        <div className="space-y-4">
          {activeChallenges.map(challenge => (
            <div
              key={challenge.id}
              className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-100"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-[17px] font-semibold text-slate-800 mb-1">
                    {challenge.name}
                  </h3>
                  <p className="text-[13px] text-slate-500">{challenge.duration}</p>
                </div>
                {challenge.myStatus === 'completed' && (
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                )}
              </div>

              {/* Members */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {challenge.members.slice(0, 4).map((member, index) => (
                    <div
                      key={index}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white text-[13px] font-semibold border-2 border-white"
                      style={{ marginLeft: index > 0 ? '-8px' : '0', zIndex: 4 - index }}
                    >
                      {member}
                    </div>
                  ))}
                  {challenge.members.length > 4 && (
                    <span className="ml-2 text-[13px] text-slate-500">
                      +{challenge.members.length - 4}
                    </span>
                  )}
                </div>
              </div>

              {/* Today's Prompt */}
              <div className="bg-purple-50 rounded-2xl p-4 mb-4">
                <p className="text-[15px] text-slate-700">
                  <span className="font-medium">Today:</span> {challenge.todayPrompt}
                </p>
              </div>

              {/* Progress & Action */}
              <div className="flex items-center justify-between">
                <p className="text-[13px] text-slate-500">
                  {challenge.progress.completed} of {challenge.progress.total} completed today
                </p>
                {challenge.myStatus === 'pending' ? (
                  <button 
                    onClick={() => onNavigate?.('proof-camera')}
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-[#B58CFF] to-[#64C7FF] text-white text-[14px] font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    Submit proof
                  </button>
                ) : (
                  <span className="text-[13px] font-medium text-green-600">Done for today!</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invites */}
      {invites.length > 0 && (
        <div className="px-6">
          <h2 className="text-[17px] font-semibold text-slate-800 mb-4">Invites</h2>
          <div className="space-y-4">
            {invites.map(invite => (
              <div
                key={invite.id}
                className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-100"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-[17px] font-semibold text-slate-800 mb-1">
                      {invite.name}
                    </h3>
                    <p className="text-[13px] text-slate-500">
                      Invited by {invite.inviter} • {invite.duration}
                    </p>
                  </div>
                </div>

                {/* Members */}
                <div className="flex items-center mb-4">
                  {invite.members.map((member, index) => (
                    <div
                      key={index}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white text-[13px] font-semibold border-2 border-white"
                      style={{ marginLeft: index > 0 ? '-8px' : '0', zIndex: 3 - index }}
                    >
                      {member}
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button className="flex-1 py-2.5 rounded-full bg-gradient-to-r from-[#B58CFF] to-[#64C7FF] text-white text-[15px] font-medium hover:opacity-90 transition-opacity">
                    Accept
                  </button>
                  <button className="flex-1 py-2.5 rounded-full bg-slate-100 text-slate-700 text-[15px] font-medium hover:bg-slate-200 transition-colors">
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}