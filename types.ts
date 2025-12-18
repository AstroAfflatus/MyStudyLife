
export enum Stream {
  Science = 'Science',
  Commerce = 'Commerce',
  Arts = 'Arts',
  Other = 'Other'
}

export interface UserProfile {
  name: string;
  className: string;
  stream: Stream;
  dailyGoal: number; // in hours
}

export interface ClassSession {
  id: string;
  subject: string;
  day: string; // Mon, Tue, etc.
  startTime: string; // 09:00
  endTime: string;
  room?: string;
  color: string;
}

export enum Priority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High'
}

export interface Task {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  priority: Priority;
  isCompleted: boolean;
  notes?: string;
}

export interface SubjectMark {
  name: string;
  obtained: number;
  max: number;
}

export interface ExamRecord {
  id: string;
  type: string; // Unit Test, Final, etc.
  date: string;
  subjects: SubjectMark[];
  totalPercentage: number;
  grade: string;
}

export interface Note {
  id: string;
  subject: string;
  title: string;
  content: string;
  isFavorite: boolean;
  dateCreated: string;
}
