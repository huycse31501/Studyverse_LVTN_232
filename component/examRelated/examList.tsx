import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Tag from "../shared/Tags";

export type ExamStatus = "completed" | "grading" | "failed" | "pending";

export interface ExamProps {
  ExamId?: string;
  name: string;
  status: ExamStatus;
  dateStart: string;
  timeStart: string | undefined;
  tags: string[];
  result: string | undefined;
  endDate?: string;
  questions?: any;
  testId?: any;
  time?: any;
  submmissions?: any;
  questionCountToPass?: any;
}

export interface ExamListProps {
  Exams: ExamProps[];
  height?: number;
  onExamItemPress?: (item: ExamProps) => void;
  pickedDate?: Date;
}

const isSameDay = (date1: Date, date2: Date) => {
  return date1.toISOString().slice(0, 10) === date2.toISOString().slice(0, 10);
};

const ExamList: React.FC<ExamListProps> = ({
  Exams,
  height,
  onExamItemPress,
  pickedDate,
}) => {
  const getIconName = (status: ExamStatus) => {
    switch (status) {
      case "completed":
        return "checkmark-circle";
      case "grading":
        return "time";
      case "failed":
        return "close-circle";
      default:
        return "remove-circle-outline";
    }
  };
  const getBackGroundColor = (status: ExamStatus) => {
    switch (status) {
      case "completed":
        return "#ccedb8";
      case "failed":
        return "#f87d7d";
      case "grading":
        return "#c9e8f4";
      default:
        return "#ffffff";
    }
  };

  const renderTags = (tags: string[]) => {
    const tagsToShow = tags.length > 2 ? tags.slice(0, 2) : tags;
    const additionalTagsCount = tags.length > 2 ? `+${tags.length - 2}` : null;

    return (
      <View style={styles.tagContainer}>
        {tagsToShow.map((tag, index) => (
          <Tag key={index} name={tag} />
        ))}
        {additionalTagsCount && (
          <Text style={styles.additionalTagsText}>{additionalTagsCount}</Text>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={[height ? { height: height } : {}]}>
      {Exams.map((item, index) => (
        <TouchableOpacity
          style={[
            styles.container,
            { backgroundColor: getBackGroundColor(item.status) },
          ]}
          key={index}
          onPress={() => onExamItemPress?.(item)}
        >
          <View style={styles.textContainer}>
            <Text style={styles.name}>{item.name}</Text>
            <View style={styles.timeContainer}>
              <Image
                source={require("../../assets/images/shared/eventTimeCircle.png")}
                style={styles.timeCircleIcon}
              />
              <Text style={styles.time}>{item.timeStart ?? "-----"}</Text>
              <View style={styles.tagContainer}>{renderTags(item.tags)}</View>
            </View>
          </View>
          <View style={styles.gradingContainer}>
            <Ionicons
              name={getIconName(item.status)}
              style={{ color: "#0e0e11"}}
              size={24}
            />
            <Text style={styles.gradingText}>{item.result ?? "-----"}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 5,
    borderRadius: 16,
    shadowColor: "rgba(0,0,0,25)",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
    marginVertical: 25,
    marginHorizontal: 30,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
    flexDirection: "column",
    marginVertical: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000000",
    paddingBottom: 5,
  },
  timeContainer: {
    flexDirection: "row",
  },
  time: {
    fontSize: 15,
    color: "#000000",
    fontWeight: "400",
  },
  calendarIcon: {
    width: 60,
    height: 60,
  },
  timeCircleIcon: {
    width: 15,
    height: 15,
    marginRight: 8,
    marginTop: 2,
  },
  gradingContainer: {
    flexDirection: "row",
    marginBottom: 30,
  },
  gradingText: {
    fontSize: 14.5,
    fontWeight: "500",
    marginLeft: 10,
    marginRight: 5,
    width: 40,
  },
  tagContainer: {
    flexDirection: "row",
    marginHorizontal: 5,
    position: "absolute",
    left: 45,
    bottom: -5,
  },
  additionalTagsText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000000",
    position: "absolute",
    right: -25,
    bottom: 5,
  },
});

export default ExamList;
