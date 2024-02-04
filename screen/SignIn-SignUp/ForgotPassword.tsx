import React from "react";
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AuthButton from "../../component/signin-signup/AuthButton";
import RedTextHeader from "../../component/shared/RedTextHeader";

const ForgotPassword = () => {
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
    // fontFamily: "Montserrat",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ForgotPassword;
