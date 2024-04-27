import {
  RouteProp,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
import MilestoneList from "../../component/studyPlanRelated/mileStoneRoadMap";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { isEqual } from "lodash";
type ViewStudyPlansRouteProp = RouteProp<
  RootStackParamList,
  "ViewStudyPlansScreen"
>;

interface ViewStudyPlansScreenProps {
  route: ViewStudyPlansRouteProp;
  navigation: StackNavigationProp<RootStackParamList, "ViewStudyPlansScreen">;
}

const ViewStudyPlansScreen = ({
  route,
  navigation,
}: ViewStudyPlansScreenProps) => {
  let host = Constants?.expoConfig?.extra?.host;
  let port = Constants?.expoConfig?.extra?.port;

  const { userId, routeBefore, studyPackage, index } = route.params;

  const user = useSelector((state: RootState) => state.user.user);
  const familyList = useSelector(
    (state: RootState) => state.familyMember.familyMembers
  );

  const totalList = user ? [...familyList, user] : familyList;

  const memberToRender = totalList.filter((user) => {
    return user.userId === String(userId);
  })[0];

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
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => {
                  navigation.navigate("StudyPlanDetailsScreen", {
                    userId: Number(memberToRender?.userId),
                    studyPackage: studyPackage,
                  });
                }}
              >
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
            {studyPackage.courseInfo[index].name}
          </Text>

          <View style={styles.mileStoneContainer}>
            <MilestoneList
              studyPackage={studyPackage.courseInfo[index]}
              isCreated={false}
              indexPass={index}
              userId={Number(userId)}
              studyPackageToPass={studyPackage}
              childrenId={memberToRender.userId}
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
  mileStoneContainer: {
    marginTop: 30,
  },
});

export default ViewStudyPlansScreen;
