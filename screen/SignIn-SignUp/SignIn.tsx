import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AuthButton from "../../component/signin-signup/AuthButton";
import TextInputField from "../../component/signin-signup/TextInputField";
import PasswordInputField from "../../component/signin-signup/PasswordInputField";
import ApplyButton from "../../component/shared/ApplyButton";
import TouchableTextComponent from "../../component/shared/TouchableText";
import regexVault from "../../utils/regex";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";

type ForgotPasswordNavigationProp = StackNavigationProp<{
  ForgotPassword: undefined;
  StatusDashboard: undefined;
}>;

const SignIn = () => {
  const navigation = useNavigation<ForgotPasswordNavigationProp>();
  const [inputs, setInputs] = useState({
    email: {
      value: "",
      required: true,
    },
    password: {
      value: "",
      required: true,
    },
  });

  function inputChangedHandler(
    inputIdentifier: keyof typeof inputs,
    enteredValue: string
  ) {
    setInputs((curInputs) => {
      const currentInput = curInputs[inputIdentifier];

      if (currentInput) {
        return {
          ...curInputs,
          [inputIdentifier]: {
            ...currentInput,
            value: enteredValue,
          },
        };
      }

      return curInputs;
    });
  }

  async function submitHandler() {
    let allFieldsFilled = true;

    for (const [key, value] of Object.entries(inputs)) {
      if (value.required && !value.value) {
        allFieldsFilled = false;
        break;
      }
    }

    if (!allFieldsFilled) {
      Alert.alert("Thông báo", "Bạn cần nhập đủ thông tin đăng nhập");
    } else {
      setInputs({
        email: { value: "", required: true },
        password: { value: "", required: true },
      });
      const response = await fetch('http://192.168.1.17:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "email": inputs.email.value,
          "password": inputs.password.value
        })
      });
      const message = await response.json();
      if (message.msg == "1") {
        Alert.alert("Thành công", "Đăng nhập thành công");
        navigation.navigate("StatusDashboard");
      }
      else Alert.alert("Thất bại", "Đăng nhập thất bại");
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: 70 }}>
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
          <View style={styles.authButton}>
            <AuthButton type="SignIn" />
          </View>
          <Image
            source={require("../../assets/images/signIn-signUp/bigLogo.png")}
            style={styles.logo}
          />
          <View style={styles.inputField}>
            <TextInputField
              placeHolder="Email"
              required
              isValid={true}
              value={inputs.email.value}
              textInputConfig={{
                onChangeText: inputChangedHandler.bind(this, "email"),
              }}
            />
            <PasswordInputField
              placeHolder="Mật khẩu"
              isValid={true}
              value={inputs.password.value}
              textInputConfig={{
                onChangeText: inputChangedHandler.bind(this, "password"),
              }}
            />
          </View>
          <View style={styles.applyButton}>
            <ApplyButton label="ĐĂNG NHẬP" onPress={submitHandler} />
          </View>
          <View>
            <TouchableTextComponent
              text="Quên mật khẩu"
              onPress={() => navigation.navigate("ForgotPassword")}
            />
          </View>
        </KeyboardAwareScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  authButton: {
    marginBottom: "10%",
  },
  logo: {
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: "5%",
  },
  inputField: {
    flex: 1,
    paddingLeft: "6.8%",
    paddingRight: "6.8%",
  },
  applyButton: {
    alignItems: "center",
    width: "100%",
    marginTop: "15%",
    marginBottom: "7.5%",
  },
});

export default SignIn;
