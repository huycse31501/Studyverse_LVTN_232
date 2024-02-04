import React from "react";
import { StyleSheet, Text, View } from "react-native";

type RedTextHeaderProp = {
  text: string;
};
const RedTextHeader = ({ text }: RedTextHeaderProp) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.buttonContainer}>
        <Text style={styles.headerText}>{text}</Text>
        <View style={styles.underline} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "column",
    alignItems: "center",
    paddingHorizontal: 7,
  },
  headerText: {
    color: "#FF2D55",
    fontSize: 18,
    //fontFamily: "RobotoRegular",
    fontWeight: "bold",
    marginTop: 5,
  },
  underline: {
    height: 3,
    backgroundColor: "#FF0076",
    width: "100%",
    marginTop: 2,
  },
});

export default RedTextHeader;
