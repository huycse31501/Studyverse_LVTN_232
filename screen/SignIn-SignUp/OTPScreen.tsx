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
import OTPInput from "../../component/shared/OTPInput";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

type OTPScreenNavigationProp = StackNavigationProp<{
  SignIn: undefined;
  SignUp: undefined;
  NewPasswordScreen: undefined;
}>;

const OTPScreen = () => {
  const navigation = useNavigation<OTPScreenNavigationProp>();
  const isEnglishEnabled = useSelector(
    (state: RootState) => state.language.isEnglishEnabled
  );
  const [OTPinput, setOTPInput] = useState(["", "", "", ""] as [
    string,
    string,
    string,
    string
  ]);

  const handleInputChange = (text: string, index: number) => {
    const newInput = [...OTPinput] as [string, string, string, string];
    newInput[index] = text;
    setOTPInput(newInput);
  };

  function submitHandler() {
    setOTPInput(["", "", "", ""]);
    Alert.alert("Thành công", `Xác thực OTP: ${OTPinput.join("")}`);
    navigation.navigate("NewPasswordScreen");
  }

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: 65 }}>
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
            <RedTextHeader text={isEnglishEnabled ? "VALIDATION CODE" :"ĐIỀN MÃ XÁC THỰC"} />
          </View>
          <View style={styles.OTPContainer}>
            <OTPInput input={OTPinput} onInputChange={handleInputChange} />
          </View>
          <View style={styles.resendOTP}>
            <Text style={styles.resendOTPText}>{isEnglishEnabled ? "Did not receive OTP yet?" :"Không nhận được mã?"}</Text>
            <TouchableTextComponent
              text={isEnglishEnabled ? "Resend" :"Gửi lại"}
              onPress={() => Alert.alert("Handle gửi lại OTP")}
            />
          </View>
          <View style={styles.sendOTPButton}>
            <ApplyButton
              label={isEnglishEnabled ? "SUBMIT" :"XÁC THỰC"}
              extraStyle={styles.OTPButton}
              onPress={submitHandler}
            />
          </View>
          <View style={styles.askToSignUp}>
          <Text style={styles.askToSignUpText}>{isEnglishEnabled ? "You have no account yet?" :"Bạn chưa có tài khoản?"}</Text>
          </View>
          <View style={styles.backToSignUpContainer}>
            <ApplyButton
              label={isEnglishEnabled ? "SIGN UP" :"ĐĂNG KÝ"}
              extraStyle={styles.backToSignUpButton}
              extraTextStyle={styles.backToSignUpButtonTextStyle}
              onPress={() => navigation.navigate("SignUp")}
            />
          </View>
          <View style={styles.backToSignIn}>
          <Text style={styles.backToSignInText}>{isEnglishEnabled ? "Back to" :"Trở lại"}</Text>
            <TouchableTextComponent
              text={isEnglishEnabled ? "Sign In" :"Đăng nhập"}
              onPress={() => navigation.navigate("SignIn")}
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
  resendOTP: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "7.5%",
  },
  resendOTPText: {
    fontSize: 16,
    color: "#666666",
    paddingRight: "2%",
    fontWeight: "500",
  },
  sendOTPButton: {
    marginTop: "10%",
  },
  OTPButton: {
    width: "50%",
    height: 50,
  },
  askToSignUp: {
    flexDirection: "column",
    alignItems: "center",
    paddingHorizontal: 7,
    marginTop: "25%",
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
  OTPContainer: {
    marginTop: "17.5%",
  },
  backToSignIn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "25%",
  },
  backToSignInText: {
    fontSize: 16,
    color: "#666666",
    paddingRight: "2%",
    fontWeight: "500",
  },
});

export default OTPScreen;
