import { format, formatDistanceToNow, parseISO, isToday, isTomorrow, addMinutes } from 'date-fns';

/**
 * Format date to display format
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'dd MMM yyyy');
  } catch {
    return dateString;
  }
};

/**
 * Format time to 12-hour format
 */
export const formatTime = (timeString: string): string => {
  try {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    return format(date, 'hh:mm a');
  } catch {
    return timeString;
  }
};

/**
 * Format date and time together
 */
export const formatDateTime = (date: string, time: string): string => {
  return `${formatDate(date)} at ${formatTime(time)}`;
};

/**
 * Format timestamp to relative time
 */
export const formatRelativeTime = (timestamp: string): string => {
  try {
    return formatDistanceToNow(parseISO(timestamp), { addSuffix: true });
  } catch {
    return timestamp;
  }
};

/**
 * Get estimated time from now
 */
export const getEstimatedTime = (minutes: number): string => {
  const futureTime = addMinutes(new Date(), minutes);
  return format(futureTime, 'hh:mm a');
};

/**
 * Mask name for privacy (e.g., "Rahul Mehta" -> "R****** M*****")
 */
export const maskName = (name: string): string => {
  const parts = name.split(' ');
  return parts
    .map((part) => {
      if (part.length <= 1) return part;
      return part[0] + '*'.repeat(part.length - 1);
    })
    .join(' ');
};

/**
 * Mask certificate number for privacy (e.g., "LC123456789" -> "LC***456789")
 */
export const maskCertificateNo = (certNo: string): string => {
  if (certNo.length <= 6) return certNo;
  const prefix = certNo.slice(0, 2);
  const suffix = certNo.slice(-6);
  return `${prefix}***${suffix}`;
};

/**
 * Mask phone number for privacy (e.g., "9876543210" -> "98****3210")
 */
export const maskPhone = (phone: string): string => {
  if (phone.length <= 6) return phone;
  return phone.slice(0, 2) + '****' + phone.slice(-4);
};

/**
 * Format phone number with country code
 */
export const formatPhone = (phone: string): string => {
  if (phone.length === 10) {
    return `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`;
  }
  return phone;
};

/**
 * Format wait time in minutes to human readable format
 */
export const formatWaitTime = (minutes: number): string => {
  if (minutes < 1) return 'Less than a minute';
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'}`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours} hour${hours === 1 ? '' : 's'}`;
  }
  return `${hours} hour${hours === 1 ? '' : 's'} ${remainingMinutes} min`;
};

/**
 * Format queue position (e.g., 1 -> "1st", 2 -> "2nd")
 */
export const formatPosition = (position: number): string => {
  if (position === 0) return 'Now Serving';
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const remainder = position % 100;
  const suffix = suffixes[(remainder - 20) % 10] || suffixes[remainder] || suffixes[0];
  return `${position}${suffix}`;
};

/**
 * Format number with commas (e.g., 1000 -> "1,000")
 */
export const formatNumber = (num: number | undefined | null): string => {
  if (num === undefined || num === null) return '0';
  return num.toLocaleString('en-IN');
};

/**
 * Format priority level
 */
export const formatPriority = (priority: number): { label: string; color: string } => {
  if (priority === 0) {
    return { label: 'Senior Priority', color: 'error' };
  }
  return { label: 'General Queue', color: 'success' };
};

/**
 * Format verification mode
 */
export const formatVerificationMode = (mode: 'presence' | 'online'): { label: string; icon: string } => {
  if (mode === 'presence') {
    return { label: 'In-Person', icon: '🏢' };
  }
  return { label: 'Online', icon: '💻' };
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
};

/**
 * Capitalize first letter of each word
 */
export const capitalizeWords = (text: string): string => {
  return text
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Generate a unique ID
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
