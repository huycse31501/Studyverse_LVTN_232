import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export type EventStatus = "complete" | "pending" | "incomplete";

export interface EventProps {
  eventId?: string;
  name: string;
  time: string;
  status: EventStatus;
}

export interface EventListProps {
  events: EventProps[];
  blueTheme?: boolean;
  height?: number;
  onEventItemPress?: (item: EventProps) => void;
}

const EventReminder: React.FC<EventListProps> = ({
  events,
  blueTheme,
  height,
  onEventItemPress,
}) => {
  const getIconName = (status: EventStatus) => {
    switch (status) {
      case "complete":
        return "checkmark-circle";
      case "pending":
        return "time";
      case "incomplete":
        return "close-circle";
    }
  };

  const getIconColor = (status: EventStatus) => {
    switch (status) {
      case "complete":
        return "green";
      case "pending":
        return "orange";
      case "incomplete":
        return "red";
    }
  };

  return (
    <ScrollView style={[height ? { height: height } : {}]}>
      {events.map((item, index) => (
        <TouchableOpacity
          style={[styles.container, blueTheme && styles.blueThemeContainer]}
          key={index}
          onPress={() => onEventItemPress?.(item)}
        >
          <Image
            source={
              blueTheme
                ? require("../../assets/images/shared/blueThemeEventCalendar.png")
                : require("../../assets/images/shared/eventCalendar.png")
            }
            style={styles.calendarIcon}
          />
          <View
            style={[
              styles.textContainer,
              blueTheme && styles.blueThemeTextContainer,
            ]}
          >
            <Text style={[styles.name, blueTheme && styles.blueThemeName]}>
              {item.name}
            </Text>
            <View style={styles.timeContainer}>
              <Image
                source={
                  blueTheme
                    ? require("../../assets/images/shared/blueThemeClock.png")
                    : require("../../assets/images/shared/eventTimeCircle.png")
                }
                style={styles.timeCircleIcon}
              />
              <Text style={[styles.time, blueTheme && styles.blueThemeTime]}>
                {item.time}
              </Text>
            </View>
          </View>
          {!blueTheme && (
            <Ionicons
              name={getIconName(item.status)}
              size={24}
              color={getIconColor(item.status)}
            />
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 5,
    borderRadius: 16,
    shadowColor: "rgba(0,0,0,25)",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
    marginVertical: 25,
    marginHorizontal: 20,
  },
  blueThemeContainer: {
    backgroundColor: "rgba(133,114,255,0.95)",
  },

  blueThemeTextContainer: {
    marginLeft: 20,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
    flexDirection: "column",
  },
  name: {
    fontSize: 16,
    fontWeight: "400",
    color: "#000000",
    paddingBottom: 5,
  },
  blueThemeName: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "400",
  },
  timeContainer: {
    flexDirection: "row",
  },
  time: {
    fontSize: 13.5,
    color: "#000000",
    fontWeight: "400",
  },
  blueThemeTime: {
    color: "#ffffff",
    fontWeight: "400",
  },
  calendarIcon: {
    width: 60,
    height: 60,
  },
  timeCircleIcon: {
    width: 15,
    height: 15,
    marginRight: 8,
    marginTop: 2,
  },
});

export default EventReminder;
