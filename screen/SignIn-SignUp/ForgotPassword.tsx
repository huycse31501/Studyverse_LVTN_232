import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  ActivityIndicator,
  Alert,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AuthButton from "../../component/signin-signup/AuthButton";
import RedTextHeader from "../../component/shared/RedTextHeader";
import TextInputField from "../../component/signin-signup/TextInputField";
import TouchableTextComponent from "../../component/shared/TouchableText";
import ApplyButton from "../../component/shared/ApplyButton";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import regexVault from "../../utils/regex";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Constants from "expo-constants";

type ForgotPasswordNavigationProp = StackNavigationProp<{
  SignIn: undefined;
  SignUp: undefined;
  OTPScreen: {
    email?: any;
  };
}>;

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation<ForgotPasswordNavigationProp>();
  const isEnglishEnabled = useSelector(
    (state: RootState) => state.language.isEnglishEnabled
  );
  const [inputs, setInputs] = useState({
    email: {
      value: "",
      required: true,
    },
  });

  const [inputValidation, setInputValidation] = useState({
    isEmailValid: regexVault.emailValidate.test(inputs.email.value),
  });

  useEffect(() => {
    const updatedValidation = {
      isEmailValid: regexVault.emailValidate.test(inputs.email.value),
    };
    setInputValidation(updatedValidation);
  }, [inputs]);

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
    let allFieldsValid = Object.values(inputValidation).every((valid) => valid);

    for (const [key, value] of Object.entries(inputs)) {
      if (value.required && !value.value) {
        allFieldsFilled = false;
        break;
      }
    }

    if (!allFieldsFilled) {
      Alert.alert("Thông báo", "Bạn cần nhập đủ thông tin theo yêu cầu");
    } else if (!allFieldsValid) {
      Alert.alert("Thông báo", "Thông tin email chưa hợp lệ");
    } else {
      try {
        setIsLoading(true);
        let host = Constants?.expoConfig?.extra?.host;
        const requestOTPURL = `https://${host}/user/sendOTP`;
        const response = await fetch(requestOTPURL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: inputs.email.value,
          }),
        });
        const message = await response.json();
        console.log(message, inputs.email.value)
        setIsLoading(false);

        if (message.msg == "1") {
          setIsLoading(false);
          setInputs({
            email: { value: "", required: true },
          });
          setInputValidation({
            isEmailValid: true,
          });
          navigation.navigate("OTPScreen", {
            email: inputs.email.value,
          });
        } else Alert.alert("Thất bại", "Xác thực thất bại");
      } catch (e) {
        setIsLoading(false);
        Alert.alert("Lỗi trong quá trình xác thực - Email không tồn tại");
      }
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: 80 }}>
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
            <RedTextHeader
              text={isEnglishEnabled ? "FORGOT PASSWORD" : "QUÊN MẬT KHẨU"}
            />
          </View>
          <View style={styles.introText}>
            <Text style={styles.introTextStyle}>
              {isEnglishEnabled
                ? "What is your email address?"
                : "Nhập địa chỉ email của bạn"}
            </Text>
          </View>
          <View style={styles.inputField}>
            <TextInputField
              placeHolder="Email"
              required
              isValid={inputValidation.isEmailValid}
              value={inputs.email.value}
              textInputConfig={{
                onChangeText: inputChangedHandler.bind(this, "email"),
              }}
            />
          </View>
          <View style={styles.backToSignIn}>
            <Text style={styles.backToSignInText}>
              {isEnglishEnabled ? "Back to" : "Trở lại"}
            </Text>
            <TouchableTextComponent
              text={isEnglishEnabled ? "Sign In" : "Đăng nhập"}
              onPress={() => {
                setInputs({
                  email: { value: "", required: true },
                });
                setInputValidation({
                  isEmailValid: true,
                });
                navigation.navigate("SignIn");
              }}
            />
          </View>
          <View style={styles.sendOTPButton}>
            <ApplyButton
              label={
                isEnglishEnabled ? "SEND VALIDATION CODE" : "GỬI MÃ XÁC THỰC"
              }
              extraStyle={styles.OTPButton}
              onPress={submitHandler}
            />
          </View>
          <View style={styles.askToSignUp}>
            <Text style={styles.askToSignUpText}>
              {isEnglishEnabled
                ? "You have no account yet?"
                : "Bạn chưa có tài khoản?"}
            </Text>
          </View>
          <View style={styles.backToSignUpContainer}>
            <ApplyButton
              label={isEnglishEnabled ? "SIGN UP" : "ĐĂNG KÝ"}
              extraStyle={styles.backToSignUpButton}
              extraTextStyle={styles.backToSignUpButtonTextStyle}
              onPress={() => {
                setInputs({
                  email: { value: "", required: true },
                });
                setInputValidation({
                  isEmailValid: true,
                });
                navigation.navigate("SignUp");
              }}
            />
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
  header: {},
  introText: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  introTextStyle: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: "12.5%",
    color: "#444444",
  },
  inputField: {
    paddingLeft: "6.8%",
    paddingRight: "6.8%",
  },
  backToSignIn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "7.5%",
  },
  backToSignInText: {
    fontSize: 16,
    color: "#666666",
    paddingRight: "2%",
    fontWeight: "500",
  },
  sendOTPButton: {
    marginTop: "20%",
  },
  OTPButton: {
    width: "80%",
    height: 50,
  },
  askToSignUp: {
    flexDirection: "column",
    alignItems: "center",
    paddingHorizontal: 7,
    marginTop: "30%",
  },
  askToSignUpText: {
    fontSize: 18,
    color: "#666666",
    fontWeight: "500",
  },
  backToSignUpContainer: {
    marginTop: "5%",
  },
  backToSignUpButton: {
    backgroundColor: "#F9F9F9",
    borderWidth: 2,
    borderRadius: 30,
    borderColor: "#0e0d0d7a",
  },
  backToSignUpButtonTextStyle: {
    color: "#000000",
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
});

export default ForgotPassword;
