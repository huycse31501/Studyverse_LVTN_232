import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";

type OptionType = "Parent" | "Children";

type OptionSelectorProps = {
  onOptionChange?: (option: OptionType) => void;
};

const OptionSelector = ({ onOptionChange }: OptionSelectorProps) => {
  const [selectedOption, setSelectedOption] = useState<OptionType>("Parent");

  const selectOption = (option: OptionType) => {
    setSelectedOption(option);
    onOptionChange?.(option);
  };

  const isOptionSelected = (option: OptionType) => selectedOption === option;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.option,
          isOptionSelected("Parent") ? styles.selected : styles.unselected,
          styles.leftOption,
        ]}
        onPress={() => selectOption("Parent")}
      >
        <Text
          style={[
            styles.text,
            isOptionSelected("Parent")
              ? styles.selectedText
              : styles.unselectedText,
          ]}
        >
          Phụ huynh
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.option,
          isOptionSelected("Children") ? styles.selected : styles.unselected,
          styles.rightOption,
        ]}
        onPress={() => selectOption("Children")}
      >
        <Text
          style={[
            styles.text,
            isOptionSelected("Children")
              ? styles.selectedText
              : styles.unselectedText,
          ]}
        >
          Con trẻ
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: "7.5%",
  },
  option: {
    width: "40%",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  selected: {
    backgroundColor: "#FF2D55",
  },
  unselected: {
    backgroundColor: "#FFFFFF",
    borderWidth: 0,
    borderColor: "#FF2D55",
  },
  selectedText: {
    color: "#FFFFFF",
    textAlign: "center",
  },
  unselectedText: {
    color: "#FF2D55",
    textAlign: "center",
  },
  leftOption: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  rightOption: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  text: {
    fontSize: 16,
  },
});

export default OptionSelector;
