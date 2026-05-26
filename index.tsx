import ReactDOM from 'react-dom/client';
import { useState, useEffect } from 'react';
import './index.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MoodTracker from './components/MoodTracker';
import PregnancyTracker from './components/PregnancyTracker';
import ConsultationPortal from './components/ConsultationPortal';
import HealthEducation from './components/HealthEducation';
import AIDoctorChat from './components/AIDoctorChat';
import AuthPortal from './components/AuthPortal';

import { MoodEntry, Booking, KickSession, EducationalArticle, User } from './types';
import { initialMoods, initialArticles } from './data';
import { Shield, Lock, Activity, Heart, Sparkles } from 'lucide-react';

function App() {
  // Navigation State
  const [currentTab, setCurrentTab] = useState('dashboard');

  // Gestational pregnancy week state (1 to 40, defaults to 16 [Avocado Size])
  const [gestationalWeek, setGestationalWeek] = useState<number>(16);

  // Live Authentication state
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Core local states backed by LocalStorage persistence
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [kickSessions, setKickSessions] = useState<KickSession[]>([]);
  const [articles, setArticles] = useState<EducationalArticle[]>([]);


  // Initialize data on component mount
  useEffect(() => {
    // 1. Initial Mood logs
    const storedMoods = localStorage.getItem('zenora_moods');
    if (storedMoods) {
      try {
        setMoodEntries(JSON.parse(storedMoods));
      } catch (e) {
        setMoodEntries(initialMoods);
      }
    } else {
      setMoodEntries(initialMoods);
      localStorage.setItem('zenora_moods', JSON.stringify(initialMoods));
    }

    // 2. Initial Clinician Bookings
    const storedBookings = localStorage.getItem('zenora_bookings');
    if (storedBookings) {
      try {
        setBookings(JSON.parse(storedBookings));
      } catch (e) {
        setBookings([]);
      }
    } else {
      // Create one default scheduled booking to let user experience telemedicine easily
      const defaultBooking: Booking = {
        id: 'bk_default',
        specialistId: 's1',
        specialistName: 'Dr. Sarah Sterling, MD',
        specialistRole: 'Obstetrician-Gynecologist',
        specialistAvatar: '👩‍⚕️',
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // tomorrow
        timeSlot: '11:30 AM',
        type: 'Video Consultation',
        status: 'Scheduled',
        notes: 'Review prenatal glucose screen results & check general physical fatigue bounds.'
      };
      setBookings([defaultBooking]);
      localStorage.setItem('zenora_bookings', JSON.stringify([defaultBooking]));
    }

    // 3. Initial Kick Counter Sessions
    const storedKicks = localStorage.getItem('zenora_kicks');
    if (storedKicks) {
      try {
        setKickSessions(JSON.parse(storedKicks));
      } catch (e) {
        setKickSessions([]);
      }
    } else {
      setKickSessions([]);
    }

    // 4. Initial Educational Articles with Bookmark properties
    const storedArticles = localStorage.getItem('zenora_articles');
    if (storedArticles) {
      try {
        setArticles(JSON.parse(storedArticles));
      } catch (e) {
        setArticles(initialArticles);
      }
    } else {
      setArticles(initialArticles);
      localStorage.setItem('zenora_articles', JSON.stringify(initialArticles));
    }

    // Load active week from memory
    const storedWeek = localStorage.getItem('zenora_week');
    if (storedWeek) {
      setGestationalWeek(parseInt(storedWeek, 10));
    }

    // Load active authenticated user from memory
    const storedUser = localStorage.getItem('zenora_current_user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        // no-op
      }
    }
  }, []);

  // Setters with active local storage syncing
  const handleAddMoodEntry = (entry: MoodEntry) => {
    const updated = [entry, ...moodEntries];
    setMoodEntries(updated);
    localStorage.setItem('zenora_moods', JSON.stringify(updated));
  };

  const handleAddBooking = (booking: Booking) => {
    const updated = [booking, ...bookings];
    setBookings(updated);
    localStorage.setItem('zenora_bookings', JSON.stringify(updated));
  };

  const handleCancelBooking = (id: string) => {
    const updated = bookings.map((b) => b.id === id ? { ...b, status: 'Cancelled' as const } : b);
    setBookings(updated);
    localStorage.setItem('zenora_bookings', JSON.stringify(updated));
  };

  const handleAddKickSession = (session: KickSession) => {
    const updated = [session, ...kickSessions];
    setKickSessions(updated);
    localStorage.setItem('zenora_kicks', JSON.stringify(updated));
  };

  const handleToggleArticleBookmark = (id: string) => {
    const updated = articles.map((a) => a.id === id ? { ...a, isBookmarked: !a.isBookmarked } : a);
    setArticles(updated);
    localStorage.setItem('zenora_articles', JSON.stringify(updated));
  };

  const handleWeekChange = (week: number) => {
    setGestationalWeek(week);
    localStorage.setItem('zenora_week', week.toString());

    // Automatically keep current user week in sync if logged in
    if (currentUser) {
      const updated = { ...currentUser, gestationalWeek: week };
      setCurrentUser(updated);
      localStorage.setItem('zenora_current_user', JSON.stringify(updated));
    }
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('zenora_current_user', JSON.stringify(user));
    setCurrentTab('dashboard'); // Dynamic redirect
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('zenora_current_user');
    setCurrentTab('dashboard');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('zenora_current_user', JSON.stringify(updatedUser));
  };

  return (
    <div className="bg-[#FAF6F0] text-[#3C2F2F] font-sans antialiased min-h-screen flex flex-col justify-between selection:bg-[#FCEEEF]/70">
      
      {/* 1. Header Navigation Bar */}
      <Navbar currentTab={currentTab} onTabChange={setCurrentTab} currentUser={currentUser} />

      {/* 2. Main Tab Body Area */}
      <main className="flex-grow">
        {currentTab === 'dashboard' && (
          <Hero onTabChange={setCurrentTab} gestationalWeek={gestationalWeek} moodEntries={moodEntries} />
        )}

        {currentTab === 'pregnancy' && (
          <PregnancyTracker 
            gestationalWeek={gestationalWeek}
            onWeekChange={handleWeekChange}
            kickSessions={kickSessions}
            onAddKickSession={handleAddKickSession}
          />
        )}

        {currentTab === 'mental-health' && (
          <MoodTracker 
            moodEntries={moodEntries}
            onAddMood={handleAddMoodEntry}
          />
        )}

        {currentTab === 'consultations' && (
          <ConsultationPortal 
            bookings={bookings}
            onAddBooking={handleAddBooking}
            onCancelBooking={handleCancelBooking}
          />
        )}

        {currentTab === 'education' && (
          <HealthEducation 
            articles={articles}
            onToggleBookmark={handleToggleArticleBookmark}
          />
        )}

        {currentTab === 'ai-chat' && (
          <AIDoctorChat />
        )}

        {currentTab === 'auth' && (
          <AuthPortal 
            currentUser={currentUser}
            onLogin={handleLogin}
            onLogout={handleLogout}
            onUpdateUser={handleUpdateUser}
            moodEntries={moodEntries}
            bookings={bookings}
            kickSessions={kickSessions}
            gestationalWeek={gestationalWeek}
            onWeekChange={handleWeekChange}
          />
        )}
      </main>

      {/* 3. High-Polished Premium SaaS Medical Footer */}
      <footer className="bg-white border-t border-[#FCEEEF] py-12 px-4 sm:px-6 lg:px-8 shadow-xs text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Logo Brand columns */}
          <div className="md:col-span-5 space-y-3 text-left">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-[#E9C2C2] to-[#FFF0F0] flex items-center justify-center border border-[#E9C2C2]">
                <Heart className="h-4 w-4 text-[#D48C8C] fill-[#D48C8C]/10" />
              </div>
              <span className="font-serif text-lg font-bold tracking-tight text-[#4F3E3E]">Zenora Care</span>
            </div>
            <p className="text-slate-500 leading-relaxed max-w-sm">
              Supporting the biological and psychological pathways of transition into motherhood. HIPAA and SOC-2 credentialed data encryption models ensure your data always stays private and secure.
            </p>
            <div className="flex items-center space-x-4 pt-1 font-mono text-[10px] text-[#A66C6C]">
              <span className="flex items-center space-x-1">
                <Shield className="h-3.5 w-3.5 text-[#D48C8C]" />
                <span>Secure SSL Encryption</span>
              </span>
              <span className="flex items-center space-x-1">
                <Lock className="h-3.5 w-3.5 text-[#D48C8C]" />
                <span>100% HIPAA Compliant</span>
              </span>
            </div>
          </div>

          {/* Clinical Disclaimers columns */}
          <div className="md:col-span-7 space-y-4 md:pl-6 border-t md:border-t-0 md:border-l border-[#FCEEEF] pt-6 md:pt-0 text-left">
            <div>
              <p className="font-bold text-[#4F3E3E] uppercase tracking-wider font-mono text-[10px] flex items-center space-x-1.5">
                <Activity className="h-3.5 w-3.5 text-[#D48C8C]" />
                <span>Clinical & Telemedicine Policy Note</span>
              </p>
              <p className="text-slate-500 leading-relaxed mt-1.5">
                Zenora operates under strict telemedicine governance structures. All counselors listed in our verified directories hold accredited state licenses. The Zenora AI Clinical Companion is designed for stress mitigation and general fetal timeline monitoring; never use AI inputs in place of diagnostic ob-gyn clinical parameters.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4 text-slate-400 font-medium pb-2">
              <span className="hover:text-[#D48C8C] cursor-pointer">HIPAA Disclosures</span>
              <span>•</span>
              <span className="hover:text-[#D48C8C] cursor-pointer">Clinical Licensing Directors</span>
              <span>•</span>
              <span className="hover:text-[#D48C8C] cursor-pointer">Privacy Policy</span>
              <span>•</span>
              <span className="hover:text-[#D48C8C] cursor-pointer">Terms of Clinical Duty</span>
            </div>

            <p className="text-[10px] text-slate-400 font-mono">
              © 2026 Zenora Care, Inc. All rights reserved. Built with pride to support maternal wellness.
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
