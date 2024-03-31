import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { RootStackParamList } from "../../component/navigator/appNavigator";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Svg, Circle, Path } from "react-native-svg";
import CircularProgress from "../../component/examRelated/circleResult";
import WideButton from "../../component/shared/WideButton";

const isPass = (correctAnswers: number, totalQuestions: number) => {
  return correctAnswers >= totalQuestions / 2;
};

type ExamResultRouteProp = RouteProp<RootStackParamList, "ExamResultScreen">;

interface ExamResultScreenProps {
  route: ExamResultRouteProp;
  navigation: StackNavigationProp<RootStackParamList, "ExamResultScreen">;
}

const ExamResultScreen = ({ route, navigation }: ExamResultScreenProps) => {
  const { userId, correctAnswers, totalQuestions, timeTaken } = route.params;
  const pass = isPass(correctAnswers, totalQuestions);
  const percentage = (correctAnswers / totalQuestions) * 100;
  const color = pass ? "#9cef76" : "#f3716b";
  const textColor = pass ? "white" : "black";
  const dynamicStyles = getDynamicStyles(pass);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Svg
          height="200"
          width="100%"
          viewBox="0 0 375 200"
          style={styles.svgCurve}
        >
          <Path d="M-10,-10 L-10,130 L750,0 " fill={color} />
        </Svg>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            navigation.navigate("ExamInfoScreen", {
              userId: Number(userId),
              routeBefore: "StatusDashboard",
              fromFooter: "1",
            });
          }}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.resultText}>Hoàn thành</Text>
      <View style={styles.circleResultContainer}>
        <CircularProgress
          size={200}
          strokeWidth={32.5}
          percentage={percentage}
          backgroundColor="#e6e6e6"
          progressColor={color}
        />
      </View>
      <Text style={styles.testResult}>
        {percentage >= 50 ? "Đạt" : "Chưa đạt"}
      </Text>
      <View style={styles.detailsContainer}>
        <View style={styles.scoreContainer}>
          <Text
            style={styles.resultDetailText}
          >{`${correctAnswers}/${totalQuestions}`}</Text>
          <Text style={styles.resultDetailTextName}>Kết quả</Text>
        </View>
        <View style={styles.scoreContainer}>
          <Text style={styles.resultDetailText}>{`${timeTaken}`}</Text>
          <Text style={styles.resultDetailTextName}>Thời gian</Text>
        </View>
      </View>
      <View style={styles.buttonGroup}>
        <WideButton
          backgroundColor="#FEDB86"
          title="Màn hình chính"
          onPress={() => {}}
        />
      </View>
      <View style={styles.buttonGroup}>
        <WideButton
          backgroundColor="#DCEED2"
          title="Xem chi tiết bài làm"
          onPress={() => {}}
        />
      </View>
      <View style={styles.buttonGroup}>
        <WideButton
          backgroundColor="#41ABF7"
          textColor="#f5f0f0"
          title="Làm lại"
          onPress={() => {}}
        />
      </View>
    </View>
  );
};

const getDynamicStyles = (pass: boolean) =>
  StyleSheet.create({
    backgroundColor: {
      backgroundColor: pass ? "#9cef76" : "#f3716b",
    },
    textColor: {
      color: pass ? "white" : "black",
    },
  });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  backButtonContainer: {
    flexDirection: "row",
    backgroundColor: "#9cef76",
    height: 150,
  },
  headerContainer: {
    position: "absolute",
    top: 0,
    width: "100%",
  },
  svgCurve: {
    position: "absolute",
    width: "100%",
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 30,
    zIndex: 10,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#383A44",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 60,
    marginBottom: 16,
    marginTop: -5,
  },
  resultText: {
    alignSelf: "center",
    marginTop: 150,
    color: "#383A44",
    fontSize: 25,
    fontWeight: "500",
  },
  circleResultContainer: {
    marginTop: 30,
  },
  testResult: {
    alignSelf: "center",
    fontSize: 27.5,
    color: "#21205A",
    fontWeight: "600",
    marginTop: 20,
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  scoreContainer: {
    marginTop: 20,
    marginHorizontal: 70,
  },
  resultDetailText: {
    color: "#383A44",
    fontSize: 20,
    fontWeight: "800",
    alignSelf: "center",
    paddingVertical: 5,
  },
  resultDetailTextName: {
    color: "#383A44",
    fontSize: 18,
    fontWeight: "500",
    alignSelf: "center",
  },
  buttonGroup: {
    marginTop: 30,
    paddingHorizontal: 50,
  },
});
export default ExamResultScreen;
