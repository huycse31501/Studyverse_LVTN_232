import React, { useCallback, useEffect, useRef, useState } from "react";
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
import TextInputField from "../../component/signin-signup/TextInputField";
import PasswordInputField from "../../component/signin-signup/PasswordInputField";
import DateInputField from "../../component/signin-signup/DateInputField";
import OptionSelector from "../../component/shared/OptionSelector";
import ApplyButton from "../../component/shared/ApplyButton";
import regexVault from "../../utils/regex";
import isDateValid from "../../utils/checkValidDate";
import AuthButton from "../../component/signin-signup/AuthButton";
import calculateAge from "../../utils/calculateAge";

type OptionType = "Parent" | "Children";

const SignUp = () => {
  const [curSignUpType, setCurSignUpType] = useState<OptionType>("Parent");
  const [inputs, setInputs] = useState({
    email: {
      value: "",
      required: true,
    },
    password: {
      value: "",
      required: true,
    },
    firstName: {
      value: "",
      required: true,
    },
    lastName: {
      value: "",
      required: true,
    },
    dob: {
      value: "",
      required: false,
    },
    signUpType: {
      value: curSignUpType,
      required: true,
    },
    phoneNumber: {
      value: "",
      required: false,
    },
  });

  const [inputValidation, setInputValidation] = useState({
    isPhoneNumberValid: regexVault.phoneNumberValidate.test(
      inputs.phoneNumber.value
    ),
    isDOBValid:
      regexVault.DOBValidate.test(inputs.dob.value) &&
      isDateValid(inputs.dob.value) &&
      (curSignUpType === "Parent"
        ? calculateAge(inputs.dob.value) > 18
        : calculateAge(inputs.dob.value) > 6),
    isPasswordValid: regexVault.passwordValidate.test(inputs.password.value),
    isFirstNameValid: regexVault.firstNameValidate.test(inputs.firstName.value),
    isLastNameValid: regexVault.lastNameValidate.test(inputs.lastName.value),
    isEmailValid: regexVault.emailValidate.test(inputs.email.value),
  });

  useEffect(() => {
    const age = calculateAge(inputs.dob.value);
    const isAgeValid = curSignUpType === "Parent" ? age > 18 : age > 6;
    const updatedValidation = {
      isPhoneNumberValid: regexVault.phoneNumberValidate.test(
        inputs.phoneNumber.value
      ),
      isDOBValid:
        regexVault.DOBValidate.test(inputs.dob.value) &&
        isDateValid(inputs.dob.value) &&
        isAgeValid,
      isPasswordValid: regexVault.passwordValidate.test(inputs.password.value),
      isFirstNameValid: regexVault.firstNameValidate.test(
        inputs.firstName.value
      ),
      isLastNameValid: regexVault.lastNameValidate.test(inputs.lastName.value),
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

  const handleOptionChange = (selectedOption: OptionType) => {
    inputChangedHandler("signUpType", selectedOption);
    setCurSignUpType(selectedOption);
  };

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
      console.log(inputs);
      setInputs({
        email: { value: "", required: true },
        password: { value: "", required: true },
        firstName: { value: "", required: true },
        lastName: { value: "", required: true },
        dob: { value: "", required: true },
        signUpType: { value: "Parent", required: true },
        phoneNumber: { value: "", required: false },
      });
      setInputValidation({
        isPhoneNumberValid: true,
        isDOBValid: true,
        isPasswordValid: true,
        isFirstNameValid: true,
        isLastNameValid: true,
        isEmailValid: true,
      });
      Alert.alert("Thành công", "Đăng ký thành công");
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: 60 }}>
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
          <Image
            source={require("../../assets/images/signIn-signUp/appLogo.png")}
            style={styles.logo}
          />
          <View style={styles.authButton}>
            <AuthButton type="SignUp" />
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
            <PasswordInputField
              placeHolder="Mật khẩu"
              isValid={inputValidation.isPasswordValid}
              value={inputs.password.value}
              textInputConfig={{
                onChangeText: inputChangedHandler.bind(this, "password"),
              }}
            />
            <TextInputField
              placeHolder="Họ"
              required
              value={inputs.lastName.value}
              isValid={inputValidation.isLastNameValid}
              textInputConfig={{
                onChangeText: inputChangedHandler.bind(this, "lastName"),
              }}
            />
            <TextInputField
              placeHolder="Tên"
              required
              isValid={inputValidation.isFirstNameValid}
              value={inputs.firstName.value}
              textInputConfig={{
                onChangeText: inputChangedHandler.bind(this, "firstName"),
              }}
            />
            <DateInputField
              required
              placeHolder="Ngày sinh"
              isValid={inputValidation.isDOBValid}
              dateStr={inputs.dob.value}
              signUpType={curSignUpType}
              textInputConfig={{
                onChangeText: inputChangedHandler.bind(this, "dob"),
              }}
            />
            <OptionSelector onOptionChange={handleOptionChange} />
            <TextInputField
              placeHolder="Số điện thoại"
              required={false}
              value={inputs.phoneNumber.value}
              isValid={inputValidation.isPhoneNumberValid}
              textInputConfig={{
                onChangeText: inputChangedHandler.bind(this, "phoneNumber"),
              }}
            />
          </View>
          <View style={styles.applyButton}>
            <ApplyButton label="ĐĂNG KÝ" onPress={submitHandler} />
          </View>
        </KeyboardAwareScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  logo: {
    resizeMode: "contain",
    alignSelf: "center",
  },
  inputField: {
    flex: 1,
    paddingLeft: "6.8%",
    paddingRight: "6.8%",
  },
  applyButton: {
    alignItems: "center",
    width: "100%",
    marginTop: 50,
  },
  authButton: {
    marginBottom: "5%",
  },
});

export default SignUp;
