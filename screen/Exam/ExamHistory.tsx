import React from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
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

const examAttempts: ExamAttempt[] = [
  {
    id: 1,
    title: "Lần làm bài 1",
    result: "Đạt",
    correctAnswers: 30,
    totalQuestions: 30,
    timeTaken: "12:03",
  },
  {
    id: 2,
    title: "Lần làm bài 2",
    result: "Chưa Đạt",
    correctAnswers: 5,
    totalQuestions: 30,
    timeTaken: "27:03",
  },
  {
    id: 3,
    title: "Lần làm bài 3",
    result: "Đạt",
    correctAnswers: 30,
    totalQuestions: 30,
    timeTaken: "27:03",
  },
  {
    id: 4,
    title: "Lần làm bài 4",
    result: "Đạt",
    correctAnswers: 28,
    totalQuestions: 30,
    timeTaken: "15:47",
  },
  {
    id: 5,
    title: "Lần làm bài 5",
    result: "Chưa Đạt",
    correctAnswers: 18,
    totalQuestions: 30,
    timeTaken: "30:00",
  },
];

type ExamHistoryRouteProp = RouteProp<RootStackParamList, "ExamHistoryScreen">;

interface ExamHistoryScreenProps {
  route: ExamHistoryRouteProp;
  navigation: StackNavigationProp<RootStackParamList, "ExamHistoryScreen">;
}

const ExamHistoryScreen = ({ route, navigation }: ExamHistoryScreenProps) => {
  let host = Constants?.expoConfig?.extra?.host;
  let port = Constants?.expoConfig?.extra?.port;
  const { userId, routeBefore, fromFooter } = route.params;

  const user = useSelector((state: RootState) => state.user.user);


  const insets = useSafeAreaInsets();

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
            {examAttempts.map((attempt) => (
              <ExamAttemptCard key={attempt.id} attempt={attempt} />
            ))}
          </ScrollView>
        </KeyboardAwareScrollView>
      </KeyboardAvoidingView>
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
});

export default ExamHistoryScreen;
