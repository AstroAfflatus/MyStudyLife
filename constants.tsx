
import React from 'react';
import { 
  Home, 
  Calendar, 
  CheckSquare, 
  BarChart2, 
  FileText, 
  Settings,
  Plus,
  BookOpen,
  Star,
  Search,
  ChevronRight,
  Clock,
  MapPin,
  TrendingUp,
  Award
} from 'lucide-react';

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const COLORS = [
  '#6366f1', // Indigo
  '#ec4899', // Pink
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#8b5cf6', // Violet
  '#3b82f6', // Blue
  '#ef4444'  // Red
];

export const NAV_ITEMS = [
  { label: 'Home', icon: <Home size={20} />, path: '/' },
  { label: 'Timetable', icon: <Calendar size={20} />, path: '/timetable' },
  { label: 'Tasks', icon: <CheckSquare size={20} />, path: '/tasks' },
  { label: 'Marks', icon: <BarChart2 size={20} />, path: '/marks' },
  { label: 'Notes', icon: <FileText size={20} />, path: '/notes' },
];

export const APP_LOGO = "https://iili.io/flTBGFn.jpg";

export const STREAMS = ['Science', 'Commerce', 'Arts', 'Other'];
export const CLASSES = ['9th', '10th', '11th', '12th', 'College'];
