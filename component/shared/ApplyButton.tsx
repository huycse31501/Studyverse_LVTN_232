import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

// Define the type for your props
type ApplyButtonProps = {
  label: string;
  onPress?: () => void; // You can add more props if needed, like an onPress function
};

const ApplyButton = ({ label, onPress }: ApplyButtonProps) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{label}</Text>
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
