function isDateValid(dateString: string) {
  const parts = dateString.split("/");
  if (parts.length !== 3) {
    return false;
  }

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);

  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    return false;
  }

  const date = new Date(year, month, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    return false;
  }

  const minDate = new Date(1900, 0, 1);
  const maxDate = new Date();

  return date >= minDate && date <= maxDate;
}
export default isDateValid;
