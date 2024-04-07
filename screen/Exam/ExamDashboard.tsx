import {
  RouteProp,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  SafeAreaView,
  Platform,
  Modal,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import WeekDatePicker from "../../component/shared/DateSlide";
import EventTimeline from "../../component/shared/EventTimeline";
import EventReminder from "../../component/shared/RemindEvent";
import ApplyButton from "../../component/shared/ApplyButton";
import Constants from "expo-constants";

import { avatarList } from "../../utils/listOfAvatar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { RootStackParamList } from "../../component/navigator/appNavigator";
import MemberOption from "../../component/examRelated/examMemberSlide";
import ExamList from "../../component/examRelated/examList";
import { examList } from "../../mockData/ExamData";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { mockQuestions, mockQuestionsResult } from "./DoExam";
import { isEqual } from "lodash";

type ExamInfoRouteProp = RouteProp<RootStackParamList, "ExamInfoScreen">;

interface ExamInfoScreenProps {
  route: ExamInfoRouteProp;
  navigation: StackNavigationProp<RootStackParamList, "ExamInfoScreen">;
}

const ExamInfoScreen = ({ route, navigation }: ExamInfoScreenProps) => {
  let host = Constants?.expoConfig?.extra?.host;
  let port = Constants?.expoConfig?.extra?.port;
  const { userId, routeBefore, fromFooter } = route.params;

  const user = useSelector((state: RootState) => state.user.user);
  const familyList = useSelector(
    (state: RootState) => state.familyMember.familyMembers
  );
  const totalList = user ? [...familyList, user] : familyList;
  const memberToRender = totalList.filter(
    (user) => user.userId === String(userId)
  )[0];
  const excludeList = totalList
    .filter((member) => member.role === "parent")
    .map((member) => Number(member.userId));

  const excludeId = [...excludeList, user?.userId];
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(
    Number(excludeId[0])
  );

  const handleSelectedMemberChange = useCallback((memberId: number | null) => {
    setSelectedMemberId(memberId);
  }, []);

  const [examData, setExamData] = useState();
  useEffect(() => {
    const requestExamList = async () => {
      let requestExamURL = `https://${host}/test/${user?.familyId}`;
      try {
        const response = await fetch(requestExamURL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (!isEqual(data, examData)) {
          setExamData(data);
        }
      } catch (e) {
        console.error("Error fetching events:", e);
      }
    };
    requestExamList();
  }, [host, userId, route.params?.newExamCreated]);
  const onBackPress = useCallback(() => {
    if (memberToRender.userId === user?.userId) {
      navigation.navigate("StatusDashboard");
    } else {
      navigation.navigate("UserDetailsScreen", {
        user: {
          userId: userId,
        },
      });
    }
  }, [navigation, memberToRender.userId, user?.userId, userId]);
  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  const insets = useSafeAreaInsets();
  // console.log(examData);
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
          <View style={styles.header}>
            <View style={styles.backButtonContainer}>
              <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
            </View>
            <Image
              source={{
                uri:
                  avatarList[Number(memberToRender.avatarId) - 1] ??
                  avatarList[0],
              }}
              style={styles.avatar}
            />
          </View>
          <View style={styles.weekDatePickerContainer}>
            <WeekDatePicker onExam onDateSelect={handleDateSelect} />
          </View>
          <View style={styles.memberChoiceContainer}>
            <MemberOption
              onSelectedMembersChange={handleSelectedMemberChange}
            />
          </View>
          <View style={styles.examContainer}>
            <ExamList
              Exams={examList}
              onExamItemPress={(item) => {
                console.log("Selected Exam:", item);
                // navigation.navigate("ExamHistoryScreen", {
                //   userId: userId,
                // })
              }}
            />
          </View>
          {user && user.role === "parent" && (
            <ApplyButton
              label="Tạo bài kiểm tra"
              extraStyle={{ width: "50%", marginTop: 50, marginBottom: 30 }}
              onPress={() => {
                navigation.navigate("CreateExamScreen", {
                  userId: userId,
                });
              }}
            />
          )}
        </KeyboardAwareScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  backButtonContainer: {
    marginTop: "6%",
    marginLeft: "7.5%",
  },
  backButton: {},
  backButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FF2D58",
  },
  avatar: {
    width: 50,
    height: 50,
    marginRight: "7.5%",
    marginTop: "6%",
    borderRadius: 500,
  },
  weekDatePickerContainer: {},
  memberChoiceContainer: {
    paddingLeft: 25,
  },
  examContainer: {},
});

export default ExamInfoScreen;
