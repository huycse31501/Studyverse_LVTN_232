import { RouteProp, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
  KeyboardAvoidingView,
  SafeAreaView,
  Platform,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RootStackParamList } from "../../component/navigator/appNavigator";
import ApplyButton from "../../component/shared/ApplyButton";

export interface User {
  fullName: string;
  nickname: string;
  birthdate: string;
  phoneNumber: string;
  avatarUri: ImageSourcePropType;
}

const mockUser: User = {
  fullName: "Mai Ánh Vân",
  nickname: "Mẹ thỏ",
  birthdate: "19/03/1988",
  phoneNumber: "0935816646",
  avatarUri: require("../../assets/images/dashboard/avatar.png"),
};

type UserInformationScreenProp = StackNavigationProp<{
  StatusDashboard: undefined;
}>;

const UserInformationScreen = () => {
  const navigation = useNavigation<UserInformationScreenProp>();

  const [confirmCancelModalVisible, setConfirmCancelModalVisible] =
    useState(false);

  const handleCancelButton = () => {
    setConfirmCancelModalVisible(false);
  };
  return (
    <SafeAreaView style={{ flex: 1, paddingTop: 30 }}>
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
          {mockUser && (
            <>
              <View style={styles.backButtonContainer}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => navigation.navigate("StatusDashboard")}
                >
                  <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Thông tin cá nhân</Text>
              </View>
              <View style={styles.userAvatarContainer}>
                <View style={styles.card}>
                  <Image source={mockUser.avatarUri} style={styles.avatar} />
                </View>
              </View>
              <View style={styles.textContainer}>
                <View style={styles.informationContainer}>
                  <Text style={styles.textInfo}>
                    Họ và tên: {mockUser.fullName}
                  </Text>
                  <TouchableOpacity style={styles.editIcon}>
                    <Image
                      source={require("../../assets/images/shared/edit.png")}
                      style={styles.editIcon}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.informationContainer}>
                  <Text style={styles.textInfo}>
                    Biệt danh: {mockUser.nickname}
                  </Text>
                  <TouchableOpacity style={styles.editIcon}>
                    <Image
                      source={require("../../assets/images/shared/edit.png")}
                      style={styles.editIcon}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.informationContainer}>
                  <Text style={styles.textInfo}>
                    Số điện thoại: {mockUser.phoneNumber}
                  </Text>
                  <TouchableOpacity style={styles.editIcon}>
                    <Image
                      source={require("../../assets/images/shared/edit.png")}
                      style={styles.editIcon}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.informationContainer}>
                  <Text style={styles.textInfo}>
                    Ngày sinh: {mockUser.birthdate}
                  </Text>
                  <TouchableOpacity style={styles.editIcon}>
                    <Image
                      source={require("../../assets/images/shared/edit.png")}
                      style={styles.editIcon}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.cancelButtonContainer}>
                <ApplyButton
                  label="Hủy liên kết"
                  onPress={() => {
                    setConfirmCancelModalVisible(true);
                  }}
                  extraStyle={styles.cancelButton}
                ></ApplyButton>
              </View>
            </>
          )}
        </KeyboardAwareScrollView>
      </KeyboardAvoidingView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={confirmCancelModalVisible}
        onRequestClose={() => setConfirmCancelModalVisible(false)}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            setConfirmCancelModalVisible(false);
          }}
        >
          <View style={styles.cancelModalContainer}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.cancelModalView}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => {
                    setConfirmCancelModalVisible(false);
                  }}
                >
                  <Image
                    source={require("../../assets/images/shared/closedModal.png")}
                    style={styles.closeIcon}
                  />
                </TouchableOpacity>
                <Text style={styles.modalIntroText}>Hủy liên kết</Text>
                <Text style={styles.modalWarningText}>
                  Lưu ý: Thành viên sau khi hủy sẽ chỉ được liên kết lại sau 14
                  ngày
                </Text>
                <ApplyButton
                  extraStyle={styles.modalButton}
                  label="XÁC NHẬN"
                  onPress={handleCancelButton}
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
  backButtonContainer: {
    marginTop: "6%",
    marginLeft: "7.5%",
  },
  backButton: {},
  backButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FF2D58",
  },
  title: {
    color: "#1E293B",
    fontWeight: "600",
    fontSize: 25,
  },
  titleContainer: {
    marginTop: 20,
    alignSelf: "center",
  },
  userAvatarContainer: {
    marginTop: 20,
    alignSelf: "center",
  },
  card: {
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    marginLeft: "7.5%",
    marginTop: "5%",
    paddingVertical: 20,
  },
  avatar: {
    width: 125,
    height: 125,
    borderRadius: 40,
  },
  informationContainer: {
    flexDirection: "row",
  },

  textInfo: {
    color: "#242425",
    fontSize: 20,
    textAlign: "left",
    fontWeight: "500",
    paddingVertical: 20,
  },

  cancelButtonContainer: {
    marginTop: 75,
  },
  cancelButton: {
    width: 200,
  },
  cancelModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  cancelModalView: {
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
  modalIntroText: {
    color: "#54595E",
    fontWeight: "600",
    fontSize: 21.5,
    alignSelf: "center",
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
  editIcon: {
    height: 30,
    width: 30,
    alignSelf: "center",
    marginBottom: 5,
    marginLeft: 25,
  },
});

export default UserInformationScreen;
