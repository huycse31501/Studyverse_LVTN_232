import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import AuthButtonProps from "../type/AuthButton";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type AuthNavigationProp = StackNavigationProp<{
  SignIn: undefined;
  SignUp: undefined;
}>;

const AuthButton = ({ type, onEnglish }: AuthButtonProps) => {
  const navigation = useNavigation<AuthNavigationProp>();
  return (
    <View style={styles.container}>
      <TouchableOpacity
        disabled={type === "SignUp"}
        onPress={() => navigation.navigate("SignUp")}
      >
        <View style={styles.buttonContainer}>
          <Text
            style={type === "SignUp" ? [styles.text, styles.bold] : styles.text}
          >
            {onEnglish ? "SIGN UP" :"ĐĂNG KÝ"}
          </Text>
          {type === "SignUp" && <View style={styles.underline} />}
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        disabled={type === "SignIn"}
        onPress={() => navigation.navigate("SignIn")}
      >
        <View style={styles.buttonContainer}>
          <Text
            style={type === "SignIn" ? [styles.text, styles.bold] : styles.text}
          >
            {onEnglish ? "SIGN IN" :"ĐĂNG NHẬP"}
          </Text>
          {type === "SignIn" && <View style={styles.underline} />}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "column",
    alignItems: "center",
    paddingHorizontal: 7,
  },
  text: {
    color: "#FF2D55",
    fontSize: 18,
  },
  bold: {
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

export default AuthButton;
