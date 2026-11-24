import { format, parseISO, isValid } from "date-fns";

export const formatDate = (dateInput: string | Date) => {
  if (!dateInput) return "N/A";

  try {
    const date =
      typeof dateInput === "string" ? parseISO(dateInput) : dateInput;
    if (!isValid(date)) return "N/A";
    return format(date, "MM/dd/yyyy");
  } catch {
    return "N/A";
  }
};

export const formatDateTime = (dateInput: string | Date) => {
  if (!dateInput) return "N/A";

  try {
    const date =
      typeof dateInput === "string" ? parseISO(dateInput) : dateInput;
    if (!isValid(date)) return "N/A";
    return format(date, "MM/dd/yyyy HH:mm");
  } catch {
    return "N/A";
  }
};
