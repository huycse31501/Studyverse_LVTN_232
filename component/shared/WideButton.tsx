import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";

type WideButtonProps = {
  title: string;
  onPress: () => void;
  backgroundColor?: string;
  textColor?: string;
};

const WideButton: React.FC<WideButtonProps> = ({
  title,
  onPress,
  backgroundColor = "#FFD580",
  textColor = "#000",
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
};

interface Styles {
  button: ViewStyle;
  text: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default WideButton;
