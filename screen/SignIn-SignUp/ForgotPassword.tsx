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

type ForgotPasswordNavigationProp = StackNavigationProp<{
  SignIn: undefined;
  SignUp: undefined;
}>;

const ForgotPassword = () => {
  const navigation = useNavigation<ForgotPasswordNavigationProp>();

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

  function submitHandler() {
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
      Alert.alert("Thông báo", "Thông tin đăng ký chưa hợp lệ");
    } else {
      setInputs({
        email: { value: "", required: true },
      });
      setInputValidation({
        isEmailValid: true,
      });
      Alert.alert("Thành công", "Xác thực");
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: "28.59%" }}>
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
            <RedTextHeader text="QUÊN MẬT KHẨU" />
          </View>
          <View style={styles.introText}>
            <Text style={styles.introTextStyle}>
              Nhập địa chỉ email của bạn
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
            <Text style={styles.backToSignInText}>Trở lại</Text>
            <TouchableTextComponent
              text="Đăng nhập"
              onPress={() => navigation.navigate("SignIn")}
            />
          </View>
          <View style={styles.sendOTPButton}>
            <ApplyButton
              label="GỬI MÃ XÁC THỰC"
              extraStyle={styles.OTPButton}
              onPress={submitHandler}
            />
          </View>
          <View style={styles.askToSignUp}>
            <Text style={styles.askToSignUpText}>Bạn chưa có tài khoản?</Text>
          </View>
          <View style={styles.backToSignUpContainer}>
            <ApplyButton
              label="ĐĂNG KÝ"
              extraStyle={styles.backToSignUpButton}
              extraTextStyle={styles.backToSignUpButtonTextStyle}
              onPress={() => navigation.navigate("SignUp")}
            />
          </View>
        </KeyboardAwareScrollView>
      </KeyboardAvoidingView>
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
});

export default ForgotPassword;
