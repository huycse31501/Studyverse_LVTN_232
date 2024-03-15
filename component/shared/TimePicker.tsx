import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

type TimePickerProps = {
  onStartTimeSelect?: (time: string) => void;
  onEndTimeSelect?: (time: string) => void;
};

const TimePicker: React.FC<TimePickerProps> = ({
  onStartTimeSelect,
  onEndTimeSelect,
}) => {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isStartTimePickerVisible, setStartTimePickerVisibility] =
    useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);

  const getTimeDate = (time: string): Date => {
    const [hours, minutes] = time.split(":").map(Number);
    const timeDate = new Date();
    timeDate.setHours(hours, minutes, 0, 0);
    return timeDate;
  };

  const showStartTimePicker = () => {
    setStartTimePickerVisibility(true);
  };

  const showEndTimePicker = () => {
    setEndTimePickerVisibility(true);
  };

  const handleStartTimeConfirm = (date: Date) => {
    const formattedTime = `${date.getHours()}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
    setStartTime(formattedTime);
    setStartTimePickerVisibility(false);

    if (onStartTimeSelect) {
      onStartTimeSelect(formattedTime);
    }
  };

  const handleEndTimeConfirm = (date: Date) => {
    const formattedTime = `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    const startTimeDate = getTimeDate(startTime);
    if (date > startTimeDate) {
      setEndTime(formattedTime);
    } else {
      setEndTimePickerVisibility(false);

      Alert.alert("Giờ kết thúc phải sau giờ bắt đầu");
      setEndTime("");
    }
    setEndTimePickerVisibility(false);

    if (onEndTimeSelect) {
      onEndTimeSelect(formattedTime);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={showStartTimePicker} style={styles.timeButton}>
        <Text style={styles.label}>From</Text>
        <Text style={styles.time}>{startTime || ""}</Text>
      </TouchableOpacity>
      <Image
        source={require("../../assets/images/dashboard/right-arrow.png")}
        style={styles.arrow}
      />
      <TouchableOpacity onPress={showEndTimePicker} style={styles.timeButton}>
        <Text style={styles.label}>To</Text>
        <Text style={styles.time}>{endTime || ""}</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isStartTimePickerVisible}
        mode="time"
        onConfirm={handleStartTimeConfirm}
        onCancel={() => setStartTimePickerVisibility(false)}
        date={startTime ? getTimeDate(startTime) : new Date()}
      />
      <DateTimePickerModal
        isVisible={startTime.length != 0 && isEndTimePickerVisible}
        mode="time"
        onConfirm={handleEndTimeConfirm}
        onCancel={() => setEndTimePickerVisibility(false)}
        date={endTime ? getTimeDate(endTime) : new Date()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 5,
    backgroundColor: "#F1F5F9",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    marginHorizontal: 20,
    elevation: 3,
    height: 90,
  },
  timeButton: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: "#F1F5F9",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  label: {
    fontSize: 18,
    color: "#94A3B8",
  },
  time: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1E293B",
    marginTop: 4,
  },
  arrow: {
    width: 50,
    height: 50,
  },
  eventDateText: {
    fontSize: 19,
    color: "#1E293B",
    fontWeight: "700",
  },
});

export default TimePicker;
