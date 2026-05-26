import { useState } from 'react';
import { EducationalArticle, Quiz, QuizQuestion } from '../types';
import { initialArticles, initialQuizzes } from '../data';
import { Search, BookMarked, ThumbsUp, Eye, Clock, Award, CheckCircle2, XCircle, ArrowRight, RefreshCw, Sparkles, BookOpen, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HealthEducationProps {
  articles: EducationalArticle[];
  onToggleBookmark: (id: string) => void;
}

export default function HealthEducation({ articles, onToggleBookmark }: HealthEducationProps) {
  
  // States
  const [activeTab, setActiveTab] = useState<'articles' | 'quizzes'>('articles');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticleToRead, setActiveArticleToRead] = useState<EducationalArticle | null>(null);

  // Quiz Playing States
  const [activeQuizToPlay, setActiveQuizToPlay] = useState<Quiz | null>(null);
  const [currentQuizQuestionIdx, setCurrentQuizQuestionIdx] = useState(0);
  const [selectedAnswerIdx, setSelectedAnswerIdx] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Filters
  const filteredArticles = articles.filter((art) => {
    const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          art.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategoryFilter === 'All' || art.category === selectedCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'Mental Wellness', 'Pregnancy Milestones', 'Nutrition & Diet', 'Newborn Prep', 'Postpartum Care'];

  // Quiz Interactions
  const handleStartQuiz = (quiz: Quiz) => {
    setActiveQuizToPlay(quiz);
    setCurrentQuizQuestionIdx(0);
    setSelectedAnswerIdx(null);
    setHasAnswered(false);
    setScore(0);
    setQuizFinished(false);
  };

  const handleSelectAnswerIndex = (idx: number) => {
    if (hasAnswered) return;
    setSelectedAnswerIdx(idx);
    setHasAnswered(true);

    const isCorrect = idx === activeQuizToPlay?.questions[currentQuizQuestionIdx].correctAnswerIndex;
    if (isCorrect) {
      setScore((s) => s + 1);
    }
  };

  const handleNextQuizQuestion = () => {
    if (!activeQuizToPlay) return;

    if (currentQuizQuestionIdx < activeQuizToPlay.questions.length - 1) {
      setCurrentQuizQuestionIdx((q) => q + 1);
      setSelectedAnswerIdx(null);
      setHasAnswered(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRetakeQuiz = () => {
    if (activeQuizToPlay) {
      handleStartQuiz(activeQuizToPlay);
    }
  };

  const getQuizEncouragingQuote = (score: number, total: number) => {
    const pct = score / total;
    if (pct === 1) {
      return '⭐ Flawless! You possess exceptional clinical awareness of pregnancy self-care parameters. Keep following this enlightened track!';
    }
    if (pct >= 0.6) {
      return '🌸 Wonderful score! You understand core maternal concepts extremely well. Compassionate education is the bedrock of maternal power.';
    }
    return '🌱 A sweet learning opportunity! Pregnancy is an immense study without blueprints. Review our specialist articles to coordinate your knowledge.';
  };

  return (
    <div className="bg-[#FFFDFB] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Block */}
        <div className="pb-6 border-b border-[#FAF6F0] flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <span className="text-xs font-mono font-bold text-[#D48C8C] uppercase tracking-wider">VERIFIED CLINICAL WISDOM</span>
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#3C2F2F] text-left mt-1">Clinical Education & Smart Quizzes</h1>
            <p className="text-sm text-[#5E4C4C] mt-2 text-left">
              Browse peer-reviewed maternal wellness guides compiled by our directory Specialists. Challenge your insights safely.
            </p>
          </div>
          
          {/* Section tab switch */}
          <div className="flex bg-[#FAF6F0] p-1 rounded-2xl border border-[#FAECEC] shrink-0">
            <button
              onClick={() => setActiveTab('articles')}
              className={`py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'articles'
                  ? 'bg-[#D48C8C] text-white shadow-3xs'
                  : 'text-[#8C7A7A] hover:text-[#4F3E3E]'
              }`}
            >
              Educational Articles
            </button>
            <button
              onClick={() => setActiveTab('quizzes')}
              className={`py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'quizzes'
                  ? 'bg-[#D48C8C] text-white shadow-3xs'
                  : 'text-[#8C7A7A] hover:text-[#4F3E3E]'
              }`}
            >
              Knowledge Quizzes
            </button>
          </div>
        </div>

        {/* SECTION: EDUCATIONAL ARTICLES */}
        {activeTab === 'articles' && (
          <div className="space-y-6">
            
            {/* Filter Tool Bar */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              {/* Category buttons list */}
              <div className="flex flex-wrap gap-1.5 text-left">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                      selectedCategoryFilter === cat
                        ? 'bg-[#FCEEEF] text-[#D48C8C] border-[#E9C2C2]'
                        : 'bg-white border-gray-200 text-[#8C7A7A] hover:bg-slate-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search input bar */}
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3.5 top-2.5 h-4.5 w-4.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles & concepts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs bg-white rounded-xl border border-[#FAECEC] focus:outline-hidden focus:border-[#D48C8C] shadow-3xs"
                />
              </div>
            </div>

            {/* Articles Grid layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              {filteredArticles.length === 0 ? (
                <p className="text-gray-400 text-xs italic">No educational literature matches your filtering query.</p>
              ) : (
                filteredArticles.map((art) => (
                  <div key={art.id} className="bg-white border border-[#F4E1E1] rounded-3xl p-5 flex flex-col justify-between shadow-3xs hover:shadow-2xs transition-shadow">
                    <div className="space-y-3">
                      
                      {/* Meta header */}
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="bg-[#FAF6F0] text-[#D48C8C] border border-[#FAECEC] px-2 py-0.5 rounded-md font-bold uppercase">
                          {art.category}
                        </span>
                        <span className="text-slate-400 flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{art.readTime}</span>
                        </span>
                      </div>

                      {/* Title & Summary */}
                      <h3 className="font-serif font-bold text-lg text-[#3C2F2F] leading-tight hover:text-[#D48C8C] transition-colors cursor-pointer" onClick={() => setActiveArticleToRead(art)}>
                        {art.title}
                      </h3>
                      <p className="text-xs text-[#5E4C4C] leading-relaxed line-clamp-3">
                        {art.summary}
                      </p>
                    </div>

                    {/* Metadata summary & Bookmark CTA */}
                    <div className="flex justify-between items-center pt-4 border-t border-[#FAF6F0] mt-5">
                      <div className="text-left">
                        <p className="font-bold text-xs text-[#4F3E3E]">{art.author}</p>
                        <p className="text-[10px] text-slate-400">{art.authorTitle}</p>
                      </div>

                      <div className="flex items-center space-x-2">
                        {/* Bookmark button */}
                        <button
                          onClick={() => onToggleBookmark(art.id)}
                          className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                            art.isBookmarked
                              ? 'bg-[#FCEEEF] border-[#E9C2C2] text-[#D48C8C]'
                              : 'bg-white border-gray-200 text-gray-400 hover:text-[#D48C8C]'
                          }`}
                        >
                          <BookMarked className="h-4.5 w-4.5" />
                        </button>
                        
                        <button
                          onClick={() => setActiveArticleToRead(art)}
                          className="text-xs font-semibold text-[#D48C8C] hover:text-[#C27B7B] uppercase tracking-wide cursor-pointer font-mono"
                        >
                          Read Guide
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* SECTION: KNOWLEDGE QUIZZES */}
        {activeTab === 'quizzes' && !activeQuizToPlay && (
          <div className="space-y-6 text-left max-w-4xl">
            <div className="bg-[#FAF6F0] rounded-3xl p-6 border border-[#F4E1E1] flex items-center space-x-4 mb-4">
              <span className="text-3xl">🏆</span>
              <div>
                <h3 className="font-serif font-bold text-lg text-[#3C2F2F]">Zenora Clinic Interactive Academy</h3>
                <p className="text-xs text-[#5E4C4C] mt-1 leading-relaxed">
                  Interactive, clinically-compiled evaluations designed to explore safe nutrition, exercise limits, and emotional mental self-regulation workflows throughout matrescence.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {initialQuizzes.map((quiz) => (
                <div key={quiz.id} className="bg-white border border-[#F4E1E1] rounded-3xl p-6 shadow-3xs flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase bg-[#FCEEEF] text-[#D48C8C] border border-[#E9C2C2] px-2.5 py-0.5 rounded-full inline-block mb-3 font-semibold">
                      {quiz.category}
                    </span>
                    <h3 className="font-serif font-bold text-xl text-[#4F3E3E] leading-snug">{quiz.title}</h3>
                    <p className="text-xs text-[#5E4C4C] mt-2.5 leading-relaxed">{quiz.description}</p>
                    <span className="block text-[11px] text-slate-400 mt-4 font-mono">
                      📚 {quiz.questions.length} Educational Questions with explainer keynotes
                    </span>
                  </div>

                  <button
                    onClick={() => handleStartQuiz(quiz)}
                    className="w-full bg-[#D48C8C] hover:bg-[#C27B7B] text-white py-3 px-4 rounded-xl text-xs font-bold text-center mt-6 shadow-3xs cursor-pointer flex items-center justify-center space-x-1"
                  >
                    <span>Begin Interactive Quiz</span>
                    <ArrowRight className="h-4.5 w-4.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ACTIVE QUIZ GAME SCREEN CONTAINER */}
        {activeTab === 'quizzes' && activeQuizToPlay && (
          <div className="max-w-3xl mx-auto bg-white border border-[#F4E1E1] rounded-3xl p-6 sm:p-8 shadow-xs text-left space-y-6">
            
            {/* Quiz Heading Header */}
            <div className="flex justify-between items-center pb-4 border-b border-[#FAF6F0]">
              <div>
                <span className="text-[10px] font-mono text-[#D48C8C] uppercase font-bold tracking-wide">ACTIVE EVALUATION</span>
                <h3 className="font-serif font-bold text-lg text-[#3C2F2F]">{activeQuizToPlay.title}</h3>
              </div>
              <button
                onClick={() => setActiveQuizToPlay(null)}
                className="text-xs text-gray-400 hover:text-rose-600 font-mono font-bold flex items-center space-x-0.5"
              >
                <span>Exit Academy</span>
              </button>
            </div>

            {/* PROGRESS BAR */}
            {!quizFinished && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-mono text-[#8C7A7A]">
                  <span>QUESTION {currentQuizQuestionIdx + 1} OF {activeQuizToPlay.questions.length}</span>
                  <span>CURRENT SCORE: {score}</span>
                </div>
                <div className="h-2 w-full bg-[#FAF6F0] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#D48C8C] rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuizQuestionIdx + 1) / activeQuizToPlay.questions.length) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* QUIZ INTERACTIVE QUESTION AREA */}
            {!quizFinished ? (
              <div className="space-y-6">
                <h4 className="font-serif font-semibold text-lg sm:text-xl text-[#3C2F2F] leading-snug">
                  {activeQuizToPlay.questions[currentQuizQuestionIdx].question}
                </h4>

                {/* Question Options */}
                <div className="space-y-2.5">
                  {activeQuizToPlay.questions[currentQuizQuestionIdx].options.map((opt, idx) => {
                    const isSelected = selectedAnswerIdx === idx;
                    const correctAnswerIdx = activeQuizToPlay.questions[currentQuizQuestionIdx].correctAnswerIndex;
                    const isCorrectAnswer = idx === correctAnswerIdx;

                    let optionStyle = 'bg-white border-gray-200 text-[#4F3E3E] hover:bg-slate-50';
                    if (hasAnswered) {
                      if (isCorrectAnswer) {
                        optionStyle = 'bg-[#EFFFFA] border-emerald-400 text-emerald-900 font-semibold';
                      } else if (isSelected) {
                        optionStyle = 'bg-rose-50 border-rose-300 text-rose-900 font-semibold';
                      } else {
                        optionStyle = 'bg-white border-gray-100 text-gray-300 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={hasAnswered}
                        onClick={() => handleSelectAnswerIndex(idx)}
                        className={`w-full text-left p-4 rounded-xl border text-xs leading-relaxed transition-all flex justify-between items-center ${
                          !hasAnswered ? 'cursor-pointer active:scale-98' : 'cursor-default'
                        } ${optionStyle}`}
                      >
                        <span className="flex-1 pr-4">{opt}</span>
                        {hasAnswered && isCorrectAnswer && (
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                        )}
                        {hasAnswered && isSelected && !isCorrectAnswer && (
                          <XCircle className="h-5 w-5 text-rose-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* COMPREHENSIVE MEDICAL EXPLANATION BLOCK */}
                <AnimatePresence>
                  {hasAnswered && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-[#FAF6F0] rounded-2xl p-4 sm:p-5 border border-[#E9C2C2]/50 text-xs space-y-2 text-[#5E4C4C] leading-relaxed"
                    >
                      <h5 className="font-bold flex items-center space-x-1.5 text-[#D48C8C] uppercase font-mono tracking-wider">
                        <Award className="h-4.5 w-4.5" />
                        <span>Medical Explanation insight</span>
                      </h5>
                      <p>{activeQuizToPlay.questions[currentQuizQuestionIdx].explanation}</p>

                      <div className="pt-3 flex justify-end">
                        <button
                          onClick={handleNextQuizQuestion}
                          className="bg-[#D48C8C] hover:bg-[#C27B7B] text-white px-5 py-2.5 rounded-xl font-bold uppercase tracking-wide cursor-pointer text-[10px] transition-colors"
                        >
                          {currentQuizQuestionIdx < activeQuizToPlay.questions.length - 1 ? 'Next Question' : 'Complete Quiz & Score'}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* FINAL FINISHED SCORE CARD */
              <div className="py-6 text-center space-y-5">
                <span className="text-5xl block animate-bounce">🏆</span>
                
                <div>
                  <h4 className="font-serif font-bold text-2xl text-[#3C2F2F]">Interactive Quiz Completed</h4>
                  <p className="text-[#8C7A7A] text-xs font-mono mt-1 uppercase">YOUR FINAL EVALUATION SCORE</p>
                </div>

                {/* Score Number Badge */}
                <div className="inline-flex items-baseline space-x-1.5 bg-[#FCEEEF] px-8 py-4 rounded-3xl border border-[#FAECEC]">
                  <span className="text-5xl font-serif font-extrabold text-[#D48C8C]">{score}</span>
                  <span className="text-slate-400 text-lg">/ {activeQuizToPlay.questions.length}</span>
                </div>

                {/* Explanation text quote */}
                <p className="max-w-md mx-auto text-xs text-[#5E4C4C] leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {getQuizEncouragingQuote(score, activeQuizToPlay.questions.length)}
                </p>

                {/* Action button triggers for restart / browse articles */}
                <div className="pt-4 flex justify-center space-x-3 text-xs">
                  <button
                    onClick={handleRetakeQuiz}
                    className="bg-[#FAF4F0] hover:bg-white text-[#5E4C4C] border border-[#E9C2C2] py-3 px-5 rounded-xl font-bold flex items-center space-x-1 cursor-pointer transition-colors"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Retake Quiz</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveQuizToPlay(null);
                      setActiveTab('articles');
                    }}
                    className="bg-[#D48C8C] hover:bg-[#C27B7B] text-white py-3 px-5 rounded-xl font-bold cursor-pointer transition-colors"
                  >
                    Read Relevant Articles
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* DETAILED ARTICLE READER DIALOG */}
        <AnimatePresence>
          {activeArticleToRead && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-[#3C2F2F]/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
            >
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-2xl border border-[#FAF0F0] shadow-2xl relative text-left my-8"
              >
                {/* Close Button Pin */}
                <button 
                  onClick={() => setActiveArticleToRead(null)}
                  className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-gray-400 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Tag & Length */}
                <div className="flex justify-between items-center text-[10px] font-mono pb-3 border-b border-[#FAF6F0] mb-4">
                  <span className="bg-[#FAF6F0] text-[#D48C8C] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md">
                    {activeArticleToRead.category}
                  </span>
                  <span className="text-slate-400 flex items-center space-x-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{activeArticleToRead.readTime}</span>
                  </span>
                </div>

                {/* Heading */}
                <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-[#3C2F2F] leading-snug">
                  {activeArticleToRead.title}
                </h2>

                {/* Author Card row */}
                <div className="flex items-center space-x-2.5 py-4 border-b border-[#FAF6F0]/60 my-4 text-xs">
                  <div className="w-9 h-9 bg-[#FCEEEF] rounded-full border border-[#FAECEC] flex items-center justify-center text-lg shadow-3xs">
                    👩‍⚕️
                  </div>
                  <div>
                    <h5 className="font-bold text-[#4F3E3E]">{activeArticleToRead.author}</h5>
                    <p className="text-[10px] text-slate-400 font-mono leading-none">{activeArticleToRead.authorTitle}</p>
                  </div>
                </div>

                {/* Article body paragraphs iteration */}
                <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                  {activeArticleToRead.content.map((para, i) => (
                    <p key={i} className="text-xs sm:text-sm text-[#5E4C4C] leading-relaxed text-slate-700">
                      {para}
                    </p>
                  ))}
                </div>

                {/* Footer bookmark / close row */}
                <div className="pt-6 border-t border-[#FAF6F0] mt-6 flex justify-between items-center text-xs">
                  <button
                    onClick={() => {
                      onToggleBookmark(activeArticleToRead.id);
                      // Update active reference locally
                      setActiveArticleToRead({
                        ...activeArticleToRead,
                        isBookmarked: !activeArticleToRead.isBookmarked
                      });
                    }}
                    className={`px-4 py-2.5 rounded-xl border font-bold flex items-center space-x-1.5 cursor-pointer transition-colors ${
                      activeArticleToRead.isBookmarked
                        ? 'bg-[#FCEEEF] border-[#E9C2C2] text-[#D48C8C]'
                        : 'bg-white border-gray-200 text-gray-500 hover:text-[#D48C8C]'
                    }`}
                  >
                    <BookMarked className="h-4.5 w-4.5" />
                    <span>{activeArticleToRead.isBookmarked ? 'Bookmarked Guide' : 'Save Guide / Bookmark'}</span>
                  </button>

                  <button
                    onClick={() => setActiveArticleToRead(null)}
                    className="bg-[#D48C8C] hover:bg-[#C27B7B] text-white py-2.5 px-6 rounded-xl font-bold transition-colors cursor-pointer"
                  >
                    Close Guide
                  </button>
                </div>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
