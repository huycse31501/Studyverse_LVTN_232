import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import EventInfo from "../type/EventInfo";

type EventTimelineProps = {
  data: EventInfo[];
  height?: number;
};

const EventTimeline = ({ data, height }: EventTimelineProps) => {
  const scrollViewStyle = {
    height: height || "auto",
  };

  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toISOString());
    }, 60000);
    setCurrentTime(new Date().toISOString());

    return () => clearInterval(interval);
  }, []);

  const getTimeUntilNextEvent = (eventTime: string) => {
    const now = new Date(currentTime);
    const [eventHours, eventMinutes] = eventTime.split(".").map(Number);
    const eventDate = new Date(now);
    eventDate.setHours(eventHours, eventMinutes, 0, 0);

    const diff = eventDate.getTime() - now.getTime();
    if (diff < 0) {
      return null;
    }

    const minutesUntilEvent = Math.round(diff / 60000);
    if (minutesUntilEvent === 0) {
      return "Bắt đầu ngay bây giờ";
    }
    return `Sau ${minutesUntilEvent} phút`;
  };

  return (
    <View style={[styles.container, height ? { height: height } : {}]}>
      <Text style={styles.header}>Sự kiện hôm nay</Text>
      <ScrollView
        style={height ? { height } : styles.scrollView}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        {data.map((event, index) => (
          <View key={index} style={styles.eventBlock}>
            <View style={styles.timeContainer}>
              <Text style={styles.time}>{event.time}</Text>
            </View>
            <View style={styles.taskContainer}>
              <View style={styles.taskBlock}>
                <Text style={styles.task}>{event.task}</Text>
                {getTimeUntilNextEvent(event.time) && (
                  <View style={styles.countdownContainer}>
                    <Text style={styles.countdown}>
                      {getTimeUntilNextEvent(event.time)}
                    </Text>
                  </View>
                )}
              </View>
              {event.image && (
                <Image source={{ uri: event.image }} style={styles.image} />
              )}
            </View>
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
  header: {
    fontWeight: "600",
    fontSize: 18,
    marginBottom: 10,
    color: "#000",
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
  },
  taskContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#FF2D55",
    borderRadius: 14,
    padding: 10,
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
});

export default EventTimeline;
