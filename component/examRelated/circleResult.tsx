import React from "react";
import { Text, View, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";

type CircularProgressProps = {
  size: number;
  strokeWidth: number;
  percentage: number;
  backgroundColor: string;
  progressColor: string;
};

const CircularProgress: React.FC<CircularProgressProps> = ({
  size,
  strokeWidth,
  percentage,
  backgroundColor,
  progressColor,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <View style={styles.container}>
      <Svg height={size} width={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle
          stroke={backgroundColor}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <Circle
          stroke={progressColor}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference.toString()}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.textView}>
        <Text style={styles.text}>{`${percentage}%`}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  textView: {
    position: "absolute",
  },
  text: {
    fontSize: 27.5,
    fontWeight: "bold",
  },
});

export default CircularProgress;
