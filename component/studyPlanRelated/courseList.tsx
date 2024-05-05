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
import { convertSubjectToId, convertSubjectsToIds } from "../shared/constants/convertSubjectToId";
import { isEnabled } from "react-native/Libraries/Performance/Systrace";

const MathIcon = require("../../assets/images/courseLogo/Math.png");
const PhysicsIcon = require("../../assets/images/courseLogo/Physics.png");
const BiologyIcon = require("../../assets/images/courseLogo/Biology.png");
const ChemistryIcon = require("../../assets/images/courseLogo/Chemistry.png");
const EnglishIcon = require("../../assets/images/courseLogo/English.png");
const LiteratureIcon = require("../../assets/images/courseLogo/Literature.png");

interface SubjectListProps {
  selectedMemberId: number | string | undefined;
  studyPackage?: any;
  isEnabled: boolean;
}

type StudyDetailsNavigationProp = StackNavigationProp<{
  StudyPlanDetailsScreen: {
    userId: number;
    routeBefore?: string;
    newPlanCreated?: boolean;
    fromFooter?: string;
    studyPackage?: any;
  };
}>;
const subjects = [
  { key: "1", name: "Toán", logo: MathIcon },
  {
    key: "2",
    name: "Ngữ văn",
    logo: LiteratureIcon,
  },
  { key: "3", name: "Anh văn", logo: EnglishIcon },
  { key: "4", name: "Vật lý", logo: PhysicsIcon },
  {
    key: "5",
    name: "Hóa học",
    logo: ChemistryIcon,
  },
  {
    key: "6",
    name: "Sinh học",
    logo: BiologyIcon,
  },
];

const getBackgroundColor = (key: string) => {
  const colors = ["#c5eac0", "#bed5f3", "#f6e0f3"];
  if (key === "0") {
    return "#f6e0f3";
  }
  return colors[(parseInt(key) - 1) % colors.length];
};

const SubjectList: React.FC<SubjectListProps> = ({
  selectedMemberId,
  studyPackage,
  isEnabled
}) => {
  const navigation = useNavigation<StudyDetailsNavigationProp>();
  return (
    <ScrollView style={{ marginBottom: 30 }}>
      {subjects.map((item, index) => (
        <TouchableOpacity
          style={[
            styles.container,
            { backgroundColor: getBackgroundColor(String(index)) },
          ]
}
          key={index}
          disabled={!isEnabled}
          onPress={() => {
            navigation.navigate("StudyPlanDetailsScreen", {
              userId: Number(selectedMemberId),
              studyPackage: {
                ...studyPackage,
                courseName: item.name,
                logoType: item.logo,
                color: getBackgroundColor(String(index)),
                userId: Number(selectedMemberId),
                courseInfo: studyPackage?.studyPlanInfo[convertSubjectToId[item.name]]
              },
            });
          }}
        >
          <View style={styles.contentContainer}>
            <Image source={item.logo} style={styles.iconStyles} />
            <Text style={styles.subjectText}>{item.name}</Text>
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
    marginTop: 15,
    marginHorizontal: 30,
    padding: 17.5,
  },
  contentContainer: {
    flexDirection: "row",
  },
  iconStyles: {
    width: 55,
    height: 55,
  },
  subjectText: {
    fontSize: 17.5,
    fontWeight: "600",
    alignSelf: "center",
    marginLeft: 30,
    color: "#373636",
  },
});

export default SubjectList;
