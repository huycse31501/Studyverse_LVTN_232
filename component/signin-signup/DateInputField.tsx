import React, { useState, useCallback, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
  TextInput,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import DateInputFieldProps from "../type/DateInputField";

const DateInputField = ({
  placeHolder,
  required,
  isValid,
  textInputConfig,
  dateStr,
}: DateInputFieldProps) => {
  const [date, setDate] = useState(new Date());
  const [isPickerShow, setIsPickerShow] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showError, setShowError] = useState(false);

  const showPicker = () => {
    setIsPickerShow(true);
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setIsPickerShow(Platform.OS === "ios"); // For iOS, keep the picker open.
    setDate(currentDate);
    const day = currentDate.getDate().toString().padStart(2, "0");
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Month is 0-indexed
    const year = currentDate.getFullYear().toString();
    const formattedDate = `${day}/${month}/${year}`;
    if (textInputConfig?.onChangeText) {
      textInputConfig.onChangeText(formattedDate);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isValid && dateStr?.trim().length !== 0) {
        setShowError(true);
      } else {
        setShowError(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [dateStr, isValid]);

  return (
    <View style={styles.container}>
      {!dateStr && !isFocused && (
        <Text style={styles.placeholder}>
          {placeHolder}
          {required && <Text style={styles.asterisk}> *</Text>}
        </Text>
      )}
      <TextInput
        style={[
          styles.input,
          !dateStr && !isFocused ? styles.inputPlaceholder : null,
        ]}
        onFocus={handleFocus}
        onBlur={handleBlur}
        autoCorrect={false}
        value={dateStr}
        {...textInputConfig}
      />
      {showError && (
        <Text style={styles.errorText}>
          Sai định dạng (DD/MM/YYYY) hoặc không hợp lệ
        </Text>
      )}
      <TouchableOpacity onPress={showPicker} style={styles.iconContainer}>
        <Image
          source={require("../../assets/images/signIn-signUp/datePickerIcon.png")}
          style={styles.icon}
        />
      </TouchableOpacity>
      {isPickerShow && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChange}
          maximumDate={new Date()}
          minimumDate={new Date(1900, 0, 1)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "black",
    position: "relative",
    marginVertical: "2.5%",
  },
  input: {
    fontSize: 18,
    color: "black",
  },
  inputPlaceholder: {
    color: "transparent",
  },
  placeholder: {
    position: "absolute",
    left: 10,
    bottom: 10,
    fontSize: 18,
    color: "grey",
  },
  asterisk: {
    color: "red",
  },
  errorText: {
    color: "#FF2D58",
    fontSize: 13,
    marginTop: 5,
  },
  iconContainer: {
    position: "absolute",
    right: 10,
    bottom: 10,
  },
  icon: {
    width: 22,
    height: 21.5,
  },
  datePicker: {
    width: "100%",
  },
});

export default DateInputField;
