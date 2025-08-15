import { Link } from 'wouter';
import { ArrowLeft } from 'lucide-react';

export default function SkillsScreen() {
  const skills = [
    { id: 1, name: 'Speed Boost', level: 0, maxLevel: 10, color: 'green', icon: '⚡' },
    { id: 2, name: 'Jump Power', level: 0, maxLevel: 10, color: 'blue', icon: '🦘' },
    { id: 3, name: 'Token Magnet', level: 0, maxLevel: 8, color: 'yellow', icon: '🧲' },
    { id: 4, name: 'Shield Defense', level: 0, maxLevel: 5, color: 'purple', icon: '🛡️' },
    { id: 5, name: 'Double Points', level: 0, maxLevel: 3, color: 'orange', icon: '💎' },
    { id: 6, name: 'Time Slow', level: 0, maxLevel: 5, color: 'cyan', icon: '⏰' },
  ];

  const totalXP = 0;
  const availablePoints = 0;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="h-20 bg-gradient-to-r from-black via-gray-900 to-black border-b border-yellow-400 relative">
        <div className="flex items-center justify-between h-full px-6">
          <Link href="/">
            <button className="flex items-center space-x-2 text-yellow-400 hover:text-yellow-300 font-mono">
              <ArrowLeft className="w-4 h-4" />
              <span>BACK TO HUB</span>
            </button>
          </Link>
          <h1 className="text-xl font-orbitron font-black text-yellow-400 tracking-wider">
            SKILLS
          </h1>
          <div className="bg-black border border-yellow-400 px-3 py-1 font-mono text-xs">
            SKILLS.SYS
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-5xl mx-auto">
          
          {/* Skills Overview */}
          <div className="bg-black border-2 border-yellow-400 p-8 mb-8 relative">
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-yellow-400" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-yellow-400" />
            
            <div className="text-center mb-8">
              <h2 className="text-3xl font-mono font-bold text-yellow-400 mb-2 tracking-wider">
                ⚡ NEURAL UPGRADES
              </h2>
              <p className="text-yellow-300/70 font-mono">Skill Enhancement System</p>
            </div>

            {/* XP and Points */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-900 border border-yellow-500/50 p-4 text-center">
                <div className="text-3xl text-yellow-400 font-mono font-bold mb-2">{totalXP}</div>
                <div className="text-sm text-yellow-300/70 font-mono">TOTAL XP</div>
              </div>
              <div className="bg-gray-900 border border-green-500/50 p-4 text-center">
                <div className="text-3xl text-green-400 font-mono font-bold mb-2">{availablePoints}</div>
                <div className="text-sm text-green-300/70 font-mono">SKILL POINTS</div>
              </div>
              <div className="bg-gray-900 border border-purple-500/50 p-4 text-center">
                <div className="text-3xl text-purple-400 font-mono font-bold mb-2">0</div>
                <div className="text-sm text-purple-300/70 font-mono">UPGRADES</div>
              </div>
            </div>

            {/* Skills Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {skills.map((skill) => (
                <div key={skill.id} className={`bg-gray-900 border border-${skill.color}-500/50 p-6 relative`}>
                  <div className={`absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-${skill.color}-400`} />
                  <div className={`absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-${skill.color}-400`} />
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{skill.icon}</div>
                      <div>
                        <div className={`font-mono font-bold text-${skill.color}-400 text-lg`}>
                          {skill.name}
                        </div>
                        <div className="text-sm text-gray-400 font-mono">
                          Level {skill.level}/{skill.maxLevel}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="w-full bg-gray-700 h-2 relative overflow-hidden">
                      <div 
                        className={`h-full bg-${skill.color}-400 transition-all duration-500`}
                        style={{ width: `${(skill.level / skill.maxLevel) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Upgrade Button */}
                  <button 
                    className={`w-full border-2 border-${skill.color}-400/50 bg-${skill.color}-600/20 text-${skill.color}-400 hover:bg-${skill.color}-600/30 transition-colors font-mono py-2 px-4 ${
                      skill.level >= skill.maxLevel || availablePoints === 0 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:border-' + skill.color + '-400'
                    }`}
                    disabled={skill.level >= skill.maxLevel || availablePoints === 0}
                  >
                    {skill.level >= skill.maxLevel ? 'MAX LEVEL' : 
                     availablePoints === 0 ? 'NO POINTS' : 'UPGRADE'}
                  </button>
                </div>
              ))}
            </div>

            {/* How to Earn Points */}
            <div className="mt-8 bg-black/60 border border-yellow-400/30 p-6">
              <h3 className="font-mono font-bold text-yellow-400 mb-4 text-center">
                HOW TO EARN SKILL POINTS
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="font-mono text-sm">
                  <div className="text-green-400 mb-2">COMPLETE RUNS</div>
                  <div className="text-green-300/70">Earn XP by finishing levels</div>
                </div>
                <div className="font-mono text-sm">
                  <div className="text-blue-400 mb-2">HIGH SCORES</div>
                  <div className="text-blue-300/70">Bonus XP for top performance</div>
                </div>
                <div className="font-mono text-sm">
                  <div className="text-purple-400 mb-2">DAILY QUESTS</div>
                  <div className="text-purple-300/70">Complete challenges for rewards</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}