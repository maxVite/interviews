import { format, parseISO, isValid } from "date-fns";

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
