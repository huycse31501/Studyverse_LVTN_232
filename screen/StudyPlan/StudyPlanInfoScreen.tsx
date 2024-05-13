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

import SubjectList from "../../component/studyPlanRelated/courseList";
import { isEqual } from "lodash";

type StudyPlanInfoRouteProp = RouteProp<
  RootStackParamList,
  "StudyPlanInfoScreen"
>;

interface StudyPlanInfoScreenProps {
  route: StudyPlanInfoRouteProp;
  navigation: StackNavigationProp<RootStackParamList, "StudyPlanInfoScreen">;
}

const StudyPlanInfoScreen = ({
  route,
  navigation,
}: StudyPlanInfoScreenProps) => {
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
  const memberStatusData = totalList.filter((userInTotalList) => {
    const userIdNumber = Number(userInTotalList.userId);
    return !isNaN(userIdNumber) && !excludeList.includes(userIdNumber);
  });
  const [selectedMemberId, setSelectedMemberId] = useState(
    user?.role === "parent" ? Number(memberStatusData[0].userId) : user?.userId
  );

  const [studyPlanData, setStudyPlanData] = useState();
  const [filteredstudyPlan, setFilteredstudyPlan] = useState({});
  const isEnglishEnabled = useSelector(
    (state: RootState) => state.language.isEnglishEnabled
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      const requestStudyPlanList = async () => {
        let requestStudyPlanURL = `https://${host}/studyPlan/${user?.familyId}`;
        try {
          const response = await fetch(requestStudyPlanURL, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const data = await response.json();
          if (!isEqual(data, studyPlanData)) {
            setStudyPlanData(data);
          }
        } catch (e) {
          console.error("Error fetching events:", e);
        }
      };
      requestStudyPlanList();
    }, 1000);

    return () => clearInterval(intervalId);
  }, [host, userId, studyPlanData, route.params?.newPlanCreated]);

  const filterExamsForSelectedMember = useCallback(() => {
    if (!studyPlanData || selectedMemberId == null) return [];

    const examsForSelectedMember = (studyPlanData as any)[selectedMemberId];
    if (!examsForSelectedMember) return [];

    return examsForSelectedMember;
  }, [studyPlanData, selectedMemberId]);

  useEffect(() => {
    const studyPlans = filterExamsForSelectedMember();
    setFilteredstudyPlan(studyPlans);
  }, [filterExamsForSelectedMember]);

  const [isSubjectListEnabled, setIsSubjectListEnabled] = useState(false);

  useEffect(() => {
    setIsSubjectListEnabled(Object.keys(filteredstudyPlan).length > 0);
  }, [filteredstudyPlan, studyPlanData, selectedMemberId]);

  // console.log(filteredstudyPlan)

  const onBackPress = useCallback(() => {
    navigation.navigate("StatusDashboard");
  }, [navigation, memberToRender.userId, user?.userId, userId]);
  const handleSelectedMemberChange = useCallback((memberId: number | null) => {
    setSelectedMemberId(memberId as any);
  }, []);

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
          <Text style={styles.headerText}>
            {isEnglishEnabled ? "Study plan" : "Kế hoạch học tập"}
          </Text>

          <View style={styles.memberChoiceContainer}>
            {user?.role === "parent" && (
              <MemberOption
                onSelectedMembersChange={handleSelectedMemberChange}
              />
            )}
          </View>
          <View style={styles.subjectListContainer}>
            <SubjectList
              selectedMemberId={selectedMemberId}
              studyPackage={{
                studyPlanInfo: filteredstudyPlan,
              }}
              isEnabled={isSubjectListEnabled}
              onEnglish={isEnglishEnabled}
            />
          </View>
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
  },
  headerText: {
    fontSize: 22,
    fontWeight: "600",
    alignSelf: "center",
    marginVertical: 5,
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
  subjectListContainer: {},
});

export default StudyPlanInfoScreen;
