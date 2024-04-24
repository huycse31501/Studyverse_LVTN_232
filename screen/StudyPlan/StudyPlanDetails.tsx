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
import Constants from "expo-constants";

import { avatarList } from "../../utils/listOfAvatar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { RootStackParamList } from "../../component/navigator/appNavigator";
import MemberOption from "../../component/examRelated/examMemberSlide";
import ApplyButton from "../../component/shared/ApplyButton";
import StudyPlanList from "../../component/studyPlanRelated/studyPlanList";
type StudyPlanDetailsRouteProp = RouteProp<
  RootStackParamList,
  "StudyPlanDetailsScreen"
>;

interface StudyPlanDetailsScreenProps {
  route: StudyPlanDetailsRouteProp;
  navigation: StackNavigationProp<RootStackParamList, "StudyPlanDetailsScreen">;
}

const StudyPlanDetailsScreen = ({
  route,
  navigation,
}: StudyPlanDetailsScreenProps) => {
  let host = Constants?.expoConfig?.extra?.host;
  let port = Constants?.expoConfig?.extra?.port;
  const { userId, routeBefore, fromFooter, studyPackage } = route.params;

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

  const onBackPress = useCallback(() => {
    navigation.navigate("StudyPlanInfoScreen", {
      userId: Number(user?.userId),
      routeBefore: "StatusDashboard",
    });
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
          <Text style={styles.headerText}>{studyPackage?.courseName}</Text>
          <View style={styles.studyPlanlistContainer}>
            <StudyPlanList logo={studyPackage.logoType} color={studyPackage.color} />
          </View>
        </KeyboardAwareScrollView>
      </KeyboardAvoidingView>
      <ApplyButton
        label="Tạo kế hoạch mới"
        extraStyle={{
          width: "50%",
          position: "absolute",
          bottom: 50,
        }}
        onPress={() => {}}
      />
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
    fontSize: 24,
    fontWeight: "600",
    alignSelf: "center",
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
  studyPlanlistContainer: {
    marginTop: 5,
  },
});

export default StudyPlanDetailsScreen;
