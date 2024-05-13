import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export type ExamAttempt = {
  id: number;
  title: string;
  result: string;
  correctAnswers: number;
  totalQuestions: number;
  timeTaken: string;
  attempIndex?: any;
};

type ExamAttemptCardProps = {
  attempt: ExamAttempt;
  onPressCard?: () => void;
  onEnglish?: any;
};

const ExamAttemptCard: React.FC<ExamAttemptCardProps> = ({
  attempt,
  onPressCard,
  onEnglish,
}) => {
  const { title, result, correctAnswers, totalQuestions, timeTaken } = attempt;

  const cardStyle =
    result === "pass"
      ? styles.passCard
      : result === "grading"
      ? styles.gradingCard
      : styles.failCard;
  return (
    <TouchableOpacity style={[styles.card, cardStyle]} onPress={onPressCard}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>
          {onEnglish ? "Result" : "Kết quả"}
        </Text>
        <Text
          style={[
            styles.result,
            result === "pass"
              ? styles.passResult
              : result === "grading"
              ? styles.gradingResult
              : styles.failResult,
          ]}
        >
          {result === "pass"
            ? onEnglish ? "Passed" :"Đạt"
            : result === "grading"
            ? onEnglish ? "Grading" : "Đang chấm"
            : onEnglish ? "Failed" : "Chưa đạt"}
        </Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>{onEnglish ? "Correct answers" : "Số câu đúng"}</Text>
        <Text style={styles.detailValue}>
          {correctAnswers}/{totalQuestions}
        </Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>{onEnglish ? "Time" : "Thời gian làm bài"}</Text>
        <Text style={styles.detailValue}>{timeTaken}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 25,
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#F9F9F9",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4F4F4F",
  },
  result: {
    fontSize: 16,
    fontWeight: "bold",
  },
  passResult: {
    color: "#28A164",
  },
  failResult: {
    color: "#dd5353",
  },
  gradingResult: {
    color: "#1b2c33",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e7dfdf",
    paddingBottom: 8,
  },
  detailLabel: {
    fontSize: 16,
    color: "#4F4F4F",
  },
  detailValue: {
    fontSize: 16,
    color: "#4F4F4F",
  },
  passCard: {
    backgroundColor: "#DFF0D8",
    borderColor: "#CDE7C7",
  },
  failCard: {
    backgroundColor: "#FDE8E8",
    borderColor: "#FBCDCD",
  },
  gradingCard: {
    backgroundColor: "#c9e8f4",
    borderColor: "#ffffff",
  },
});

export default ExamAttemptCard;
