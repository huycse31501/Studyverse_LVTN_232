import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Image,
  Touchable,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import ProgressBar from "../../component/shared/ProgressBar";
import { RootStackParamList } from "../../component/navigator/appNavigator";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Constants from "expo-constants";
import ApplyButton from "../../component/shared/ApplyButton";
import WideButton from "../../component/shared/WideButton";

export type Question = {
  id: number;
  type: "multiple-choice" | "text";
  question: string;
  options?: string[];
  userAnswer?: string;
  correctAnswer?: string;
  isParentView?: boolean;
};

export const mockQuestions: Question[] = [
  {
    id: 1,
    type: "multiple-choice",
    question: "What is the capital of France?",
    options: ["New York", "London", "Paris", "Tokyo"],
  },
  {
    id: 2,
    type: "text",
    question: 'Who wrote "Romeo and Juliet"?',
  },
];

type DetailExamResultRouteProp = RouteProp<
  RootStackParamList,
  "DetailExamResultScreen"
>;

interface DetailExamResultScreenProps {
  route: DetailExamResultRouteProp;
  navigation: StackNavigationProp<RootStackParamList, "DetailExamResultScreen">;
}

const DetailExamResultScreen = ({
  route,
  navigation,
}: DetailExamResultScreenProps) => {
  let host = Constants?.expoConfig?.extra?.host;
  let port = Constants?.expoConfig?.extra?.port;
  const { userId, questions, timeFinish } = route.params;
  const [gradedQuestions, setGradedQuestions] = useState<Question[]>(questions);
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleGradeOption = (questionId: number, isCorrect: boolean) => {
    const updatedQuestions = gradedQuestions.map((q) => {
      if (q.id === questionId) {
        const correctAnswerValue = isCorrect ? "true" : "false";
        const newCorrectAnswer =
          q.correctAnswer === correctAnswerValue ? "" : correctAnswerValue;
        return { ...q, correctAnswer: newCorrectAnswer };
      }
      return q;
    });
    setGradedQuestions(updatedQuestions);
  };

  const goToNextQuestion = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < questions.length) {
      flatListRef.current?.scrollToIndex({ index: nextIndex });
      setCurrentIndex(nextIndex);
    }
  };

  const goToPreviousQuestion = () => {
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      flatListRef.current?.scrollToIndex({ index: prevIndex });
      setCurrentIndex(prevIndex);
    }
  };

  const renderItem = ({ item, index }: { item: Question; index: number }) => {
    const userAnswer = item.userAnswer;
    const correctAnswer = item.correctAnswer;
    const isAnswered = userAnswer !== undefined;
    const progressText = `${index + 1}/${questions.length}`;

    switch (item.type) {
      case "multiple-choice":
        return (
          <View style={[styles.questionContainer]}>
            <Text style={styles.headerText}>Câu hỏi</Text>
            <View style={styles.progessBarContainer}>
              <ProgressBar progress={progress} width={300} />
              <Text style={styles.progressTextStyle}>{progressText}</Text>
            </View>
            <View style={styles.timeContainer}>
              <Image
                source={require("../../assets/images/shared/clockIcon.png")}
                style={styles.timeIcon}
              />
              <Text style={styles.timeCounter}>{timeFinish}</Text>
              {item.isParentView && (
                <TouchableOpacity
                  key={index}
                  style={styles.submitButton}
                  onPress={() => {}}
                >
                  <Text style={styles.submitText}>Hoàn thành</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.textNoticeContainer}>
              <Text style={styles.noticeInput}>{item.question}</Text>
            </View>
            <View style={styles.optionsContainer}>
              {item.options!.map((option, index) => {
                const isUserAnswer = userAnswer === option;
                const isCorrectAnswer = correctAnswer === option;
                let backgroundColor = "#FFFFFF";
                if (isAnswered) {
                  if (isUserAnswer && isUserAnswer !== isCorrectAnswer) {
                    backgroundColor = "#FDE4E4";
                  } else if (isCorrectAnswer) {
                    backgroundColor = "#DDF0E6";
                  }
                }
                return (
                  <View
                    key={index}
                    style={[
                      styles.optionWrapper,
                      { backgroundColor: backgroundColor },
                    ]}
                  >
                    <Text style={styles.optionText}>{option}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        );
      case "text":
        return (
          <View style={[styles.questionContainer]}>
            <Text style={styles.headerText}>Câu hỏi</Text>
            <View style={styles.progessBarContainer}>
              <ProgressBar progress={progress} width={300} />
              <Text style={styles.progressTextStyle}>{progressText}</Text>
            </View>
            <View style={styles.timeContainer}>
              <Image
                source={require("../../assets/images/shared/clockIcon.png")}
                style={styles.timeIcon}
              />
              <Text style={styles.timeCounter}>{timeFinish}</Text>
              {item.isParentView && (
                <TouchableOpacity
                  key={index}
                  style={styles.submitButton}
                  onPress={() => {}}
                >
                  <Text style={styles.submitText}>Hoàn thành</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.textNoticeContainer}>
              <Text style={styles.noticeInput}>{item.question}</Text>
            </View>
            <Text style={styles.answerTitleTextStyle}>Trả lời</Text>

            <View style={styles.textNoticeContainer}>
              <Text style={styles.noticeInput}>{userAnswer || " "}</Text>
            </View>
            {correctAnswer && !item.isParentView && (
              <View
                style={[
                  styles.notificationContainer,
                  correctAnswer === "false" && { backgroundColor: "#FDE4E4" },
                ]}
              >
                <Text style={styles.notificationText}>
                  {`Câu trả lời ${
                    correctAnswer === "false" ? "không " : ""
                  }chính xác`}
                </Text>
              </View>
            )}
            {item.isParentView && (
              <View style={styles.gradingContainer}>
                <TouchableOpacity
                  style={[
                    styles.gradingOptionWrapper,
                    item.correctAnswer === "true" && {
                      backgroundColor: "#DDF0E6",
                    },
                  ]}
                  onPress={() => handleGradeOption(item.id, true)}
                >
                  <Text style={styles.optionText}>Đúng</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.gradingOptionWrapper,
                    item.correctAnswer === "false" && {
                      backgroundColor: "#FDE4E4",
                    },
                  ]}
                  onPress={() => handleGradeOption(item.id, false)}
                >
                  <Text style={styles.optionText}>Sai</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        );
    }
  };

  const answeredQuestionsCount = questions.filter(
    (q) => q.userAnswer !== undefined
  ).length;
  const progress = answeredQuestionsCount / questions.length;

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            console.log("pressed");
          }}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        <FlatList
          data={gradedQuestions}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          ref={flatListRef}
        />
      </View>
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={[styles.navButton, styles.prevButton]}
          onPress={goToPreviousQuestion}
          disabled={currentIndex === 0}
        >
          <View style={styles.nextContainer}>
            <Text style={styles.navButtonText}>{"Trước"}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, styles.nextButton]}
          onPress={goToNextQuestion}
          disabled={currentIndex === questions.length - 1}
        >
          <View style={styles.nextContainer}>
            <Text style={styles.navButtonText}>{"Sau"}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  backButton: {
    marginTop: 60,
    marginLeft: 30,
    position: "absolute",
    zIndex: 20,
    elevation: 20,
  },
  headerContainer: {
    position: "absolute",
    top: -10,
    width: "100%",
    height: 100,
    backgroundColor: "#FDCD55",
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#383A44",
  },
  headerText: {
    fontWeight: "400",
    fontSize: 18,
  },
  progessBarContainer: {
    marginTop: 10,
    flexDirection: "row",
  },
  progressTextStyle: {
    color: "#21205A",
    fontSize: 19,
    alignSelf: "center",
    marginLeft: 15,
    marginTop: -3,
    fontWeight: "400",
  },
  timeContainer: {
    marginTop: 20,
    marginBottom: 5,
    flexDirection: "row",
  },
  timeIcon: {
    width: 32,
    height: 35,
  },
  timeCounter: {
    alignSelf: "center",
    marginLeft: 10,
    fontSize: 20,
    fontWeight: "600",
    color: "#21205A",
  },
  textNoticeContainer: {
    backgroundColor: "#e0e6f0",
    padding: 10,
    borderRadius: 10,
    width: 330,
    height: 150,
    marginTop: 30,
    alignSelf: "center",
    marginBottom: 20,
  },
  noticeInput: {
    fontSize: 18,
    fontWeight: "500",
    color: "#413636",
    marginTop: 10,
    alignSelf: "center",
  },
  listContainer: {
    marginTop: 100,
    // marginLeft: 5,
  },
  questionContainer: {
    width: Dimensions.get("window").width,
    padding: 10,
  },
  textInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 8,
  },
  answerTitleTextStyle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#21205A",
    marginLeft: 10,
    marginTop: 10,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: 30,
    marginTop: 20,
  },
  optionWrapper: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    marginVertical: 20,
    marginHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
    width: Dimensions.get("window").width / 2 - 60,
    borderRadius: 15,
    elevation: 3,
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
  },
  selectedOption: {
    backgroundColor: "#f0f3a0",
  },
  optionText: {
    fontSize: 18,
    color: "#383A44",
    fontWeight: "500",
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 30,
    paddingBottom: 20,
    marginTop: 20,
  },
  navButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  prevButton: {
    backgroundColor: "#FDCD55",
  },
  nextButton: {
    backgroundColor: "#FDCD55",
  },
  navButtonText: {
    fontSize: 18,
    color: "#383A44",
  },
  rightArrow: {
    width: 30,
    height: 30,
  },
  nextContainer: {
    flexDirection: "row",
    width: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  submitButton: {
    marginLeft: 100,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FDCD55",
  },
  submitText: {
    fontWeight: "500",
    fontSize: 17,
  },
  notificationContainer: {
    backgroundColor: "#ccffcc",
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#DDF0E6",
    alignItems: "center",
    justifyContent: "center",
    width: 330,
    marginTop: 10,
    alignSelf: "center",
  },
  notificationText: {
    color: "#3e3d4a",
    fontSize: 16,
    fontWeight: "500",
  },
  gradingContainer: {
    flexDirection: "row",
  },
  gradingOptionWrapper: {
    backgroundColor: "#FFFFFF",
    padding: 10,
    marginTop: 10,
    marginHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
    width: Dimensions.get("window").width / 2 - 45,
    borderRadius: 15,
    elevation: 3,
    marginLeft: 17.5,
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
  },
});

export default DetailExamResultScreen;
