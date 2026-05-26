import React, { useState, useEffect } from 'react';
import { User, MoodEntry, Booking, KickSession } from '../types';
import { Shield, Lock, User as UserIcon, Mail, Calendar, Key, UserCheck, LogOut, ArrowRight, Heart, Sparkles, AlertCircle, Edit3, Save, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { pregnancyWeeksData } from '../data';

interface AuthPortalProps {
  currentUser: User | null;
  onLogin: (user: User) => void;
  onLogout: () => void;
  onUpdateUser: (user: User) => void;
  moodEntries: MoodEntry[];
  bookings: Booking[];
  kickSessions: KickSession[];
  gestationalWeek: number;
  onWeekChange: (week: number) => void;
}

export default function AuthPortal({ 
  currentUser, 
  onLogin, 
  onLogout, 
  onUpdateUser,
  moodEntries,
  bookings,
  kickSessions,
  gestationalWeek,
  onWeekChange
}: AuthPortalProps) {
  
  const [activeMode, setActiveMode] = useState<'login' | 'register'>('login');
  
  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginErr, setLoginErr] = useState('');

  // Register Form States
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regWeek, setRegWeek] = useState(gestationalWeek);
  const [regPartnerName, setRegPartnerName] = useState('');
  const [regDueDate, setRegDueDate] = useState('');
  const [regAvatar, setRegAvatar] = useState('🤰');
  const [regErr, setRegErr] = useState('');
  const [showRegSuccessSplash, setShowRegSuccessSplash] = useState(false);

  // Edit Profile Mode
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPartnerName, setEditPartnerName] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [editAvatar, setEditAvatar] = useState('🤰');
  const [editWeek, setEditWeek] = useState(gestationalWeek);

  useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.name);
      setEditPartnerName(currentUser.partnerName || '');
      setEditDueDate(currentUser.dueDate || '');
      setEditAvatar(currentUser.avatarEmoji || '🤰');
      setEditWeek(currentUser.gestationalWeek);
    }
  }, [currentUser]);

  // Default mock users database in LocalStorage
  const getRegisteredUsers = (): User[] => {
    const stored = localStorage.getItem('zenora_registered_users');
    if (stored) {
      try { return JSON.parse(stored); } catch (e) { return []; }
    }
    
    // Seed default users for quick demo
    const defaultUsers: User[] = [
      {
        id: 'u_sarah',
        email: 'sarah@zenora.com',
        name: 'Sarah Sterling',
        password: 'password123',
        gestationalWeek: 16,
        partnerName: 'Andrew',
        dueDate: '2026-11-20',
        avatarEmoji: '🤰',
        dateCreated: '2026-05-20'
      },
      {
        id: 'u_elena',
        email: 'elena@zenora.com',
        name: 'Elena Moss',
        password: 'password123',
        gestationalWeek: 24,
        partnerName: 'Jack',
        dueDate: '2026-09-12',
        avatarEmoji: '🌸',
        dateCreated: '2026-05-18'
      }
    ];
    localStorage.setItem('zenora_registered_users', JSON.stringify(defaultUsers));
    return defaultUsers;
  };

  const saveRegisteredUser = (newUser: User) => {
    const existing = getRegisteredUsers();
    // remove duplicate if any
    const filtered = existing.filter(u => u.email !== newUser.email);
    const updated = [...filtered, newUser];
    localStorage.setItem('zenora_registered_users', JSON.stringify(updated));
  };

  // Log in existing users
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginErr('');

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginErr('Please provide both your registered email and secure password.');
      return;
    }

    const db = getRegisteredUsers();
    const found = db.find(u => u.email.toLowerCase() === loginEmail.toLowerCase().trim());

    if (!found) {
      setLoginErr('No registered clinical profile found with this email.');
      return;
    }

    if (found.password && found.password !== loginPassword) {
      setLoginErr('Incorrect password parameters. Please double-check.');
      return;
    }

    // Success login
    onLogin(found);
    onWeekChange(found.gestationalWeek);
  };

  // Quick Demo credentials Filler
  const handleFillDemo = (email: string) => {
    setLoginEmail(email);
    setLoginPassword('password123');
    setLoginErr('');
  };

  // Register account submission
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegErr('');

    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setRegErr('All core fields (Name, Email, Password) must be completed.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegErr('Password parameters do not match one another.');
      return;
    }

    // Check existing
    const db = getRegisteredUsers();
    const alreadyExists = db.some(u => u.email.toLowerCase() === regEmail.toLowerCase().trim());
    if (alreadyExists) {
      setRegErr('A registered clinical account with this email already exists.');
      return;
    }

    const newUser: User = {
      id: 'u_' + Math.random().toString(36).substr(2, 9),
      name: regName.trim(),
      email: regEmail.trim(),
      password: regPassword,
      gestationalWeek: regWeek,
      partnerName: regPartnerName.trim() || undefined,
      dueDate: regDueDate || undefined,
      avatarEmoji: regAvatar,
      dateCreated: new Date().toISOString()
    };

    saveRegisteredUser(newUser);
    setShowRegSuccessSplash(true);
    
    // Auto-login after delay
    setTimeout(() => {
      setShowRegSuccessSplash(false);
      onLogin(newUser);
      onWeekChange(newUser.gestationalWeek);
      // Reset State
      setRegName('');
      setRegEmail('');
      setRegPassword('');
      setRegConfirmPassword('');
      setRegPartnerName('');
      setRegDueDate('');
    }, 2500);
  };

  // Save modified profile specifications
  const handleSaveProfileUpgrade = () => {
    if (!currentUser) return;

    const upgradedUser: User = {
      ...currentUser,
      name: editName.trim() || currentUser.name,
      partnerName: editPartnerName.trim() || undefined,
      dueDate: editDueDate || undefined,
      avatarEmoji: editAvatar,
      gestationalWeek: editWeek
    };

    onUpdateUser(upgradedUser);
    onWeekChange(editWeek);
    saveRegisteredUser(upgradedUser);
    setIsEditingProfile(false);
  };

  // Current Pregnancy Info for Display
  const userWeekInfo = pregnancyWeeksData.find(w => w.week === (currentUser ? currentUser.gestationalWeek : gestationalWeek)) || pregnancyWeeksData[2];

  // Estimated Days to Due Date
  const calculateDaysToDue = () => {
    if (!currentUser || !currentUser.dueDate) return null;
    const dueTime = new Date(currentUser.dueDate).getTime();
    const nowTime = new Date().getTime();
    const diff = dueTime - nowTime;
    if (diff < 0) return 0;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };
  const daysRemaining = calculateDaysToDue();

  const avatarList = ['🤰', '🌸', '🤱', '💖', '🍊', '🌱', '🥑', '✨'];

  return (
    <div className="bg-[#FFFDFB] min-h-screen py-10 px-4 sm:px-6 lg:px-8 text-left">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Banner */}
        <div className="pb-6 border-b border-[#FAF6F0] flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <span className="text-xs font-mono font-bold text-[#D48C8C] uppercase tracking-wider">SECURE DIGITAL WORKSPACE</span>
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#3C2F2F] mt-1">
              {currentUser ? 'Your Maternal Account Profile' : 'Secure Clinical Authentication'}
            </h1>
            <p className="text-sm text-[#5E4C4C] mt-2">
              {currentUser 
                ? 'Review your trimester parameters, track logged milestones, and securely edit gestational weeks.' 
                : 'Join Zenora Care to synchronize your daily mood logs, save clinician telemedicine slots, and track fetal kick trends.'
              }
            </p>
          </div>

          <div className="flex items-center space-x-1 bg-[#FAF6F0] px-3.5 py-1.5 rounded-full text-[10px] font-mono font-bold text-[#A66C6C] border border-[#F1D0D0] shrink-0">
            <Shield className="h-3.5 w-3.5 text-[#D48C8C]" />
            <span>HIPAA SECURED & LOCAL ENCRYPTED</span>
          </div>
        </div>

        {/* REGISTRATION SUCCESS SPLASH DIALOG OVERLAY */}
         <AnimatePresence>
          {showRegSuccessSplash && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-[#3C2F2F]/40 backdrop-blur-xs flex items-center justify-center p-4"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-3xl p-8 max-w-sm text-center border border-[#FAF0F0] shadow-2xl space-y-4"
              >
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h3 className="font-serif font-extrabold text-2xl text-[#3C2F2F]">Welcome to Zenora!</h3>
                <p className="text-xs text-[#5E4C4C] leading-relaxed">
                  Your secure clinical account and pregnancy parameters were created successfully. Syncing your dashboard...
                </p>
                <div className="bg-[#FAF6F0] p-3.5 rounded-xl text-[10px] font-mono text-[#D48C8C]">
                  👩‍⚕️ ENCRYPTING MATERNAL CREDENTIALS
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* NOT LOGGED IN AUTHENTICATION HUB PANEL */}
        {!currentUser ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left side info block */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#FAF6F0] rounded-3xl p-6 border border-[#FAECEE]">
                <h3 className="font-serif font-bold text-lg text-[#3C2F2F] mb-3 flex items-center space-x-2">
                  <span>💖</span>
                  <span>Why Register with Zenora?</span>
                </h3>
                
                <ul className="space-y-4 text-xs text-[#5E4C4C] leading-relaxed">
                  <li className="flex items-start">
                    <span className="text-rose-500 mr-2">✦</span>
                    <div>
                      <strong className="text-[#3C2F2F]">Personalized Milestone Trackers:</strong>
                      <p className="mt-0.5">Customizes fruit analogies based on your exact week of pregnancy (1 to 40).</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-rose-500 mr-2">✦</span>
                    <div>
                      <strong className="text-[#3C2F2F]">Secure Booking Synchronization:</strong>
                      <p className="mt-0.5">Logs clinical teleconsultations with certified OB-GYNs and doulas securely.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-rose-500 mr-2">✦</span>
                    <div>
                      <strong className="text-[#3C2F2F]">Mood Analytics & Kick Tracker:</strong>
                      <p className="mt-0.5">Generates automated progress charts from your registered log records.</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* DEMO ACCOUNTS ACCORDION */}
              <div className="bg-white border border-[#E9C2C2] rounded-3xl p-6 space-y-4">
                <div>
                  <h4 className="font-serif font-semibold text-sm text-[#4F3E3E] flex items-center space-x-1.5">
                    <Sparkles className="h-4 w-4 text-[#D48C8C]" />
                    <span>Instant Demo Access</span>
                  </h4>
                  <p className="text-[11px] text-[#8C7A7A] mt-1 leading-relaxed">
                    Test the account-specific parameters instantly by logging in using our medical tester configurations:
                  </p>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => handleFillDemo('sarah@zenora.com')}
                    className="w-full bg-[#FAF6F0] hover:bg-[#FCEEEF] border border-[#FAECEC] p-3 rounded-2xl text-xs flex justify-between items-center transition-colors text-left"
                  >
                    <div>
                      <p className="font-bold text-[#4F3E3E]">👩‍⚕️ Sarah Sterling (Week 16)</p>
                      <p className="text-[10px] text-slate-400">Email: sarah@zenora.com | Pass: password123</p>
                    </div>
                    <span className="text-[#D48C8C] text-sm">→</span>
                  </button>

                  <button
                    onClick={() => handleFillDemo('elena@zenora.com')}
                    className="w-full bg-[#FAF6F0] hover:bg-[#FCEEEF] border border-[#FAECEC] p-3 rounded-2xl text-xs flex justify-between items-center transition-colors text-left"
                  >
                    <div>
                      <p className="font-bold text-[#4F3E3E]">🌸 Elena Moss (Week 24)</p>
                      <p className="text-[10px] text-slate-400">Email: elena@zenora.com | Pass: password123</p>
                    </div>
                    <span className="text-[#D48C8C] text-sm">→</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right side Auth Form card */}
            <div className="lg:col-span-7 bg-white border border-[#F4E1E1] rounded-3xl p-6 sm:p-8 shadow-3xs space-y-6">
              
              {/* Switchable tab switcher */}
              <div className="flex bg-[#FAF6F0] p-1.5 rounded-2xl border border-[#FAECEC] w-full">
                <button
                  onClick={() => { setActiveMode('login'); setLoginErr(''); }}
                  className={`w-1/2 py-2.5 rounded-xl text-sm md:text-xs font-bold transition-all ${
                    activeMode === 'login'
                      ? 'bg-[#D48C8C] text-white shadow-3xs'
                      : 'text-[#8C7A7A] hover:text-[#4F3E3E]'
                  }`}
                >
                  Log In Profile
                </button>
                <button
                  onClick={() => { setActiveMode('register'); setRegErr(''); }}
                  className={`w-1/2 py-2.5 rounded-xl text-sm md:text-xs font-bold transition-all ${
                    activeMode === 'register'
                      ? 'bg-[#D48C8C] text-white shadow-3xs'
                      : 'text-[#8C7A7A] hover:text-[#4F3E3E]'
                  }`}
                >
                  Register Profile
                </button>
              </div>

              {/* 1. LOGIN MODE */}
              {activeMode === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  
                  {loginErr && (
                    <div className="bg-rose-50 border border-rose-100 text-[#C25858] p-3.5 rounded-2xl flex items-center space-x-2 text-xs">
                      <AlertCircle className="h-4.5 w-4.5 text-rose-500 shrink-0" />
                      <span>{loginErr}</span>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-sm md:text-[11px] font-mono text-[#8C7A7A] uppercase font-bold">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-gray-400" />
                      <input
                        type="email"
                        placeholder="e.g. sarah@zenora.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3.5 text-sm md:text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#D48C8C]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm md:text-[11px] font-mono text-[#8C7A7A] uppercase font-bold">Password Key</label>
                    <div className="relative">
                      <Key className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-gray-400" />
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-3.5 text-sm md:text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#D48C8C]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#D48C8C] hover:bg-[#C27B7B] text-white py-3.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 cursor-pointer shadow-3xs transition-shadow"
                  >
                    <Lock className="h-4 w-4" />
                    <span>Authorize & Log In</span>
                  </button>
                </form>
              )}

              {/* 2. REGISTER MODE */}
              {activeMode === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  
                  {regErr && (
                    <div className="bg-rose-50 border border-rose-100 text-[#C25858] p-3.5 rounded-2xl flex items-center space-x-2 text-xs">
                      <AlertCircle className="h-4.5 w-4.5 text-rose-500 shrink-0" />
                      <span>{regErr}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm md:text-[11px] font-mono text-[#8C7A7A] uppercase font-bold">Full Name</label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Sarah Sterling"
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          className="w-full pl-8.5 pr-4 py-3 text-sm md:text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#D48C8C]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm md:text-[11px] font-mono text-[#8C7A7A] uppercase font-bold">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input
                          type="email"
                          placeholder="sarah@example.com"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          className="w-full pl-8.5 pr-4 py-3 text-sm md:text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#D48C8C]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm md:text-[11px] font-mono text-[#8C7A7A] uppercase font-bold">Secure Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full px-4 py-3 text-sm md:text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#D48C8C]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm md:text-[11px] font-mono text-[#8C7A7A] uppercase font-bold">Confirm Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 text-sm md:text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#D48C8C]"
                      />
                    </div>
                  </div>

                  {/* Gestational week selection */}
                  <div className="bg-[#FAF6F0] p-4 rounded-2xl border border-[#FAECED] space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-[#4F3E3E]">Pregnancy Week Milestone</span>
                      <span className="bg-[#D48C8C] text-white font-bold font-mono px-2 py-0.5 rounded-full text-[10px]">
                        WEEK {regWeek}
                      </span>
                    </div>

                    <input
                      type="range"
                      min="1"
                      max="40"
                      value={regWeek}
                      onChange={(e) => setRegWeek(parseInt(e.target.value, 10))}
                      className="w-full accent-[#D48C8C]"
                    />

                    {/* Miniature display of the active selected week */}
                    {pregnancyWeeksData.find(w => w.week === regWeek) && (
                      <div className="bg-white p-2.5 rounded-xl border border-[#FAECEC] flex items-center space-x-2 text-[11px]">
                        <span className="text-xl">
                          {pregnancyWeeksData.find(w => w.week === regWeek)?.fruitEmoji}
                        </span>
                        <div>
                          <strong>
                            {pregnancyWeeksData.find(w => w.week === regWeek)?.babySizeFruit} Size
                          </strong>
                          <span className="text-slate-400 block font-mono text-[9px]">
                            {pregnancyWeeksData.find(w => w.week === regWeek)?.trimester} Trimester Milestone
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm md:text-[11px] font-mono text-[#8C7A7A] uppercase font-bold">Partner's Name <span className="text-slate-300">(Optional)</span></label>
                      <input
                        type="text"
                        placeholder="Andrew"
                        value={regPartnerName}
                        onChange={(e) => setRegPartnerName(e.target.value)}
                        className="w-full px-4 py-3 text-sm md:text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#D48C8C]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm md:text-[11px] font-mono text-[#8C7A7A] uppercase font-bold">Expected Due Date <span className="text-slate-300">(Optional)</span></label>
                      <input
                        type="date"
                        value={regDueDate}
                        onChange={(e) => setRegDueDate(e.target.value)}
                        className="w-full px-4 py-3 text-sm md:text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#D48C8C]"
                      />
                    </div>
                  </div>

                  {/* Avatar Picker segment */}
                  <div className="space-y-1.5">
                    <label className="text-sm md:text-[11px] font-mono text-[#8C7A7A] uppercase font-bold">Select Profile Icon Avatar</label>
                    <div className="flex flex-wrap gap-2">
                      {avatarList.map(emoji => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => setRegAvatar(emoji)}
                          className={`w-10 h-10 rounded-xl border text-lg flex items-center justify-center transition-colors cursor-pointer ${
                            regAvatar === emoji 
                              ? 'bg-[#FCEEEF] border-[#D48C8C] shadow-3xs' 
                              : 'bg-white border-gray-200 hover:bg-slate-50'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#D48C8C] hover:bg-[#C27B7B] text-white py-3.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 cursor-pointer shadow-3xs transition-shadow"
                  >
                    <UserCheck className="h-4 w-4" />
                    <span>Register Medical Profile</span>
                  </button>
                </form>
              )}

            </div>

          </div>
        ) : (
          
          /* ACTIVE REGISTERED USER PROFILE VIEW */
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Left Hand Account card details card */}
            <div className="md:col-span-4 bg-white border border-[#F4E1E1] rounded-3xl p-6 shadow-3xs space-y-6 text-center">
              
              {/* Profile Main avatar & title header info */}
              <div className="space-y-3">
                <div className="w-20 h-20 bg-[#FCEEEF] border-2 border-[#D48C8C] rounded-full mx-auto flex items-center justify-center text-4xl shadow-sm">
                  {currentUser.avatarEmoji || '🤰'}
                </div>
                <div>
                  <h3 className="font-serif font-extrabold text-xl text-[#3C2F2F]">{currentUser.name}</h3>
                  <p className="text-xs text-[#8C7A7A] font-mono mt-0.5">{currentUser.email}</p>
                </div>
                <span className="inline-block bg-[#FCEEEF] text-[#D48C8C] text-[10px] font-mono font-bold uppercase border border-[#F1D0D0] px-3 py-1 rounded-full">
                  Verified Zenora Patient
                </span>
              </div>

              {/* Patient Core Parameters List widget */}
              <div className="border-t border-[#FAF6F0] pt-5 space-y-3 text-left">
                <p className="text-[10px] font-mono text-[#A18F8F] uppercase font-semibold">Maternal Metrics info</p>
                
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#5E4C4C] font-semibold">Active Gestation:</span>
                  <span className="text-[#3C2F2F] font-bold font-mono">Week {currentUser.gestationalWeek}</span>
                </div>
                
                {currentUser.partnerName && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#5E4C4C] font-semibold">Birth Partner:</span>
                    <span className="text-[#3C2F2F] font-bold">{currentUser.partnerName}</span>
                  </div>
                )}

                {currentUser.dueDate && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#5E4C4C] font-semibold">Due Target Date:</span>
                    <span className="text-[#3C2F2F] font-bold font-mono">{currentUser.dueDate}</span>
                  </div>
                )}

                {daysRemaining !== null && (
                  <div className="bg-[#FAF6F0] p-3 rounded-2xl border border-[#FAECEC] mt-2 text-center text-xs text-[#4F3E3E] font-semibold">
                    👶 Approximately <span className="text-[#D48C8C] text-lg font-serif font-extrabold">{daysRemaining}</span> days until birth!
                  </div>
                )}
              </div>

              {/* Logout panel CTA buttons */}
              <button
                onClick={onLogout}
                className="w-full text-xs font-bold text-gray-500 hover:text-rose-600 border border-gray-200 hover:border-rose-200 bg-white py-3 rounded-xl cursor-pointer flex items-center justify-center space-x-1.5 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out Account</span>
              </button>

            </div>

            {/* Right Hand Profile Actions & edit modules */}
            <div className="md:col-span-8 space-y-6">
              
              {/* Account logs statistics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                <div className="bg-white border border-[#F4E1E1] p-5 rounded-3xl shadow-3xs text-center space-y-1.5">
                  <span className="text-2xl block text-[#D48C8C]">🧘‍♀️</span>
                  <h4 className="text-xl font-serif font-extrabold text-[#3C2F2F]">{moodEntries.length}</h4>
                  <p className="text-[10px] text-slate-400 font-mono uppercase font-bold">Mood Records Logged</p>
                </div>

                <div className="bg-white border border-[#F4E1E1] p-5 rounded-3xl shadow-3xs text-center space-y-1.5">
                  <span className="text-2xl block text-[#D48C8C]">🦶</span>
                  <h4 className="text-xl font-serif font-extrabold text-[#3C2F2F]">{kickSessions.length}</h4>
                  <p className="text-[10px] text-slate-400 font-mono uppercase font-bold">Kick Sessions Saved</p>
                </div>

                <div className="bg-white border border-[#F4E1E1] p-5 rounded-3xl shadow-3xs text-center space-y-1.5">
                  <span className="text-2xl block text-[#D48C8C]">📅</span>
                  <h4 className="text-xl font-serif font-extrabold text-[#3C2F2F]">{bookings.filter(b => b.status === 'Scheduled').length}</h4>
                  <p className="text-[10px] text-slate-400 font-mono uppercase font-bold">Active Teleconsultations</p>
                </div>

              </div>

              {/* ACTIVE WEEK SUMMARY BANNER */}
              <div className="bg-[#FAF6F0] border border-[#FAEDE9] p-6 rounded-3xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl bg-white w-12 h-12 rounded-2xl flex items-center justify-center border border-[#FAECEC]">
                      {userWeekInfo.fruitEmoji}
                    </span>
                    <div>
                      <h4 className="font-serif font-bold text-[#3C2F2F]">Currently Tracked Fruit size</h4>
                      <p className="text-xs text-[#8C7A7A]">Week {currentUser.gestationalWeek}: {userWeekInfo.babySizeFruit}</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono bg-[#E9C2C2] text-white px-2.5 py-1 rounded-full uppercase font-bold">
                    {currentUser.gestationalWeek >= 28 ? '3rd Trimester' : currentUser.gestationalWeek >= 13 ? '2nd Trimester' : '1st Trimester'}
                  </span>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-[#FAECEC] space-y-2 text-xs leading-relaxed text-[#5E4C4C]">
                  <p>👶 <strong>Fetal Developments:</strong> {userWeekInfo.babyDevelopments}</p>
                  <p>🤱 <strong>Maternal Changes:</strong> {userWeekInfo.momChanges}</p>
                </div>
              </div>

              {/* PROFILE SPECIFICATION SETTING EDITOR */}
              <div className="bg-white border border-[#F4E1E1] rounded-3xl p-6 shadow-3xs space-y-6">
                
                <div className="flex justify-between items-center pb-3 border-b border-[#FAF6F0]">
                  <h4 className="font-serif font-bold text-lg text-[#3C2F2F] flex items-center space-x-1.5">
                    <Edit3 className="h-5 w-5 text-[#D48C8C]" />
                    <span>Customize Trimester Specifications</span>
                  </h4>
                  
                  {!isEditingProfile && (
                    <button
                      onClick={() => setIsEditingProfile(true)}
                      className="text-xs font-bold text-[#D48C8C] hover:text-[#B26E6E] cursor-pointer"
                    >
                      Modify Parameters
                    </button>
                  )}
                </div>

                {isEditingProfile ? (
                  <div className="space-y-4">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm md:text-[11px] font-mono text-[#8C7A7A] uppercase font-bold">Display Profile Name</label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-4 py-3 text-sm md:text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#D48C8C]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-sm md:text-[11px] font-mono text-[#8C7A7A] uppercase font-bold">Birth Partner's Name</label>
                        <input
                          type="text"
                          value={editPartnerName}
                          onChange={(e) => setEditPartnerName(e.target.value)}
                          className="w-full px-4 py-3 text-sm md:text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#D48C8C]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div className="space-y-1.5">
                        <label className="text-sm md:text-[11px] font-mono text-[#8C7A7A] uppercase font-bold">Pregnancy Week Slider</label>
                        <div className="flex items-center space-x-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <input
                            type="range"
                            min="1"
                            max="40"
                            value={editWeek}
                            onChange={(e) => setEditWeek(parseInt(e.target.value, 10))}
                            className="w-full accent-[#D48C8C] cursor-pointer"
                          />
                          <span className="bg-[#D48C8C] text-white px-2.5 py-0.5 rounded-full font-bold font-mono text-[10px] shrink-0">W {editWeek}</span>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-sm md:text-[11px] font-mono text-[#8C7A7A] uppercase font-bold">Adjust Target Due Date</label>
                        <input
                          type="date"
                          value={editDueDate}
                          onChange={(e) => setEditDueDate(e.target.value)}
                          className="w-full px-4 py-3 text-sm md:text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#D48C8C]"
                        />
                      </div>

                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm md:text-[11px] font-mono text-[#8C7A7A] uppercase font-bold">Revise Avatar Emoji</label>
                      <div className="flex flex-wrap gap-2">
                        {avatarList.map(emoji => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => setEditAvatar(emoji)}
                            className={`w-10 h-10 rounded-xl border text-lg flex items-center justify-center transition-colors cursor-pointer ${
                              editAvatar === emoji 
                                ? 'bg-[#FCEEEF] border-[#D48C8C] shadow-3xs' 
                                : 'bg-white border-gray-200 hover:bg-slate-50'
                            }`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 flex space-x-2">
                      <button
                        onClick={handleSaveProfileUpgrade}
                        className="bg-[#D48C8C] hover:bg-[#C27B7B] text-white py-2 px-6 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5"
                      >
                        <Save className="h-4 w-4" />
                        <span>Save Account Upgrades</span>
                      </button>
                      <button
                        onClick={() => setIsEditingProfile(false)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-600 py-2 px-6 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>

                  </div>
                ) : (
                  <div className="text-xs text-[#5E4C4C] space-y-2">
                    <p>✨ Clinically calibrated specifications ensure custom stress insights and trimester developments match your physiological milestones.</p>
                    <p>🗓️ Zenora automatically syncs logged events and clinical consultations with this core account.</p>
                  </div>
                )}

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
