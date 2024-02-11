import React from "react";
import {
  StyleSheet,
  KeyboardAvoidingView,
  SafeAreaView,
  Platform,
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const listOfAccountSetting = [
  {
    name: "Thông tin cá nhân",
    image: require("../../assets/images/dashboard/setting1.png"),
  },
  {
    name: "Thông tin gia đình",
    image: require("../../assets/images/dashboard/setting2.png"),
  },
  {
    name: "Mật khẩu",
    image: require("../../assets/images/dashboard/setting3.png"),
  },
  {
    name: "Thông báo",
    image: require("../../assets/images/dashboard/setting4.png"),
  },
];

const extraSetting = [
  {
    name: "Đánh giá & Nhận xét",
    image: require("../../assets/images/dashboard/setting5.png"),
  },
  {
    name: "Hỗ trợ",
    image: require("../../assets/images/dashboard/setting6.png"),
  },
];
const Setting = () => {
  return (
    <SafeAreaView style={{ flex: 1, paddingTop: "15.5%" }}>
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
          <View style={styles.titleContainer}>
            <TouchableOpacity>
              <Image
                source={require("../../assets/images/dashboard/left-arrow.png")}
                style={styles.leftArrow}
              />
            </TouchableOpacity>
            <Text style={styles.title}>Cài đặt</Text>
            <View style={{ width: 45 }} />
          </View>
          <View style={styles.imageContainer}>
            <Image
              source={require("../../assets/images/dashboard/avatar.png")}
              style={styles.avatar}
            />
          </View>
          <Text style={styles.account}>Tài khoản</Text>
          <View style={styles.accountSettingContainer}>
            {listOfAccountSetting.map((setting, index) => (
              <TouchableOpacity key={index} style={styles.functionContainer}>
                <Image source={setting.image} style={styles.imageFunction} />
                <Text style={styles.textFunction}>{setting.name}</Text>
                <View style={styles.rightArrowContainer}>
                  <Image
                    style={styles.rightArrow}
                    source={require("../../assets/images/dashboard/right-arrow.png")}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.account}>Thêm</Text>
          <View style={styles.accountSettingContainer}>
            {extraSetting.map((setting, index) => (
              <TouchableOpacity key={index} style={styles.functionContainer}>
                <Image source={setting.image} style={styles.imageFunction} />
                <Text style={styles.textFunction}>{setting.name}</Text>
                <View style={styles.rightArrowContainer}>
                  <Image
                    style={styles.rightArrow}
                    source={require("../../assets/images/dashboard/right-arrow.png")}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity>
            <Text style={styles.logout}>Đăng xuất</Text>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    marginLeft: "3%",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
  },
  leftArrow: {
    width: 30,
    height: 30,
  },
  title: {
    fontSize: 20,
    color: "#090A0A",
    alignSelf: "center",
    textAlign: "center",
  },
  imageContainer: {
    marginTop: "5%",
  },
  avatar: {
    alignSelf: "center",
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#FFFFFF",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  account: {
    color: "#090A0A",
    fontWeight: "bold",
    fontSize: 18,
    marginLeft: "5%",
    marginTop: "3%",
  },
  accountSettingContainer: {
    paddingVertical: 10,
  },
  functionContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  textFunction: {
    flex: 1,
    color: "#090A0A",
    fontSize: 16,
    marginLeft: 12.5,
  },
  imageFunction: {
    width: 30,
    height: 30,
  },
  rightArrowContainer: {
    alignItems: "flex-end",
    flex: 1,
  },
  rightArrow: {
    width: 30,
    height: 30,
  },
  logout: {
    color: "#979C9E",
    fontSize: 18,
    alignSelf: "center",
    marginTop: "10%",
  },
});

export default Setting;
