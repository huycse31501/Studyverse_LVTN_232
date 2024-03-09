import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import {
  StyleSheet,
  KeyboardAvoidingView,
  SafeAreaView,
  Platform,
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ApplyButton from "../../component/shared/ApplyButton";
import regexVault from "../../utils/regex";

type DetailsNavigationProp = StackNavigationProp<{
  StatusDashboard: undefined;
  FamilyInfoScreen: undefined;
  UserInformationScreen: undefined;
}>;

const Setting = () => {
  const navigation = useNavigation<DetailsNavigationProp>();

  const [linkStatus, setLinkStatus] = useState("unlinked");
  const [familyLinkedModalVisible, setFamilyLinkedModalVisible] =
    useState(false);
  const [createFamilyModalVisible, setcreateFamilyModalVisible] =
    useState(false);
  const [familyLinkInfo, setFamilyLinkInfo] = useState("");

  const handleApplyPress = () => {
    setFamilyLinkedModalVisible(true);
  };

  const handleUnlinkPress = () => {
    setLinkStatus("unlinked");
    setFamilyLinkInfo("");
  };

  const handleCreateFamily = () => {
    setcreateFamilyModalVisible(false);
    setLinkStatus("linked");
  };
  const handleConfirmLink = () => {
    if (regexVault.emailValidate.test(familyLinkInfo)) {
      setLinkStatus("pending");
      setFamilyLinkedModalVisible(false);
      console.log(familyLinkInfo);
    } else {
      alert("Vui lòng email hợp lệ");
    }
  };

  const listOfAccountSetting = [
    {
      name: "Thông tin cá nhân",
      image: require("../../assets/images/dashboard/setting1.png"),
      onPress: () => {
        navigation.navigate("UserInformationScreen");
      },
      valid: true,
    },
    {
      name: "Tạo gia đình",
      image: require("../../assets/images/dashboard/setting2.png"),
      onPress: () => {
        setcreateFamilyModalVisible(true);
      },
      valid: !!(linkStatus === "unlinked"),
    },
    {
      name: "Thông tin gia đình",
      image: require("../../assets/images/dashboard/setting2.png"),
      onPress: () => navigation.navigate("FamilyInfoScreen"),
      valid: !!(linkStatus === "linked"),
    },
    {
      name: "Mật khẩu",
      image: require("../../assets/images/dashboard/setting3.png"),
      onPress: () => {},
      valid: true,
    },
    {
      name: "Thông báo",
      image: require("../../assets/images/dashboard/setting4.png"),
      onPress: () => {},
      valid: true,
    },
  ];

  const extraSetting = [
    {
      name: "Hỗ trợ",
      image: require("../../assets/images/dashboard/setting6.png"),
    },
    {
      name: "Đăng xuất",
      image: require("../../assets/images/shared/logout.png"),
    },
  ];

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
          <View style={styles.titleContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate("StatusDashboard")}
            >
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
            {listOfAccountSetting.map(
              (setting, index) =>
                setting.valid && (
                  <TouchableOpacity
                    key={index}
                    style={styles.functionContainer}
                    onPress={setting.onPress}
                  >
                    <Image
                      source={setting.image}
                      style={styles.imageFunction}
                    />
                    <Text style={styles.textFunction}>{setting.name}</Text>
                    <View style={styles.rightArrowContainer}>
                      <Image
                        style={styles.rightArrow}
                        source={require("../../assets/images/dashboard/right-arrow.png")}
                      />
                    </View>
                  </TouchableOpacity>
                )
            )}
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
          {linkStatus === "unlinked" && (
            <>
              <Text style={styles.linkText}>Tài khoản chưa liên kết</Text>
              <ApplyButton
                extraStyle={styles.linkButton}
                label="LIÊN KẾT GIA ĐÌNH"
                onPress={handleApplyPress}
              />
            </>
          )}

          {linkStatus === "pending" && (
            <>
              <Text style={styles.pendingLinkText}>
                Đã gửi yêu cầu liên kết
              </Text>
              <ApplyButton
                extraStyle={styles.pendingLinkButton}
                label="HỦY"
                onPress={handleUnlinkPress}
              />
            </>
          )}

          {linkStatus === "linked" && (
            <>
              <Text style={styles.linkedText}>
                Tài khoản đã liên kết gia đình
              </Text>
            </>
          )}
        </KeyboardAwareScrollView>
      </KeyboardAvoidingView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={familyLinkedModalVisible}
        onRequestClose={() => {
          setFamilyLinkedModalVisible(false);
          setFamilyLinkInfo("");
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            setFamilyLinkedModalVisible(false);
            setFamilyLinkInfo("");
          }}
        >
          <View style={styles.centeredView}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalView}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => {
                    setFamilyLinkedModalVisible(false);
                    setFamilyLinkInfo("");
                  }}
                >
                  <Image
                    source={require("../../assets/images/shared/closedModal.png")}
                    style={styles.closeIcon}
                  />
                </TouchableOpacity>
                <Text style={styles.modalIntroText}>Liên kết gia đình</Text>
                <TextInput
                  style={styles.modalTextInput}
                  placeholder="Email liên kết"
                  value={familyLinkInfo}
                  onChangeText={setFamilyLinkInfo}
                />
                <ApplyButton
                  extraStyle={styles.modalButton}
                  label="XÁC NHẬN"
                  onPress={handleConfirmLink}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={createFamilyModalVisible}
        onRequestClose={() => setcreateFamilyModalVisible(false)}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            setcreateFamilyModalVisible(false);
          }}
        >
          <View style={styles.centeredCreateFamilyView}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.createFamilyModalView}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => {
                    setcreateFamilyModalVisible(false);
                  }}
                >
                  <Image
                    source={require("../../assets/images/shared/closedModal.png")}
                    style={styles.closeIcon}
                  />
                </TouchableOpacity>
                <Text style={styles.modalIntroText}>Tạo gia đình</Text>
                <Text style={styles.modalWarningText}>
                  Lưu ý: Tài khoản sau khi khởi tạo gia đình sẽ không hủy được
                </Text>
                <ApplyButton
                  extraStyle={styles.modalButton}
                  label="XÁC NHẬN"
                  onPress={handleCreateFamily}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
    fontSize: 22,
    fontWeight: "400",
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
  pendingText: {
    alignSelf: "center",
    marginVertical: 20,
    fontSize: 16,
    color: "#FF9500",
  },
  linkButton: {
    width: 265,
    height: 56,
  },
  linkText: {
    alignSelf: "center",
    color: "#FF2D58",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: "5%",
  },
  pendingLinkText: {
    alignSelf: "center",
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: "5%",
    marginTop: "7.5%",
  },
  pendingLinkButton: {
    width: 216,
    height: 56,
  },
  linkedText: {
    alignSelf: "center",
    color: "#FF2D58",
    fontSize: 16,
    fontWeight: "600",
    marginTop: "10%",
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  centeredCreateFamilyView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  createFamilyModalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "90%",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "80%",
  },
  modalIntroText: {
    color: "#54595E",
    fontWeight: "600",
    fontSize: 21.5,
    // marginBottom: "10%",
    alignSelf: "center",
  },
  modalTextInput: {
    height: 50,
    marginVertical: "7.5%",
    borderWidth: 1,
    borderColor: "#D1D1D1",
    borderRadius: 10,
    paddingHorizontal: 50,
    fontSize: 16,
  },
  modalButton: {
    width: 160,
    height: 50,
    marginTop: "2%",
  },
  modalWarningText: {
    color: "#FF2D55",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "left",
    marginTop: "7.5%",
    marginBottom: "7.5%",
  },
  closeButton: {
    position: "absolute",
    top: 15,
    right: 15,
    zIndex: 1,
  },
  closeIcon: {
    width: 24,
    height: 24,
  },
});

export default Setting;
