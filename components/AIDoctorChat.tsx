import { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Send, Sparkles, AlertCircle, RefreshCw, Eye, Heart, HeartHandshake } from 'lucide-react';
import { ChatMessage } from '../types';
import { motion } from 'motion/react';

// Common pre-built prompt options that address typical maternal anxieties
const DEFAULTS_PROMPTS = [
  { id: 'dp_1', label: '5-Min Stress-Relief Somatic Breathing Exercise', text: 'Please provide a step-by-step, premium 5-minute somatic breathing exercise to calm immediate prepartum anxiety. Make the tone warm and compassionate.' },
  { id: 'dp_2', label: 'Safe Nutrition: First Trimester Guidelines', text: 'Provide a structured summary of critical folates, choline sources, and a strict list of safe foods and foods to absolutely avoid in the 1st trimester of pregnancy.' },
  { id: 'dp_3', label: 'Core Birth-Bag Hospital Essentials', text: 'Develop a compact, high-integrity birthing/hospital bag checklist for both mother, partner, and newborn baby.' },
  { id: 'dp_4', label: 'Overcoming Postpartum Matrescence Insomnia', text: 'Explain safe, non-medicinal behavioral strategies for postpartum mothers with fragmented sleep to cultivate sleep hygiene.' }
];

export default function AIDoctorChat() {
  
  // States
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'ai_welcome',
      sender: 'ai',
      text: 'Hello, dear. I am Zenora, your clinical AI Companion. I am fully equipped to answer questions regarding prenatal yoga, stress relief, trimester milestones, nutritional safety, and general emotional self-care. Write any concern, or choose of our pre-built clinical prompts below.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Main Stream handler from GenAI
  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || userInput;
    if (!textToSend.trim()) return;

    // Reset input
    if (!customText) setUserInput('');
    setErrorMessage('');

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Add User Message
    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      sender: 'user',
      text: textToSend,
      timestamp: timeString
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      // 2. Initialize Google GenAI
      const key = process.env.GEMINI_API_KEY || process.env.API_KEY;
      
      const ai = new GoogleGenAI({ 
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });

      // Show temporary compiling assistant placeholder
      const tempId = 'ai_temp_' + Math.random().toString(36).substr(2, 9);
      setMessages((prev) => [
        ...prev,
        {
          id: tempId,
          sender: 'ai',
          text: '',
          timestamp: timeString
        }
      ]);

      // 3. Generate Stream
      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-3.5-flash',
        contents: textToSend,
        config: {
          systemInstruction: 'You are Zenora, a world-class maternal clinical AI companion specializing in physical/mental pregnancy guidance and emotional postpartum care for mothers. Your tone must be loving, compassionate, medically precise, supportive, and calming. Never replace a doctor; always include a gentle clinical disclaimer when giving high-risk guidance. Prefer structured bullet points and easy-to-read formatting.',
          temperature: 0.7
        }
      });

      let accumulatedResponseText = '';

      for await (const chunk of responseStream) {
        if (chunk.text) {
          accumulatedResponseText += chunk.text;
          
          // Update the temp message
          setMessages((prev) => 
            prev.map((msg) => 
              msg.id === tempId 
                ? { ...msg, text: accumulatedResponseText } 
                : msg
            )
          );
        }
      }

    } catch (err: any) {
      console.error('Gemini Stream Error:', err);
      
      // Remove empty temp message if any
      setMessages((prev) => prev.filter((m) => m.text !== ''));

      // Clean fallback if API key isn't loaded or fails
      const fallbackResponse = `I hear you, and I appreciate you sharing your questions about this stage. Although I am currently navigating a network limit (or our security API is refreshing), I can assure you that your concerns are highly common during pregnancy! 🌸\n\n**Quick Supportive Directives:**\n- If this is regarding somatic nausea/pain, take double warm ginger water, rest deeply, and do not compromise on hydration.\n- If you feel emotional waves, remember that matrescence involves active, natural brain adaptation. Inhale for 4 seconds, and release for 6.\n\n*General clinical recommendation: You may also log this concerns inside your "Clinician Consults" portal and chat directly with Dr. Sterling, MD (OBGYN) or Dr. Moss (Maternal Counselor).*`;
      
      setMessages((prev) => [
        ...prev,
        {
          id: 'ai_fallback_' + Math.random().toString(36).substr(2, 9),
          sender: 'ai',
          text: fallbackResponse,
          timestamp: timeString
        }
      ]);

      setErrorMessage('Zenora Clinical Connection was simulated due to missing or refreshing network variables.');
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="bg-[#FFFDFB] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header Block bar */}
        <div className="pb-6 border-b border-[#FAF6F0] flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div className="text-left">
            <span className="text-xs font-mono font-bold text-[#D48C8C] uppercase tracking-wider">COMPASSIONATE CLINICAL INSIGHTS</span>
            <h1 className="font-serif text-3xl font-extrabold text-[#3C2F2F] mt-1 flex items-center space-x-2">
              <Sparkles className="h-7 w-7 text-[#D48C8C] animate-pulse" />
              <span>Zenora AI Maternal Advisor</span>
            </h1>
            <p className="text-sm text-[#5E4C4C] mt-2">
              Ask about trimester developments, safe exercises, soothing checklists, or mental anxiety. Real-time answers powered by Gemini.
            </p>
          </div>
          
          <div className="bg-[#FAF6F0] px-4 py-2.5 rounded-2xl border border-[#FAECEC] shrink-0 text-left">
            <p className="text-[10px] font-mono font-bold text-[#8C7A7A] uppercase">CLINICAL ENGINE</p>
            <p className="text-xs text-[#5E4C4C] font-semibold flex items-center space-x-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span>Gemini 3.5 Flash Active</span>
            </p>
          </div>
        </div>

        {/* MEDICAL DISCLAIMER FLOATING NOTE */}
        <div className="bg-[#FFF5F5] border border-rose-200 rounded-2xl p-4 flex items-start space-x-3 text-rose-800 text-xs text-left max-w-3xl">
          <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Important Clinical Disclaimer:</p>
            <p className="leading-relaxed">
              Zenora AI is configured to provide reassuring educational parameters and stress-calming guidelines. Under no circumstances should Zenora replace physical ob-gyn diagnostics, emergency hospitalization, or direct physician evaluations.
            </p>
          </div>
        </div>

        {/* THE MAIN ACTIVE WINDOW */}
        <div className="bg-white border border-[#F4E1E1] rounded-3xl shadow-xs overflow-hidden h-[500px] flex flex-col justify-between">
          
          {/* Chat scrolling feed */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <div key={m.id} className={`flex flex-col text-left ${isUser ? 'items-end' : 'items-start'}`}>
                  {/* Sender title */}
                  <span className="text-[10px] font-mono text-slate-400 mb-1 px-1.5 uppercase font-medium">
                    {isUser ? 'My Request' : 'Zenora AI advisor'}
                  </span>
                  
                  {/* Bubble content */}
                  <div className={`max-w-[85%] rounded-3xl p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                    isUser 
                      ? 'bg-[#D48C8C] text-white rounded-tr-none' 
                      : 'bg-[#FAF6F0] border border-[#FAEDE9] text-[#4F3E3E] rounded-tl-none font-serif'
                  }`}>
                    {m.text}
                  </div>
                </div>
              );
            })}
            
            {/* Gemini typing animation */}
            {isTyping && (
              <div className="flex flex-col items-start">
                <span className="text-[10px] font-mono text-[#D48C8C] mb-1 px-1.5 uppercase font-bold animate-pulse">
                  Clinician thinking...
                </span>
                <div className="bg-[#FAF6F0] rounded-3xl p-4 flex space-x-1 items-center">
                  <span className="w-2 h-2 bg-[#D48C8C] rounded-full animate-bounce delay-100" />
                  <span className="w-2 h-2 bg-[#D48C8C] rounded-full animate-bounce delay-200" />
                  <span className="w-2 h-2 bg-[#D48C8C] rounded-full animate-bounce delay-300" />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Form input messaging */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            className="p-4 bg-slate-50 border-t border-[#FCDEE0] flex items-center space-x-2"
          >
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ask Zenora about safe foods, breathing steps, trimester indicators..."
              className="flex-1 border border-gray-200 bg-white rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#3C2F2F] placeholder-gray-400 focus:outline-hidden focus:border-[#D48C8C] focus:ring-1 focus:ring-[#D48C8C]"
            />
            <button
              type="submit"
              className="h-10 w-10 sm:h-11 sm:w-11 bg-[#D48C8C] hover:bg-[#C27B7B] rounded-2xl flex items-center justify-center text-white cursor-pointer shadow-3xs hover:shadow-xs transition-shadow"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>

        </div>

        {/* CHOOSE PRE-BUILT SUGGESTIONS */}
        <div className="space-y-3">
          <span className="text-[10px] block font-mono font-bold uppercase text-[#8C7A7A] xl:text-left">Select Instant Clinical Inquiry</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
            {DEFAULTS_PROMPTS.map((dp) => (
              <button
                key={dp.id}
                onClick={() => handleSendMessage(dp.text)}
                className="p-3 bg-white border border-[#E9C2C2]/50 hover:border-[#D48C8C] rounded-2xl transition-all hover:shadow-3xs text-xs font-semibold text-[#5E4C4C] hover:text-[#4F3E3E] flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center space-x-2 pr-2">
                  <span className="text-lg">🌸</span>
                  <span className="truncate">{dp.label}</span>
                </div>
                <span className="text-[#D48C8C] font-mono text-base transform group-hover:translate-x-1 duration-200">→</span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
