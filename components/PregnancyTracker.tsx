import { useState, useEffect } from 'react';
import { pregnancyWeeksData, WeeklyPregnancyInfo } from '../data';
import { KickSession } from '../types';
import { Calendar, CheckCircle2, Circle, TrendingUp, Play, StopCircle, RefreshCw, Sparkles, Footprints, Clock, Activity, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PregnancyTrackerProps {
  gestationalWeek: number;
  onWeekChange: (week: number) => void;
  kickSessions: KickSession[];
  onAddKickSession: (session: KickSession) => void;
}

// Basic pre-defined checklist items throughout pregnancy
interface ChecklistItem {
  id: string;
  task: string;
  trimester: 1 | 2 | 3;
  completed: boolean;
}

export default function PregnancyTracker({
  gestationalWeek,
  onWeekChange,
  kickSessions,
  onAddKickSession
}: PregnancyTrackerProps) {
  
  // Find current week detail
  const currentInfo = pregnancyWeeksData.find((w) => w.week === gestationalWeek) || pregnancyWeeksData[2];

  // Checklist items
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: 'cl_1', task: 'Begin folic acid & initial prenatal labs check', trimester: 1, completed: true },
    { id: 'cl_2', task: 'First confirmation ultrasound (weeks 8-12)', trimester: 1, completed: true },
    { id: 'cl_3', task: 'Schedule NIPT screening test', trimester: 1, completed: false },
    { id: 'cl_4', task: 'Plan maternity allowance or office leaves draft', trimester: 2, completed: true },
    { id: 'cl_5', task: 'Anatomy scan ultrasound evaluation (week 20)', trimester: 2, completed: false },
    { id: 'cl_6', task: 'Register for infant CPR and safety class', trimester: 2, completed: false },
    { id: 'cl_7', task: 'Drink 2.5L clean water daily to avoid early Braxton-Hicks', trimester: 2, completed: false },
    { id: 'cl_8', task: 'Start daily kick counts (28 weeks onwards)', trimester: 3, completed: false },
    { id: 'cl_9', task: 'Install child infant car seat properly', trimester: 3, completed: false },
    { id: 'cl_10', task: 'Pack hospital/birthing center bag', trimester: 3, completed: false },
    { id: 'cl_11', task: 'Finalize pediatrician recommendations contact', trimester: 3, completed: false }
  ]);

  // Kick Counter State Machine
  const [isCounting, setIsCounting] = useState(false);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [currentKicks, setCurrentKicks] = useState(0);
  const [kickTimer, setKickTimer] = useState<NodeJS.Timeout | null>(null);

  // Timer run loop
  useEffect(() => {
    let interval: any = null;
    if (isCounting) {
      interval = setInterval(() => {
        setSessionSeconds((s) => s + 1);
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isCounting]);

  const handleStartCounting = () => {
    setIsCounting(true);
    setSessionSeconds(0);
    setCurrentKicks(0);
  };

  const handleRecordKick = () => {
    if (!isCounting) return;
    setCurrentKicks((k) => k + 1);
  };

  const handleStopAndSave = () => {
    setIsCounting(false);
    
    // Save only if session was active
    if (sessionSeconds > 0) {
      const now = new Date();
      const newSession: KickSession = {
        id: Math.random().toString(36).substr(2, 9),
        date: now.toISOString().split('T')[0],
        startTime: now.toTimeString().slice(0, 5),
        durationMinutes: Math.round(sessionSeconds / 60) || 1,
        kickCount: currentKicks
      };
      onAddKickSession(newSession);
    }

    setSessionSeconds(0);
    setCurrentKicks(0);
  };

  const toggleChecklistItem = (id: string) => {
    setChecklist(
      checklist.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const formatTimer = (totSecs: number) => {
    const mins = Math.floor(totSecs / 60);
    const secs = totSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-[#FFFDFB] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Title */}
        <div className="pb-6 border-b border-[#FAF6F0] flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <span className="text-xs font-mono font-bold text-[#D48C8C] uppercase tracking-wider">DEVELOPMENT ROADMAP</span>
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#3C2F2F] text-left mt-1">Pregnancy Pathway & Baby Size Clock</h1>
            <p className="text-sm text-[#5E4C4C] mt-2 text-left">
              Track embryological biological markers, record fetal kick frequency, and coordinate prenatal safety checklists.
            </p>
          </div>
          
          {/* Week Selector Grid Button Slider */}
          <div className="flex flex-wrap gap-1.5 shrink-0 bg-[#FAF6F0] p-1.5 rounded-2xl border border-[#FAECEC]">
            {pregnancyWeeksData.map((data) => (
              <button
                key={data.week}
                onClick={() => onWeekChange(data.week)}
                className={`py-1.5 px-3 rounded-xl text-xs font-semibold font-mono transition-all cursor-pointer ${
                  gestationalWeek === data.week
                    ? 'bg-[#D48C8C] text-white'
                    : 'text-[#8C7A7A] hover:bg-white hover:text-[#4F3E3E]'
                }`}
              >
                W{data.week}
              </button>
            ))}
          </div>
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Week-by-Week Visual Overview Card */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-[#FAECEC] shadow-2xs overflow-hidden">
            {/* Top header decoration banner */}
            <div className="bg-gradient-to-tr from-[#FFF0F0] to-[#FAF6F0] p-6 border-b border-[#F4E1E1] flex justify-between items-center">
              <div className="text-left">
                <span className="text-xs font-mono font-bold text-[#D48C8C] uppercase tracking-wider">Trimester {currentInfo.trimester}</span>
                <h2 className="font-serif text-2xl font-bold text-[#4F3E3E] mt-1">Week {currentInfo.week} Milestone Snapshot</h2>
              </div>
              <div className="bg-white/80 p-3 rounded-2xl border border-[#F2D6D6] text-center shadow-xs">
                <span className="text-[10px] block font-mono text-[#D48C8C] font-bold">EST. BABY SIZE</span>
                <span className="text-2xl mt-0.5 block">{currentInfo.fruitEmoji} {currentInfo.babySizeFruit}</span>
              </div>
            </div>

            {/* Core Metrics & Developments */}
            <div className="p-6 sm:p-8 space-y-6 text-left">
              
              {/* Dimensions Section */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#FAF6F0] p-4 rounded-2xl border border-[#F4E1E1]/50 text-center">
                  <span className="text-[10px] font-mono text-[#8C7A7A] block uppercase">Est. Crown-to-Rump Length</span>
                  <span className="text-2xl font-bold text-[#4F3E3E] font-serif block mt-1">{currentInfo.babyLengthCm} cm</span>
                </div>
                <div className="bg-[#FAF6F0] p-4 rounded-2xl border border-[#F4E1E1]/50 text-center">
                  <span className="text-[10px] font-mono text-[#8C7A7A] block uppercase">Est. Fetal Weight</span>
                  <span className="text-2xl font-bold text-[#4F3E3E] font-serif block mt-1">{currentInfo.babyWeightG} g</span>
                </div>
              </div>

              {/* Fetal Developments Progress Column */}
              <div className="space-y-2">
                <h3 className="text-sm uppercase font-mono tracking-wider text-[#D48C8C] font-bold">👶 Embryological & Fetal Progression</h3>
                <p className="text-sm text-[#5E4C4C] leading-relaxed border-l-2 border-[#F4DCDD] pl-3.5 italic">
                  &quot;{currentInfo.babyDevelopments}&quot;
                </p>
              </div>

              {/* Sister Column: Maternal Changes */}
              <div className="space-y-2">
                <h3 className="text-sm uppercase font-mono tracking-wider text-[#A66C6C] font-bold">🧘‍♀️ Evolving Mother Somatosensory Adjustments</h3>
                <p className="text-sm text-[#5E4C4C] leading-relaxed">
                  {currentInfo.momChanges}
                </p>
              </div>

              {/* Tips for the Current Week */}
              <div className="space-y-3 pt-3 border-t border-[#FAF6F0]">
                <h3 className="text-sm uppercase font-mono tracking-wider text-[#8C7A7A] font-bold">📋 Safe Clinical Guidelines & Checklists</h3>
                <div className="space-y-2">
                  {currentInfo.tips.map((tip, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-xs text-[#5E4C4C] bg-[#FFFBF9] p-3 rounded-xl border border-[#FAEDE9]">
                      <span className="text-[#D48C8C] font-bold shrink-0 mt-0.5">✔</span>
                      <span className="leading-relaxed">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Right: Kick Counter and Prenatal Safety Timeline */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Dynamic Interactive Kick Counter Hub */}
            <div className="bg-[#FAF6F0] border border-[#F4E1E1] rounded-3xl p-6 shadow-2xs text-left space-y-4">
              <div className="flex justify-between items-start pb-3 border-b border-[#F4DCDD]">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#3C2F2F] flex items-center space-x-1.5">
                    <Footprints className="h-5 w-5 text-[#D48C8C]" />
                    <span>Fetal Kick Counter</span>
                  </h3>
                  <p className="text-[11px] text-[#8C7A7A] mt-0.5">Record fetal shifts. Medical guide asks for 10 counts in 2h</p>
                </div>
                {isCounting && (
                  <span className="animate-pulse bg-red-100 text-red-700 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border border-red-200 uppercase">
                    ACTIVE TIMER
                  </span>
                )}
              </div>

              {/* Counter Interface display widget */}
              <div className="bg-white rounded-2xl p-6 border border-[#FAECEC] shadow-3xs flex flex-col items-center justify-center text-center space-y-4">
                
                {/* Timer Clock representation */}
                <div className="flex items-center space-x-2 text-sm text-[#8C7A7A] font-medium font-mono">
                  <Clock className="h-4 w-4 text-[#D48C8C]" />
                  <span>ELAPSED TIME:</span>
                  <span className="text-[#4F3E3E] font-bold text-lg">{formatTimer(sessionSeconds)}</span>
                </div>

                {/* Big Kick Circle Counter */}
                <div className="relative">
                  {/* Outer breathing ring */}
                  {isCounting && (
                    <div className="absolute inset-0 bg-[#FCEEEF] rounded-full animate-ping scale-110 opacity-30" />
                  )}
                  <button
                    disabled={!isCounting}
                    onClick={handleRecordKick}
                    className={`w-32 h-32 rounded-full flex flex-col items-center justify-center border-3 transition-all cursor-pointer ${
                      isCounting
                        ? 'bg-[#FCEEEF] border-[#D48C8C] text-[#D48C8C] shadow-sm transform hover:scale-[1.03] active:scale-95'
                        : 'bg-[#FAF6F0] border-dashed border-gray-300 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Heart className={`h-8 w-8 text-[#D48C8C] ${isCounting ? 'animate-bounce' : 'opacity-40'}`} />
                    <span className="text-3xl font-bold font-serif mt-1">{currentKicks}</span>
                    <span className="text-[10px] uppercase font-mono font-bold tracking-wider leading-none">Record Kick</span>
                  </button>
                </div>

                {/* Controls buttons */}
                <div className="flex space-x-3 w-full pt-2">
                  {!isCounting ? (
                    <button
                      onClick={handleStartCounting}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs uppercase tracking-wide py-3 px-4 rounded-xl flex items-center justify-center space-x-1 transition-all shadow-xs cursor-pointer"
                    >
                      <Play className="h-4 w-4" />
                      <span>Start Tracker</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleStopAndSave}
                      className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs uppercase tracking-wide py-3 px-4 rounded-xl flex items-center justify-center space-x-1 transition-all shadow-xs cursor-pointer"
                    >
                      <StopCircle className="h-4 w-4" />
                      <span>Stop & Log Session</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Historical kick session cards */}
              <div className="space-y-2">
                <span className="text-[10px] block font-mono font-bold uppercase tracking-wide text-[#8C7A7A]">Past Logged Sessions</span>
                {kickSessions.length === 0 ? (
                  <p className="text-xs text-[#A39191] italic text-center p-3 bg-white/60 rounded-xl border border-[#FAEDE9]">
                    No kick session metrics saved this gestational period.
                  </p>
                ) : (
                  <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                    {kickSessions.map((session) => (
                      <div key={session.id} className="bg-white border border-[#E9C2C2]/50 p-3 rounded-xl flex justify-between items-center text-xs">
                        <div className="flex items-center space-x-2">
                          <Activity className="h-4 w-4 text-[#D48C8C]" />
                          <div>
                            <p className="font-semibold text-[#4F3E3E] font-mono">{session.kickCount} Kicks recorded</p>
                            <p className="text-[10px] text-[#8C7A7A]">In {session.durationMinutes} min ({session.startTime})</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-slate-400 bg-[#FAF6F0] p-1 rounded-md">
                          {session.date}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* General Timeline Checklist Card */}
            <div className="bg-white border border-[#FAECEC] rounded-3xl p-6 shadow-2xs text-left">
              <h3 className="font-serif font-bold text-lg text-[#3C2F2F] pb-3 border-b border-[#FAF6F0] mb-3">Prenatal Care Checklist</h3>
              
              {/* Dynamic checklist rows */}
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {checklist.map((item) => {
                  const isSelected = item.completed;
                  return (
                    <div 
                      key={item.id}
                      onClick={() => toggleChecklistItem(item.id)}
                      className="flex items-start space-x-3 p-2 rounded-xl hover:bg-[#FAF6F0] transition-colors cursor-pointer text-xs text-[#5E4C4C]"
                    >
                      <button className="shrink-0 mt-0.5 text-[#D48C8C] hover:scale-105 transition-transform">
                        {isSelected ? (
                          <CheckCircle2 className="h-5 w-5 text-[#D48C8C] fill-[#D48C8C]/15" />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-300" />
                        )}
                      </button>
                      <div className="flex-1">
                        <p className={`font-medium ${isSelected ? 'line-through text-gray-400' : 'text-[#4F3E3E]'}`}>
                          {item.task}
                        </p>
                        <span className="text-[9px] uppercase font-mono bg-[#FAF6F0] text-[#D48C8C] px-1.5 py-0.5 rounded-md mt-1 inline-block">
                          Trimester {item.trimester} Focus
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
