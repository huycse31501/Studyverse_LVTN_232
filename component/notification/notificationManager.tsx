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
      events.forEach(scheduleNotificationForEvent);
    } catch (e) {
      console.error("Error fetching events:", e);
    }
  }

  function scheduleNotificationForEvent(event: any) {
    if (typeof event.timeStart !== 'string') {
      return;
    }

    const eventStartTime = new Date(event.timeStart);
    if (isNaN(eventStartTime.getTime())) {
      console.error('Invalid event timeStart:', event.timeStart);
      return;
    }

    const remindTime = typeof event.remindTime === 'number' ? event.remindTime : 0;

    if (remindTime === 0) {
      return;
    }
    
    const notificationTime = subMinutes(eventStartTime, remindTime);
    console.log(notificationTime, new Date())
    Notifications.scheduleNotificationAsync({
      content: {
        title: 'Sự kiện sắp diễn ra',
        body: `${event.name} sẽ diễn ra sau ${remindTime} phút`,
      },
      trigger: notificationTime.getTime(),
    }).then(response => {
      console.log('Notification scheduled:', response, notificationTime);
    }).catch(error => {
      console.error('Error scheduling notification:', error);
    });
  }
  return null;
};

export default NotificationManager;