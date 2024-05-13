import { addMinutes, subMinutes } from "date-fns";
import Constants from "expo-constants";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useEffect } from "react";
import * as Notifications from "expo-notifications";

let host = Constants?.expoConfig?.extra?.host;
let port = Constants?.expoConfig?.extra?.port;

const NotificationManager = () => {
  const user = useSelector((state: RootState) => state.user.user);
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notification received!", notification);
      }
    );

    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification response received!", response);
      });

    return () => {
      Notifications.removeNotificationSubscription(subscription);
      Notifications.removeNotificationSubscription(responseSubscription);
    };
  }, []);

  useEffect(() => {
    if (user?.userId) {
      registerForNotifications();
      fetchAndScheduleEvents(user.userId);
    }
  }, [user?.userId]);

  async function registerForNotifications() {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      console.log("Notification permissions not granted");
      return;
    }

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  }

  async function fetchAndScheduleEvents(userId: string) {
    let requestUserEventURL = `https://${host}/event/${userId}`;
    try {
      const response = await fetch(requestUserEventURL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const events = await response.json();
      console.log(events);
      events.forEach(scheduleNotificationForEvent);
    } catch (e) {
      console.error("Error fetching events:", e);
    }
  }

  function scheduleNotificationForEvent(event: any) {
    if (typeof event.timeStart !== "string" || typeof event.timeEnd !== "string") {
      console.error("Event time information is incomplete.");
      return;
    }

    if (typeof event.remindTime !== 'number' || event.remindTime <= 0) {
      console.log("No valid remindTime provided for event:", event.name);
      return;
    }
    

    const gmtPlus7Offset = '+07:00';
    const eventStartTimeWithZone = event.timeStart.includes('Z') || event.timeStart.includes('+') ? event.timeStart : `${event.timeStart}${gmtPlus7Offset}`;
    const eventEndTimeWithZone = event.timeEnd.includes('Z') || event.timeEnd.includes('+') ? event.timeEnd : `${event.timeEnd}${gmtPlus7Offset}`;

    const eventStartTime = new Date(eventStartTimeWithZone);
    const eventEndTime = new Date(eventEndTimeWithZone);

    const now = new Date();
    const currentTime = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()));
    currentTime.setHours(currentTime.getHours() + 7);

    if (isNaN(eventStartTime.getTime()) || isNaN(eventEndTime.getTime())) {
      console.error("Invalid event time:", event.timeStart, event.endTime);
      return;
    }

    const remindTime = typeof event.remindTime === 'number' && event.remindTime > 0 ? event.remindTime : 0;
    let notificationTime = subMinutes(eventStartTime, remindTime);

    if (currentTime < notificationTime && notificationTime < eventEndTime) {
      notificationTime = currentTime; 
    }

    Notifications.scheduleNotificationAsync({
      content: {
        title: "Sự kiện sắp diễn ra",
        body: `${event.name} sẽ diễn ra sau ${remindTime} phút.`,
      },
      trigger: notificationTime > currentTime ? notificationTime.getTime() : null,
    }).then(response => {
      console.log('Notification scheduled:', response, notificationTime);
    }).catch(error => {
      console.error('Error scheduling notification:', error);
    });
  }

  return null;
};

export default NotificationManager;
