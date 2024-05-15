import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

interface SwitcherProps {
  type: "List" | "WaitList";
  onListPress?: () => void;
  onWaitListPress?: () => void;
  onEnglish?: boolean;
}

const FamilyInfoSwitcher = ({
  type,
  onListPress,
  onWaitListPress,
  onEnglish,
}: SwitcherProps) => {
  const waitList = useSelector((state: RootState) => state.waitList.waitList);

  return (
    <View style={styles.container}>
      <TouchableOpacity disabled={type === "List"} onPress={onListPress}>
        <View style={styles.buttonContainer}>
          <Text
            style={type === "List" ? [styles.text, styles.bold] : styles.text}
          >
            {onEnglish ? "FAMILY MEMBER" : "DANH SÁCH"}
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
            {onEnglish ? `APPROVAL ${
              Array.isArray(waitList) && waitList.length !== 0
                ? `(${waitList.length})`
                : ""
            }` : `CHỜ DUYỆT ${
              Array.isArray(waitList) && waitList.length !== 0
                ? `(${waitList.length})`
                : ""
            }`}
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
