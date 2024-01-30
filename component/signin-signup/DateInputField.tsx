import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Platform, TextInput } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import DateInputFieldProps from '../type/DateInputField';

const DateInputField = ({ placeHolder, required }: DateInputFieldProps) => {
  const [date, setDate] = useState(new Date());
  const [isPickerShow, setIsPickerShow] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [dateStr, setDateStr] = useState('')

  const showPicker = () => {
    setIsPickerShow(true);
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setIsPickerShow(Platform.OS === 'ios'); // For iOS, keep the picker open.
    setDate(currentDate);
    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
    const year = currentDate.getFullYear().toString().slice(-2);
    
    setDateStr(`${day}/${month}/${year}`);
  };

  return (
    <View style={styles.container}>
      {!dateStr && !isFocused && (
        <Text style={styles.placeholder}>
          {placeHolder}
          {<Text style={styles.asterisk}> *</Text>}
        </Text>
      )}
      <TextInput
        style={[
          styles.input,
          !date && !isFocused ? styles.inputPlaceholder : null,
        ]}
        value={dateStr}
        onChangeText={setDateStr}
        onFocus={handleFocus}
        onBlur={handleBlur}
        autoCorrect={false}
      />
      <TouchableOpacity onPress={showPicker} style={styles.iconContainer}>
        <Image
          source={require('../../assets/images/signIn-signUp/datePickerIcon.png')}
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
      borderBottomColor: 'black',
      marginVertical: 20,
      position: 'relative'  
    },
    input: {
      fontSize: 18,
      color: 'black',
    },
    inputPlaceholder: {
      color: 'transparent',
    },
    placeholder: {
      position: 'absolute',
      left: 10,
      bottom: 10,
      fontSize: 18,
      color: 'grey',
    },
    asterisk: {
      color: 'red',
    },
    iconContainer: {
        position: 'absolute',
        right: 10,
        bottom: 10,
      },
      icon: {
        width: 22,
        height: 21.5,
      },
      datePicker: {
        width: '100%',
      },
  });

export default DateInputField;