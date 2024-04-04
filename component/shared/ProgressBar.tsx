import React from "react";
import { View, StyleSheet } from "react-native";

type ProgressBarProps = {
  progress: number;
  width: number;
};

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, width }) => {
  const filledWidth = progress * width;

  return (
    <View style={[styles.container, { width }]}>
      <View style={[styles.filled, { width: filledWidth }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 20,
    backgroundColor: "#f3da8e",
    borderRadius: 10,
    overflow: "hidden",
  },
  filled: {
    height: "100%",
    backgroundColor: "#FFC107",
    borderRadius: 10,
  },
});

export default ProgressBar;
