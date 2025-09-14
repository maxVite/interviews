import { format, parseISO, isValid } from "date-fns";

/**
 * Formatea una fecha a diferentes formatos estándar
 */
export const formatDate = {
  short: (dateString: string | Date): string => {
    try {
      const date =
        typeof dateString === "string" ? parseISO(dateString) : dateString;
      return isValid(date) ? format(date, "MMM d, yyyy") : "Invalid date";
    } catch {
      return "Invalid date";
    }
  },

  long: (dateString: string | Date): string => {
    try {
      const date =
        typeof dateString === "string" ? parseISO(dateString) : dateString;
      return isValid(date) ? format(date, "MMMM d, yyyy") : "Invalid date";
    } catch {
      return "Invalid date";
    }
  },

  dateTime: (dateString: string | Date): string => {
    try {
      const date =
        typeof dateString === "string" ? parseISO(dateString) : dateString;
      return isValid(date) ? format(date, "MMM d, yyyy HH:mm") : "Invalid date";
    } catch {
      return "Invalid date";
    }
  },

  input: (dateString: string | Date): string => {
    try {
      const date =
        typeof dateString === "string" ? parseISO(dateString) : dateString;
      return isValid(date) ? format(date, "yyyy-MM-dd") : "";
    } catch {
      return "";
    }
  },

  relative: (dateString: string | Date): string => {
    try {
      const date =
        typeof dateString === "string" ? parseISO(dateString) : dateString;
      if (!isValid(date)) return "Invalid date";

      const now = new Date();
      const diffInMs = now.getTime() - date.getTime();
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

      if (diffInDays === 0) return "Today";
      if (diffInDays === 1) return "Yesterday";
      if (diffInDays === -1) return "Tomorrow";
      if (diffInDays > 0) return `${diffInDays} days ago`;
      return `in ${Math.abs(diffInDays)} days`;
    } catch {
      return "Invalid date";
    }
  },
};

export const getTodayInput = (): string => {
  return format(new Date(), "yyyy-MM-dd");
};

export const isFutureDate = (dateString: string): boolean => {
  try {
    const date = parseISO(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return isValid(date) && date >= today;
  } catch {
    return false;
  }
};
