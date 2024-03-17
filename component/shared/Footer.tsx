import React from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";

const icons = [
  {
    id: "1",
    uri: require("../../assets/images/footer/calendar.png"),
    onPress: () => console.log("Icon pressed"),
  },
  {
    id: "2",
    uri: require("../../assets/images/footer/exam.png"),
    onPress: () => console.log("Icon pressed"),
  },
  {
    id: "3",
    uri: require("../../assets/images/footer/studyplan.png"),
    onPress: () => console.log("Icon pressed"),
  },
  {
    id: "4",
    uri: require("../../assets/images/footer/map.png"),
    onPress: () => console.log("Icon pressed"),
  },
];

type FooterNavigateProp = StackNavigationProp<{
  EventInfoScreen: {
    userId: number;
    routeBefore: string;
  };
}>;

const Footer = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const navigation = useNavigation<FooterNavigateProp>();

  return (
    <View style={styles.container}>
      {icons.map((icon) => (
        <TouchableOpacity
          key={icon.id}
          onPress={
            icon.id == "1"
              ? () =>
                  navigation.navigate("EventInfoScreen", {
                    userId: Number(user?.userId),
                    routeBefore: "statusboard",
                  })
              : icon.onPress
          }
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
    backgroundColor: "#EFEFF4",
    paddingLeft: 10,
    shadowColor: "rgba(0,0,0,0.5)",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 20,
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
