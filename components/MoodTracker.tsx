import React, { useState, useEffect } from 'react';
import { MoodEntry } from '../types';
import { initialMoods } from '../data';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Plus, Minus, Check, Calendar, CloudLightning, HeartHandshake, Smile, Eye } from 'lucide-react';
import { motion } from 'motion/react';

interface MoodTrackerProps {
  moodEntries: MoodEntry[];
  onAddMood: (entry: MoodEntry) => void;
}

const AVAILABLE_EMOTIONS: Array<MoodEntry['emotion']> = [
  'Peaceful', 'Joyful', 'Calm', 'Tired', 'Anxious', 'Overwhelmed', 'Sad'
];

const EMOTION_EMOJIS: Record<MoodEntry['emotion'], string> = {
  Peaceful: '🕊️',
  Joyful: '☀️',
  Calm: '🌸',
  Tired: '🥱',
  Anxious: '🌪️',
  Overwhelmed: '🌊',
  Sad: '🌧️'
};

const EMOTION_COLORS: Record<MoodEntry['emotion'], string> = {
  Peaceful: 'bg-[#E3EFE3] text-[#4F6C4F] border-[#C8DFC8]',
  Joyful: 'bg-[#FFF6D6] text-[#8C761D] border-[#F2DF99]',
  Calm: 'bg-[#FCEEEF] text-[#B86E6E] border-[#E9C2C2]',
  Tired: 'bg-[#ECEAF5] text-[#554C8C] border-[#CED4EC]',
  Anxious: 'bg-[#FAECE4] text-[#AB5527] border-[#EBCEBD]',
  Overwhelmed: 'bg-[#E2FAF5] text-[#207B6C] border-[#B2ECE0]',
  Sad: 'bg-[#E6F4FA] text-[#2C628C] border-[#BCDDF0]'
};

const MOOD_LEVELS = [
  { level: 1, label: 'Terrible', desc: 'Deep anxiety, somatic crisis' },
  { level: 2, label: 'Struggling', desc: 'Fragile, high fatigue, worried' },
  { level: 3, label: 'Neutral', desc: 'Standard baseline stability' },
  { level: 4, label: 'Good', desc: 'Balanced mental state, light' },
  { level: 5, label: 'Joyful', desc: 'Deeply positive, connected, happy' }
];

const SYMPTOMS_LIST = [
  'Nausea',
  'Fatigue',
  'Headache',
  'Backache',
  'Cramps',
  'Insomnia',
  'Frequent urination',
  'Swollen feet'
];

