import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import ExamAttemptCard, {
  ExamAttempt,
} from "../../component/examRelated/examAttempCard";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../component/navigator/appNavigator";
import { StackNavigationProp } from "@react-navigation/stack";
import Constants from "expo-constants";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { avatarList } from "../../utils/listOfAvatar";
import ApplyButton from "../../component/shared/ApplyButton";
import {
  CountCorrectAnswer,
  getExamStatusForHistory,
} from "../../utils/examStatus";
import { formatTimeToHHMMSS } from "../../utils/formatTimeFromSecondToHHMMSS";

// const examAttempts: ExamAttempt[] = [
//   {
//     id: 1,
//     title: "Lần làm bài 1",
//     result: "Đạt",
//     correctAnswers: 30,
//     totalQuestions: 30,
//     timeTaken: "12:03",
//   },
//   {
//     id: 2,
//     title: "Lần làm bài 2",
//     result: "Chưa Đạt",
//     correctAnswers: 5,
//     totalQuestions: 30,
//     timeTaken: "27:03",
//   },
//   {
//     id: 3,
//     title: "Lần làm bài 3",
//     result: "Đạt",
//     correctAnswers: 30,
//     totalQuestions: 30,
//     timeTaken: "27:03",
//   },
//   {
//     id: 4,
//     title: "Lần làm bài 4",
//     result: "Đạt",
//     correctAnswers: 28,
//     totalQuestions: 30,
//     timeTaken: "15:47",
//   },
//   {
//     id: 5,
//     title: "Lần làm bài 5",
//     result: "Chưa Đạt",
//     correctAnswers: 18,
//     totalQuestions: 30,
//     timeTaken: "30:00",
//   },
// ];

type ExamHistoryRouteProp = RouteProp<RootStackParamList, "ExamHistoryScreen">;

interface ExamHistoryScreenProps {
  route: ExamHistoryRouteProp;
  navigation: StackNavigationProp<RootStackParamList, "ExamHistoryScreen">;
}

const ExamHistoryScreen = ({ route, navigation }: ExamHistoryScreenProps) => {
  let host = Constants?.expoConfig?.extra?.host;
  let port = Constants?.expoConfig?.extra?.port;
  const {
    userId,
    routeBefore,
    fromFooter,
    payLoadToDoExam,
    examInfo,
    childrenId,
  } = route.params;
  const [examAttempts, setExamAttempts] = useState<ExamAttempt[]>();

  useEffect(() => {
    if (examInfo && examInfo.submissions) {
      const formattedAttempts = examInfo.submissions.map(
        (submission: any, index: any) => ({
          id: submission.id,
          title: `Lần làm bài thứ ${index + 1}`,
          result: getExamStatusForHistory(
            submission,
            examInfo.questions,
            examInfo.questionCountToPass
          ),
          correctAnswers: CountCorrectAnswer(submission, examInfo.questions),
          totalQuestions: examInfo.questions.length,
          timeTaken: formatTimeToHHMMSS(submission.time),
          attempIndex: index,
        })
      );
      setExamAttempts(formattedAttempts);
    }
  }, [examInfo]);

  const user = useSelector((state: RootState) => state.user.user);

  const insets = useSafeAreaInsets();

  const navigateToDoExam = () => {
    navigation.navigate("DoExamScreen", {
      userId: payLoadToDoExam.userId,
      questions: payLoadToDoExam.questions,
      time: payLoadToDoExam.time,
      examId: payLoadToDoExam.examId,
      childrenId: payLoadToDoExam.childrenId,
      examInfo: examInfo,
    });
  };

  const deleteExam = async () => {
    let requestDeleteTestURL = `https://${host}/test/${examInfo?.testId}`;
      try {
        const response = await fetch(requestDeleteTestURL, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },

        });
        const data = await response.json();
        if (data.msg == "1") {
          navigation.navigate("ExamInfoScreen", {
            userId: Number(userId),
            routeBefore: "CreateExamScreen",
            newExamCreated: true,
          });
        } else {
          Alert.alert("Thất bại", "Xóa kiểm tra thất bại");
        }
      } catch (e) {
        Alert.alert(`Xóa kiểm tra thất bại`);
      }
  };
  return (
    <SafeAreaView style={{ flex: 1, paddingTop: insets.top - 15 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "position" : "height"}
      >
        <KeyboardAwareScrollView
          style={{ flex: 1 }}
          resetScrollToCoords={{ x: 0, y: 0 }}
          scrollEnabled={true}
          extraHeight={120}
          extraScrollHeight={120}
          enableOnAndroid={true}
          enableAutomaticScroll={true}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.backButtonContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                navigation.navigate("ExamInfoScreen", {
                  userId: Number(user?.userId),
                  routeBefore: "StatusDashboard",
                  fromFooter: "1",
                });
              }}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            <Text style={styles.header}>Lịch sử bài làm</Text>
          </View>

          <ScrollView style={styles.container}>
            {examAttempts && examAttempts.length !== 0 ? (
              examAttempts.map((attempt) => (
                <ExamAttemptCard
                  key={attempt.id}
                  attempt={attempt}
                  onPressCard={() => {
                    navigation.navigate("DetailExamResultScreen", {
                      timeFinish: attempt.timeTaken,
                      examInfo: examInfo,
                      attempIndex: attempt.attempIndex,
                      childrenId: childrenId,
                      userId: userId,
                      payloadToDoExam: payLoadToDoExam,
                      result: attempt.result,
                    });
                  }}
                />
              ))
            ) : (
              <>
                <Text style={styles.placeHolderText}>
                  Chưa ghi nhận bài làm
                </Text>
              </>
            )}
          </ScrollView>
        </KeyboardAwareScrollView>
      </KeyboardAvoidingView>
      {user?.role === "parent" ? (
        <ApplyButton
          label="Xóa bài kiểm tra"
          extraStyle={{
            width: 200,
            height: 50,
            position: "absolute",
            bottom: 30,
          }}
          onPress={deleteExam}
        />
      ) : (
        <ApplyButton
          label="Làm bài kiểm tra"
          extraStyle={{
            width: 200,
            height: 50,
            position: "absolute",
            bottom: 60,
          }}
          onPress={navigateToDoExam}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButtonContainer: {
    flexDirection: "row",
    marginLeft: 20,
  },

  backButton: {},
  backButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FF2D58",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 60,
    marginBottom: 16,
    marginTop: -5,
  },
  placeHolderText: {
    alignSelf: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 200,
  },
});

export default ExamHistoryScreen;
