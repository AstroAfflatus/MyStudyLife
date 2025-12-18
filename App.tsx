
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Storage } from './storage';
import { UserProfile } from './types';
import { NAV_ITEMS, APP_LOGO } from './constants';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import Timetable from './pages/Timetable';
import Tasks from './pages/Tasks';
import Marks from './pages/Marks';
import Notes from './pages/Notes';
import Settings from './pages/Settings';
import { Menu, X, User } from 'lucide-react';
import { NotificationService } from './notificationService';

const AppLayout: React.FC<{ user: UserProfile; setUser: (u: UserProfile) => void }> = ({ user, setUser }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Audio init on user gesture
    const handleFirstInteraction = async () => {
      await NotificationService.playPremiumSound().catch(() => {});
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('click', handleFirstInteraction);
    };
    window.addEventListener('touchstart', handleFirstInteraction);
    window.addEventListener('click', handleFirstInteraction);

    // BACKGROUND CHIME CYCLE - 60 SECONDS
    const pulseInterval = setInterval(() => {
      NotificationService.playPremiumSound().catch(() => {});
      console.debug("Background chime pulse.");
    }, 60000);

    return () => {
      clearInterval(pulseInterval);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('click', handleFirstInteraction);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* PROFESSIONAL MOBILE HEADER */}
      <header className="sticky top-0 z-40 bg-white/40 backdrop-blur-3xl border-b border-white/50 px-5 py-4 sm:py-6 flex items-center justify-between safe-pt">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2.5 bg-white/80 rounded-xl shadow-lg text-slate-700 lg:hidden border border-white active:scale-95 transition-all"
          >
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute -inset-2 bg-indigo-500 rounded-full blur-[15px] opacity-15"></div>
              <img src={APP_LOGO} alt="Logo" className="relative w-10 h-10 rounded-xl shadow-xl border border-white/60" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-black text-slate-900 tracking-tighter leading-none">MyStudyLife</h1>
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-indigo-600 mt-1">Ultra Elite</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center">
          <Link to="/settings" className="w-10 h-10 rounded-full bg-slate-950 flex items-center justify-center text-white shadow-xl hover:scale-105 active:scale-95 transition-all border border-white/20">
            <User size={20} />
          </Link>
        </div>
      </header>

      <div className="flex flex-1 relative">
        {/* MOBILE DRAWER / SIDEBAR */}
        <aside className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white/95 backdrop-blur-3xl border-r border-white transform transition-transform duration-500 ease-[cubic-bezier(0.23, 1, 0.32, 1)] lg:translate-x-0 lg:static lg:inset-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="p-8 flex flex-col h-full safe-pt">
            <div className="flex items-center justify-between lg:hidden mb-10">
              <span className="font-black text-xl tracking-tighter">Menu Hub</span>
              <button onClick={() => setIsSidebarOpen(false)} className="p-2.5 bg-slate-100 rounded-full"><X size={20} /></button>
            </div>
            
            <nav className="space-y-3 flex-1">
              {NAV_ITEMS.map((item) => (
                <NavLink 
                  key={item.path} 
                  {...item} 
                  isActive={location.pathname === item.path}
                  onClick={() => setIsSidebarOpen(false)} 
                />
              ))}
            </nav>

            <div className="mt-auto pt-8 border-t border-slate-100 safe-pb">
               <div className="p-6 bg-slate-950 rounded-[2rem] text-white relative overflow-hidden group shadow-xl">
                  <p className="text-xs font-bold relative z-10 text-indigo-100 opacity-90">Maximize performance with Advanced AI.</p>
                  <button className="mt-4 w-full py-3 bg-indigo-600 rounded-full text-[9px] font-black uppercase tracking-[0.2em] transition-all active:scale-95">Upgrade Hub</button>
               </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 w-full overflow-x-hidden relative">
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/timetable" element={<Timetable />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/marks" element={<Marks />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/settings" element={<Settings user={user} setUser={setUser} />} />
          </Routes>
        </main>
      </div>

      {/* COMPACT BOTTOM NAV */}
      <nav className="fixed bottom-4 left-4 right-4 z-40 bg-slate-950/95 backdrop-blur-3xl rounded-full px-6 py-3.5 flex items-center justify-between shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] lg:hidden border border-white/10 safe-pb">
        {NAV_ITEMS.map((item) => (
          <MobileNavLink key={item.path} {...item} isActive={location.pathname === item.path} />
        ))}
      </nav>
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(Storage.getUser());

  const handleOnboardingComplete = (profile: UserProfile) => {
    Storage.setUser(profile);
    setUser(profile);
    NotificationService.send("Profile Activated", "Welcome to your elite academic hub.");
  };

  if (!user) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <HashRouter>
      <AppLayout user={user} setUser={setUser} />
    </HashRouter>
  );
};

const NavLink: React.FC<{ label: string; icon: React.ReactNode; path: string; isActive: boolean; onClick: () => void }> = ({ label, icon, path, isActive, onClick }) => {
  return (
    <Link 
      to={path} 
      onClick={onClick}
      className={`
        flex items-center gap-4 px-6 py-4 rounded-[2rem] font-bold transition-all duration-300 group
        ${isActive 
          ? 'bg-slate-950 text-white shadow-lg scale-[1.01] border border-white/10' 
          : 'text-slate-400 hover:bg-indigo-50 hover:text-indigo-600'}
      `}
    >
      <div className={`transition-transform duration-300 ${isActive ? 'text-indigo-400 scale-110' : ''}`}>
        {icon}
      </div>
      <span className="tracking-tight text-sm">{label}</span>
    </Link>
  );
};

const MobileNavLink: React.FC<{ icon: React.ReactNode; path: string; isActive: boolean }> = ({ icon, path, isActive }) => {
  return (
    <Link 
      to={path} 
      className={`p-3 rounded-full transition-all duration-500 ${
        isActive 
          ? 'bg-indigo-600 text-white scale-[1.2] shadow-indigo-500/30 shadow-lg border border-white/20' 
          : 'text-slate-500'
      }`}
    >
      {React.cloneElement(icon as React.ReactElement, { size: 20 })}
    </Link>
  );
};

export default App;
