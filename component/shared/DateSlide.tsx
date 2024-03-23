import React, { useCallback, useMemo, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import DatePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { DateCountMap } from "../../screen/Calendar/CalendarDashboard";
import { formatDate } from "../../utils/formatDate";
import { formatDateObj } from "../../utils/formatDateObjToString";

type Props = {
  remind?: boolean;
  listOfEventCount?: DateCountMap[];
  onDateSelect?: (date: Date) => void;
};

const daysOfWeek = ["Su", "Mo", "Tu", "Wed", "Th", "Fr", "Sa"];

const WeekDatePicker: React.FC<Props> = ({
  remind,
  onDateSelect,
  listOfEventCount,
}) => {
  const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const onDateChange = useCallback(
    (event: DateTimePickerEvent, selectedDate?: Date) => {
      const currentDate = selectedDate || date;
      setShowPicker(false);
      setDate(currentDate);
      setSelectedDate(currentDate);
      onDateSelect?.(currentDate);
    },
    [date, onDateSelect]
  );

  const onDatePress = useCallback(
    (dateItem: Date) => {
      setSelectedDate(dateItem);
      setDate(dateItem);
      if (onDateSelect) {
        onDateSelect(dateItem);
      }
    },
    [onDateSelect]
  );

  const generateWeekDates = (selectedDate: Date): Date[] => {
    let startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
    return Array.from({ length: 7 }).map((_, index) => {
      let date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index);
      return date;
    });
  };

  const weekDates = useMemo(() => generateWeekDates(date), [date]);

  const renderDate = (dateItem: Date, dayOfWeek: string) => {
    const isSelected =
      dateItem.getDate() === selectedDate.getDate() &&
      dateItem.getMonth() === selectedDate.getMonth() &&
      dateItem.getFullYear() === selectedDate.getFullYear();

    const formattedDateItem = formatDateObj(dateItem);

    const matchingEventCount = listOfEventCount?.find(
      (eventCount) => String(eventCount.date) === String(formattedDateItem)
    )?.countEvent;

    return (
      <TouchableOpacity
        key={dateItem.toISOString()}
        style={[styles.date, isSelected && styles.selectedDate]}
        onPress={() => onDatePress(dateItem)}
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
        {isSelected && !listOfEventCount && <View style={styles.dot} />}
        {listOfEventCount && matchingEventCount ? (
          <Text
            style={[
              styles.eventCount,
              !isSelected && { color: "rgba(222,73,110,0.75)" },
            ]}
          >
            {String(matchingEventCount)}
          </Text>
        ) : (
          <View style={styles.emptyEventSpace}></View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.weekDates}>
        {weekDates.map((dateItem, index) =>
          renderDate(dateItem, daysOfWeek[index])
        )}
      </View>
      <View style={styles.eventDateContainer}>
        <Text style={styles.eventDateText}>
          {remind ? "Nhắc nhở" : "Sự kiện"}
        </Text>
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

      {showPicker && (
        <DatePicker
          key={`date-picker-${date.toISOString()}`}
          value={date}
          mode="date"
          display="default"
          onChange={onDateChange}
          onTouchCancel={() => setShowPicker(false)}
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
    width: 50,
    height: 90,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedDate: {
    backgroundColor: "#FFF0F0",
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
    color: "#DE496E",
  },
  selectedDaysOfWeekText: {
    color: "#DE496E",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#DE496E",
    position: "absolute",
    bottom: 10,
  },
  eventCount: {
    height: 30,

    fontSize: 16,
    color: "#DE496E",
    fontWeight: "700",
    paddingRight: 0,
    paddingTop: 5,
  },
  eventDateContainer: {
    marginVertical: 20,
    flexDirection: "row",
    paddingLeft: 30,
  },
  eventDateText: {
    fontSize: 19,
    color: "#1E293B",
    fontWeight: "700",
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
  emptyEventSpace: {
    height: 30,
  },
});

export default React.memo(WeekDatePicker);
