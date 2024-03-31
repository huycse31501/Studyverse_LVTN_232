import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { listOfSubjectTags } from "./constants/listOfSubject";

type TagProps = {
  name: string;
};

const getColors = (name: string) => {
  let backgroundColor, circleColor;
  switch (name) {
    case "Toán":
      backgroundColor = "#f7f0d3";
      circleColor = "#F59E0B";
      break;
    case "Anh văn":
    case "Lịch sử":
    case "Ngữ văn":
      backgroundColor = "#FEF2F2";
      circleColor = "#DC2626";
      break;
    case "Daily":
    case "Exam":
      backgroundColor = "#F0FFF5";
      circleColor = "#1A7529";
      break;
    default:
      backgroundColor = "#FFFFFF";
      circleColor = "#000000";
  }
  return { backgroundColor, circleColor };
};

const Tag: React.FC<TagProps> = ({ name }) => {
  const { backgroundColor, circleColor } = getColors(name);

  return (
    <View style={[styles.tag, { backgroundColor }]}>
      <View style={[styles.circle, { backgroundColor: circleColor }]} />
      <Text style={styles.text}>{name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginHorizontal: 7,
    width: 80,
  },
  circle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  text: {
    fontSize: 11,
    fontWeight: "500",
  },
});

export default Tag;
