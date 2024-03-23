import EventInfo from "../component/type/EventInfo";

export function sortEventsByStartTime(events: EventInfo[]) {
  const eventsWithIndex = events.map((event, index) => ({ event, index }));

  return eventsWithIndex
    .sort((a, b) => {
      const [hoursA, minutesA] = a.event.startTime.split(":").map(Number);
      const [hoursB, minutesB] = b.event.startTime.split(":").map(Number);
      const minutesTotalA = hoursA * 60 + minutesA;
      const minutesTotalB = hoursB * 60 + minutesB;

      const primaryComparison = minutesTotalA - minutesTotalB;
      if (primaryComparison !== 0) {
        return primaryComparison;
      }

      return a.index - b.index;
    })
    .map((item) => item.event);
}
