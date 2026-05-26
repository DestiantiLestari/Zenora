import { useState } from 'react';
import { Calendar, Heart, ShieldCheck, Activity, ChevronRight, UserCheck, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { pregnancyWeeksData } from '../data';
import { MoodEntry } from '../types';

interface HeroProps {
  onTabChange: (tab: string) => void;
  gestationalWeek: number;
  moodEntries?: MoodEntry[];
}

export default function Hero({ onTabChange, gestationalWeek, moodEntries = [] }: HeroProps) {
  const [selectedTrimester, setSelectedTrimester] = useState<1 | 2 | 3>(1);

  // Find info based on week
  const currentInfo = pregnancyWeeksData.find((w) => w.week === gestationalWeek) || pregnancyWeeksData[2];

  // Get latest mood entry
  const latestMood = moodEntries.length > 0 ? moodEntries[moodEntries.length - 1] : null;

  const trimesterQuips = {
    1: {
      range: 'Weeks 1 – 12',
      title: 'Trimester of Genesis & Adaptation',
      symptoms: 'Morning discomfort, fatigue, olfactory sensitivity, emotional swings',
      affirmation: '“My body is performing a magnificent, invisible alchemy. I honor my tiredness and give myself grace to retreat and rest.”',
      focus: 'Embryological neural tube division & cellular blueprinting'
    },
    2: {
      range: 'Weeks 13 – 26',
      title: 'Trimester of Radiance & Movement',
      symptoms: 'Growing belly, mild back tension, fluttering baby movements ("quickening")',
      affirmation: '“As I feel my baby’s first soft movements, I develop an deep, loving sanctuary of mutual peace and trust.”',
      focus: 'Auditory development, sleep-wake cycles & active muscular tests'
    },
    3: {
      range: 'Weeks 27 – 40',
      title: 'Trimester of Nesting & Readiness',
      symptoms: 'Pelvic weight, shortness of breath, nesting urges, harmless pre-contractions',
      affirmation: '“I am incredibly strong, resilient, and fully equipped to bring this life forward. Every wave brings me closer to our meeting.”',
      focus: 'Lung maturation, fat storage & physical preparation for childbirth'
    }
  };

  return (
    <div className="bg-[#FFFDFB] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Main Hero Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-8 md:py-12">
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FCEEEF]/60 text-[#D48C8C] border border-[#F5D7D7] uppercase tracking-wider font-mono">
              <Sparkles className="h-3.5 w-3.5 animate-pulse text-[#D48C8C]" />
              <span>Compassionate Maternal Care Clinic</span>
            </span>
            
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#3C2F2F] tracking-tight leading-tight">
              Where mental wellness <br className="hidden md:inline" /> meets <span className="text-[#D48C8C] relative after:content-[''] after:absolute after:bottom-1 after:left-0 after:w-full after:h-1.5 after:bg-[#FCEEEF] after:-z-10">pregnancy care</span>.
            </h1>
            
            <p className="text-base sm:text-lg text-[#5E4C4C] max-w-2xl leading-relaxed">
              Zenora is a modern prenatal workspace specifically engineered to support you through both the physiological and psychological transitions of pregnancy, postpartum, and motherhood. Discover license-certified care experts and trackable wellness analytics.
            </p>

            {/* CTA Group */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3.5 justify-start">
              <button 
                onClick={() => onTabChange('pregnancy')}
                className="flex items-center justify-center space-x-2 bg-[#D48C8C] hover:bg-[#C27B7B] text-white px-8 py-4 rounded-full font-bold shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.01] cursor-pointer"
              >
                <span>Launch Pregnancy Clock</span>
                <ChevronRight className="h-5 w-5" />
              </button>
              <button 
                onClick={() => onTabChange('mental-health')}
                className="flex items-center justify-center space-x-2 bg-white border border-[#E9C2C2] hover:bg-[#FAF6F0] text-[#5E4C4C] px-8 py-4 rounded-full font-bold transition-all duration-200 hover:scale-[1.01] cursor-pointer shadow-3xs"
              >
                <Calendar className="h-5 w-5 text-[#D48C8C]" />
                <span>Track Today’s Mood</span>
              </button>
            </div>

            {/* Clinical Badging */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-[#FAF6F0]">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="h-5 w-5 text-[#D48C8C] shrink-0" />
                <span className="text-xs text-[#5E4C4C] font-semibold font-mono uppercase tracking-wider">HIPAA Secured</span>
              </div>
              <div className="flex items-center space-x-2">
                <UserCheck className="h-5 w-5 text-[#D48C8C] shrink-0" />
                <span className="text-xs text-[#5E4C4C] font-semibold font-mono uppercase tracking-wider">Accredited MDs</span>
              </div>
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-[#D48C8C] shrink-0" />
                <span className="text-xs text-[#5E4C4C] font-semibold font-mono uppercase tracking-wider">Somatic Tracking</span>
              </div>
            </div>
          </div>

          {/* Right Side - Visual Premium Card */}
          <div className="lg:col-span-5 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#FCEEEF]/80 to-transparent rounded-3xl -rotate-2 scale-102 blur-xs" />
            <motion.div 
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="relative bg-white border border-[#FAECEC] rounded-3xl p-6 sm:p-8 shadow-xs hover:shadow-xs transition-shadow"
            >
              <div className="flex justify-between items-center pb-4 border-b border-[#FAF6F0]">
                <div className="text-left">
                  <span className="text-[10px] font-mono text-[#D48C8C] font-bold uppercase tracking-wider">MOMENTARY SNAPSHOT</span>
                  <p className="text-xl font-serif font-bold text-[#3C2F2F] mt-0.5">Active Gestation clock</p>
                </div>
                <div className="bg-[#FFF5F5] px-4 py-1.5 rounded-full border border-[#FAECEC] text-xs font-bold font-mono text-[#D48C8C]">
                  Week {gestationalWeek}
                </div>
              </div>

               {/* Weekly display snapshot widget */}
              <div className="py-6 space-y-4">
                <div className="flex items-center space-x-4 bg-[#FFFDFB] p-4 rounded-2xl border border-[#FAEDE9]">
                  <div className="text-3xl bg-white w-12 h-12 rounded-xl border border-[#FAECE7] flex items-center justify-center shadow-3xs shrink-0">
                    {currentInfo.fruitEmoji}
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-sm text-[#4F3E3E]">Week {currentInfo.week}: {currentInfo.babySizeFruit}</h4>
                    <p className="text-xs text-[#8C7A7A] mt-0.5 mt-0.5">Baby: ~{currentInfo.babyLengthCm} cm, {currentInfo.babyWeightG}g. {currentInfo.babyDevelopments.slice(0, 90)}...</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 bg-[#FCEEEF]/30 p-4 rounded-2xl border border-[#F5E2E2]">
                  <div className="text-3xl bg-white w-12 h-12 rounded-xl border border-[#FAECEC] flex items-center justify-center shadow-3xs shrink-0">
                    {latestMood ? '🩺' : '🧘‍♀️'}
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-sm text-[#4F3E3E]">Your Mental Status</h4>
                    {latestMood ? (
                      <>
                        <span className="text-[10px] inline-block font-mono bg-[#E9C2C2] text-white px-2 py-0.5 rounded-full uppercase mt-1">
                          {latestMood.emotion} State
                        </span>
                        <p className="text-xs text-[#8C7A7A] mt-1">{latestMood.notes ? latestMood.notes.slice(0, 80) + '...' : 'Somatic patterns successfully recorded'}</p>
                      </>
                    ) : (
                      <>
                        <span className="text-[10px] inline-block font-mono bg-[#E9C2C2] text-white px-2 py-0.5 rounded-full uppercase mt-1">
                          Not Logged Today
                        </span>
                        <p className="text-xs text-[#8C7A7A] mt-1">Log your physical and emotional adjustments now to identify trends.</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action item card footer */}
              <div className="bg-[#FAF6F0]/60 rounded-2xl p-4 border border-[#FAECEC] flex justify-between items-center text-xs">
                <span className="text-[#5E4C4C] font-semibold">Scheduled physical care appointments?</span>
                <button 
                  onClick={() => onTabChange('consultations')} 
                  className="text-[#D48C8C] hover:text-[#C27B7B] font-bold flex items-center space-x-0.5 cursor-pointer"
                >
                  <span>Verify</span>
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Trimester Insights Widget (The Interactive Experience) */}
        <div className="py-12 border-t border-[#F4E1E1]">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="font-serif text-3xl font-bold text-[#3C2F2F]">Interactive Trimester Roadmap</h2>
            <p className="text-sm text-[#5E4C4C] mt-2">
              Select a stage to explore typical physiological milestones, emotional focus regions, and maternal affirmations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 bg-[#FFFDFB] p-2 rounded-2xl border border-[#F4E1E1] max-w-4xl mx-auto mb-8 shadow-xs">
            {([1, 2, 3] as const).map((tri) => (
              <button
                key={tri}
                onClick={() => setSelectedTrimester(tri)}
                className={`py-3 px-4 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  selectedTrimester === tri
                    ? 'bg-[#FCEEEF] text-[#D48C8C] shadow-xs border border-[#E9C2C2]'
                    : 'text-[#8C7A7A] hover:bg-[#FAF6F0] hover:text-[#4F3E3E]'
                }`}
              >
                Trimester {tri} <span className="block text-xs font-normal text-[#A39191]">{trimesterQuips[tri].range}</span>
              </button>
            ))}
          </div>

          {/* Expanded Trimester Content Card */}
          <div className="max-w-4xl mx-auto bg-white border border-[#F4E1E1] rounded-3xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 shadow-sm">
            <div className="md:col-span-7 space-y-4">
              <span className="text-xs font-mono font-bold text-[#D48C8C] uppercase tracking-wider">GUIDANCE PORTAL</span>
              <h3 className="font-serif text-2xl font-bold text-[#4F3E3E]">{trimesterQuips[selectedTrimester].title}</h3>
              
              <div>
                <h4 className="text-xs uppercase font-mono tracking-wider text-[#8C7A7A] font-semibold">Typical Gestational Adjustments</h4>
                <p className="text-sm text-[#5E4C4C] mt-1">{trimesterQuips[selectedTrimester].symptoms}</p>
              </div>

              <div>
                <h4 className="text-xs uppercase font-mono tracking-wider text-[#8C7A7A] font-semibold">Development Focus</h4>
                <p className="text-sm text-[#5E4C4C] mt-1">{trimesterQuips[selectedTrimester].focus}</p>
              </div>
            </div>

            <div className="md:col-span-5 bg-[#FAF4F0] rounded-2xl p-6 border border-[#E9C2C2]/50 flex flex-col justify-center items-center text-center">
              <span className="text-3xl mb-3">🧘‍♀️</span>
              <h4 className="text-xs uppercase font-mono tracking-wider text-[#D48C8C] font-semibold mb-2">Soothing Affirmation</h4>
              <p className="font-serif italic text-sm text-[#5E4C4C] leading-relaxed">
                {trimesterQuips[selectedTrimester].affirmation}
              </p>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="py-12 border-t border-[#F4E1E1]">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-serif text-3xl font-bold text-[#3C2F2F]">Four Core Support Modules</h2>
            <p className="text-sm text-[#5E4C4C] mt-2">
              Every stage of your journey deserves dedicated focus, medical accuracy, and compassionate design.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div 
              onClick={() => onTabChange('mental-health')}
              className="bg-white border border-[#F4E1E1] hover:border-[#D48C8C] rounded-2xl p-6 shadow-xs hover:shadow-sm transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#FCEEEF] flex items-center justify-center border border-[#FAECEC] mb-4 text-[#D48C8C] group-hover:scale-110 transition-transform">
                <span>🧘‍♀️</span>
              </div>
              <h3 className="font-serif font-bold text-lg text-[#4F3E3E] group-hover:text-[#D48C8C] transition-colors">Mood Analytics</h3>
              <p className="text-xs text-[#5E4C4C] mt-2 leading-relaxed">
                Log daily mental states, record structural physical symptoms, water, and sleep. Track your somatic patterns with interactive visual analytics.
              </p>
            </div>

            <div 
              onClick={() => onTabChange('pregnancy')}
              className="bg-white border border-[#F4E1E1] hover:border-[#D48C8C] rounded-2xl p-6 shadow-xs hover:shadow-sm transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#FCEEEF] flex items-center justify-center border border-[#FAECEC] mb-4 text-[#D48C8C] group-hover:scale-110 transition-transform">
                <span>👶</span>
              </div>
              <h3 className="font-serif font-bold text-lg text-[#4F3E3E] group-hover:text-[#D48C8C] transition-colors">Pregnancy Tracker</h3>
              <p className="text-xs text-[#5E4C4C] mt-2 leading-relaxed">
                Set active pregnancy weeks to visualize fruit size comparisons, log kick counting sessions, and check off prenatal clinical safety checklists easily.
              </p>
            </div>

            <div 
              onClick={() => onTabChange('consultations')}
              className="bg-white border border-[#F4E1E1] hover:border-[#D48C8C] rounded-2xl p-6 shadow-xs hover:shadow-sm transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#FCEEEF] flex items-center justify-center border border-[#FAECEC] mb-4 text-[#D48C8C] group-hover:scale-110 transition-transform">
                <span>👩‍⚕️</span>
              </div>
              <h3 className="font-serif font-bold text-lg text-[#4F3E3E] group-hover:text-[#D48C8C] transition-colors">Clinical Consults</h3>
              <p className="text-xs text-[#5E4C4C] mt-2 leading-relaxed">
                Connect directly with board-certified maternal OB-GYNs, mental coaches, lactation specialists, or doulas. Book, chat, and meet in-app securely.
              </p>
            </div>

            <div 
              onClick={() => onTabChange('education')}
              className="bg-white border border-[#F4E1E1] hover:border-[#D48C8C] rounded-2xl p-6 shadow-xs hover:shadow-sm transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#FCEEEF] flex items-center justify-center border border-[#FAECEC] mb-4 text-[#D48C8C] group-hover:scale-110 transition-transform">
                <span>📚</span>
              </div>
              <h3 className="font-serif font-bold text-lg text-[#4F3E3E] group-hover:text-[#D48C8C] transition-colors">Safety Education</h3>
              <p className="text-xs text-[#5E4C4C] mt-2 leading-relaxed">
                Browse clinical articles compiled by licensed specialists, test your nutritional wisdom with active interactive scoring quizzes.
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Social Quote */}
        <div className="mt-8 bg-gradient-to-tr from-[#FFFDFB] to-[#FAF6F0] border border-[#F4E1E1] rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center space-x-3">
            <span className="text-3xl text-gradient">🎗️</span>
            <div>
              <p className="font-serif font-semibold text-sm text-[#4F3E3E]">Zenora Family Community</p>
              <p className="text-xs text-[#8C7A7A]">Join over 15,000 mothers navigating this beautiful path collectively.</p>
            </div>
          </div>
          <button 
            onClick={() => onTabChange('ai-chat')}
            className="bg-[#D48C8C]/15 hover:bg-[#D48C8C]/25 text-[#D48C8C] px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide uppercase transition-colors"
          >
            Chat with Zenora AI Clinical Assistant
          </button>
        </div>

      </div>
    </div>
  );
}
