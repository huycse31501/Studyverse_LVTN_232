import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import DatePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

type Props = {};

const daysOfWeek = ["Su", "Mo", "Tu", "Wed", "Th", "Fr", "Sa"];

const DatePickerBlue: React.FC<Props> = () => {
  const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowPicker(false);
    setDate(currentDate);
    setSelectedDate(currentDate);
  };

  const generateFourDaySpan = (selectedDate: Date): Date[] => {
    let dates = [];
    let dayOfWeek = selectedDate.getDay();
    let startIndex = dayOfWeek === 0 || dayOfWeek === 1 ? -1 : -2;

    for (let i = startIndex; i < startIndex + 4; i++) {
      let newDate = new Date(selectedDate);
      newDate.setDate(selectedDate.getDate() + i);
      dates.push(newDate);
    }
    return dates;
  };

  const fourDaySpan = generateFourDaySpan(selectedDate);

  const renderDate = (dateItem: Date, dayOfWeek: string) => {
    const isSelected =
      dateItem.getDate() === date.getDate() &&
      dateItem.getMonth() === date.getMonth() &&
      dateItem.getFullYear() === date.getFullYear();

    return (
      <TouchableOpacity
        key={dateItem.toISOString()}
        style={[styles.date, isSelected && styles.selectedDate]}
        onPress={() => setDate(dateItem)}
      >
        <Text style={[styles.dateText, isSelected && styles.selectedDateText]}>
          {dateItem.getDate()}
        </Text>
        <Text
          style={[
            styles.daysOfWeek,
            isSelected && styles.selectedDaysOfWeekText,
          ]}
        >
          {dayOfWeek}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.eventDateContainer}>
        <Text style={styles.eventDateText}>{"Chọn ngày"}</Text>
        <Text style={styles.eventDateTime}>
          {date.getMonth() + 1}/{date.getFullYear()}
        </Text>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setShowPicker(true)}
        >
          <Image
            source={require("../../assets/images/shared/datePicker.png")}
            style={styles.datePickerLogo}
          ></Image>
        </TouchableOpacity>
      </View>
      <View style={styles.weekDates}>
        {fourDaySpan.map((dateItem, index) =>
          renderDate(dateItem, daysOfWeek[index])
        )}
      </View>

      {showPicker && (
        <DatePicker
          value={date}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  weekDates: {
    flexDirection: "row",
    marginHorizontal: 15,
  },
  date: {
    width: 90,
    height: 140,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedDate: {
    backgroundColor: "#8572FF",
    borderRadius: 16,
  },
  dateText: {
    fontSize: 19,
    color: "#1E293B",
    fontWeight: "700",
  },
  daysOfWeek: {
    color: "#94A3B8",
    fontSize: 16,
  },
  selectedDateText: {
    fontSize: 20,
    color: "#FFFFFF",
  },
  selectedDaysOfWeekText: {
    color: "#FFFFFF",
  },
  eventDateContainer: {
    marginVertical: 20,
    flexDirection: "row",
    paddingLeft: 30,
  },
  eventDateText: {
    fontSize: 19,
    color: "#1E293B",
    fontWeight: "600",
  },
  eventDateTime: {
    fontSize: 19,
    color: "#1E293B",
    fontWeight: "600",
    paddingLeft: 30,
  },
  datePickerButton: {
    paddingLeft: "25%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    position: "absolute",
    right: 40,
    top: -7.5,
  },
  datePickerLogo: {
    width: 35,
    height: 35,
  },
});

export default DatePickerBlue;
