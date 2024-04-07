export function convertTimeToSeconds(time: string) {
  const parts = time.split(":");

  const seconds =
    parseInt(parts[0], 10) * 3600 +
    parseInt(parts[1], 10) * 60 +
    parseInt(parts[2], 10);

  return seconds;
}
