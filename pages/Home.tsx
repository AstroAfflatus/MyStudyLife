
import React, { useEffect, useState, useMemo } from 'react';
import { UserProfile, ClassSession, Task, ExamRecord } from '../types';
import { Storage } from '../storage';
import { DAYS } from '../constants';
import { getStudyAdvice } from '../geminiService';
import { Sparkles, Calendar, CheckCircle2, ChevronRight, BookOpen, Clock, Zap, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdBanner from '../components/AdBanner';
import { NotificationService } from '../notificationService';

interface Props {
  user: UserProfile;
}

const DAILY_QUOTES = [
  "Discipline today creates an empire tomorrow. Every focused minute is an investment in your greatness.",
  "Your potential is infinite. Push past yesterday's limits and claim victory today with elite focus.",
  "Small daily wins lead to massive breakthroughs. Stay consistent, stay focused, stay elite.",
  "Excellence is a habit. Habit is your foundation. Build it strong with today's study goals.",
  "Rise above distractions. Your future self is counting on the work you do in this very moment."
];

const Home: React.FC<Props> = ({ user }) => {
  const [timetable] = useState<ClassSession[]>(Storage.getTimetable());
  const [tasks] = useState<Task[]>(Storage.getTasks());
  const [marks] = useState<ExamRecord[]>(Storage.getMarks());
  const [aiAdvice, setAiAdvice] = useState<string>('Syncing intelligence...');

  const currentDay = useMemo(() => DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1], []);
  const todaysClasses = useMemo(() => timetable.filter(c => c.day === currentDay).sort((a, b) => a.startTime.localeCompare(b.startTime)), [timetable, currentDay]);
  const pendingTasks = useMemo(() => tasks.filter(t => !t.isCompleted), [tasks]);
  const latestMark = useMemo(() => marks[marks.length - 1], [marks]);

  const dailyMotivation = useMemo(() => {
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    return DAILY_QUOTES[dayOfYear % DAILY_QUOTES.length];
  }, []);

  useEffect(() => {
    const fetchAdvice = async () => {
      const advice = await getStudyAdvice(user, pendingTasks.slice(0, 1));
      // CONCISE WRITE UP (strictly under 30 words for mobile punchiness)
      setAiAdvice(advice.split(' ').slice(0, 28).join(' ') + (advice.split(' ').length > 28 ? '...' : ''));
    };
    fetchAdvice();
    NotificationService.requestPermission();
  }, [user, pendingTasks]);

  return (
    <div className="p-5 sm:p-10 max-w-5xl mx-auto space-y-10 sm:space-y-14 pb-32 animate-fade-in">
      {/* 5D REALISTIC HEADER */}
      <section className="flex flex-col gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Crown size={18} className="text-amber-500 fill-amber-500 drop-shadow-md" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600">Elite Scholar Core</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-black text-slate-950 tracking-tighter leading-none">
            Hello, <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">{user.name}</span>
          </h2>
          {/* CONCISE MOTIVATION */}
          <div className="flex items-start gap-3 px-5 py-4 bg-white/60 backdrop-blur-2xl rounded-[2rem] border border-white/80 shadow-xl max-w-xs">
            <Zap size={16} className="text-amber-500 fill-amber-500 shrink-0 mt-0.5 animate-pulse" />
            <p className="text-[11px] font-bold text-slate-800 tracking-tight leading-snug italic line-clamp-2">"{dailyMotivation}"</p>
          </div>
        </div>

        <div className="glass-card px-6 py-5 flex items-center gap-5 shadow-2xl border-white/90">
          <div className="w-12 h-12 rounded-[1.5rem] bg-slate-950 flex items-center justify-center text-white shadow-xl">
            <Calendar size={22} />
          </div>
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Network Time</p>
            <p className="text-base font-black text-slate-900 tracking-tighter">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
          </div>
        </div>
      </section>

      {/* AI DASHBOARD */}
      <section className="relative glass-card p-1 bg-gradient-to-br from-indigo-500/30 via-purple-600/30 to-indigo-500/30 overflow-hidden shadow-2xl">
        <div className="bg-slate-950 rounded-[2.2rem] p-8 sm:p-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-indigo-500/10 blur-[100px] pointer-events-none"></div>
          <div className="relative z-10 flex flex-col items-center sm:flex-row gap-6 sm:gap-10">
            <div className="relative shrink-0">
               <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-30 animate-pulse"></div>
               <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[1.5rem] bg-white/10 backdrop-blur-3xl border border-white/10 flex items-center justify-center relative shadow-2xl">
                 <Sparkles className="text-indigo-400" size={32} />
               </div>
            </div>
            <div className="space-y-2 text-center sm:text-left">
              <h3 className="text-[8px] font-black uppercase tracking-[0.5em] text-indigo-400">GenAI Strategic Directives</h3>
              <p className="text-lg sm:text-xl font-bold leading-tight text-indigo-50 opacity-95">
                "{aiAdvice}"
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* LECTURES CARD */}
        <div className="glass-card p-8 flex flex-col gap-8 hover:scale-[1.02] transition-all duration-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-white">
                 <Clock size={22} />
               </div>
               <h3 className="font-black text-xl text-slate-900 tracking-tighter">Lectures</h3>
            </div>
            <Link to="/timetable" className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-950 hover:text-white transition-all shadow-sm">
              <ChevronRight size={18} />
            </Link>
          </div>
          <div className="space-y-4">
            {todaysClasses.length > 0 ? todaysClasses.map(cls => (
              <div key={cls.id} className="p-5 rounded-[1.8rem] bg-white/80 border border-white shadow-lg flex items-center gap-4">
                <div className="w-2 h-10 rounded-full" style={{ backgroundColor: cls.color }}></div>
                <div>
                  <p className="font-black text-slate-950 text-sm tracking-tight">{cls.subject}</p>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">{cls.startTime}</p>
                </div>
              </div>
            )) : <div className="h-20 flex items-center justify-center text-slate-400 font-bold italic text-xs">Clear schedule.</div>}
          </div>
        </div>

        {/* MISSIONS CARD */}
        <div className="glass-card p-8 flex flex-col gap-8 hover:scale-[1.02] transition-all duration-500">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-white">
               <CheckCircle2 size={22} />
             </div>
             <h3 className="font-black text-xl text-slate-900 tracking-tighter">Missions</h3>
          </div>
          <div className="space-y-4">
            {pendingTasks.length > 0 ? pendingTasks.slice(0, 3).map(t => (
              <div key={t.id} className="p-5 rounded-[1.8rem] bg-white/80 border border-white shadow-lg flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${t.priority === 'High' ? 'bg-rose-500' : 'bg-sky-500'}`}></div>
                <p className="font-black text-slate-800 text-sm tracking-tight truncate">{t.title}</p>
              </div>
            )) : <div className="h-20 flex items-center justify-center text-slate-400 font-bold italic text-xs">No tasks.</div>}
          </div>
        </div>

        {/* PERFORMANCE CARD */}
        <div className="glass-card p-8 flex flex-col items-center justify-center text-center gap-6 hover:scale-[1.02] transition-all duration-500">
          <h3 className="font-black text-xl text-slate-900 tracking-tighter">Performance Index</h3>
          {latestMark ? (
            <div className="relative w-40 h-40 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-[14px] border-slate-50 shadow-inner"></div>
              <svg className="w-full h-full -rotate-90 relative z-10 filter drop-shadow-lg">
                <circle 
                  cx="50%" cy="50%" r="40%" 
                  fill="none" stroke="url(#hp_grad)" strokeWidth="14" 
                  strokeDasharray={`${2 * Math.PI * 80}`}
                  strokeDashoffset={`${2 * Math.PI * 80 * (1 - latestMark.totalPercentage / 100)}`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="hp_grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-black text-slate-950 leading-none">{Math.round(latestMark.totalPercentage)}%</span>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Accuracy</span>
              </div>
            </div>
          ) : <BookOpen size={60} className="text-slate-100" />}
        </div>
      </div>

      {/* PARTNER SUITE */}
      <section className="space-y-8 pt-10 border-t border-slate-100">
        <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 text-center">Global Partner Network</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AdBanner className="shadow-2xl rounded-[1.8rem]" />
          <AdBanner className="hidden md:block shadow-2xl rounded-[1.8rem]" />
        </div>
        <p className="text-center text-[8px] font-black text-slate-300 uppercase tracking-[0.4em]">ca-app-pub-6078973010995432/7316243969</p>
      </section>
    </div>
  );
};

export default Home;
