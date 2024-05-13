import {
  StackNavigationProp,
  createStackNavigator,
} from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import SignIn from "../../screen/SignIn-SignUp/SignIn";
import SignUp from "../../screen/SignIn-SignUp/SignUp";
import { StyleSheet } from "react-native";
import ForgotPassword from "../../screen/SignIn-SignUp/ForgotPassword";
import OTPScreen from "../../screen/SignIn-SignUp/OTPScreen";
import StatusDashboard from "../../screen/Dashboard/StatusBoard";
import UserDetailsScreen, { User } from "../../screen/Dashboard/Details";
import Setting from "../../screen/Dashboard/Setting";
import FamilyInfoScreen from "../../screen/Dashboard/FamilyInfo";
import NewPasswordScreen from "../../screen/SignIn-SignUp/NewPassword";
import FamilyAcceptScreen from "../../screen/Dashboard/FamilyAccept";
import UserInformationScreen from "../../screen/Dashboard/UserInformation";
import { EventProps } from "../shared/RemindEvent";
import EventInfo from "../type/EventInfo";
import EventInfoScreen, {
  Event,
} from "../../screen/Calendar/CalendarDashboard";
import EventRemindScreen from "../../screen/Calendar/EventRemindScreen";
import CreateEventScreen from "../../screen/Calendar/CreateEventScreen";
import EditEventScreen from "../../screen/Calendar/EditEventScreen";
import ExamInfoScreen from "../../screen/Exam/ExamDashboard";
import ExamHistoryScreen from "../../screen/Exam/ExamHistory";
import ExamResultScreen from "../../screen/Exam/ExamResultScreen";
import DoExamScreen, { Question } from "../../screen/Exam/DoExam";
import DetailExamResultScreen from "../../screen/Exam/DetailsExamResult";
import CreateExamScreen from "../../screen/Exam/CreateExamScreen";
import CreateQuestionListScreen from "../../screen/Exam/CreateQuestionList";
import CreateNewQuestionScreen from "../../screen/Exam/CreateNewQuestion";
import StudyPlanInfoScreen from "../../screen/StudyPlan/StudyPlanInfoScreen";
import StudyPlanDetailsScreen from "../../screen/StudyPlan/StudyPlanDetails";
import CreateStudyPlanScreen from "../../screen/StudyPlan/CreateStudyPlan";
import CreateMilestoneScreen from "../../screen/StudyPlan/AddMilestoneScreen";
import ViewStudyPlansScreen from "../../screen/StudyPlan/ViewStudyPlan";
import AddMoreMilestoneScreen from "../../screen/StudyPlan/AddMileStoneForExistingStudyPlanScreen";
import EditMilestoneScreen from "../../screen/StudyPlan/EditMileStoneScreen";
import EditStudyPlanScreen from "../../screen/StudyPlan/EditStudyPlan";
import StudyStatisticScreen from "../../screen/Statistic/StudyStatistic";

