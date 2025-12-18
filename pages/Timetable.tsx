
import React, { useState, useEffect } from 'react';
import { Storage } from '../storage';
import { ClassSession } from '../types';
import { DAYS, COLORS } from '../constants';
// Added missing Calendar icon to the import list
import { Plus, Trash2, Clock, MapPin, ChevronLeft, ChevronRight, X, Calendar } from 'lucide-react';

const Timetable: React.FC = () => {
  const [classes, setClasses] = useState<ClassSession[]>(Storage.getTimetable());
  const [selectedDay, setSelectedDay] = useState<string>(DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClass, setNewClass] = useState<Partial<ClassSession>>({
    day: selectedDay,
    color: COLORS[0],
    startTime: '09:00',
    endTime: '10:00'
  });

  const saveClass = () => {
    if (!newClass.subject || !newClass.startTime || !newClass.endTime) return;
    const updated = [...classes, { ...newClass, id: Date.now().toString() } as ClassSession];
    setClasses(updated);
    Storage.saveTimetable(updated);
    setIsModalOpen(false);
    setNewClass({ day: selectedDay, color: COLORS[0], startTime: '09:00', endTime: '10:00' });
  };

  const deleteClass = (id: string) => {
    const updated = classes.filter(c => c.id !== id);
    setClasses(updated);
    Storage.saveTimetable(updated);
  };

  const filteredClasses = classes
    .filter(c => c.day === selectedDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto pb-24">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Weekly Schedule</h2>
          <p className="text-slate-500 text-sm">Organize your classes and labs</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-200 active:scale-95 transition-all"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Day Selector */}
      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4">
        {DAYS.map(day => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`
              flex-shrink-0 px-5 py-3 rounded-2xl font-bold text-sm transition-all
              ${selectedDay === day 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}
            `}
          >
            {day.substring(0, 3)}
          </button>
        ))}
      </div>

      {/* Class List */}
      <div className="mt-6 space-y-4">
        {filteredClasses.length > 0 ? (
          filteredClasses.map(cls => (
            <div 
              key={cls.id} 
              className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-4 relative group"
            >
              <div 
                className="w-1.5 h-16 rounded-full flex-shrink-0"
                style={{ backgroundColor: cls.color }}
              ></div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-slate-800 text-lg">{cls.subject}</h4>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-slate-500 text-xs font-medium">
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} className="text-slate-400" />
                    <span>{cls.startTime} - {cls.endTime}</span>
                  </div>
                  {cls.room && (
                    <div className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-slate-400" />
                      <span>{cls.room}</span>
                    </div>
                  )}
                </div>
              </div>
              <button 
                onClick={() => deleteClass(cls.id)}
                className="p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        ) : (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl h-64 flex flex-col items-center justify-center gap-4 text-slate-400">
            <Calendar size={48} strokeWidth={1} />
            <div className="text-center">
              <p className="font-bold">No classes for {selectedDay}</p>
              <p className="text-sm">Tap the "+" to add your first lecture</p>
            </div>
          </div>
        )}
      </div>

      {/* Add Class Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold">Add New Class</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={24} className="text-slate-400" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Subject Name</label>
                <input 
                  type="text" 
                  value={newClass.subject || ''}
                  onChange={e => setNewClass({ ...newClass, subject: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. Physics"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Start Time</label>
                  <input 
                    type="time" 
                    value={newClass.startTime}
                    onChange={e => setNewClass({ ...newClass, startTime: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">End Time</label>
                  <input 
                    type="time" 
                    value={newClass.endTime}
                    onChange={e => setNewClass({ ...newClass, endTime: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Room / Hall</label>
                <input 
                  type="text" 
                  value={newClass.room || ''}
                  onChange={e => setNewClass({ ...newClass, room: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  placeholder="e.g. Room 204"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Color Label</label>
                <div className="flex gap-3">
                  {COLORS.map(c => (
                    <button
                      key={c}
                      onClick={() => setNewClass({ ...newClass, color: c })}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${newClass.color === c ? 'border-slate-800 scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 pt-0">
              <button 
                onClick={saveClass}
                className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100"
              >
                Save to Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timetable;
