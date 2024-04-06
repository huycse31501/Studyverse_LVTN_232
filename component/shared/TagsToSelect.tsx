import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

type TagToSelectProps = {
  name: string;
};

export const listOfTagToSelects = [
  "Toán",
  "Lý",
  "Hóa học",
  "Lịch sử",
  "Anh văn",
  "Ngữ văn",
  "Sinh học",
  "Địa lý",
  "GDCD",
  "Hằng ngày",
  "Kiểm tra",
];

const TagToSelect: React.FC<
  TagToSelectProps & { isSelected: boolean; onPress: () => void }
> = ({ name, isSelected, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.TagToSelect, isSelected && styles.selectedTag]}
    >
      <View style={styles.circle} />
      <Text style={styles.text}>{name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  TagToSelect: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 15,
    flexGrow: 0,
    flexBasis: "25%",
    borderColor: "black",
    borderWidth: 0.75,
    height: 30,
    margin: 10,
  },
  selectedTag: {
    backgroundColor: "#DDF0E6",
  },
  circle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },

  text: {
    fontSize: 14,
    fontWeight: "500",
  },
});

export default TagToSelect;
