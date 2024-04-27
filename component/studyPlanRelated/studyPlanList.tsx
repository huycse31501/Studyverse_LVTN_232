import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { formatDate } from "../../utils/formatDate";
const MathIcon = require("../../assets/images/courseLogo/Math.png");
const PhysicsIcon = require("../../assets/images/courseLogo/Physics.png");
const BiologyIcon = require("../../assets/images/courseLogo/Biology.png");
const ChemistryIcon = require("../../assets/images/courseLogo/Chemistry.png");
const EnglishIcon = require("../../assets/images/courseLogo/English.png");
const LiteratureIcon = require("../../assets/images/courseLogo/Literature.png");

interface StudyPlanListProps {
  logo?: any;
  color?: any;
  studyPackage?: any;
  userId?: any;
}

type StudyDetailsNavigationProp = StackNavigationProp<{
  StudyPlanDetailsScreen: {
    userId: number;
    routeBefore?: string;
    newPlanCreated?: boolean;
    fromFooter?: string;
    studyPackage?: any;
  };
  ViewStudyPlansScreen: {
    userId: number;
    routeBefore?: string;
    studyPackage?: any;
    index?: any;
  };
}>;

const StudyPlanList: React.FC<StudyPlanListProps> = ({
  logo,
  color,
  studyPackage,
  userId,
}) => {
  const navigation = useNavigation<StudyDetailsNavigationProp>();

  const studyPackageToRender = studyPackage.courseInfo.map((item: any) => {
    // console.log(item.milestones)

    return {
      name: item.name,
      startDate: item.startDate,
      endDate: item.endDate,
      currentProgress: Math.floor(
        (item.milestones.filter((milestone: any) => {
          return milestone.pass === true;
        }).length /
          item.milestones.length) *
          100
      ),
    };
  });
  return (
    <ScrollView style={{ marginBottom: 30 }}>
      {studyPackageToRender.map((item: any, index: any) => (
        <TouchableOpacity
          style={[styles.container, { backgroundColor: color }]}
          key={index}
          onPress={() => {
            navigation.navigate("ViewStudyPlansScreen", {
              userId: userId,
              studyPackage: studyPackage,
              index: index,
            });
          }}
        >
          <View style={styles.contentContainer}>
            <Image source={logo} style={styles.iconStyles} />
            <View style={styles.studyPlanInfoContainer}>
              <View style={styles.studyPlanTextContainer}>
                <Text style={styles.studyPlanText}>{item.name}</Text>
                <TouchableOpacity>
                  <Image
                    source={require("../../assets/images/shared/addQuestion.png")}
                    style={styles.editLogoStyle}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.studyPlanTimeRangeContainer}>
                <Image
                  style={styles.studyPlanLogo}
                  source={require("../../assets/images/shared/calendarStudyPlan.png")}
                />
                <Text
                  style={styles.studyPlanTimeText}
                >{`${formatDate(item.startDate)} - ${formatDate(item.endDate)}`}</Text>
              </View>
              <View style={styles.progressContainer}>
                <LinearGradient
                  colors={["#FFBF1A", "#FF4080"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[
                    styles.progressBar,
                    {
                      width: `${item.currentProgress}%`,
                      borderTopLeftRadius: 10,
                      borderBottomLeftRadius: 10,
                      borderBottomRightRadius: 10,
                    },
                  ]}
                />
                <Text style={styles.label}>{`${item.currentProgress}%`}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 16,
    shadowColor: "rgba(0,0,0,25)",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    marginTop: 35,
    marginHorizontal: 30,
    padding: 17.5,
    paddingVertical: 25,
  },
  contentContainer: {
    flexDirection: "row",
  },
  iconStyles: {
    width: 55,
    height: 55,
    alignSelf: "center",
  },
  studyPlanInfoContainer: {},
  studyPlanTimeRangeContainer: {
    flexDirection: "row",
    marginLeft: 15,
    marginTop: 3,
  },
  studyPlanLogo: {
    width: 12.5,
    height: 12.5,
    alignSelf: "center",
  },
  studyPlanTimeText: {
    fontSize: 13,
    fontWeight: "400",
    marginLeft: 5,
  },

  studyPlanText: {
    fontSize: 18,
    fontWeight: "600",
    alignSelf: "flex-start",
    color: "#131313",
    marginLeft: 15,
    width: 100,
  },
  progressContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginLeft: 15,
    marginTop: 10,
    height: 18,
  },
  progressBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 10,
    height: "100%",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    position: "relative",
    left: 180,
    top: -1,
    color: "rgba(0,0,0,0.85)",
  },
  studyPlanTextContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  editLogoStyle: {
    width: 30,
    height: 30,
    position: "absolute",
    top: -30,
    left: 80,
  },
});

export default StudyPlanList;
