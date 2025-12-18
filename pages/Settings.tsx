
import React, { useState } from 'react';
import { UserProfile, Stream } from '../types';
import { Storage } from '../storage';
import { STREAMS, CLASSES } from '../constants';
import { User, Bell, Moon, LogOut, Smartphone, ShieldCheck } from 'lucide-react';

interface Props {
  user: UserProfile;
  setUser: (u: UserProfile) => void;
}

const Settings: React.FC<Props> = ({ user, setUser }) => {
  const [profile, setProfile] = useState<UserProfile>(user);
  const [showSavedMsg, setShowSavedMsg] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const saveSettings = () => {
    Storage.setUser(profile);
    setUser(profile);
    setShowSavedMsg(true);
    setTimeout(() => setShowSavedMsg(false), 2000);
  };

  return (
    <div className="p-6 sm:p-12 max-w-4xl mx-auto space-y-12 animate-fade-in pb-32">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-100 rounded-xl shadow-inner border border-white">
            <ShieldCheck size={18} className="text-indigo-600" />
          </div>
          <span className="text-[11px] font-black uppercase tracking-[0.5em] text-indigo-600">Preferences Terminal</span>
        </div>
        <h2 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tighter leading-none">Settings</h2>
      </div>

      <div className="space-y-10">
        {/* PROFILE SECTION */}
        <section className="glass-card p-8 space-y-8 shadow-2xl">
          <div className="flex items-center gap-5 border-b border-slate-100 pb-8">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white border-2 border-white/50 shadow-xl shrink-0">
              <User size={24} />
            </div>
            <h3 className="font-black text-2xl text-slate-900 tracking-tight">Identity Profile</h3>
          </div>
          
          <div className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-6">Legal Name</label>
              <input 
                type="text" 
                value={profile.name}
                onChange={e => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-8 py-5 bg-white/40 border border-white rounded-full outline-none font-bold text-slate-900 text-base shadow-inner"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-6">Grade</label>
                <select 
                  value={profile.className}
                  onChange={e => setProfile({ ...profile, className: e.target.value })}
                  className="w-full px-8 py-5 bg-white/40 border border-white rounded-[2rem] outline-none font-bold text-slate-900 text-base appearance-none shadow-inner"
                >
                  {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-6">Stream</label>
                <select 
                  value={profile.stream}
                  onChange={e => setProfile({ ...profile, stream: e.target.value as Stream })}
                  className="w-full px-8 py-5 bg-white/40 border border-white rounded-[2rem] outline-none font-bold text-slate-900 text-base appearance-none shadow-inner"
                >
                  {STREAMS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* SYSTEM CONTROLS */}
        <section className="glass-card p-8 space-y-8 shadow-2xl">
          <div className="flex items-center gap-5 border-b border-slate-100 pb-8">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 border-2 border-white shadow-inner shrink-0">
              <Smartphone size={24} />
            </div>
            <h3 className="font-black text-2xl text-slate-900 tracking-tight">System Core</h3>
          </div>
          
          {/* TACTILE SLIDER - ALWAYS ON BY DEFAULT */}
          <div className="flex items-center justify-between py-4 group">
            <div className="flex items-center gap-6">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-700 ${notifications ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-slate-50 border-white text-slate-400'}`}>
                <Bell size={22} />
              </div>
              <div>
                <span className="font-black text-slate-900 text-lg block tracking-tight leading-none">Push Protocol</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-2 block">1-Min Luxury Pulse</span>
              </div>
            </div>
            <button 
              onClick={() => setNotifications(!notifications)}
              className={`luxe-slider-track ${notifications ? 'active' : ''} shrink-0`}
            >
              <div className={`luxe-slider-knob ${notifications ? 'translate-x-[2.2rem]' : 'translate-x-0'} flex items-center justify-center`}>
                 <div className={`w-1 h-3 rounded-full ${notifications ? 'bg-indigo-600' : 'bg-slate-300'} transition-colors`}></div>
              </div>
            </button>
          </div>
          
          <div className="flex items-center justify-between py-4 opacity-25 grayscale pointer-events-none">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 border-2 border-white">
                <Moon size={22} />
              </div>
              <div>
                <span className="font-black text-slate-900 text-lg block tracking-tight leading-none">Dark Interface</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-2 block">Update Pending v4.0</span>
              </div>
            </div>
            <div className="luxe-slider-track">
               <div className="luxe-slider-knob"></div>
            </div>
          </div>
        </section>

        <div className="text-center space-y-10 pt-10">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.5em]">MSL_5D_ULTRA_CORE</p>
          <button className="flex items-center gap-3 px-10 py-5 rounded-full border border-rose-100 text-rose-500 font-black text-[10px] uppercase tracking-[0.3em] hover:bg-rose-50 transition-all mx-auto active:scale-95">
            <LogOut size={18} /> Clear Terminal Cache
          </button>
        </div>

        {/* FLOATING ACTION BUTTON */}
        <div className="fixed bottom-24 right-6 sm:bottom-10 sm:right-10 z-50">
          <button 
            onClick={saveSettings}
            className={`
              btn-pebble px-10 py-6 sm:px-14 sm:py-8 font-black text-xs sm:text-sm uppercase tracking-[0.3em] text-white transition-all shadow-xl
              ${showSavedMsg ? 'bg-emerald-500' : 'bg-slate-900'}
            `}
          >
            {showSavedMsg ? 'Synchronized' : 'Commit Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
