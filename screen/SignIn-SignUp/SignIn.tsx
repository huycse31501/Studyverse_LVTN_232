import React from "react";
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

const SignIn = () => {
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
              value={""}
              textInputConfig={{
                onChangeText: () => {},
              }}
            />
            <PasswordInputField
              placeHolder="Mật khẩu"
              isValid={true}
              value={""}
              textInputConfig={{
                onChangeText: () => {},
              }}
            />
          </View>
          <View style={styles.applyButton}>
            <ApplyButton label="ĐĂNG NHẬP" onPress={() => {}} />
          </View>
          <View>
            <TouchableTextComponent text="Quên mật khẩu" />
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