export type RootStackParamList = {
  ForgotPassword: undefined;
  SignUp: undefined;
  SignIn: undefined;
  OTPScreen: {
    email?: any
  };
  StatusDashboard: undefined;
  UserDetailsScreen: { user: User };
  Setting: undefined;
  FamilyInfoScreen: {
    routeBefore?: string;
  };
  NewPasswordScreen: {
    email?: any;
  };
  FamilyAcceptScreen: undefined;
  UserInformationScreen: undefined;
  EventInfoScreen: {
    userId: number;
    routeBefore: string;
    newEventCreated?: boolean;
    fromFooter?: string;
  };
  EventRemindScreen: {
    userId: number;
    routeBefore: string;
  };
  CreateEventScreen: {
    userId: number;
  };
  EditEventScreen: {
    userId: number;
    eventInfo: any;
    routeBefore: string;
    fromFooter?: string;
  };
  ExamInfoScreen: {
    userId: number;
    routeBefore?: string;
    newExamCreated?: boolean;
    fromFooter?: string;
  };
  ExamHistoryScreen: {
    userId: number;
    routeBefore?: string;
    newExamCreated?: boolean;
    fromFooter?: string;
    payLoadToDoExam?: any;
    examInfo?: any;
    childrenId?: any;
  };
  ExamResultScreen: {
    timeTaken: string;
    userId?: number;
    examInfo?: any;
    childrenId?: any;
    questions?: any;
    time?: any;
    examId?: any;
    currentChoice?: any;
  };
  DoExamScreen: {
    questions: Question[];
    time: string;
    userId?: number;
    examId?: string;
    childrenId?: any;
    payLoadToDoExam?: any;
    examInfo?: any;
    routeBefore?: any;
    payloadToNavigateBackToExamResultScreen?: any;
  };
  DetailExamResultScreen: {
    timeFinish: string;
    userId?: number;
    examInfo?: any;
    attemp?: any;
    attempIndex?: any;
    payloadToDoExam?: any;
    childrenId?: any;
    result?: any;
  };
  CreateExamScreen: {
    userId: number;
    previousPayload?: any;
    currentQuestionList?: any;
  };
  CreateQuestionListScreen: {
    userId: number;
    previousPayload?: any;
    currentQuestionList?: any;
  };
  CreateNewQuestionScreen: {
    userId: number;
    previousPayload?: any;
    currentQuestionList?: any;
  };
  StudyPlanInfoScreen: {
    userId: number;
    routeBefore?: string;
    newPlanCreated?: boolean;
    fromFooter?: string;
  };
  StudyPlanDetailsScreen: {
    userId: number;
    routeBefore?: string;
    newPlanCreated?: boolean;
    fromFooter?: string;
    studyPackage?: any;
  };
  CreateStudyPlanScreen: {
    userId: number;
    routeBefore?: string;
    fromFooter?: string;
    studyPackage?: any;
  };
  CreateMilestoneScreen: {
    userId: number;

    tagUser?: any;
    routeBefore?: string;
    fromFooter?: string;
    studyPackage?: any;
  };
  ViewStudyPlansScreen: {
    userId: number;
    routeBefore?: string;
    studyPackage?: any;
    index?: any;
  };
  AddMoreMilestoneScreen: {
    userId: number;
    routeBefore?: string;
    studyPackage?: any;
    index?: any;
    updateStudyPackage?: any;
  };
  EditMilestoneScreen: {
    userId: number;
    routeBefore?: string;
    studyPackage?: any;
    index?: any;
    currentMilestone?: any;
  };
  EditStudyPlanScreen: {
    userId: number;
    routeBefore?: string;
    newPlanCreated?: boolean;
    fromFooter?: string;
    studyPackage?: any;
    editStudyPlan?: any;
  };
  StudyStatisticScreen: {
    userId: number;
    fromFooter?: string;
  };
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="SignIn"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: "#FFFFFF" },
        }}
      >
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="OTPScreen" component={OTPScreen} />
        <Stack.Screen name="StatusDashboard" component={StatusDashboard} />
        <Stack.Screen name="UserDetailsScreen" component={UserDetailsScreen} />
        <Stack.Screen name="Setting" component={Setting} />
        <Stack.Screen name="FamilyInfoScreen" component={FamilyInfoScreen} />
        <Stack.Screen
          name="FamilyAcceptScreen"
          component={FamilyAcceptScreen}
        />
        <Stack.Screen name="NewPasswordScreen" component={NewPasswordScreen} />
        <Stack.Screen
          name="UserInformationScreen"
          component={UserInformationScreen}
        />

        <Stack.Screen name="EventInfoScreen" component={EventInfoScreen} />
        <Stack.Screen name="EventRemindScreen" component={EventRemindScreen} />
        <Stack.Screen name="CreateEventScreen" component={CreateEventScreen} />
        <Stack.Screen name="EditEventScreen" component={EditEventScreen} />
        <Stack.Screen name="ExamInfoScreen" component={ExamInfoScreen} />
        <Stack.Screen name="ExamHistoryScreen" component={ExamHistoryScreen} />
        <Stack.Screen name="ExamResultScreen" component={ExamResultScreen} />
        <Stack.Screen name="DoExamScreen" component={DoExamScreen} />
        <Stack.Screen
          name="DetailExamResultScreen"
          component={DetailExamResultScreen}
        />
        <Stack.Screen name="CreateExamScreen" component={CreateExamScreen} />
        <Stack.Screen
          name="CreateQuestionListScreen"
          component={CreateQuestionListScreen}
        />
        <Stack.Screen
          name="CreateNewQuestionScreen"
          component={CreateNewQuestionScreen}
        />
        <Stack.Screen
          name="StudyPlanInfoScreen"
          component={StudyPlanInfoScreen}
        />
        <Stack.Screen
          name="StudyPlanDetailsScreen"
          component={StudyPlanDetailsScreen}
        />
        <Stack.Screen
          name="CreateStudyPlanScreen"
          component={CreateStudyPlanScreen}
        />
        <Stack.Screen
          name="CreateMilestoneScreen"
          component={CreateMilestoneScreen}
        />
        <Stack.Screen
          name="ViewStudyPlansScreen"
          component={ViewStudyPlansScreen}
        />
        <Stack.Screen
          name="AddMoreMilestoneScreen"
          component={AddMoreMilestoneScreen}
        />
        <Stack.Screen
          name="EditMilestoneScreen"
          component={EditMilestoneScreen}
        />
        <Stack.Screen
          name="EditStudyPlanScreen"
          component={EditStudyPlanScreen}
        />
        <Stack.Screen
          name="StudyStatisticScreen"
          component={StudyStatisticScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
CreateStudyPlanScreen;
