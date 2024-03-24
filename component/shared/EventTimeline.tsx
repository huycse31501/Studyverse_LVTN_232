import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import EventInfo from "../type/EventInfo";
import { avatarList } from "../../utils/listOfAvatar";
import { sortEventsByStartTime } from "../../utils/sortEventByTime";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { RootStackParamList } from "../navigator/appNavigator";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type EventTimelineProps = {
  data: EventInfo[];
  routeBefore?: string;
  userId?: number;
  height?: number;
  fromFooter?: string;
};

type EventTimeLineNavigationProp = StackNavigationProp<{
  EditEventScreen: {
    userId: number;
    eventInfo: any;
    routeBefore: string;
    fromFooter?: string;
  };
}>;

const EventTimeline = ({
  data,
  height,
  userId,
  routeBefore,
  fromFooter
}: EventTimelineProps) => {
  const navigation = useNavigation<EventTimeLineNavigationProp>();
  const [currentTime, setCurrentTime] = useState("");
  const sortedEvents = useMemo(() => sortEventsByStartTime(data), [data]);
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
    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 1000);
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
        {sortedEvents.map((event, index) => (
          <TouchableOpacity
            key={index}
            style={styles.eventBlock}
            onPress={() => {
              if (
                typeof userId !== "undefined" &&
                typeof routeBefore !== "undefined"
              ) {
                navigation.navigate("EditEventScreen", {
                  userId: userId,
                  routeBefore: routeBefore,
                  eventInfo: event,
                  fromFooter: fromFooter,
                });
              }
            }}
          >
            <View style={styles.timeContainer}>
              <Text style={styles.timeStart}>{event.startTime}</Text>
              <Text style={styles.timeEnd}>{event.endTime}</Text>
            </View>
            <View style={styles.taskContainer}>
              <View style={styles.taskBlock} key={index}>
                <Text style={styles.task}>{event.name}</Text>
                {getTimeUntilNextEvent(event.startTime) && (
                  <View style={styles.countdownContainer}>
                    <Text style={styles.countdown}>
                      {getTimeUntilNextEvent(event.startTime)}
                    </Text>
                  </View>
                )}
              </View>
              {event.tags &&
                event.tags
                  .slice(0, 3)
                  .map((tag, tagIndex) => (
                    <Image
                      key={tagIndex}
                      source={{ uri: avatarList[Number(tag) - 1] }}
                      style={styles.image}
                    />
                  ))}
              {event.tags && event.tags.length > 3 && (
                <Text style={styles.moreImages}>+{event.tags.length - 3}</Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    marginVertical: 10,
  },
  scrollView: {
    flex: 1,
    flexGrow: 0,
  },
  eventBlock: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  timeContainer: {
    width: 50,
  },
  timeStart: {
    fontSize: 13,
    color: "#94A3B8",
    fontWeight: "bold",
    paddingBottom: 10,
  },
  timeEnd: {
    fontSize: 13,
    color: "#94A3B8",
    fontWeight: "bold",
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
    height: "100%",
  },
  task: {
    fontSize: 14,
    color: "#ffffff",
    fontWeight: "500",
    padding: 2.5,
  },
  countdownContainer: {
    marginTop: 5,
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
