import { useState } from 'react';
import { Menu, X, Sparkles, Heart, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User } from '../types';

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  currentUser: User | null;
}

export default function Navbar({ currentTab, onTabChange, currentUser }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'pregnancy', label: 'Pregnancy Clock' },
    { id: 'mental-health', label: 'Mental Wellness' },
    { id: 'education', label: 'Education & Quizzes' },
    { id: 'ai-chat', label: 'Zenora AI Guide' }
  ];

  const handleNavClick = (tabId: string) => {
    onTabChange(tabId);
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#FFFDFB]/95 backdrop-blur-md border-b border-[#F4E1E1] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-18 items-center">
          {/* Logo */}
          <div 
            onClick={() => handleNavClick('dashboard')} 
            className="flex items-center space-x-2 cursor-pointer group"
          >
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-[#E9C2C2] to-[#FFF0F0] flex items-center justify-center border border-[#E9C2C2] shadow-sm group-hover:scale-105 transition-transform">
              <Heart className="h-5 w-5 text-[#D48C8C] fill-[#D48C8C]/20" />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-[#4F3E3E] group-hover:text-[#D48C8C] transition-colors">
                Zenora
              </span>
              <span className="hidden sm:inline-block ml-1 px-1.5 py-0.5 text-[10px] uppercase tracking-wider font-mono text-[#4F3E3E] bg-[#FCEEEF] rounded-full text-xs border border-[#F4D0D0]">
                Care
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex space-x-1 items-center">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  currentTab === item.id
                    ? 'bg-[#FCEEEF] text-[#D48C8C] border border-[#E1C3C3]'
                    : 'text-[#5E4C4C] hover:bg-[#FAF4F0] hover:text-[#4F3E3E]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right CTA */}
          <div className="hidden md:flex items-center space-x-3 text-left">
            {currentUser ? (
              <div 
                onClick={() => handleNavClick('auth')}
                className="flex items-center space-x-2 bg-[#FAF6F0] border border-[#FAECEC] hover:border-[#D48C8C] px-3.5 py-1.5 rounded-full cursor-pointer transition-colors"
              >
                <span className="text-base">{currentUser.avatarEmoji || '🤰'}</span>
                <div>
                  <p className="text-[9px] text-[#A66C6C] font-mono leading-none uppercase font-bold">Active Patient</p>
                  <p className="text-xs font-bold text-[#4F3E3E] leading-tight">{currentUser.name.split(' ')[0]}</p>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => handleNavClick('auth')}
                className="flex items-center space-x-1 text-xs text-[#BF7575] bg-[#FCEEEF] px-3.5 py-2 rounded-full border border-[#F1D0D0] hover:bg-[#FCEEEF]/70 transition-colors cursor-pointer"
              >
                <span>🔐 Sign In / Register</span>
              </button>
            )}
            <button 
              onClick={() => onTabChange('consultations')}
              className="bg-[#D48C8C] text-white hover:bg-[#C27B7B] px-5 py-2 rounded-full text-xs font-bold shadow-xs transition-all hover:shadow-sm cursor-pointer uppercase tracking-wider font-mono"
            >
              Consult Now
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-full text-[#5E4C4C] hover:bg-[#FAF4F0] focus:outline-hidden border border-[#F4E1E1]"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden border-t border-[#F4E1E1] bg-[#FFFDFB]/98"
          >
            <div className="px-3 pt-3 pb-6 space-y-1.5">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`block w-full text-left px-5 py-3.5 rounded-xl text-lg font-bold transition-all ${
                    currentTab === item.id
                      ? 'bg-[#FCEEEF] text-[#D48C8C] shadow-3xs'
                      : 'text-[#5E4C4C] hover:bg-[#FAF4F0]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-5 pb-2 border-t border-[#FAF1F1] px-4 flex flex-col space-y-3.5">
                <div className="flex items-center space-x-2 text-[#BF7575] justify-center px-2 py-1">
                  <Sparkles className="h-4.5 w-4.5 text-[#D48C8C]" />
                  <span className="text-sm font-mono font-bold tracking-wide">Zenora AI Clinician Active</span>
                </div>
                
                {currentUser ? (
                  <button 
                    onClick={() => handleNavClick('auth')}
                    className="w-full text-center bg-[#FAF6F0] hover:bg-[#FAECEC] text-[#4F3E3E] border border-[#FAECEC] px-5 py-3.5 rounded-2xl text-sm font-extrabold flex items-center justify-center space-x-2.5 cursor-pointer transition-colors"
                  >
                    <span className="text-xl">{currentUser.avatarEmoji || '🤰'}</span>
                    <span>{currentUser.name} (My Profile)</span>
                  </button>
                ) : (
                  <button 
                    onClick={() => handleNavClick('auth')}
                    className="w-full text-center bg-[#FCEEEF]/70 hover:bg-[#FCEEEF] text-[#D48C8C] border border-[#FAECEC] px-5 py-3.5 rounded-2xl text-sm font-extrabold flex items-center justify-center space-x-2 cursor-pointer transition-colors"
                  >
                    <span>🔐 Sign In / Register Patient</span>
                  </button>
                )}
 
                <button 
                  onClick={() => handleNavClick('consultations')}
                  className="w-full text-center bg-[#D48C8C] text-white px-5 py-4 rounded-2xl text-sm font-extrabold uppercase tracking-widest font-mono hover:bg-[#C27B7B] transition-all cursor-pointer shadow-3xs"
                >
                  Book Virtual Consult
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