export default function MoodTracker({ moodEntries, onAddMood }: MoodTrackerProps) {
  // Local state for recording a new entry
  const [level, setLevel] = useState<number>(3);
  const [selectedEmotion, setSelectedEmotion] = useState<MoodEntry['emotion']>('Calm');
  const [notes, setNotes] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [sleepHours, setSleepHours] = useState<number>(8);
  const [waterIntake, setWaterIntake] = useState<number>(8); // glasses
  const [successMsg, setSuccessMsg] = useState('');

  // Local helper stats
  const averageMood = moodEntries.length
    ? (moodEntries.reduce((sum, m) => sum + m.level, 0) / moodEntries.length).toFixed(1)
    : '0';

  const averageSleep = moodEntries.length
    ? (moodEntries.reduce((sum, m) => sum + m.sleepHours, 0) / moodEntries.length).toFixed(1)
    : '0';

  const averageWater = moodEntries.length
    ? (moodEntries.reduce((sum, m) => sum + m.waterIntake, 0) / moodEntries.length).toFixed(1)
    : '0';

  // Toggle symptoms selecetion
  const handleSymptomToggle = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handleWaterChange = (mod: 'inc' | 'dec') => {
    if (mod === 'inc' && waterIntake < 16) {
      setWaterIntake((w) => w + 1);
    } else if (mod === 'dec' && waterIntake > 0) {
      setWaterIntake((w) => w - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const todayDate = new Date().toISOString().split('T')[0];

    const newEntry: MoodEntry = {
      id: Math.random().toString(36).substr(2, 9),
      date: todayDate,
      level,
      emotion: selectedEmotion,
      notes,
      symptoms: selectedSymptoms,
      sleepHours,
      waterIntake
    };

    onAddMood(newEntry);

    // Show banner success
    setSuccessMsg('Your daily mood & wellness check-in has been logged successfully!');
    setTimeout(() => setSuccessMsg(''), 5000);

    // Reset fields
    setNotes('');
    setSelectedSymptoms([]);
    setLevel(3);
    setSelectedEmotion('Calm');
    setSleepHours(8);
    setWaterIntake(8);
  };

  // Build gorgeous formatting for recharts tooltips
  const chartData = [...moodEntries]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((m) => ({
      date: m.date.slice(5), // MM-DD
      level: m.level,
      emotion: `${EMOTION_EMOJIS[m.emotion]} ${m.emotion}`,
      sleep: m.sleepHours,
      water: m.waterIntake
    }));

  return (
    <div className="bg-[#FFFDFB] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 pb-6 border-b border-[#FAF6F0]">
          <div>
            <span className="text-xs font-mono font-bold text-[#D48C8C] uppercase tracking-wider">MOMENTARY COHERENCE</span>
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#3C2F2F] text-left mt-1">Mental Health & Somatic Tracker</h1>
            <p className="text-sm text-[#5E4C4C] mt-2 text-left">
              Log emotional patterns and physical symptoms. Safe, secure local storage protects your diagnostic trends.
            </p>
          </div>
          <div className="bg-[#FAF4F0] px-4 py-2.5 rounded-2xl border border-[#FAECEC] flex items-center space-x-2 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono font-semibold text-[#5E4C4C]">Offline Self-Persistence Active</span>
          </div>
        </div>

        {/* Success Banner */}
        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#EFFFFA] border border-emerald-300 rounded-2xl p-4 flex items-center space-x-2 text-emerald-800 text-sm font-semibold"
          >
            <Check className="h-5 w-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </motion.div>
        )}

        {/* Two Column Layout: Log & Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Dynamic Log Check-In Form */}
          <div className="lg:col-span-5 bg-[#FAF6F0] p-6 rounded-3xl border border-[#F4E1E1] shadow-2xs space-y-6">
            <h2 className="font-serif text-2xl font-bold text-[#4F3E3E] pb-3 border-b border-[#F4DCDD]">Daily Wellness Logging</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6 text-left">
              
              {/* Question 1: Energy / Mood Value Rating */}
              <div className="space-y-3">
                <label className="block text-xs uppercase font-mono tracking-wider text-[#8C7A7A] font-bold">
                  1. Rate Overall Wellness Level
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {MOOD_LEVELS.map((m) => (
                    <button
                      key={m.level}
                      type="button"
                      onClick={() => setLevel(m.level)}
                      className={`py-3 px-1.5 rounded-xl border text-center transition-all cursor-pointer ${
                        level === m.level
                          ? 'bg-[#D48C8C] text-white border-[#D48C8C] shadow-xs'
                          : 'bg-white border-[#E9C2C2] text-[#8C7A7A] hover:bg-[#FFF]'
                      }`}
                    >
                      <span className="block text-lg font-bold">{m.level}</span>
                      <span className="text-[9px] block uppercase font-mono leading-none tracking-tight mt-1">
                        {m.label}
                      </span>
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-[#A39191] italic font-sans leading-none">
                  Selected response: &quot;{MOOD_LEVELS.find((m) => m.level === level)?.desc}&quot;
                </p>
              </div>

              {/* Question 2: Specific Core Emotion */}
              <div className="space-y-3">
                <label className="block text-xs uppercase font-mono tracking-wider text-[#8C7A7A] font-bold">
                  2. Select Prominent Emotion
                </label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_EMOTIONS.map((emo) => {
                    const isSelected = selectedEmotion === emo;
                    return (
                      <button
                        key={emo}
                        type="button"
                        onClick={() => setSelectedEmotion(emo)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center space-x-1.5 cursor-pointer ${
                          isSelected
                            ? `${EMOTION_COLORS[emo]} scale-102 ring-2 ring-[#D48C8C]/20 shadow-xs`
                            : 'bg-white text-[#8C7A7A] border-[#E9C2C2] hover:bg-[#FFF]'
                        }`}
                      >
                        <span className="text-base">{EMOTION_EMOJIS[emo]}</span>
                        <span>{emo}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question 3: Physical Somatic Symptoms */}
              <div className="space-y-3">
                <label className="block text-xs uppercase font-mono tracking-wider text-[#8C7A7A] font-bold">
                  3. Log Clinical Somatic Indicators
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {SYMPTOMS_LIST.map((sym) => {
                    const isSelected = selectedSymptoms.includes(sym);
                    return (
                      <button
                        key={sym}
                        type="button"
                        onClick={() => handleSymptomToggle(sym)}
                        className={`p-2.5 rounded-xl text-xs font-medium border text-left flex items-center space-x-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#E39090] text-white border-[#E39090] shadow-2xs'
                            : 'bg-white text-[#5E4C4C] border-[#E9C2C2]/60 hover:bg-[#FFF]'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border ${
                          isSelected ? 'bg-white/20 border-white' : 'border-gray-300'
                        }`}>
                          {isSelected && <Check className="h-3 w-3 text-white" />}
                        </div>
                        <span className="truncate">{sym}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question 4: Sleep and Water Sliders */}
              <div className="grid grid-cols-2 gap-4 pt-1">
                {/* Sleep Slider */}
                <div className="space-y-2">
                  <label className="block text-xs uppercase font-mono tracking-wider text-[#8C7A7A] font-bold">
                    4. Sleep (Hours)
                  </label>
                  <div className="bg-white p-3 rounded-xl border border-[#FAECEC] flex flex-col justify-center">
                    <span className="text-xl font-bold text-[#4F3E3E] font-mono">{sleepHours} hrs</span>
                    <input
                      type="range"
                      min="4"
                      max="12"
                      step="0.5"
                      value={sleepHours}
                      onChange={(e) => setSleepHours(parseFloat(e.target.value))}
                      className="w-full mt-2 accent-[#D48C8C]"
                    />
                  </div>
                </div>

                {/* Water Glasses */}
                <div className="space-y-2">
                  <label className="block text-xs uppercase font-mono tracking-wider text-[#8C7A7A] font-bold">
                    5. Water (250ml Glass)
                  </label>
                  <div className="bg-white p-3 rounded-xl border border-[#FAECEC] flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleWaterChange('dec')}
                      className="w-7 h-7 rounded-full bg-[#FAF4F0] border border-[#E9C2C2] text-[#4F3E3E] flex items-center justify-center font-bold font-mono hover:bg-[#FFF]"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="text-lg font-bold text-[#4F3E3E] font-mono">{waterIntake} gls</span>
                    <button
                      type="button"
                      onClick={() => handleWaterChange('inc')}
                      className="w-7 h-7 rounded-full bg-[#FAF4F0] border border-[#E9C2C2] text-[#4F3E3E] flex items-center justify-center font-bold font-mono hover:bg-[#FFF]"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Journal Notes */}
              <div className="space-y-2">
                <label className="block text-xs uppercase font-mono tracking-wider text-[#8C7A7A] font-bold">
                  6. Daily Therapeutic Reflections
                </label>
                <textarea
                  placeholder="Record your dreams, somatic symptoms, anxieties, or joyful adjustments here without judgment..."
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-white border border-[#E9C2C2] focus:ring-1 focus:ring-[#D48C8C] focus:border-[#D48C8C] rounded-2xl p-4 text-xs text-[#4F3E3E] leading-relaxed resize-none focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#D48C8C] hover:bg-[#C27B7B] text-white py-3.5 px-4 rounded-xl text-sm font-semibold shadow-xs hover:shadow-sm transition-all text-center cursor-pointer"
              >
                Persist Check-in Log
              </button>

            </form>
          </div>

          {/* Right: Premium Dynamic Analytics & Trends */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Analytics Metric Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white border border-[#FAF0F0] p-4 rounded-2xl shadow-3xs flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono text-[#8C7A7A] uppercase leading-none block">DIAGNOSTIC INDEX</span>
                  <span className="text-xs text-[#D48C8C] font-semibold mt-1 inline-block">Avg Mood State</span>
                </div>
                <div className="flex items-baseline space-x-1.5 mt-3">
                  <span className="text-3xl font-serif font-bold text-[#3C2F2F]">{averageMood}</span>
                  <span className="text-xs text-[#8C7A7A]">/ 5</span>
                </div>
              </div>

              <div className="bg-white border border-[#FAF0F0] p-4 rounded-2xl shadow-3xs flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono text-[#8C7A7A] uppercase leading-none block">HYDRATION STATUS</span>
                  <span className="text-xs text-blue-400 font-semibold mt-1 inline-block">Avg Hydration</span>
                </div>
                <div className="flex items-baseline space-[#BFBFBF] mt-3">
                  <span className="text-3xl font-serif font-bold text-[#3C2F2F]">{averageWater}</span>
                  <span className="text-xs text-[#8C7A7A] ml-1">glasses</span>
                </div>
              </div>

              <div className="bg-white border border-[#FAF0F0] p-4 rounded-2xl shadow-3xs flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono text-[#8C7A7A] uppercase leading-none block">SOMNOLENT CLOCK</span>
                  <span className="text-xs text-amber-500 font-semibold mt-1 inline-block">Avg Daily Sleep</span>
                </div>
                <div className="flex items-baseline space-x-0.5 mt-3">
                  <span className="text-3xl font-serif font-bold text-[#3C2F2F]">{averageSleep}</span>
                  <span className="text-xs text-[#8C7A7A] ml-1">hours</span>
                </div>
              </div>
            </div>

            {/* Recharts Graphical Trends */}
            <div className="bg-white border border-[#F4E1E1] p-6 rounded-3xl shadow-3xs space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#4F3E3E]">Coherence Trend Graph</h3>
                  <p className="text-[11px] text-[#8C7A7A]">Continuous visualization of your emotional baseline variables</p>
                </div>
                <div className="flex space-x-2 text-[10px] font-mono">
                  <span className="flex items-center space-x-1">
                    <span className="w-2.5 h-1.5 rounded-full bg-[#D48C8C] block" />
                    <span className="text-[#8C7A7A]">Mood Rating</span>
                  </span>
                </div>
              </div>

              {/* Recharts Render Container */}
              <div className="h-64 sm:h-72 w-full pt-2">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#FCEEEF" vertical={false} />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fill: '#8C7A7A', fontSize: 10 }} 
                        stroke="#FAECEC"
                      />
                      <YAxis 
                        domain={[1, 5]} 
                        ticks={[1, 2, 3, 4, 5]} 
                        tick={{ fill: '#8C7A7A', fontSize: 10 }}
                        stroke="#FAECEC"
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#FFFDFB', 
                          border: '1px solid #E9C2C2', 
                          borderRadius: '16px',
                          fontSize: '11px',
                          color: '#4F3E3E'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="level" 
                        name="Wellness Level"
                        stroke="#D48C8C" 
                        strokeWidth={3} 
                        activeDot={{ r: 7 }} 
                        dot={{ r: 4, stroke: '#D48C8C', strokeWidth: 1 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full w-full flex flex-col justify-center items-center text-center bg-[#FAF6F0] rounded-2xl border border-dashed border-[#E9C2C2] p-4 text-[#8C7A7A]">
                    <span>🌧️</span>
                    <span className="text-xs font-mono font-bold mt-2">No mood metrics captured yet</span>
                  </div>
                )}
              </div>
            </div>

            {/* Dynamic Historical Timeline Feed & Journal Cards */}
            <div className="space-y-4">
              <h3 className="font-serif font-semibold text-lg text-[#3C2F2F] text-left">Your Emotional Chronoscope</h3>
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {moodEntries.map((m) => {
                  return (
                    <motion.div 
                      layout
                      key={m.id}
                      className="bg-white border border-[#F4E1E1] rounded-2xl p-4 shadow-3xs hover:shadow-xs transition-shadow text-left space-y-2.5"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold flex items-center space-x-1 ${EMOTION_COLORS[m.emotion]}`}>
                            <span>{EMOTION_EMOJIS[m.emotion]}</span>
                            <span>{m.emotion}</span>
                          </span>
                          <span className="text-[10px] text-[#A39191] font-mono flex items-center space-x-1">
                            <Calendar className="h-3 w-3 inline text-[#D48C8C]" />
                            <span>{m.date}</span>
                          </span>
                        </div>
                        <div className="flex items-center space-x-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span 
                              key={i} 
                              className={`text-slate-200 text-xs ${i < m.level ? 'text-[#D48C8C] scale-110 font-bold' : 'opacity-20'}`}
                            >
                              ♥
                            </span>
                          ))}
                        </div>
                      </div>

                      {m.notes && (
                        <p className="text-xs text-[#5E4C4C] italic font-serif leading-relaxed pl-1.5 border-l-2 border-[#E9C2C2]">
                          &quot;{m.notes}&quot;
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-[#FAF6F0] text-[10px]">
                        {m.symptoms.length > 0 ? (
                          <span className="text-[#BF7575] flex items-center space-x-1 bg-[#FCEEEF] px-2 py-0.5 rounded-md border border-[#F4DCDD]">
                            <CloudLightning className="h-2.5 w-2.5" />
                            <span className="font-medium">Symptoms: {m.symptoms.join(', ')}</span>
                          </span>
                        ) : (
                          <span className="text-emerald-700 font-medium flex items-center space-x-1 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                            <Smile className="h-2.5 w-2.5" />
                            <span>No somatic disruptions</span>
                          </span>
                        )}

                        <span className="text-[#8C7A7A] font-mono">
                          Sleep: <strong>{m.sleepHours}h</strong>
                        </span>
                        <span className="text-blue-500 font-mono">
                          Water: <strong>{m.waterIntake}gls</strong>
                        </span>
                      </div>
                    </motion.div>
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
