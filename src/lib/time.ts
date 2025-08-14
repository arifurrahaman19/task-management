export const now = (): string => new Date().toISOString();

export const isOverdue = (dueAt?: string): boolean => {
  if (!dueAt) return false;
  return new Date(dueAt) < new Date();
};

export const toISO = (date: Date): string => date.toISOString();

export const formatDateTime = (isoString: string): string => {
  const date = new Date(isoString);
  return (
    date.toLocaleDateString() +
    ' ' +
    date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  );
};

export const formatDateShort = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleDateString();
};

export const formatDateTimeLocal = (isoString: string): string => {
  const date = new Date(isoString);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 16);
};
