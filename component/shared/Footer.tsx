import React from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";

type FooterNavigateProp = StackNavigationProp<{
  EventInfoScreen: {
    userId: number;
    routeBefore: string;
    fromFooter?: string;
  };
  ExamInfoScreen: {
    userId: number;
    routeBefore: string;
    newExamCreated?: boolean;
    fromFooter?: string;
  };
  StudyPlanInfoScreen: {
    userId: number;
    routeBefore?: string;
    newExamCreated?: boolean;
    fromFooter?: string;
  };
  StudyStatisticScreen: {
    userId: number;
    fromFooter?: string;
  };
}>;

const Footer = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const navigation = useNavigation<FooterNavigateProp>();
  const icons = [
    {
      id: "1",
      uri: require("../../assets/images/footer/calendar.png"),
      onPress: () =>
        navigation.navigate("EventInfoScreen", {
          userId: Number(user?.userId),
          routeBefore: "StatusDashboard",
          fromFooter: "1",
        }),
    },
    {
      id: "2",
      uri: require("../../assets/images/footer/exam.png"),
      onPress: () =>
        navigation.navigate("ExamInfoScreen", {
          userId: Number(user?.userId),
          routeBefore: "StatusDashboard",
          fromFooter: "1",
        }),
    },
    {
      id: "3",
      uri: require("../../assets/images/footer/study.png"),
      onPress: () => {
        navigation.navigate("StudyPlanInfoScreen", {
          userId: Number(user?.userId),
          routeBefore: "StatusDashboard",
          fromFooter: "1",
        });
      },
    },
    {
      id: "4",
      uri: require("../../assets/images/footer/studyplan.png"),
      onPress: () => {
        navigation.navigate("StudyStatisticScreen", {
          userId: Number(user?.userId),
          fromFooter: "1",
        });
      },
    },
  ];
  return (
    <View style={styles.container}>
      {icons.map((icon) => (
        <TouchableOpacity
          key={icon.id}
          onPress={icon.onPress}
          style={styles.iconWrapper}
        >
          <Image source={icon.uri} style={styles.icon} />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "rgba(239, 242, 244, 0.75)",
    paddingLeft: 10,
    borderTopWidth: 0,
    borderTopColor: "rgba(0, 0, 0, 0.1)",
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOffset: {
      width: 0,
      height: -1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 5,
  },
  iconWrapper: {
    padding: 10,
  },
  icon: {
    height: 40,
    width: 40,
  },
});

export default Footer;
