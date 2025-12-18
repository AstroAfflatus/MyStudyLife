
import React, { useState, useMemo } from 'react';
import { Storage } from '../storage';
import { ExamRecord, SubjectMark } from '../types';
import { Plus, Trash2, Award, History, TrendingUp, ChevronRight, X, Trash } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const Marks: React.FC = () => {
  const [exams, setExams] = useState<ExamRecord[]>(Storage.getMarks());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newExamType, setNewExamType] = useState('Unit Test');
  const [subjects, setSubjects] = useState<SubjectMark[]>([{ name: '', obtained: 0, max: 100 }]);

  const calculateGrade = (percent: number) => {
    if (percent >= 90) return 'A+';
    if (percent >= 80) return 'A';
    if (percent >= 70) return 'B';
    if (percent >= 60) return 'C';
    if (percent >= 50) return 'D';
    return 'F';
  };

  const saveExam = () => {
    const validSubjects = subjects.filter(s => s.name && s.max > 0);
    if (validSubjects.length === 0) return;

    const totalObtained = validSubjects.reduce((acc, curr) => acc + curr.obtained, 0);
    const totalMax = validSubjects.reduce((acc, curr) => acc + curr.max, 0);
    const totalPercentage = (totalObtained / totalMax) * 100;
    const grade = calculateGrade(totalPercentage);

    const record: ExamRecord = {
      id: Date.now().toString(),
      type: newExamType,
      date: new Date().toISOString().split('T')[0],
      subjects: validSubjects,
      totalPercentage,
      grade
    };

    const updated = [...exams, record];
    setExams(updated);
    Storage.saveMarks(updated);
    setIsModalOpen(false);
    setSubjects([{ name: '', obtained: 0, max: 100 }]);
  };

  const deleteExam = (id: string) => {
    const updated = exams.filter(e => e.id !== id);
    setExams(updated);
    Storage.saveMarks(updated);
  };

  const chartData = useMemo(() => {
    return exams.slice(-5).map(e => ({
      name: e.type,
      percentage: Math.round(e.totalPercentage)
    }));
  }, [exams]);

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto pb-24">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Performance Tracking</h2>
          <p className="text-slate-500 text-sm">Analyze your exam results and growth</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg active:scale-95 transition-all"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Chart Section */}
      {exams.length > 1 && (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp size={18} className="text-indigo-500" /> Progress Chart
            </h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last 5 Exams</span>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorPercent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" hide />
                <YAxis domain={[0, 100]} hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="percentage" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorPercent)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* History List */}
      <div className="space-y-6">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <History size={18} className="text-indigo-500" /> Exam History
        </h3>
        
        {exams.length > 0 ? (
          exams.slice().reverse().map(exam => (
            <div key={exam.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-6 group">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-xl">
                {Math.round(exam.totalPercentage)}%
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-slate-800">{exam.type}</h4>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full">Grade {exam.grade}</span>
                </div>
                <p className="text-xs text-slate-500 font-medium">{new Date(exam.date).toLocaleDateString()} • {exam.subjects.length} Subjects</p>
              </div>
              <button 
                onClick={() => deleteExam(exam.id)}
                className="p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash size={18} />
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl text-slate-400">
            <Award size={48} className="mx-auto mb-2 opacity-20" />
            <p className="font-bold">No records yet</p>
            <p className="text-sm">Start by adding your first result.</p>
          </div>
        )}
      </div>

      {/* Add Mark Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-300 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
              <h3 className="text-xl font-bold">Record Results</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={24} className="text-slate-400" /></button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Exam Type</label>
                <input 
                  type="text" 
                  value={newExamType}
                  onChange={e => setNewExamType(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  placeholder="e.g. Unit Test 1"
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Subjects Score</label>
                {subjects.map((sub, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-center">
                    <input 
                      type="text" 
                      value={sub.name}
                      onChange={e => {
                        const s = [...subjects];
                        s[index].name = e.target.value;
                        setSubjects(s);
                      }}
                      className="col-span-6 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                      placeholder="Subject"
                    />
                    <input 
                      type="number" 
                      value={sub.obtained}
                      onChange={e => {
                        const s = [...subjects];
                        s[index].obtained = Number(e.target.value);
                        setSubjects(s);
                      }}
                      className="col-span-3 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                      placeholder="Obt"
                    />
                    <input 
                      type="number" 
                      value={sub.max}
                      onChange={e => {
                        const s = [...subjects];
                        s[index].max = Number(e.target.value);
                        setSubjects(s);
                      }}
                      className="col-span-3 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                      placeholder="Max"
                    />
                  </div>
                ))}
                <button 
                  onClick={() => setSubjects([...subjects, { name: '', obtained: 0, max: 100 }])}
                  className="text-xs font-bold text-indigo-600 flex items-center gap-1 mt-2"
                >
                  <Plus size={14} /> Add Subject
                </button>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100">
              <button 
                onClick={saveExam}
                className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg"
              >
                Calculate & Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marks;
