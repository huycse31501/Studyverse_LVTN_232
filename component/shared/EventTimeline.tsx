import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import EventInfo from "../type/EventInfo";

type EventTimelineProps = {
  data: EventInfo[];
  height?: number;
};

const EventTimeline = ({ data, height }: EventTimelineProps) => {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateCurrentTime = () => {
      const newCurrentTime = new Date().toLocaleTimeString("en-GB", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setCurrentTime(newCurrentTime);
    };

    updateCurrentTime(); // Update immediately on mount
    const interval = setInterval(updateCurrentTime, 1000); // Update every second
    return () => clearInterval(interval);
  }, []);
  const getTimeUntilNextEvent = (eventTime: string): string | null => {
    const now = new Date();

    const currentISODate = now.toISOString().slice(0, 10);
    const eventDateTimeString = `${currentISODate}T${eventTime}:00`;
    const eventDate = new Date(eventDateTimeString);

    const diff = eventDate.getTime() - now.getTime();

    if (diff < 0) {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowDateString = tomorrow.toLocaleDateString();
      const eventDateTimeStringTomorrow = `${tomorrowDateString} ${eventTime}`;
      const eventDateTomorrow = new Date(eventDateTimeStringTomorrow);

      const diffTomorrow = eventDateTomorrow.getTime() - now.getTime();
      if (diffTomorrow < 0) {
        return null;
      } else {
        return calculateTimeUntilEvent(diffTomorrow);
      }
    } else {
      return calculateTimeUntilEvent(diff);
    }
  };

  const calculateTimeUntilEvent = (diff: number): string => {
    const minutesUntilEvent = Math.floor(diff / 60000);
    const hoursUntilEvent = Math.floor(minutesUntilEvent / 60);
    const remainingMinutes = minutesUntilEvent % 60;

    let timeString = "";
    if (hoursUntilEvent > 0) {
      timeString += `${hoursUntilEvent} giờ `;
    }
    if (remainingMinutes > 0) {
      timeString += `${remainingMinutes} phút`;
    }

    return timeString ? `Sau ${timeString}` : "";
  };

  return (
    <View style={[styles.container, height ? { height: height } : {}]}>
      <ScrollView
        style={height ? { height } : styles.scrollView}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        {data.map((event, index) => (
          <View key={index} style={styles.eventBlock}>
            <View style={styles.timeContainer}>
              <Text style={styles.time}>{event.timeStart}</Text>
              <Text style={styles.time}>{event.timeEnd}</Text>
            </View>
            {event.task.map((task, index) => (
              <View style={styles.taskContainer} key={index}>
                <View style={styles.taskBlock}>
                  <Text style={styles.task}>
                    {task}
                  </Text>
                  {getTimeUntilNextEvent(event.timeStart) && (
                    <View style={styles.countdownContainer}>
                      <Text style={styles.countdown}>
                        {getTimeUntilNextEvent(event.timeStart)}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
  },
  scrollView: {
    flex: 1,
    flexGrow: 0,
  },
  eventBlock: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  timeContainer: {
    width: 50,
  },
  time: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "bold",
    paddingTop: 10,
  },
  taskContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#FF2D55",
    borderRadius: 14,
    padding: 10,
    marginHorizontal: 3,
  },
  taskBlock: {
    flex: 1,
  },
  task: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  countdownContainer: {
    marginTop: 5,
    backgroundColor: "#FF375F",
    borderRadius: 10,
    padding: 5,
  },
  countdown: {
    fontSize: 10,
    color: "#FFFFFF",
  },
  image: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: 10,
    alignSelf: "center",
  },
  moreImages: {
    fontSize: 15,
    color: "#FFFFFF",
    marginLeft: 10,
    alignSelf: "center",
  },
});

export default EventTimeline;
