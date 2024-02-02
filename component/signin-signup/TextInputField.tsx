import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import TextInputFieldProps from "../type/TextInputField";

const TextInputField = ({ placeHolder, required, isValid,textInputConfig }: TextInputFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState("");

  // Function to handle the focus state
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <View style={styles.container}>
      {!value && !isFocused && (
        <Text style={styles.placeholder}>
          {placeHolder}
          {required && <Text style={styles.asterisk}> *</Text>}
        </Text>
      )}
      <TextInput
        style={[
          styles.input,
          !value && !isFocused ? styles.inputPlaceholder : null,
        ]}
        value={value}
        onChangeText={setValue}
        onFocus={handleFocus}
        onBlur={handleBlur}
        autoCorrect={false}
        {...textInputConfig}
      />
      {!isValid && value.trim().length !== 0 && (
        <Text style={styles.errorText}>{placeHolder} không hợp lệ</Text>
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
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
});

export default TextInputField;
