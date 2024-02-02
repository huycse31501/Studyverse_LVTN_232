import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import PasswordInputFieldProps from "../type/PasswordInputField";
import { Ionicons } from "@expo/vector-icons";

const PasswordInputField = ({
  placeHolder,
  isValid,
  textInputConfig,
  value,
}: PasswordInputFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);
  // const [value, setValue] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <View style={styles.container}>
      {!value && !isFocused && (
        <Text style={styles.placeholder}>
          {placeHolder}
          {<Text style={styles.asterisk}> *</Text>}
        </Text>
      )}
      <TextInput
        style={[
          styles.input,
          !value && !isFocused ? styles.inputPlaceholder : null,
        ]}
        onFocus={handleFocus}
        onBlur={handleBlur}
        secureTextEntry={!passwordVisible}
        autoCorrect={false}
        {...textInputConfig}
      />
      {!isValid && value?.trim()?.length !== 0 && (
        <Text style={styles.errorText}>
          Tối thiểu 8 ký tự gồm 1 ký tự in hoa và 1 chữ số
        </Text>
      )}
      <TouchableOpacity
        style={styles.eyeIcon}
        onPress={togglePasswordVisibility}
      >
        <Ionicons
          name={passwordVisible ? "eye" : "eye-off"}
          size={24}
          color="grey"
        />
      </TouchableOpacity>
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
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
  placeholder: {
    position: "absolute",
    left: 10,
    bottom: 10,
    fontSize: 18,
    color: "grey",
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    bottom: 10,
  },
  asterisk: {
    color: "red",
  },
});

export default PasswordInputField;
