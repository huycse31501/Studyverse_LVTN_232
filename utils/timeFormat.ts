export const formatTime = (time: string): string => {
  let [hours, minutes] = time.split(":");
  hours = hours.padStart(2, "0");
  minutes = minutes.padStart(2, "0");
  return `${hours}:${minutes}`;
};
