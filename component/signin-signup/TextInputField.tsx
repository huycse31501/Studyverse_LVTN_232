import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import TextInputFieldProps from "../type/TextInputField";

const InputField = ({ placeHolder, required }: TextInputFieldProps) => {
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
      />
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
    position: 'relative',
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
    fontSize: 50,
    color: 'grey',
    fontFamily: 'roboto',
  },
  asterisk: {
    color: 'red',
  },
});

export default InputField;
