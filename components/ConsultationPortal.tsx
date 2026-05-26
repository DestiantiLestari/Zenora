import React, { useState } from 'react';
import { Specialist, Booking, ChatMessage } from '../types';
import { initialSpecialists } from '../data';
import { Calendar, Clock, Star, Video, MessageCircle, Phone, Check, Shield, Search, X, User, Heart, Mic, MicOff, VideoOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ConsultationPortalProps {
  bookings: Booking[];
  onAddBooking: (booking: Booking) => void;
  onCancelBooking: (id: string) => void;
}

export default function ConsultationPortal({
  bookings,
  onAddBooking,
  onCancelBooking
}: ConsultationPortalProps) {
  
  // States
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSpecialistToBook, setActiveSpecialistToBook] = useState<Specialist | null>(null);

  // Form Booking Fields
  const [bookingDate, setBookingDate] = useState('');
  const [bookingSlot, setBookingSlot] = useState('10:00 AM');
  const [bookingType, setBookingType] = useState<Booking['type']>('Video Consultation');
  const [bookingNotes, setBookingNotes] = useState('');

  // Consultation Room Simulation Fields
  const [activeConsultationRoomBooking, setActiveConsultationRoomBooking] = useState<Booking | null>(null);
  const [simulatedChatHistory, setSimulatedChatHistory] = useState<ChatMessage[]>([]);
  const [chatInputValue, setChatInputValue] = useState('');
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  // Filter lists
  const filteredSpecialists = initialSpecialists.filter((spec) => {
    const matchesSearch = spec.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          spec.bio.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRoleFilter === 'All' || spec.role === selectedRoleFilter;
    return matchesSearch && matchesRole;
  });

  const handleOpenBookingModal = (spec: Specialist) => {
    setActiveSpecialistToBook(spec);
    // Set default tomorrow date
    const tmrw = new Date();
    tmrw.setDate(tmrw.getDate() + 1);
    setBookingDate(tmrw.toISOString().split('T')[0]);
    setBookingSlot('10:00 AM');
    setBookingType('Video Consultation');
    setBookingNotes('');
  };

  const handleConfirmBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSpecialistToBook) return;

    const newBooking: Booking = {
      id: Math.random().toString(36).substr(2, 9),
      specialistId: activeSpecialistToBook.id,
      specialistName: activeSpecialistToBook.name,
      specialistRole: activeSpecialistToBook.role,
      specialistAvatar: activeSpecialistToBook.avatar,
      date: bookingDate,
      timeSlot: bookingSlot,
      type: bookingType,
      status: 'Scheduled',
      notes: bookingNotes
    };

    onAddBooking(newBooking);
    setActiveSpecialistToBook(null);
  };

  // Launch virtual room session simulation
  const handleEnterConsultationRoom = (booking: Booking) => {
    setActiveConsultationRoomBooking(booking);
    // Preset mock messages
    setSimulatedChatHistory([
      {
        id: 'msg_1',
        sender: 'specialist',
        text: `Hello! I am ${booking.specialistName}. Welcome to your secure virtual wellness portal. How are you feeling today relative to your prenatal diary entries?`,
        timestamp: 'Just now'
      }
    ]);
    setChatInputValue('');
  };

  const handleSendSimulatedMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInputValue.trim() || !activeConsultationRoomBooking) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      sender: 'user',
      text: chatInputValue,
      timestamp: 'Just now'
    };

    setSimulatedChatHistory((prev) => [...prev, userMsg]);
    setChatInputValue('');

    // Trigger doctors smart answer
    setTimeout(() => {
      const responseTrigger = getDoctorsAutomatedAnswer(
        activeConsultationRoomBooking.specialistRole,
        userMsg.text
      );
      
      setSimulatedChatHistory((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substr(2, 9),
          sender: 'specialist',
          text: responseTrigger,
          timestamp: 'Just now'
        }
      ]);
    }, 1500);
  };

  // Simple rule-based mock response according to role
  const getDoctorsAutomatedAnswer = (role: string, query: string): string => {
    const qLower = query.toLowerCase();
    
    if (role === 'Obstetrician-Gynecologist') {
      if (qLower.includes('pain') || qLower.includes('cramp')) {
        return "Mild uterine contraction pulling is standard stretch progression, but if it expands aggressively, or you experience spotting, please contact our on-call emergency room. Keep hydration high.";
      }
      if (qLower.includes('sick') || qLower.includes('nausea')) {
        return "First trimester hormone pulses irritate gastric layers. Try organic ginger infusion capsules, take meals in small fractions, and keep carbs dry. Avoid ocean fish with heavy mercury.";
      }
      return "That makes sense. Physical transitions during gestation require structured physiological parameters tracking. I have recorded your symptom logs into your HIPAA prenatal schedule.";
    }

    if (role === 'Maternal Psychologist') {
      if (qLower.includes('anxious') || qLower.includes('scared') || qLower.includes('worry')) {
        return "I honor your worries completely. Your neurobiology is preparing space to shelter a child, which alters emotional thresholds. Focus on placing your hands on your diaphragm, inhale in 4 seconds, exhale in 6. Let go of perfect catalogs.";
      }
      return "Your emotional transition is what we call Matrescence. It is as massive as puberty. Treat your internal dialogue with deep grace and compassion. How is your sleep hygiene this week?";
    }

    if (role === 'Doula & Birth Coach') {
      return "You are incredibly strong. During delivery, your uterine muscles know exactly how to work with the baby. Focus on active somatic breathing and trust our birth plan structure.";
    }

    if (role === 'Lactation Consultant') {
      return "A wide asymmetrical latch is key. Keep baby's nose aligned slightly back to ensure their jaw can take a wide mouthful of lower areola and rest deep. Milk letdown surges will regulate within 10 days.";
    }

    return "Thank you for sharing that with me. Your symptoms fit within normal prenatal baselines. Keep recording your daily hydration and mood indices inside your counselor timeline.";
  };

  const TIME_SLOTS = ['09:00 AM', '10:00 AM', '11:30 AM', '02:00 PM', '03:30 PM', '05:00 PM'];

  return (
    <div id="portal-root" className="bg-[#FFFDFB] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Block */}
        <div className="pb-6 border-b border-[#FAF6F0] flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <span className="text-xs font-mono font-bold text-[#D48C8C] uppercase tracking-wider">SECURE TELEMEDICINE</span>
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#3C2F2F] text-left mt-1">Specialists Directories & Consult Room</h1>
            <p className="text-sm text-[#5E4C4C] mt-2 text-left">
              Schedule direct virtual sessions, messaging, or phone consults with verified board-certified clinicians safely under HIPAA standards.
            </p>
          </div>
          
          <div className="flex items-center space-x-1 py-1.5 px-3 bg-indigo-50 text-indigo-800 text-xs rounded-full font-mono font-semibold border border-indigo-100">
            <Shield className="h-4.5 w-4.5 text-indigo-600 animate-pulse shrink-0" />
            <span>Fully SOC-2 & HIPAA Secure Session</span>
          </div>
        </div>

        {/* ACTIVE APPOINTMENTS OR VIRTUAL ROOM SIMULATION PANEL */}
        <div className="space-y-4">
          <h2 className="font-serif font-bold text-xl text-[#3C2F2F] text-left">Your Telehealth Care Schedule</h2>
          {bookings.length === 0 ? (
            <div className="bg-[#FAF6F0] border border-dashed border-[#E9C2C2] rounded-3xl p-6 text-center text-[#8C7A7A] max-w-4xl">
              <p className="text-sm">You have no scheduled clinician appointments booked for this gestational semester.</p>
              <p className="text-xs mt-1 text-[#A39191]">Browse our verified directory below to coordinate a virtual consultation instantly.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl">
              {bookings.map((book) => {
                const isScheduled = book.status === 'Scheduled';
                return (
                  <div key={book.id} className="bg-white border border-[#F4E1E1] rounded-2xl p-4 flex flex-col justify-between shadow-2xs text-left">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl bg-[#FCEEEF] w-10 h-10 rounded-lg flex items-center justify-center border border-[#FAECEC]">
                          {book.specialistAvatar}
                        </span>
                        <div>
                          <h4 className="font-semibold text-sm text-[#4F3E3E]">{book.specialistName}</h4>
                          <p className="text-[11px] font-mono text-[#D48C8C] uppercase">{book.specialistRole}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${
                        isScheduled ? 'bg-[#EFFFFA] text-emerald-800 border-emerald-200' : 'bg-gray-100 text-gray-500 border-gray-200'
                      }`}>
                        {book.status}
                      </span>
                    </div>

                    <div className="py-3 space-y-1 text-xs text-[#5E4C4C] border-b border-[#FAF6F0] my-2">
                      <p className="flex items-center space-x-1.5 font-mono">
                        <Calendar className="h-3.5 w-3.5 text-[#D48C8C]" />
                        <span>Date: <strong>{book.date}</strong></span>
                      </p>
                      <p className="flex items-center space-x-1.5 font-mono">
                        <Clock className="h-3.5 w-3.5 text-[#D48C8C]" />
                        <span>Time: <strong>{book.timeSlot}</strong></span>
                      </p>
                      <p className="flex items-center space-x-1.5 font-mono">
                        <Video className="h-3.5 w-3.5 text-[#D48C8C]" />
                        <span>Channel: <strong>{book.type}</strong></span>
                      </p>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      {isScheduled && (
                        <>
                          <button
                            onClick={() => handleEnterConsultationRoom(book)}
                            className="flex-1 bg-gradient-to-r from-[#D48C8C] to-[#E99A9A] text-white hover:brightness-105 font-semibold text-xs py-2 px-3 rounded-lg text-center shadow-3xs cursor-pointer flex items-center justify-center space-x-1"
                          >
                            <Video className="h-3.5 w-3.5" />
                            <span>Enter Virtual Room</span>
                          </button>
                          <button
                            onClick={() => onCancelBooking(book.id)}
                            className="bg-transparent hover:bg-gray-50 text-gray-400 hover:text-rose-600 font-semibold text-xs py-2 px-3 rounded-lg border border-gray-200 transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* VIRTUAL CONSULTATION ROOM SIMULATOR INTERFACE */}
        <AnimatePresence>
          {activeConsultationRoomBooking && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 text-white rounded-3xl overflow-hidden shadow-2xl max-w-5xl mx-auto border border-slate-700"
            >
              <div className="bg-slate-800 px-6 py-4 flex justify-between items-center border-b border-slate-700">
                <div className="flex items-center space-x-3 text-left">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <div>
                    <h3 className="font-semibold text-base">Virtual Room: Dr-Patient Clinic</h3>
                    <p className="text-xs text-slate-400 font-mono">Secure Connection: TLS 1.3 • {activeConsultationRoomBooking.specialistName}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveConsultationRoomBooking(null)}
                  className="p-1.5 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Consultation split dashboard */}
              <div className="grid grid-cols-1 lg:grid-cols-12 h-[480px]">
                
                {/* Visual Video Feed Placement (Col-7) */}
                <div className="lg:col-span-7 bg-slate-950 relative flex flex-col justify-between p-4">
                  
                  {/* Doctor Video Box Placeholder */}
                  <div className="flex-1 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-center items-center relative overflow-hidden">
                    {!isVideoOff ? (
                      <div className="absolute inset-0 bg-[#FBF2EF] flex items-center justify-center">
                        <div className="text-center text-slate-900 space-y-2">
                          <span className="text-6xl block transform hover:scale-105 transition-transform duration-1000">
                            {activeConsultationRoomBooking.specialistAvatar}
                          </span>
                          <p className="font-serif font-bold text-lg text-[#3C2F2F]">{activeConsultationRoomBooking.specialistName}</p>
                          <span className="text-[10px] uppercase font-mono bg-[#E9C2C2] text-white px-3 py-1 rounded-full">Specialist Present</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-slate-500 space-y-1">
                        <VideoOff className="h-10 w-10 mx-auto" />
                        <p className="text-xs font-mono">Specialist Video Stream Suspended</p>
                      </div>
                    )}
                    <span className="absolute bottom-3 left-3 bg-slate-950/80 px-2 py-1 rounded-md text-[10px] font-mono">FEED: CLINIC_CAM_01</span>
                  </div>

                  {/* Patient Little Cam Placeholder */}
                  <div className="absolute top-8 right-8 w-28 h-20 rounded-lg bg-slate-800 border-2 border-[#D48C8C] overflow-hidden flex items-center justify-center">
                    <div className="text-center text-[10px] p-1 text-[#FCEEEF]">
                      <User className="h-4 w-4 mx-auto text-[#D48C8C]" />
                      <span className="font-mono mt-0.5 block">You (Cam active)</span>
                    </div>
                  </div>

                  {/* Controls interface bottom bar */}
                  <div className="flex justify-center items-center space-x-4 pt-3 border-t border-slate-900 h-16 shrink-0">
                    <button 
                      onClick={() => setIsMicMuted(!isMicMuted)}
                      className={`p-3 rounded-full transition-colors cursor-pointer ${
                        isMicMuted ? 'bg-rose-600 text-white' : 'bg-slate-800 hover:bg-slate-700'
                      }`}
                    >
                      {isMicMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                    </button>
                    
                    <button 
                      onClick={() => setIsVideoOff(!isVideoOff)}
                      className={`p-3 rounded-full transition-colors cursor-pointer ${
                        isVideoOff ? 'bg-rose-600 text-white' : 'bg-slate-800 hover:bg-slate-700'
                      }`}
                    >
                      {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
                    </button>

                    <button 
                      onClick={() => setActiveConsultationRoomBooking(null)}
                      className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase transition-transform scale-102 cursor-pointer"
                    >
                      Disconnect Consult
                    </button>
                  </div>
                </div>

                {/* Patient Chat messaging module (Col-5) */}
                <div className="lg:col-span-5 bg-slate-800 border-l border-slate-700 flex flex-col justify-between">
                  <div className="p-4 bg-slate-850 border-b border-slate-700 flex items-center space-x-2 text-left">
                    <MessageCircle className="h-5 w-5 text-[#D48C8C]" />
                    <span className="text-xs font-bold font-mono text-slate-300">SECURE TEXT CHAT SUPPORT</span>
                  </div>

                  {/* Message body history */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-80">
                    {simulatedChatHistory.map((msg) => {
                      const isPatient = msg.sender === 'user';
                      return (
                        <div key={msg.id} className={`flex flex-col text-left ${isPatient ? 'items-end' : 'items-start'}`}>
                          <span className="text-[9px] text-slate-400 font-mono mb-0.5 px-1">{isPatient ? 'You' : 'Specialist'}</span>
                          <div className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                            isPatient ? 'bg-[#D48C8C] text-white rounded-tr-none' : 'bg-slate-900 text-slate-100 rounded-tl-none'
                          }`}>
                            {msg.text}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Form input messaging */}
                  <form onSubmit={handleSendSimulatedMessage} className="p-3 bg-slate-900 border-t border-slate-800 flex space-x-2">
                    <input
                      type="text"
                      value={chatInputValue}
                      onChange={(e) => setChatInputValue(e.target.value)}
                      placeholder={`Type to ${activeConsultationRoomBooking.specialistName}...`}
                      className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:ring-1 focus:ring-[#D48C8C]"
                    />
                    <button 
                      type="submit"
                      className="bg-[#D48C8C] hover:bg-[#C27B7B] text-white px-3.5 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                    >
                      Send
                    </button>
                  </form>

                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SPECIALIST DIRECTORY AREA WITH FILTERS */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h2 className="font-serif font-bold text-2xl text-[#3C2F2F] text-left">Browse Licensed Specialists Directory</h2>
              <p className="text-xs text-[#8C7A7A] mt-1 text-left">Find Obstetricians, Maternal Mental Health Counselors, Lactation Consultants, or Doulas.</p>
            </div>
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-2.5 h-4.5 w-4.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search specialty, name, bio..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-white rounded-xl border border-[#FAECEC] focus:outline-hidden focus:border-[#D48C8C] focus:ring-1 focus:ring-[#D48C8C] shadow-3xs"
              />
            </div>
          </div>

          {/* Specialization Filter badges row */}
          <div className="flex flex-wrap gap-2 text-left">
            {['All', 'Obstetrician-Gynecologist', 'Maternal Psychologist', 'Doula & Birth Coach', 'Lactation Consultant', 'Pregnancy Nutritionist'].map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRoleFilter(role)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedRoleFilter === role
                    ? 'bg-[#FCEEEF] text-[#D48C8C] border border-[#E9C2C2]'
                    : 'bg-white text-[#8C7A7A] border border-gray-200 hover:bg-[#FAF6F0]'
                }`}
              >
                {role === 'All' ? 'All Roles' : role}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {filteredSpecialists.length === 0 ? (
              <p className="text-[#8C7A7A] italic text-xs col-span-full">No licensed practitioners match your active directory filtering query.</p>
            ) : (
              filteredSpecialists.map((spec) => (
                <div key={spec.id} className="bg-white border border-[#F4E1E1] rounded-3xl p-6 shadow-3xs hover:shadow-xs transition-shadow flex flex-col justify-between">
                  <div>
                    {/* Header: photo & rating */}
                    <div className="flex justify-between items-start pb-4 border-b border-[#FAF6F0]">
                      <div className="flex items-center space-x-3">
                        <span className="text-4xl bg-[#FAF6F0] w-14 h-14 rounded-2xl flex items-center justify-center border border-[#FAECEC] shadow-2xs">
                          {spec.avatar}
                        </span>
                        <div>
                          <h3 className="font-serif font-bold text-[#4F3E3E] text-base">{spec.name}</h3>
                          <span className="text-[10px] uppercase font-mono bg-[#FCEEEF] text-[#D48C8C] px-2 py-0.5 rounded-full leading-none mt-1 inline-block">
                            {spec.role}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-xs text-[#5E4C4C] mt-4 leading-relaxed italic">
                      &quot;{spec.bio}&quot;
                    </p>

                    {/* Stats & Price */}
                    <div className="grid grid-cols-2 gap-2 py-4 my-2 text-xs border-y border-[#FAF6F0]">
                      <div>
                        <span className="text-[9px] font-mono text-slate-400 block uppercase">FEE / SESSION</span>
                        <strong className="text-[#3C2F2F] text-sm">${spec.price} USD</strong>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono text-slate-400 block uppercase">SATISFACTION</span>
                        <div className="flex items-center space-x-1 mt-0.5 text-amber-500">
                          <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                          <strong className="text-[#3C2F2F] font-mono text-xs">{spec.rating} ({spec.reviews})</strong>
                        </div>
                      </div>
                    </div>

                    {/* Days Availability */}
                    <div className="space-y-1.5 text-xs">
                      <span className="text-[9px] font-mono text-slate-400 block uppercase">WEEKLY SCHEDULE</span>
                      <div className="flex flex-wrap gap-1">
                        {spec.availability.map((day) => (
                          <span key={day} className="bg-slate-50 text-slate-700 text-[10px] font-mono px-2 py-0.5 rounded-md border border-slate-100">
                            {day}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Booking Trigger CTA */}
                  <button
                    onClick={() => handleOpenBookingModal(spec)}
                    className="w-full bg-[#D48C8C] hover:bg-[#C27B7B] text-white py-3 px-4 rounded-xl text-xs font-bold text-center mt-6 shadow-3xs cursor-pointer transition-transform hover:scale-[1.01]"
                  >
                    Select & Book Consult
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* BOOKING DIALOG DIALOG OVERLAY */}
        <AnimatePresence>
          {activeSpecialistToBook && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-[#3C2F2F]/40 backdrop-blur-xs flex items-center justify-center p-4"
            >
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-lg border border-[#FCEEEF] shadow-2xl relative text-left"
              >
                {/* Close Button */}
                <button 
                  onClick={() => setActiveSpecialistToBook(null)}
                  className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-50 text-gray-400 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="flex items-center space-x-3 pb-4 border-b border-[#FAF6F0] mb-5">
                  <span className="text-3xl bg-[#FCEEEF] w-12 h-12 rounded-xl flex items-center justify-center">
                    {activeSpecialistToBook.avatar}
                  </span>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#3C2F2F]">Book Session: {activeSpecialistToBook.name}</h3>
                    <p className="text-xs font-mono text-[#D48C8C]">{activeSpecialistToBook.role}</p>
                  </div>
                </div>

                <form onSubmit={handleConfirmBookingSubmit} className="space-y-4 text-xs text-[#5E4C4C]">
                  
                  {/* Date Picker */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#4F3E3E]">Select Consultation Date</label>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      required
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 bg-slate-50 text-gray-800 focus:outline-hidden focus:ring-1 focus:ring-[#D48C8C] focus:bg-white"
                    />
                  </div>

                  {/* Time Slots Radio cards */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#4F3E3E]">Available Slots For Chosen Specialist</label>
                    <div className="grid grid-cols-3 gap-2">
                      {TIME_SLOTS.map((slot) => {
                        const isSelected = bookingSlot === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setBookingSlot(slot)}
                            className={`py-2 px-1 rounded-lg border text-center font-mono ${
                              isSelected
                                ? 'bg-[#FCEEEF] border-[#D48C8C] text-[#D48C8C] font-bold'
                                : 'bg-white border-gray-200 text-[#8C7A7A] hover:bg-slate-50'
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Channel type option card */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#4F3E3E]">Preferred Secure Channel</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { type: 'Video Consultation', label: 'Zoom Video', icon: <Video className="h-3.5 w-3.5" /> },
                        { type: 'Chat Support', label: 'Text Chat', icon: <MessageCircle className="h-3.5 w-3.5" /> },
                        { type: 'Phone Call', label: 'Direct Call', icon: <Phone className="h-3.5 w-3.5" /> }
                      ].map((item) => {
                        const isSelected = bookingType === item.type;
                        return (
                          <button
                            key={item.type}
                            type="button"
                            onClick={() => setBookingType(item.type as Booking['type'])}
                            className={`py-2 p-1.5 rounded-lg border flex flex-col items-center justify-center space-y-1 ${
                              isSelected
                                ? 'bg-[#FCEEEF] border-[#D48C8C] text-[#D48C8C] font-bold shadow-3xs'
                                : 'bg-white border-gray-200 text-gray-500 hover:bg-slate-50'
                            }`}
                          >
                            {item.icon}
                            <span className="text-[10px]">{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Consultation notes text block */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#4F3E3E]">Briefly State Concerns / Symptoms</label>
                    <textarea
                      placeholder="e.g. Mild cramping, high anxiety about lab results, breastfeeding latch difficulty..."
                      rows={3}
                      value={bookingNotes}
                      onChange={(e) => setBookingNotes(e.target.value)}
                      className="w-full border border-gray-300 rounded-2xl p-3 bg-[#FFFDFB] text-gray-800 focus:outline-hidden focus:ring-1 focus:ring-[#D48C8C] focus:bg-white resize-none"
                    />
                  </div>

                  {/* Footer actions */}
                  <div className="pt-4 flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setActiveSpecialistToBook(null)}
                      className="flex-1 bg-transparent hover:bg-gray-50 text-gray-500 font-bold py-3 px-4 rounded-xl border border-gray-200 text-center cursor-pointer text-xs"
                    >
                      Close Form
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-[#D48C8C] hover:bg-[#C27B7B] text-white font-bold py-3 px-4 rounded-xl text-center shadow-xs cursor-pointer text-xs transition-colors"
                    >
                      Confirm HIPAA Booking
                    </button>
                  </div>

                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
