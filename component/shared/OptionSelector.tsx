import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";

type OptionType = "parent" | "children";

type OptionSelectorProps = {
  onOptionChange?: (option: OptionType) => void;
  onEnglish?: any
};

const OptionSelector = ({ onOptionChange, onEnglish }: OptionSelectorProps) => {
  const [selectedOption, setSelectedOption] = useState<OptionType>("parent");

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
          isOptionSelected("parent") ? styles.selected : styles.unselected,
          styles.leftOption,
        ]}
        onPress={() => selectOption("parent")}
      >
        <Text
          style={[
            styles.text,
            isOptionSelected("parent")
              ? styles.selectedText
              : styles.unselectedText,
          ]}
        >
          {onEnglish ? "Parent" : "Phụ huynh"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.option,
          isOptionSelected("children") ? styles.selected : styles.unselected,
          styles.rightOption,
        ]}
        onPress={() => selectOption("children")}
      >
        <Text
          style={[
            styles.text,
            isOptionSelected("children")
              ? styles.selectedText
              : styles.unselectedText,
          ]}
        >
          {onEnglish ? "Children" :"Con trẻ"}
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
