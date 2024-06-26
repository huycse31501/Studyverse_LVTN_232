import React from "react";
import { TouchableOpacity, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from "react-native";
import { EventProps } from "./RemindEvent";

type ApplyButtonProps = {
  label: string;
  onPress?: () => void;
  extraStyle?: StyleProp<ViewStyle>; 
  extraTextStyle?: StyleProp<TextStyle>; 
};

const ApplyButton = ({ label, onPress, extraStyle, extraTextStyle }: ApplyButtonProps) => {
  return (
    <TouchableOpacity style={[styles.button, extraStyle]} onPress={onPress}>
      <Text style={[styles.text, extraTextStyle]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "40%",
    backgroundColor: "#FF2D55",
    padding: 10,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  text: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ApplyButton;