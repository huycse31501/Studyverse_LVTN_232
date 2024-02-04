import React from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
} from "react-native";

interface TouchableTextComponentProps {
  text: string;
  onPress?: () => void;
}

const TouchableTextComponent = ({
  text,
  onPress,
}: TouchableTextComponentProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.text}>{text}</Text>
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
  button: {
    backgroundColor: "transparent",
  },
  text: {
    color: "#FF2D55",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default TouchableTextComponent;
