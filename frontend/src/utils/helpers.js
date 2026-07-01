import { format, formatDistance, isAfter } from 'date-fns';

// Format date for display
export const formatDate = (date, formatStr = 'PPP') => {
  if (!date) return '';
  try {
    return format(new Date(date), formatStr);
  } catch {
    return '';
  }
};

// Relative time (e.g. "2 days ago")
export const timeAgo = (date) => {
  if (!date) return '';
  try {
    return formatDistance(new Date(date), new Date(), { addSuffix: true });
  } catch {
    return '';
  }
};

// Days until journey
export const daysUntil = (date) => {
  if (!date) return null;
  const diff = new Date(date) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

// Is date in the future
export const isFuture = (date) => {
  return isAfter(new Date(date), new Date());
};

// Format seat preference label
export const formatSeatPreference = (pref) => {
  const labels = {
    window: 'Window Seat',
    lower_berth: 'Lower Berth',
    upper_berth: 'Upper Berth',
    side_lower: 'Side Lower',
    side_upper: 'Side Upper',
    adjacent_seats: 'Adjacent Seats',
    same_coach: 'Same Coach',
    same_compartment: 'Same Compartment',
  };
  return labels[pref] || pref;
};

// Get initials from name
export const getInitials = (name = '') => {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('');
};

// Generate avatar color from name
export const getAvatarColor = (name = '') => {
  const colors = [
    'bg-primary-500',
    'bg-violet-500',
    'bg-cyan-500',
    'bg-emerald-500',
    'bg-rose-500',
    'bg-amber-500',
    'bg-pink-500',
    'bg-teal-500',
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

// Trip status display
export const getTripStatusConfig = (status) => {
  const config = {
    planning: {
      label: 'Planning',
      color: 'text-amber-400',
      bg: 'bg-amber-400/10',
      dot: 'bg-amber-400',
    },
    ready: {
      label: 'Ready to Book',
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10',
      dot: 'bg-emerald-400',
    },
    completed: {
      label: 'Completed',
      color: 'text-slate-400',
      bg: 'bg-slate-400/10',
      dot: 'bg-slate-400',
    },
    cancelled: {
      label: 'Cancelled',
      color: 'text-red-400',
      bg: 'bg-red-400/10',
      dot: 'bg-red-400',
    },
  };
  return config[status] || config.planning;
};

// Member status
export const getMemberStatusConfig = (status) => {
  const config = {
    pending: {
      label: 'Pending',
      color: 'text-amber-400',
      bg: 'bg-amber-400/10',
      dot: 'bg-amber-400',
    },
    ready: {
      label: 'Ready',
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10',
      dot: 'bg-emerald-400',
    },
  };
  return config[status] || config.pending;
};

// Truncate text
export const truncate = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Validate invite code format
export const isValidInviteCode = (code) => {
  return /^[A-Z0-9]{8}$/.test(code?.toUpperCase() || '');
};

// Count total passengers across all members
export const getTotalPassengers = (members = []) => {
  return members.reduce((sum, m) => sum + (m.passengerCount || 1), 0);
};
