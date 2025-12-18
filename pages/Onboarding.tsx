
import React, { useState } from 'react';
import { UserProfile, Stream } from '../types';
import { APP_LOGO, STREAMS, CLASSES } from '../constants';
import { ArrowRight, User, Sparkles } from 'lucide-react';

interface Props {
  onComplete: (profile: UserProfile) => void;
}

const Onboarding: React.FC<Props> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [className, setClassName] = useState(CLASSES[0]);
  const [stream, setStream] = useState<Stream>(Stream.Science);
  const [dailyGoal, setDailyGoal] = useState(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onComplete({ name, className, stream, dailyGoal });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-5 sm:p-10 animate-fade-in safe-pt safe-pb">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-4">
          <div className="relative inline-block">
             <div className="absolute -inset-4 bg-indigo-500 rounded-full blur-[25px] opacity-15"></div>
             <img src={APP_LOGO} alt="App Logo" className="relative w-20 h-20 mx-auto rounded-[1.8rem] shadow-2xl border border-white/80" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">MyStudyLife</h1>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/50 backdrop-blur-xl border border-white rounded-full shadow-lg">
             <Sparkles size={14} className="text-indigo-600" />
             <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Elite Scholar Suite</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-8 space-y-8 shadow-2xl">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-5">Identity</label>
            <div className="relative">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full pl-12 pr-6 py-4 bg-white/50 border border-white rounded-full outline-none font-bold text-slate-800 text-base shadow-inner"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-5">Grade</label>
              <select 
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="w-full px-6 py-4 bg-white/50 border border-white rounded-[1.8rem] outline-none font-bold text-slate-800 text-sm shadow-inner appearance-none"
              >
                {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-5">Stream</label>
              <select 
                value={stream}
                onChange={(e) => setStream(e.target.value as Stream)}
                className="w-full px-6 py-4 bg-white/50 border border-white rounded-[1.8rem] outline-none font-bold text-slate-800 text-sm shadow-inner appearance-none"
              >
                {STREAMS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-5">Daily Target: {dailyGoal}h</label>
            <input 
              type="range" 
              min="1" 
              max="12" 
              value={dailyGoal}
              onChange={(e) => setDailyGoal(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-indigo-600"
            />
          </div>

          <button 
            type="submit"
            className="btn-pebble w-full py-5 bg-slate-900 text-white font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-indigo-500/20 shadow-xl"
          >
            Start Journey <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
