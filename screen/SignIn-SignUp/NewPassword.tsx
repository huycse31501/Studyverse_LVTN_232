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
import { useNavigation, useRoute } from "@react-navigation/native";
import regexVault from "../../utils/regex";
import PasswordInputField from "../../component/signin-signup/PasswordInputField";

type NewPasswordNavigationProp = StackNavigationProp<{
  SignIn: undefined;
  SignUp: undefined;
  OTPScreen: undefined;
}>;

const NewPasswordScreen = () => {
  const navigation = useNavigation<NewPasswordNavigationProp>();

  const route = useRoute<any>();
  const { email } = route.params;

  const [inputs, setInputs] = useState({
    newpassword: {
      value: "",
      required: true,
    },
    rePassword: {
      value: "",
      required: true,
    },
  });

  const [inputValidation, setInputValidation] = useState({
    isNewPasswordValid: regexVault.passwordValidate.test(
      inputs.newpassword.value
    ),
    isRePasswordValid: !!(
      inputs.newpassword.value &&
      inputs.newpassword.value === inputs.rePassword.value
    ),
  });

  useEffect(() => {
    const updatedValidation = {
      isNewPasswordValid: regexVault.passwordValidate.test(
        inputs.newpassword.value
      ),
      isRePasswordValid: !!(
        inputs.newpassword.value &&
        inputs.newpassword.value === inputs.rePassword.value
      ),
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
      Alert.alert("Thông báo", "Thông tin nhập chưa hợp lệ");
    } else {
      let newPassword = inputs.newpassword.value
      setInputs({
        newpassword: { value: "", required: true },
        rePassword: { value: "", required: true },
      });
      setInputValidation({
        isNewPasswordValid: regexVault.passwordValidate.test(
          inputs.newpassword.value
        ),
        isRePasswordValid: !!(
          inputs.newpassword.value &&
          inputs.newpassword.value === inputs.rePassword.value
        ),
      });

      const response = await fetch('http://192.168.1.17:8080/user/newPassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "email": email,
          "newPassword": newPassword
        })
      });
      const message = await response.json();
      if (message.msg == "1") {
        Alert.alert("Thành công", "Đổi mật khẩu thành công");
      }
      else {
        Alert.alert("Thất bại", "Đổi mật khẩu thất bại");
      }
      navigation.navigate("SignIn");
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: "18.59%" }}>
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
            <RedTextHeader text="ĐẶT LẠI MẬT KHẨU" />
          </View>
          <View style={styles.inputField}>
            <PasswordInputField
              placeHolder="Mật khẩu mới"
              isValid={inputValidation.isNewPasswordValid}
              value={inputs.newpassword.value}
              textInputConfig={{
                onChangeText: inputChangedHandler.bind(this, "newpassword"),
              }}
            />
            <PasswordInputField
              placeHolder="Nhập lại mật khẩu mới"
              customError="Mật khẩu chưa trùng khớp"
              isValid={inputValidation.isRePasswordValid}
              value={inputs.rePassword.value}
              textInputConfig={{
                onChangeText: inputChangedHandler.bind(this, "rePassword"),
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
          <View style={styles.sendNewPassword}>
            <ApplyButton
              label="XÁC NHẬN"
              extraStyle={styles.NewPasswordButton}
              onPress={submitHandler}
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
    marginTop: "12%",
  },
  backToSignIn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "12.5%",
  },
  backToSignInText: {
    fontSize: 16,
    color: "#666666",
    paddingRight: "2%",
    fontWeight: "500",
  },
  sendNewPassword: {
    marginTop: "10%",
  },
  NewPasswordButton: {
    width: "50%",
    height: 50,
  },
});

export default NewPasswordScreen;
