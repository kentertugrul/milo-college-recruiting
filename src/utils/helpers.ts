import { format, formatDistanceToNow, isPast, isFuture, addDays } from 'date-fns';
import { University, ApplicationStatus, Reminder } from '../types';

export const generateId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const formatDate = (dateString: string): string => {
  try {
    return format(new Date(dateString), 'MMM dd, yyyy');
  } catch {
    return dateString;
  }
};

export const formatDateTime = (dateString: string): string => {
  try {
    return format(new Date(dateString), 'MMM dd, yyyy h:mm a');
  } catch {
    return dateString;
  }
};

export const getRelativeTime = (dateString: string): string => {
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  } catch {
    return dateString;
  }
};

export const isDeadlineApproaching = (dateString: string, daysThreshold: number = 7): boolean => {
  try {
    const deadline = new Date(dateString);
    const threshold = addDays(new Date(), daysThreshold);
    return isFuture(deadline) && deadline <= threshold;
  } catch {
    return false;
  }
};

export const isOverdue = (dateString: string): boolean => {
  try {
    return isPast(new Date(dateString));
  } catch {
    return false;
  }
};

export const getStatusColor = (status: ApplicationStatus): string => {
  const colors: Record<ApplicationStatus, string> = {
    not_started: '#9CA3AF',
    in_progress: '#3B82F6',
    submitted: '#8B5CF6',
    accepted: '#10B981',
    rejected: '#EF4444',
    waitlisted: '#F59E0B',
  };
  return colors[status];
};

export const getStatusLabel = (status: ApplicationStatus): string => {
  const labels: Record<ApplicationStatus, string> = {
    not_started: 'Not Started',
    in_progress: 'In Progress',
    submitted: 'Submitted',
    accepted: 'Accepted',
    rejected: 'Rejected',
    waitlisted: 'Waitlisted',
  };
  return labels[status];
};

export const getPriorityColor = (priority: 'low' | 'medium' | 'high'): string => {
  const colors = {
    low: '#10B981',
    medium: '#F59E0B',
    high: '#EF4444',
  };
  return colors[priority];
};

export const getSchoolSizeLabel = (size: string): string => {
  const labels: Record<string, string> = {
    small: 'Small (<2,000)',
    medium: 'Medium (2,000-10,000)',
    large: 'Large (10,000-20,000)',
    very_large: 'Very Large (>20,000)',
  };
  return labels[size] || size;
};

export const sortUniversities = (
  universities: University[],
  sortBy: 'name' | 'deadline' | 'status' | 'region',
  direction: 'asc' | 'desc' = 'asc'
): University[] => {
  const sorted = [...universities].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'deadline':
        comparison = new Date(a.applicationDeadline).getTime() - new Date(b.applicationDeadline).getTime();
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
      case 'region':
        comparison = a.region.localeCompare(b.region);
        break;
    }

    return direction === 'asc' ? comparison : -comparison;
  });

  return sorted;
};

export const getUpcomingReminders = (reminders: Reminder[], days: number = 7): Reminder[] => {
  return reminders
    .filter(r => !r.completed && isDeadlineApproaching(r.dueDate, days))
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
};

export const getApplicationStats = (universities: University[]) => {
  const total = universities.length;
  const notStarted = universities.filter(u => u.status === 'not_started').length;
  const inProgress = universities.filter(u => u.status === 'in_progress').length;
  const submitted = universities.filter(u => u.status === 'submitted').length;
  const accepted = universities.filter(u => u.status === 'accepted').length;
  const rejected = universities.filter(u => u.status === 'rejected').length;
  const waitlisted = universities.filter(u => u.status === 'waitlisted').length;

  return {
    total,
    notStarted,
    inProgress,
    submitted,
    accepted,
    rejected,
    waitlisted,
    completionRate: total > 0 ? ((submitted + accepted + rejected + waitlisted) / total) * 100 : 0,
  };
};

