export interface MoodEntry {
  id: string;
  date: string; // YYYY-MM-DD
  level: number; // 1-5 (Terrible, Struggling, Neutral, Good, Joyful)
  emotion: 'Calm' | 'Anxious' | 'Joyful' | 'Tired' | 'Overwhelmed' | 'Sad' | 'Peaceful';
  notes: string;
  symptoms: string[]; // e.g. Nausea, Headache, Backache, Fatigue, Cramps
  sleepHours: number;
  waterIntake: number; // number of glasses (e.g., 250ml each)
}

export interface Specialist {
  id: string;
  name: string;
  role: 'Obstetrician-Gynecologist' | 'Maternal Psychologist' | 'Doula & Birth Coach' | 'Lactation Consultant' | 'Pregnancy Nutritionist';
  rating: number;
  reviews: number;
  avatar: string; // avatar classification or symbol
  bio: string;
  price: number;
  availability: string[]; // days of week
}

export interface Booking {
  id: string;
  specialistId: string;
  specialistName: string;
  specialistRole: string;
  specialistAvatar: string;
  date: string;
  timeSlot: string;
  type: 'Video Consultation' | 'Chat Support' | 'Phone Call';
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  notes?: string;
}

export interface EducationalArticle {
  id: string;
  title: string;
  category: 'Mental Wellness' | 'Pregnancy Milestones' | 'Nutrition & Diet' | 'Newborn Prep' | 'Postpartum Care';
  readTime: string;
  summary: string;
  content: string[]; // Paragraphs
  author: string;
  authorTitle: string;
  views: number;
  likes: number;
  isBookmarked?: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  category: string;
  description: string;
  questions: QuizQuestion[];
}

export interface KickSession {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  durationMinutes: number;
  kickCount: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'specialist';
  text: string;
  timestamp: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  password?: string; // stored securely in simulated local database
  gestationalWeek: number;
  partnerName?: string;
  dueDate?: string;
  avatarEmoji?: string;
  dateCreated: string;
}

