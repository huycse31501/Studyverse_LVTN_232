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

export interface ExamToLinkMilestoneProps {
  name: string;
  examId: number;
}

export interface ExamToLinkMilestoneListProps {
  ExamToLinkMilestones: ExamToLinkMilestoneProps[];
  height?: number;
  onExamToLinkMilestoneItemPress: (examId: number) => void;
  selectedExamId: number | null;
}

const ExamToLinkMilestoneList: React.FC<ExamToLinkMilestoneListProps> = ({
  ExamToLinkMilestones,
  height,
  onExamToLinkMilestoneItemPress,
  selectedExamId,
}) => {
  return (
    <ScrollView style={[height ? { height: height } : {}]}>
      {ExamToLinkMilestones.map((item, index) => (
        <TouchableOpacity
          style={[
            styles.container,
            {
              backgroundColor:
                item.examId === selectedExamId ? "#ccedb8" : "#fff",
            },
          ]}
          key={index}
          onPress={() => onExamToLinkMilestoneItemPress(item.examId)}
        >
          <View style={styles.textContainer}>
            <Text style={styles.name}>{item.name}</Text>
            <View style={styles.timeContainer}>
              <Image
                source={require("../../assets/images/shared/eventTimeCircle.png")}
                style={styles.timeCircleIcon}
              />
              <Text style={styles.time}>{"-----"}</Text>
            </View>
          </View>
          <View style={styles.gradingContainer}>
            <Text style={styles.gradingText}>{"-----"}</Text>
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
    marginBottom: 10,
    borderRadius: 16,
    shadowColor: "rgba(0,0,0,25)",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
    marginTop: 15,
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
    marginTop: 1,
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

export default ExamToLinkMilestoneList;
