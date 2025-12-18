
import React, { useState, useMemo } from 'react';
import { Storage } from '../storage';
import { Note } from '../types';
import { Plus, Search, Star, Trash2, X, Sparkles, BookOpen } from 'lucide-react';
import { summarizeNote } from '../geminiService';

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>(Storage.getNotes());
  const [search, setSearch] = useState('');
  const [filterFav, setFilterFav] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Partial<Note> | null>(null);
  const [summary, setSummary] = useState<string | null>(null);

  const saveNote = () => {
    if (!editingNote?.title || !editingNote?.content) return;
    
    let updated;
    if (editingNote.id) {
      updated = notes.map(n => n.id === editingNote.id ? editingNote as Note : n);
    } else {
      updated = [{ ...editingNote, id: Date.now().toString(), dateCreated: new Date().toISOString(), isFavorite: false } as Note, ...notes];
    }

    setNotes(updated);
    Storage.saveNotes(updated);
    setIsModalOpen(false);
    setEditingNote(null);
    setSummary(null);
  };

  const deleteNote = (id: string) => {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    Storage.saveNotes(updated);
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = notes.map(n => n.id === id ? { ...n, isFavorite: !n.isFavorite } : n);
    setNotes(updated);
    Storage.saveNotes(updated);
  };

  const filteredNotes = useMemo(() => {
    return notes.filter(n => {
      const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase());
      const matchesFav = filterFav ? n.isFavorite : true;
      return matchesSearch && matchesFav;
    });
  }, [notes, search, filterFav]);

  const handleSummarize = async () => {
    if (!editingNote?.content) return;
    setSummary("AI is thinking...");
    const result = await summarizeNote(editingNote.content);
    setSummary(result);
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto pb-24">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Study Notes</h2>
          <p className="text-slate-500 text-sm">Organize your learning material</p>
        </div>
        <button 
          onClick={() => { setEditingNote({}); setIsModalOpen(true); }}
          className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg active:scale-95 transition-all"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search notes..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button 
          onClick={() => setFilterFav(!filterFav)}
          className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all border flex items-center justify-center gap-2 ${
            filterFav ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-white text-slate-500 border-slate-200'
          }`}
        >
          <Star size={18} fill={filterFav ? 'currentColor' : 'none'} /> Favourites
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredNotes.length > 0 ? (
          filteredNotes.map(note => (
            <div 
              key={note.id} 
              onClick={() => { setEditingNote(note); setIsModalOpen(true); }}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer relative group"
            >
              <button 
                onClick={(e) => toggleFavorite(note.id, e)}
                className="absolute top-4 right-4 text-slate-300 hover:text-amber-500 transition-colors"
              >
                <Star size={20} fill={note.isFavorite ? '#f59e0b' : 'none'} className={note.isFavorite ? 'text-amber-500' : ''} />
              </button>
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 block mb-2">{note.subject}</span>
              <h4 className="font-bold text-slate-800 text-lg mb-2 truncate pr-6">{note.title}</h4>
              <p className="text-slate-500 text-sm line-clamp-3 leading-relaxed">{note.content}</p>
              <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-medium">{new Date(note.dateCreated).toLocaleDateString()}</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                  className="p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-slate-400">
            <BookOpen size={48} className="mx-auto mb-4 opacity-20" />
            <p className="font-bold">No notes found</p>
            <p className="text-sm">Start taking notes to build your knowledge base.</p>
          </div>
        )}
      </div>

      {/* Note Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl h-[90vh] rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in duration-300 flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex-1">
                <input 
                  type="text" 
                  value={editingNote?.subject || ''}
                  onChange={e => setEditingNote({ ...editingNote, subject: e.target.value })}
                  className="bg-transparent border-none outline-none text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 w-full"
                  placeholder="SUBJECT (E.G. PHYSICS)"
                />
                <input 
                  type="text" 
                  value={editingNote?.title || ''}
                  onChange={e => setEditingNote({ ...editingNote, title: e.target.value })}
                  className="bg-transparent border-none outline-none text-xl font-bold text-slate-800 w-full mt-1"
                  placeholder="Title of your note..."
                />
              </div>
              <button onClick={() => setIsModalOpen(false)}><X size={24} className="text-slate-400" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <textarea 
                value={editingNote?.content || ''}
                onChange={e => setEditingNote({ ...editingNote, content: e.target.value })}
                className="w-full h-full resize-none bg-transparent outline-none text-slate-700 leading-relaxed text-lg"
                placeholder="Start typing your study notes here..."
              ></textarea>
            </div>

            {summary && (
              <div className="px-6 py-4 bg-indigo-50 border-t border-indigo-100">
                <div className="flex items-center gap-2 mb-1 text-indigo-600">
                  <Sparkles size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">AI Summary</span>
                </div>
                <p className="text-xs text-indigo-900 leading-relaxed italic">{summary}</p>
              </div>
            )}

            <div className="p-6 border-t border-slate-100 flex gap-4">
              <button 
                onClick={handleSummarize}
                disabled={!editingNote?.content}
                className="flex-1 py-4 border border-indigo-200 text-indigo-600 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-indigo-50 disabled:opacity-50 transition-all"
              >
                <Sparkles size={20} /> Summarize with AI
              </button>
              <button 
                onClick={saveNote}
                className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg hover:bg-indigo-700 transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;
