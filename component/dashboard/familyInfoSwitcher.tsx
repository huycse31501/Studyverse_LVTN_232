import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";

interface SwitcherProps {
  type: "List" | "WaitList";
  onListPress?: () => void;
  onWaitListPress?: () => void;
}

const FamilyInfoSwitcher = ({
  type,
  onListPress,
  onWaitListPress,
}: SwitcherProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity disabled={type === "List"} onPress={onListPress}>
        <View style={styles.buttonContainer}>
          <Text
            style={type === "List" ? [styles.text, styles.bold] : styles.text}
          >
            DANH SÁCH
          </Text>
          {type === "List" && <View style={styles.underline} />}
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        disabled={type === "WaitList"}
        onPress={onWaitListPress}
      >
        <View style={styles.buttonContainer}>
          <Text
            style={
              type === "WaitList" ? [styles.text, styles.bold] : styles.text
            }
          >
            CHỜ DUYỆT (2)
          </Text>
          {type === "WaitList" && <View style={styles.underline} />}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "column",
    alignItems: "center",
    paddingHorizontal: "7.5%",
  },
  text: {
    color: "#FF2D55",
    fontSize: 18,
  },
  bold: {
    fontWeight: "bold",
    marginTop: 5,
  },
  underline: {
    height: 3,
    backgroundColor: "#FF0076",
    width: "115%",
    marginTop: 2,
  },
});

export default FamilyInfoSwitcher;
