export const isValidDate = (dateString: string): boolean => {
  if (!/^\d{1,2}\.\d{1,2}\.\d{4}$/.test(dateString.trim())) return false;

  const parts = dateString.split('.');
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);
  const currentYear = new Date().getFullYear();

  if (year < currentYear - 65 || year > currentYear - 16 || month == 0 || month > 12) return false;

  const monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) monthLength[1] = 29;

  return day > 0 && day <= monthLength[month - 1];
};
