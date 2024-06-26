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
import ExamList, { ExamProps } from "../../component/examRelated/examList";
import { examList } from "../../mockData/ExamData";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { isEqual } from "lodash";
import { formatDateObj } from "../../utils/formatDateObjToString";
import { convertIdsToSubjects } from "../../component/shared/constants/convertSubjectToId";
import { formatDateInUserInformation } from "../../utils/formatDateStrtoDateStr";
import { DateCountMap } from "../Calendar/CalendarDashboard";
import { formatDate } from "../../utils/formatDate";
import { formatTimeToHHMMSS } from "../../utils/formatTimeFromSecondToHHMMSS";
import { calculateCorrectAnswers, getExamStatus } from "../../utils/examStatus";

type ExamInfoRouteProp = RouteProp<RootStackParamList, "ExamInfoScreen">;

interface ExamInfoScreenProps {
  route: ExamInfoRouteProp;
  navigation: StackNavigationProp<RootStackParamList, "ExamInfoScreen">;
}

interface ExamData {
  endDate: string;
}

interface CountByDate {
  [key: string]: number;
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
  const memberStatusData = totalList.filter((userInTotalList) => {
    const userIdNumber = Number(userInTotalList.userId);
    return !isNaN(userIdNumber) && !excludeList.includes(userIdNumber);
  });
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedMemberId, setSelectedMemberId] = useState(
    user?.role === "parent" ? Number(memberStatusData[0].userId) : user?.userId
  );
  const [examData, setExamData] = useState();
  const [filteredExams, setFilteredExams] = useState([]);
  const [pendingExams, setPendingExams] = useState([]);
  const [gradingExams, setGradingExams] = useState([]);
  const [failExams, setFailExams] = useState([]);
  const [passExams, setPassExams] = useState([]);
  const [examToInput, setExamToInput] = useState<ExamProps[]>([]);
  const [countExam, setCountExam] = useState([]);
  const isEnglishEnabled = useSelector(
    (state: RootState) => state.language.isEnglishEnabled
  );

  useEffect(() => {
    if (!Array.isArray(examToInput)) return;

    const examCount = Object.values(
      examToInput
        .map((exam: any) => ({
          date: formatDate(exam.endDate.split("T")[0]),
        }))
        .reduce((acc: DateCountMap, currentValue: any) => {
          const { date } = currentValue;
          if (acc[date]) {
            acc[date].countEvent += 1;
          } else {
            acc[date] = { date, countEvent: 1 };
          }
          return acc;
        }, {} as DateCountMap)
    );

    setCountExam(examCount as any);
  }, [examData, selectedMemberId]);

  const handleSelectedMemberChange = useCallback((memberId: number | null) => {
    setSelectedMemberId(memberId as any);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
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
    }, 1000);

    return () => clearInterval(intervalId);
  }, [host, userId, examData, route.params?.newExamCreated]);
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

  const filterExamsForSelectedMember = useCallback(() => {
    if (!examData || selectedMemberId == null) return [];

    const examsForSelectedMember = (examData as any)[selectedMemberId];
    if (!examsForSelectedMember) return [];

    const filtered = examsForSelectedMember.filter((exam: any) => {
      const startDate = new Date(exam.startDate);
      const endDate = new Date(exam.endDate);
      const selectedDateStart = new Date(selectedDate.setHours(0, 0, 0, 0));
      const selectedDateEnd = new Date(selectedDate.setHours(23, 59, 59, 999));

      return selectedDateStart <= endDate && selectedDateEnd >= startDate;
    });

    return filtered;
  }, [examData, selectedMemberId, selectedDate]);

  useEffect(() => {
    const exams = filterExamsForSelectedMember();
    setFilteredExams(exams);
  }, [filterExamsForSelectedMember]);

  const filterExamsForExamInput = useCallback(() => {
    if (!examData || selectedMemberId == null) return [];

    const examsForSelectedMember = (examData as any)[selectedMemberId];
    if (!examsForSelectedMember) return [];

    const filtered = examsForSelectedMember
      .filter((exam: any) => {
        const startDate = new Date(exam.startDate);
        const endDate = new Date(exam.endDate);
        const selectedDateStart = new Date(selectedDate.setHours(0, 0, 0, 0));
        const selectedDateEnd = new Date(
          selectedDate.setHours(23, 59, 59, 999)
        );

        return selectedDateStart <= endDate && selectedDateEnd >= startDate;
      })
      .map((exam: any) => {
        return {
          name: exam.name,
          dateStart: formatDateInUserInformation(exam.startDate),
          timeStart:
            exam?.submissions?.length === 0
              ? undefined
              : formatTimeToHHMMSS(
                  exam.submissions[exam.submissions.length - 1]?.time
                ),
          tags: convertIdsToSubjects(exam.tags),
          status: getExamStatus(
            exam.submissions,
            exam.questions,
            exam.questionCountToPass
          ),
          result: calculateCorrectAnswers(exam.submissions, exam.questions),
          endDate: exam.endDate,
          questions: exam.questions,
          testId: exam.id,
          time: exam.time,
          submissions: exam.submissions,
          questionCountToPass: exam.questionCountToPass,
        };
      });

    return filtered;
  }, [
    examData,
    selectedMemberId,
    selectedDate,
    host,
    userId,
    route.params?.newExamCreated,
  ]);

  useEffect(() => {
    const examsInput = filterExamsForExamInput();
    setExamToInput(examsInput);
    setPendingExams(
      examsInput.filter((exam: any) => {
        return exam.status === "pending";
      })
    );
    setGradingExams(
      examsInput.filter((exam: any) => {
        return exam.status === "grading";
      })
    );
    setPassExams(
      examsInput.filter((exam: any) => {
        return exam.status === "completed";
      })
    );
    setFailExams(
      examsInput.filter((exam: any) => {
        return exam.status === "failed";
      })
    );
  }, [filterExamsForExamInput, route.params?.newExamCreated]);

  useEffect(() => {
    setFilteredExams(filterExamsForSelectedMember());
  }, [filterExamsForSelectedMember]);
  // console.log(examToInput);

  // console.log(countExam)
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
          <View style={styles.weekDatePickerContainer}>
            <WeekDatePicker
              onExam
              listOfEventCount={countExam}
              onDateSelect={handleDateSelect}
              onEnglish={isEnglishEnabled}
            />
          </View>
          <View style={styles.memberChoiceContainer}>
            {user?.role === "parent" && (
              <MemberOption
                onSelectedMembersChange={handleSelectedMemberChange}
              />
            )}
          </View>
          <Text
            style={styles.noteText}
          >{isEnglishEnabled ?  `Pending exams (${pendingExams.length})` : `Chưa hoàn thành (${pendingExams.length})`}</Text>
          <View style={styles.examContainer}>
            <ExamList
              Exams={pendingExams}
              pickedDate={selectedDate}
              onExamItemPress={(item) => {
                navigation.navigate("ExamHistoryScreen", {
                  examInfo: item,
                  userId: userId,
                  payLoadToDoExam: {
                    userId: userId,
                    questions: item.questions.map((quiz: any) => {
                      return {
                        id: quiz.id,
                        question: quiz.name,
                        type: quiz.type === 1 ? "multiple-choice" : "text",
                        options:
                          quiz.type === 1
                            ? quiz.choices.map((choice: any) => {
                                return {
                                  content: choice.content,
                                  id: choice.id,
                                };
                              })
                            : undefined,
                        image: quiz?.image,
                      };
                    }),
                    time: formatTimeToHHMMSS(item.time),
                    examId: item.testId,
                    childrenId: selectedMemberId,
                  },
                });
              }}
            />
          </View>
          <Text
            style={styles.noteText}
          >{isEnglishEnabled ?  `Grading exams (${gradingExams.length})` :`Đang được chấm (${gradingExams.length})`}</Text>
          <View style={styles.examContainer}>
            <ExamList
              Exams={gradingExams}
              pickedDate={selectedDate}
              onExamItemPress={(item) => {
                navigation.navigate("ExamHistoryScreen", {
                  examInfo: item,
                  userId: userId,
                  payLoadToDoExam: {
                    userId: userId,
                    questions: item.questions.map((quiz: any) => {
                      return {
                        id: quiz.id,
                        question: quiz.name,
                        type: quiz.type === 1 ? "multiple-choice" : "text",
                        options:
                          quiz.type === 1
                            ? quiz.choices.map((choice: any) => {
                                return {
                                  content: choice.content,
                                  id: choice.id,
                                };
                              })
                            : undefined,
                      };
                    }),
                    time: formatTimeToHHMMSS(item.time),
                    examId: item.testId,
                    childrenId: selectedMemberId,
                  },
                });
              }}
            />
          </View>
          <Text
            style={styles.noteText}
          >{isEnglishEnabled ?  `Passed exams (${passExams.length})` :`Bài kiểm tra đã đạt (${passExams.length})`}</Text>
          <View style={styles.examContainer}>
            <ExamList
              Exams={passExams}
              pickedDate={selectedDate}
              onExamItemPress={(item) => {
                navigation.navigate("ExamHistoryScreen", {
                  examInfo: item,
                  userId: userId,
                  payLoadToDoExam: {
                    userId: userId,
                    questions: item.questions.map((quiz: any) => {
                      return {
                        id: quiz.id,
                        question: quiz.name,
                        type: quiz.type === 1 ? "multiple-choice" : "text",
                        options:
                          quiz.type === 1
                            ? quiz.choices.map((choice: any) => {
                                return {
                                  content: choice.content,
                                  id: choice.id,
                                };
                              })
                            : undefined,
                      };
                    }),
                    time: formatTimeToHHMMSS(item.time),
                    examId: item.testId,
                    childrenId: selectedMemberId,
                  },
                });
              }}
            />
          </View>
          <Text
            style={styles.noteText}
          >{isEnglishEnabled ?  `Failed exams (${failExams.length})` :`Bài kiểm tra chưa đạt (${failExams.length})`}</Text>
          <View style={styles.examContainer}>
            <ExamList
              Exams={failExams}
              pickedDate={selectedDate}
              onExamItemPress={(item) => {
                navigation.navigate("ExamHistoryScreen", {
                  examInfo: item,
                  userId: userId,
                  payLoadToDoExam: {
                    userId: userId,
                    questions: item.questions.map((quiz: any) => {
                      return {
                        id: quiz.id,
                        question: quiz.name,
                        type: quiz.type === 1 ? "multiple-choice" : "text",
                        options:
                          quiz.type === 1
                            ? quiz.choices.map((choice: any) => {
                                return {
                                  content: choice.content,
                                  id: choice.id,
                                };
                              })
                            : undefined,
                      };
                    }),
                    time: formatTimeToHHMMSS(item.time),
                    examId: item.testId,
                    childrenId: selectedMemberId,
                  },
                });
              }}
            />
          </View>
          {user && user.role === "parent" && (
            <ApplyButton
              label={isEnglishEnabled ?  `Create exam` :"Tạo bài kiểm tra"}
              extraStyle={{
                width: "50%",
                marginTop: 30,
                marginBottom: 30,
              }}
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
  noteText: {
    fontSize: 20,
    color: "#1E293B",
    fontWeight: "600",
    paddingLeft: 30,
    marginTop: 15,
    marginBottom: 10,
  },
});

export default ExamInfoScreen;
