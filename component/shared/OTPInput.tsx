import React, { useRef } from "react";
import {
  TextInput,
  View,
  StyleSheet,
  KeyboardTypeOptions,
  TextInputProps,
} from "react-native";

type OTPInputProps = {
  input: [string, string, string, string];
  onInputChange: (text: string, index: number) => void;
  textInputConfig?: TextInputProps;
};

const OTPInput: React.FC<OTPInputProps> = ({
  input,
  onInputChange,
  textInputConfig,
}) => {
  const keyboardType: KeyboardTypeOptions = "numeric";

  const inputRefs = useRef<Array<TextInput | null>>([]);

  const handleInput = (text: string, index: number) => {
    onInputChange(text, index);
    if (text && index < input.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    if (!text && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      {input.map((digit, index) => (
        <TextInput
          key={index}
          style={styles.input}
          onChangeText={(text) => handleInput(text, index)}
          value={digit}
          maxLength={1}
          keyboardType={keyboardType}
          returnKeyType="done"
          ref={(ref) => {
            inputRefs.current[index] = ref;
          }}
          {...textInputConfig}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: 45,
    height: 45,
    borderRadius: 30,
    borderColor: "#0e0d0d7a",
    borderWidth: 2,
    textAlign: "center",
    fontSize: 18,
    marginHorizontal: 15,
    color: "#000000",
    fontWeight: "bold",
  },
});

export default OTPInput;
