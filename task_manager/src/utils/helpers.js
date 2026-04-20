export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const isOverdue = (dueDate, status) => {
  if (!dueDate || status === 'completed') return false;
  return new Date(dueDate) < new Date();
};

export const getInitials = (name = '') =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

export const getErrorMessage = (error) => {
  if (error?.response?.data) {
    const data = error.response.data;
    if (typeof data === 'string') return data;
    if (data.detail) return data.detail;
    const firstKey = Object.keys(data)[0];
    if (firstKey && Array.isArray(data[firstKey])) return `${firstKey}: ${data[firstKey][0]}`;
  }
  return error?.message || 'Something went wrong. Please try again.';
};

export const PRIORITY_CONFIG = {
  high: {
    label: 'High',
    badgeClass: 'bg-rose-50 text-rose-600 border border-rose-100',
    dotClass: 'bg-rose-500',
  },
  medium: {
    label: 'Medium',
    badgeClass: 'bg-amber-50 text-amber-700 border border-amber-100',
    dotClass: 'bg-amber-400',
  },
  low: {
    label: 'Low',
    badgeClass: 'bg-jade-50 text-jade-700 border border-jade-100',
    dotClass: 'bg-jade-400',
  },
};

export const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    badgeClass: 'bg-ink-100 text-ink-600 border border-ink-200',
  },
  'in-progress': {
    label: 'In Progress',
    badgeClass: 'bg-blue-50 text-blue-600 border border-blue-100',
  },
  in_progress: {
    label: 'In Progress',
    badgeClass: 'bg-blue-50 text-blue-600 border border-blue-100',
  },
  completed: {
    label: 'Completed',
    badgeClass: 'bg-jade-50 text-jade-700 border border-jade-100',
  },
};
