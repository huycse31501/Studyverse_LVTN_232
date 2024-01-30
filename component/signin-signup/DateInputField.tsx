import React, { useState, useCallback } from "react";
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
import debounceParamFunc from "../type/GeneralFunction/debounce";

const DateInputField = ({ placeHolder, required }: DateInputFieldProps) => {
  const [date, setDate] = useState(new Date());
  const [isPickerShow, setIsPickerShow] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [dateStr, setDateStr] = useState("");
  const [isValidDate, setIsValidDate] = useState(true);

  const showPicker = () => {
    setIsPickerShow(true);
  };

  const debounce = (func: debounceParamFunc, delay: number): (...args: any[]) => void => {
    let inDebounce: ReturnType<typeof setTimeout> | null;
    return function(this: any, ...args: any[]) {
      const context = this;
      if (inDebounce !== null) {
        clearTimeout(inDebounce);
      }
      inDebounce = setTimeout(() => func.apply(context, args), delay);
    };
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  
  const validateDate = (dateStr: string) => {
    // Check if the string is empty
    if (dateStr.trim() === '') {
      // If empty, reset validation state or do not set an error
      setIsValidDate(true); // or handle this case appropriately
    } else {
      // Existing validation logic
      const regex = /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[012])\/\d{4}$/;
      setIsValidDate(regex.test(dateStr));
    }
  };

  const debouncedValidateDate = useCallback(debounce(validateDate, 500), []);


  const handleDateChange = (text: string) => {
    setDateStr(text);

    debouncedValidateDate(text);
  };
  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setIsPickerShow(Platform.OS === "ios"); // For iOS, keep the picker open.
    setDate(currentDate);
    const day = currentDate.getDate().toString().padStart(2, "0");
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Month is 0-indexed
    const year = currentDate.getFullYear().toString().slice(-2);
    const formattedDate = `${day}/${month}/${year}`;

    setDateStr(formattedDate);
    validateDate(formattedDate);
  };

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
          !date && !isFocused ? styles.inputPlaceholder : null,
        ]}
        value={dateStr}
        onChangeText={handleDateChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        autoCorrect={false}
      />
      {!isValidDate && (
        <Text style={styles.errorText}>
          Ngày sinh không hợp lệ
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
          maximumDate={new Date(2100, 11, 31)}
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
    marginVertical: 20,
    position: "relative",
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
  invalidInput: {
    borderColor: "red",
    borderWidth: 1,
  },
  errorText: {
    color: "red",
    fontSize: 12,
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
