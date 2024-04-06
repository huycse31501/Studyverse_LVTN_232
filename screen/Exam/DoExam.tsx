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

export type Question = {
  id: number;
  type: "multiple-choice" | "text";
  question: string;
  options?: string[];
  userAnswer?: string;
  correctAnswer?: string;
  isParentView?: boolean;
  label?: string[];
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

export const mockQuestionsResult: Question[] = [
  {
    id: 1,
    type: "multiple-choice",
    question: "What is the capital of France?",
    options: ["New York", "London", "Paris", "Tokyo"],
    userAnswer: "London",
    correctAnswer: "Paris",
  },
  {
    id: 2,
    type: "multiple-choice",
    question: "What is the capital of France?",
    options: ["New York", "London", "Paris", "Tokyo"],
    userAnswer: "Paris",
    correctAnswer: "Paris",
  },
  {
    id: 3,
    type: "text",
    question: 'Who wrote "Romeo and Juliet"?',
    userAnswer: "Me",
    correctAnswer: "true",
  },
  {
    id: 4,
    type: "text",
    question: 'Who wrote "Romeo and Juliet"?',
    userAnswer: "Me",
    correctAnswer: "false",
  },
  {
    id: 5,
    type: "text",
    question: 'Who wrote "Romeo and Juliet"?',
    userAnswer: "Me",

    isParentView: true,
  },
];

type DoExamRouteProp = RouteProp<RootStackParamList, "DoExamScreen">;

interface DoExamScreenProps {
  route: DoExamRouteProp;
  navigation: StackNavigationProp<RootStackParamList, "DoExamScreen">;
}

const DoExamScreen = ({ route, navigation }: DoExamScreenProps) => {
  let host = Constants?.expoConfig?.extra?.host;
  let port = Constants?.expoConfig?.extra?.port;
  const { userId, questions, time } = route.params;

  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState("");

  const getSecondsFromTime = (time: string) => {
    const [hours, minutes, seconds] = time.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  useEffect(() => {
    let totalTime = getSecondsFromTime(time);
    setTimeLeft(time);

    const timer = setInterval(() => {
      totalTime -= 1;
      const hours = Math.floor(totalTime / 3600);
      const mins = Math.floor((totalTime % 3600) / 60);
      const secs = totalTime % 60;
      const formattedTime = `${hours.toString().padStart(2, "0")}:${mins
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
      setTimeLeft(formattedTime);

      if (totalTime <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [time]);

  useEffect(() => {
    const progress = Object.keys(answers).length / questions.length;
  }, [answers]);
  const handleSelectOption = (questionId: number, option: string) => {
    let newAnswers = { ...answers };

    if (
      questions.find((question) => question.id === questionId)?.type ===
        "text" &&
      option.trim() === ""
    ) {
      const { [questionId]: deletedAnswer, ...rest } = newAnswers;
      newAnswers = rest;
    } else {
      if (newAnswers[questionId] === option) {
        delete newAnswers[questionId];
      } else {
        newAnswers = {
          ...newAnswers,
          [questionId]: option,
        };
      }
    }

    setAnswers(newAnswers);
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
              <Text style={styles.timeCounter}>{timeLeft}</Text>
              <TouchableOpacity
                key={index}
                style={styles.submitButton}
                onPress={() => {}}
              >
                <Text style={styles.submitText}>Nộp bài</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.textNoticeContainer}>
              <Text style={styles.noticeInput}>{item.question}</Text>
            </View>
            <View style={styles.optionsContainer}>
              {item.options!.map((option, index) => {
                const isSelected = answers[item.id] === option;
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.optionWrapper,
                      isSelected && styles.selectedOption,
                    ]}
                    onPress={() => handleSelectOption(item.id, option)}
                  >
                    <Text style={styles.optionText}>{option}</Text>
                  </TouchableOpacity>
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
              <Text style={styles.timeCounter}>{timeLeft}</Text>
              <TouchableOpacity
                key={index}
                style={styles.submitButton}
                onPress={() => {}}
              >
                <Text style={styles.submitText}>Nộp bài</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.textNoticeContainer}>
              <Text style={styles.noticeInput}>{item.question}</Text>
            </View>
            <Text style={styles.answerTitleTextStyle}>Trả lời</Text>

            <View style={styles.textNoticeContainer}>
              <TextInput
                value={answers[item.id] || ""}
                onChangeText={(text) => handleSelectOption(item.id, text)}
                style={styles.noticeInput}
              />
            </View>
          </View>
        );
    }
  };

  const progress = Object.keys(answers).length / questions.length;
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
          data={questions}
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
    marginLeft: 5,
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
    marginTop: 60,
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
    marginLeft: 120,
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
});

export default DoExamScreen;
