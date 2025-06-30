import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, isValid, parseISO } from 'date-fns';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(date, formatStr = 'PPP') {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isValid(dateObj) ? format(dateObj, formatStr) : 'Invalid date';
}

export function calculateAge(birthDate) {
  const birth = parseISO(birthDate);
  if (!isValid(birth)) return 0;
  
  const today = new Date();
  const age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    return age - 1;
  }
  
  return age;
}

export function calculateAgeInMonths(birthDate) {
  const birth = parseISO(birthDate);
  if (!isValid(birth)) return 0;
  
  const today = new Date();
  const yearDiff = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  return yearDiff * 12 + monthDiff;
}

export function getVaccineStatus(dueDate, administeredDate) {
  const due = parseISO(dueDate);
  const today = new Date();
  
  if (administeredDate) {
    return 'completed';
  }
  
  if (due < today) {
    return 'overdue';
  }
  
  const daysDiff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysDiff <= 7) {
    return 'due';
  }
  
  return 'upcoming';
}