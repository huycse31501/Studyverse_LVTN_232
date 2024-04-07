import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import BlackBorderTextInputFieldProps from "../type/BlackBorderText";

const BlackBorderTextInputField = ({
  placeHolder,
  required,
  isValid,
  textInputConfig,
  value,
  customError,
  isBlackPlaceHolder,
}: BlackBorderTextInputFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isValid && value?.trim().length !== 0) {
        setShowError(true);
      } else {
        setShowError(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [value, isValid]);

  return (
    <View style={styles.container}>
      {!value && !isFocused && (
        <Text
          style={[styles.placeholder, isBlackPlaceHolder && { color: "black" }]}
        >
          {placeHolder}
          {required && <Text style={styles.asterisk}> *</Text>}
        </Text>
      )}
      <TextInput
        style={[
          styles.input,
          !value && !isFocused ? styles.inputPlaceholder : null,
        ]}
        onFocus={handleFocus}
        onBlur={handleBlur}
        autoCorrect={false}
        value={value}


        {...textInputConfig}
      />
      {showError && (
        <Text style={styles.errorText}>
          {customError ?? `${placeHolder} không hợp lệ`}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "85%",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#a5a5a9",
    position: "relative",
    alignSelf: "center",
    marginBottom: 20,
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
});

export default BlackBorderTextInputField;
