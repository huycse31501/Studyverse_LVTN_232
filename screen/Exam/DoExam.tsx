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
  Alert,
  Modal,
} from "react-native";
import {
  FlatList,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import ProgressBar from "../../component/shared/ProgressBar";
import { RootStackParamList } from "../../component/navigator/appNavigator";
import { RouteProp, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Constants from "expo-constants";
import ApplyButton from "../../component/shared/ApplyButton";
import { formatTimeToHHMMSS } from "../../utils/formatTimeFromSecondToHHMMSS";
import { convertTimeToSeconds } from "../../utils/convertTimeToSecond";
import { Ionicons } from "@expo/vector-icons";

export type Option = {
  content: string;
  id: string;
};
export type Question = {
  id: number;
  type: "multiple-choice" | "text";
  question: string;
  options?: Option[];
  userAnswer?: string;
  correctAnswer?: string;
  isParentView?: boolean;
  label?: string[];
  answerId?: number;
  image?: any;
};

export type Choice = {
  id: number;
  choiceId?: number | null;
  answer?: string | null;
};

const getSecondsFromTime = (time: string) => {
  const [hours, minutes, seconds] = time.split(":").map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

type DoExamRouteProp = RouteProp<RootStackParamList, "DoExamScreen">;

interface DoExamScreenProps {
  route: DoExamRouteProp;
  navigation: StackNavigationProp<RootStackParamList, "DoExamScreen">;
}

const DoExamScreen = ({ route, navigation }: DoExamScreenProps) => {
  let host = Constants?.expoConfig?.extra?.host;
  let port = Constants?.expoConfig?.extra?.port;
  const {
    userId,
    questions,
    time,
    examId,
    childrenId,
    examInfo,
    payloadToNavigateBackToExamResultScreen,
    routeBefore,
  } = route.params;
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState("");
  // console.log(userId)
  // console.log(questions, time)
  const totalExamTimeInSeconds = useRef(getSecondsFromTime(time));
  const [timeLeftInSeconds, setTimeLeftInSeconds] = useState(
    totalExamTimeInSeconds.current
  );
  const [currentChoice, setCurrentChoice] = useState<Choice[]>(
    questions.map((question) => {
      return {
        id: question.id,
        choiceId: question.type === "multiple-choice" ? -1 : null,
        answer: null,
      };
    })
  );
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUri, setImageUri] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeftInSeconds((prevTimeLeftInSeconds) => {
        const updatedTimeLeftInSeconds = prevTimeLeftInSeconds - 1;
        if (updatedTimeLeftInSeconds <= 0) {
          clearInterval(timer);
        }
        return updatedTimeLeftInSeconds;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const elapsedTime = totalExamTimeInSeconds.current - timeLeftInSeconds;
  const elapsedHours = Math.floor(elapsedTime / 3600);
  const elapsedMinutes = Math.floor((elapsedTime % 3600) / 60);
  const elapsedSeconds = elapsedTime % 60;
  const formattedElapsedTime = `${elapsedHours
    .toString()
    .padStart(2, "0")}:${elapsedMinutes
    .toString()
    .padStart(2, "0")}:${elapsedSeconds.toString().padStart(2, "0")}`;

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
        handleSubmitTest();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [time]);

  useFocusEffect(
    React.useCallback(() => {
      setCurrentChoice(
        questions.map((question) => ({
          id: question.id,
          choiceId: question.type === "multiple-choice" ? -1 : null,
          answer: null,
        }))
      );
      flatListRef.current?.scrollToIndex({ animated: false, index: 0 });
    }, [questions])
  );

  const handleSelectOption = (
    questionId: number,
    optionContent: string,
    optionId?: string
  ) => {
    let newCurrentChoice = [...currentChoice];

    const question = questions.find((q) => q.id === questionId);
    if (!question) return;

    const choiceIndex = newCurrentChoice.findIndex(
      (choice) => choice.id === questionId
    );

    if (choiceIndex !== -1) {
      if (question.type === "text") {
        newCurrentChoice[choiceIndex] = {
          ...newCurrentChoice[choiceIndex],
          answer: optionContent.trim() === "" ? null : optionContent,
        };
      } else if (question.type === "multiple-choice") {
        const selectedOptionId = question.options?.find(
          (option) => option.content === optionContent
        )?.id;

        newCurrentChoice[choiceIndex] = {
          ...newCurrentChoice[choiceIndex],
          choiceId:
            newCurrentChoice[choiceIndex].choiceId === Number(selectedOptionId)
              ? -1
              : Number(selectedOptionId),
        };
      }
    }

    setCurrentChoice(newCurrentChoice);
  };
  const handleTextChange = (questionId: number, text: string) => {
    setCurrentChoice((currentChoice) =>
      currentChoice.map((choice) =>
        choice.id === questionId ? { ...choice, answer: text } : choice
      )
    );
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

  const handleSubmitTest = async () => {
    let requestSubmitTestURL = `https://${host}/test/submit`;

    try {
      const response = await fetch(requestSubmitTestURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate: new Date(),
          endDate: new Date(),
          testId: examId,
          childrenId: childrenId,
          time: convertTimeToSeconds(formattedElapsedTime),
          questions: currentChoice,
        }),
      });
      console.log(
        JSON.stringify({
          startDate: new Date(),
          endDate: new Date(),
          testId: examId,
          childrenId: childrenId,
          time: convertTimeToSeconds(formattedElapsedTime),
          questions: currentChoice,
        })
      );
      const data = await response.json();
      if (data.msg == "1") {
        navigation.navigate("ExamResultScreen", {
          userId: Number(userId),
          timeTaken: formattedElapsedTime,
          currentChoice: currentChoice,
          questions: questions,
          time: time,
          examId: examId,
          childrenId: childrenId,
          examInfo: examInfo,
        });
        // navigation.navigate("ExamInfoScreen", {
        //   userId: Number(userId),
        // });
      } else {
        Alert.alert("Thất bại", "Nộp bài thất bại");
      }
    } catch (e) {
      Alert.alert(`Nộp bài thất bại - API Failed`);
    }
  };
  // console.log(currentChoice)
  const renderItem = ({ item, index }: { item: Question; index: number }) => {
    const progressText = `${index + 1}/${questions.length}`;
    const questionChoice = currentChoice.find(
      (choice) => choice.id === item.id
    );
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
                onPress={handleSubmitTest}
              >
                <Text style={styles.submitText}>Nộp bài</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.imageContainer}>
              <Text style={styles.answerTitleTextStyle}>Ảnh minh họa: </Text>
              <TouchableOpacity
                onPress={() => {
                  setImageUri(item.image);
                  setShowImageModal(true);
                }}
              >
                <Ionicons
                  name={"images"}
                  style={{ color: "#0e0e11", marginLeft: 10, marginTop: 7 }}
                  size={26}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.textNoticeContainer}>
              <Text style={styles.noticeInput}>{item.question}</Text>
            </View>
            <View style={styles.optionsContainer}>
              {item.options!.map((option, index) => {
                return (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.optionWrapper,
                      questionChoice?.choiceId === Number(option.id) &&
                        styles.selectedOption,
                    ]}
                    onPress={() =>
                      handleSelectOption(item.id, option.content, option.id)
                    }
                  >
                    <Text style={styles.optionText}>{option.content}</Text>
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
                onPress={handleSubmitTest}
              >
                <Text style={styles.submitText}>Nộp bài</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.imageContainer}>
              <Text style={styles.answerTitleTextStyle}>Ảnh minh họa: </Text>
              <TouchableOpacity
                onPress={() => {
                  setImageUri(item.image);
                  setShowImageModal(true);
                }}
              >
                <Ionicons
                  name={"images"}
                  style={{ color: "#0e0e11", marginLeft: 10, marginTop: 7 }}
                  size={26}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.textNoticeContainer}>
              <Text style={styles.noticeInput}>{item.question}</Text>
            </View>
            <Text style={styles.answerTitleTextStyle}>Trả lời</Text>

            <View style={styles.textNoticeContainer}>
              <TextInput
                value={questionChoice?.answer || ""}
                onChangeText={(text) => handleTextChange(item.id, text)}
                style={styles.noticeInput}
                placeholder="Điền câu trả lời tại đây"
                multiline={true}
                keyboardType="ascii-capable"
              />
            </View>
          </View>
        );
    }
  };

  const progress =
    currentChoice.reduce((acc, choice) => {
      const answer = choice.answer ?? "";
      if (
        (choice.choiceId !== undefined &&
          choice.choiceId !== -1 &&
          choice.choiceId !== null) ||
        answer.trim() !== ""
      ) {
        return acc + 1;
      } else {
        return acc;
      }
    }, 0) / questions.length;
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (routeBefore === "ExamResultScreen") {
              navigation.navigate("ExamResultScreen", {
                userId: payloadToNavigateBackToExamResultScreen.userId,
                timeTaken: payloadToNavigateBackToExamResultScreen.timeTaken,
                currentChoice:
                  payloadToNavigateBackToExamResultScreen.currentChoice,
                questions: payloadToNavigateBackToExamResultScreen.questions,
                time: payloadToNavigateBackToExamResultScreen.time,
                examId: payloadToNavigateBackToExamResultScreen.examId,
                childrenId: payloadToNavigateBackToExamResultScreen.childrenId,
                examInfo: payloadToNavigateBackToExamResultScreen.examInfo,
              });
              return;
            }
            navigation.navigate("ExamHistoryScreen", {
              examInfo: examInfo,
              userId: Number(userId),
              payLoadToDoExam: {
                userId: userId,
                questions: questions,
                time: time,
                examId: examInfo.testId,
                childrenId: childrenId,
              },
            });
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
          keyboardShouldPersistTaps="handled"
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={showImageModal}
        onRequestClose={() => setShowImageModal(false)}
        statusBarTranslucent
      >
        <TouchableWithoutFeedback
          onPress={() => {
            setShowImageModal(false);
          }}
        >
          <View style={styles.centeredImageModalView}>
            <TouchableWithoutFeedback>
              <View style={styles.imageModalView}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => {
                    setShowImageModal(false);
                  }}
                >
                  <Image
                    source={require("../../assets/images/shared/closedModal.png")}
                    style={styles.closeIcon}
                  />
                </TouchableOpacity>
                <Image
                  source={{ uri: imageUri }}
                  style={styles.imageStyle}
                  resizeMode="contain"
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
    zIndex: 3,
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
  imageContainer: {
    marginTop: 15,
    flexDirection: "row",
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
    borderRadius: 10,
    padding: 15,
    width: 330,
    height: 150,
    marginTop: 10,
    alignSelf: "center",
    marginBottom: 20,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  noticeInput: {
    fontSize: 18,
    fontWeight: "500",
    color: "#413636",
    marginTop: 10,
    alignSelf: "center",
    width: "100%",
    height: "100%",
    textAlignVertical: "top",
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
    marginTop: 40,
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
  centeredImageModalView: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.25)",
  },
  imageModalView: {
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: 300,
    height: 250,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 15,
    right: 15,
    zIndex: 1,
  },
  closeIcon: {
    width: 30,
    height: 30,
  },
  imageStyle: {
    width: "80%",
    height: "80%",
    alignSelf: "center",
    marginTop: 20,
  },
});

export default DoExamScreen;
