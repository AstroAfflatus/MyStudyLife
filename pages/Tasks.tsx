
import React, { useState } from 'react';
import { Storage } from '../storage';
import { Task, Priority } from '../types';
import { Plus, Check, Trash2, Calendar, AlertCircle, Clock, X } from 'lucide-react';

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(Storage.getTasks());
  const [filter, setFilter] = useState<'Pending' | 'Completed'>('Pending');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    priority: Priority.Medium,
    dueDate: new Date().toISOString().split('T')[0]
  });

  const saveTask = () => {
    if (!newTask.title) return;
    const updated = [...tasks, { ...newTask, id: Date.now().toString(), isCompleted: false } as Task];
    setTasks(updated);
    Storage.saveTasks(updated);
    setIsModalOpen(false);
    setNewTask({ priority: Priority.Medium, dueDate: new Date().toISOString().split('T')[0] });
  };

  const toggleTask = (id: string) => {
    const updated = tasks.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t);
    setTasks(updated);
    Storage.saveTasks(updated);
  };

  const deleteTask = (id: string) => {
    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated);
    Storage.saveTasks(updated);
  };

  const filteredTasks = tasks.filter(t => filter === 'Pending' ? !t.isCompleted : t.isCompleted);

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto pb-24">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Academic Tasks</h2>
          <p className="text-slate-500 text-sm">Homework, assignments & deadlines</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-200 active:scale-95 transition-all"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="flex p-1 bg-slate-100 rounded-2xl mb-8">
        <button 
          onClick={() => setFilter('Pending')}
          className={`flex-1 py-3 font-bold text-sm rounded-xl transition-all ${filter === 'Pending' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
        >
          Pending
        </button>
        <button 
          onClick={() => setFilter('Completed')}
          className={`flex-1 py-3 font-bold text-sm rounded-xl transition-all ${filter === 'Completed' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
        >
          Completed
        </button>
      </div>

      <div className="space-y-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <div 
              key={task.id} 
              className={`group flex items-center gap-4 p-4 rounded-3xl bg-white border border-slate-200 transition-all ${task.isCompleted ? 'opacity-70' : ''}`}
            >
              <button 
                onClick={() => toggleTask(task.id)}
                className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all ${
                  task.isCompleted ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-200 text-transparent hover:border-indigo-400'
                }`}
              >
                <Check size={16} />
              </button>
              <div className="flex-1">
                <h4 className={`font-bold text-slate-800 ${task.isCompleted ? 'line-through' : ''}`}>{task.title}</h4>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{task.subject}</span>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                    <Calendar size={12} />
                    <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    task.priority === 'High' ? 'bg-red-50 text-red-600' :
                    task.priority === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => deleteTask(task.id)}
                className="p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-20 text-slate-400">
            <AlertCircle size={48} className="mx-auto mb-4 stroke-1" />
            <p className="font-bold">Nothing here yet!</p>
            <p className="text-sm">Stay on top of your work by adding tasks.</p>
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold">New Task</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={24} className="text-slate-400" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Task Title</label>
                <input 
                  type="text" 
                  value={newTask.title || ''}
                  onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. History Project"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Subject</label>
                  <input 
                    type="text" 
                    value={newTask.subject || ''}
                    onChange={e => setNewTask({ ...newTask, subject: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    placeholder="Maths"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Due Date</label>
                  <input 
                    type="date" 
                    value={newTask.dueDate}
                    onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Priority</label>
                <div className="flex gap-2">
                  {[Priority.Low, Priority.Medium, Priority.High].map(p => (
                    <button
                      key={p}
                      onClick={() => setNewTask({ ...newTask, priority: p })}
                      className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all border-2 ${
                        newTask.priority === p ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-100 text-slate-500'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 pt-0">
              <button 
                onClick={saveTask}
                className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
