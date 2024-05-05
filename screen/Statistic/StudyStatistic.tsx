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
  ActivityIndicator,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import Constants from "expo-constants";

import { avatarList } from "../../utils/listOfAvatar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { RootStackParamList } from "../../component/navigator/appNavigator";
import MemberOption from "../../component/examRelated/examMemberSlide";

import { convertIdToSubject } from "../../component/shared/constants/convertSubjectToId";
import { logoMap } from "../../component/shared/constants/listOfSubject";
import { LinearGradient } from "expo-linear-gradient";

type StudyStatisticRouteProp = RouteProp<
  RootStackParamList,
  "StudyStatisticScreen"
>;

interface StudyStatisticScreenProps {
  route: StudyStatisticRouteProp;
  navigation: StackNavigationProp<RootStackParamList, "StudyStatisticScreen">;
}

const StudyStatisticScreen = ({
  route,
  navigation,
}: StudyStatisticScreenProps) => {
  let host = Constants?.expoConfig?.extra?.host;
  let port = Constants?.expoConfig?.extra?.port;
  const { userId } = route.params;

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

  const [statisticData, setStatisticData] = useState<any>();

  const [filteredStatistic, setFilteredStatistic] = useState({});

  const [ratingScore, setRatingScore] = useState<number>();
  const [numberOfTestDone, setNumberOfTestDone] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const onBackPress = useCallback(() => {
    navigation.navigate("StatusDashboard");
  }, [navigation, memberToRender.userId, user?.userId, userId]);
  const handleSelectedMemberChange = useCallback((memberId: number | null) => {
    setSelectedMemberId(memberId as any);
  }, []);

  // console.log(statisticData)
  useEffect(() => {
    const requestStudyPlanList = async () => {
      setIsLoading(true);
      let requestStudyPlanURL = `https://${host}/stats/${selectedMemberId}`;
      try {
        const response = await fetch(requestStudyPlanURL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();

        const subjects = data.subject;
        let newSubjects = Object.keys(subjects).reduce((acc: any, key: any) => {
          const subjectName = convertIdToSubject[key];
          const { correct, count } = subjects[key];
          if (count > 0) {
            acc[subjectName] = Number((correct / count).toFixed(2));
          } else {
            acc[subjectName] = 0;
          }
          return acc;
        }, {});

        let sortable = [];
        for (var subject in newSubjects) {
          sortable.push([subject, newSubjects[subject]]);
        }

        sortable.sort(function (a, b) {
          return b[1] - a[1];
        });
        const subjectToRender = sortable.map((object: any) => {
          return {
            name: object[0],
            score: object[1],
          };
        });

        setNumberOfTestDone(`${data.test.pass}/${data.test.count}`);

        setRatingScore(
          Math.round(Number(data.answer.correct / data.answer.count) * 100)
        );

        setStatisticData(subjectToRender);
        setIsLoading(false);
      } catch (e) {
        setIsLoading(false);
        console.error("Error fetching statistics:", e);
      }
    };
    requestStudyPlanList();
  }, [selectedMemberId]);

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
          <Text style={styles.headerText}>Thống kê học tập</Text>
          {user?.role === "parent" && (
            <View style={styles.memberChoiceContainer}>
              <MemberOption
                onSelectedMembersChange={handleSelectedMemberChange}
              />
            </View>
          )}
          <View style={styles.totalResultContainer}>
            <View style={styles.testNumberContainer}>
              <Image
                source={require("../../assets/images/statistic/lightning.png")}
                style={styles.logoStyle}
              ></Image>
              <View style={styles.innerTextContainer}>
                <Text style={styles.ratingText}>{numberOfTestDone}</Text>
                <Text style={styles.explanationText}>Bài kiểm tra</Text>
              </View>
            </View>
            <View style={styles.testNumberContainer}>
              <Image
                source={require("../../assets/images/statistic/check.png")}
                style={styles.logoStyle}
              ></Image>
              <View style={styles.innerTextContainer}>
                <Text style={styles.ratingText}>
                  {ratingScore ? ratingScore : 0}%
                </Text>
                <Text style={styles.explanationText}>Tỷ lệ đúng</Text>
              </View>
            </View>
          </View>
          <Text style={styles.textRating}>Tỷ lệ câu hỏi trả lời đúng</Text>
          <View style={styles.chartContainer}>
            {statisticData &&
              statisticData.map(
                  (subject: { name: string; score: number }, index: number) => {
                    //   console.log(logoMap)
                  const logo = logoMap[subject.name];
                  const progressBarWidth = subject.score * 100;
                  return (
                    <View style={styles.subjectStatistic} key={index}>
                      {logo ? (
                        <Image source={logo} style={styles.subjectLogo} />
                      ) : (
                        <Text>Invalid subject name</Text>
                      )}
                      <View style={styles.contentContainer}>
                        <Text style={styles.subjectName}>{subject.name}</Text>
                        <View style={styles.progressContainer}>
                          <View
                            style={{
                              backgroundColor: "#E0E0E0",
                              height: 20,
                              borderRadius: 10,
                              width: "80%",
                              overflow: "hidden",
                            }}
                          >
                            <LinearGradient
                              colors={["#FFBF1A", "#FF4080"]}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                              style={[
                                styles.progressBar,
                                {
                                  width: `${progressBarWidth}%`,
                                  borderTopLeftRadius: 10,
                                  borderBottomLeftRadius: 10,
                                  borderBottomRightRadius: 10,
                                },
                              ]}
                            />
                          </View>
                          <Text
                            style={styles.label}
                          >{`${progressBarWidth}%`}</Text>
                        </View>
                      </View>
                    </View>
                  );
                }
              )}
          </View>
        </KeyboardAwareScrollView>
      </KeyboardAvoidingView>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0b0b0d" />
        </View>
      )}
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
  memberChoiceContainer: {
    paddingLeft: 25,
  },
  loadingContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  totalResultContainer: {
    flexDirection: "row",
    alignSelf: "center",
  },
  testNumberContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    marginBottom: 5,
    borderRadius: 30,
    shadowColor: "rgba(0,0,0,25)",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 3,
    marginVertical: 25,
    marginHorizontal: 15,
    paddingRight: 30,
  },
  innerTextContainer: {
    marginLeft: 17.5,
  },
  logoStyle: {
    width: 32.5,
    height: 32.5,
  },
  explanationText: {
    color: "#9098A3",
    fontSize: 14,
    fontWeight: "600",
  },
  ratingText: {
    fontSize: 18,
    fontWeight: "700",
  },
  textRating: {
    marginLeft: 30,
    fontSize: 18,
    fontWeight: "600",
    color: "#9098A3",
    marginTop: 30,
  },
  chartContainer: {
    alignItems: "flex-start",
    width: "90%",
    padding: 15,
    backgroundColor: "#fff",
    marginBottom: 50,
    borderRadius: 15,
    shadowColor: "rgba(0,0,0,25)",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 3,
    marginVertical: 25,
    marginHorizontal: 15,
    paddingRight: 30,
  },

  subjectLogo: {
    width: 50,
    height: 50,
  },
  subjectStatistic: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingVertical: 10,
  },
  contentContainer: {
    flex: 1,
    marginLeft: 20,
  },
  subjectName: {
    marginLeft: 5,
    fontSize: 18,
    fontWeight: "600",
    top: -10,
  },
  progressBar: {
    borderRadius: 10,
    height: "100%",
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    position: "relative",
    left: 20,
    top: -4,
    color: "rgba(0,0,0,0.85)",
  },
  progressContainer: {
    flexDirection: "row",
    borderRadius: 10,

    height: 20,
  },
});

export default StudyStatisticScreen;
