
import { UserProfile, ClassSession, Task, ExamRecord, Note } from './types';

const KEYS = {
  USER: 'msl_user',
  TIMETABLE: 'msl_timetable',
  TASKS: 'msl_tasks',
  MARKS: 'msl_marks',
  NOTES: 'msl_notes'
};

export const Storage = {
  getUser: (): UserProfile | null => {
    const data = localStorage.getItem(KEYS.USER);
    return data ? JSON.parse(data) : null;
  },
  setUser: (user: UserProfile) => localStorage.setItem(KEYS.USER, JSON.stringify(user)),

  getTimetable: (): ClassSession[] => {
    const data = localStorage.getItem(KEYS.TIMETABLE);
    return data ? JSON.parse(data) : [];
  },
  saveTimetable: (classes: ClassSession[]) => localStorage.setItem(KEYS.TIMETABLE, JSON.stringify(classes)),

  getTasks: (): Task[] => {
    const data = localStorage.getItem(KEYS.TASKS);
    return data ? JSON.parse(data) : [];
  },
  saveTasks: (tasks: Task[]) => localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks)),

  getMarks: (): ExamRecord[] => {
    const data = localStorage.getItem(KEYS.MARKS);
    return data ? JSON.parse(data) : [];
  },
  saveMarks: (marks: ExamRecord[]) => localStorage.setItem(KEYS.MARKS, JSON.stringify(marks)),

  getNotes: (): Note[] => {
    const data = localStorage.getItem(KEYS.NOTES);
    return data ? JSON.parse(data) : [];
  },
  saveNotes: (notes: Note[]) => localStorage.setItem(KEYS.NOTES, JSON.stringify(notes))
};
