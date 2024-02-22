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
  avatarUri: ImageSourcePropType;
}

type UserDetailsRouteProp = RouteProp<RootStackParamList, "UserDetailsScreen">;

interface UserDetailsScreenProps {
  route: UserDetailsRouteProp;
  navigation: StackNavigationProp<RootStackParamList, "UserDetailsScreen">;
}
const UserDetailsScreen = ({ route, navigation }: UserDetailsScreenProps) => {
  const { user } = route.params;

  const [confirmCancelModalVisible, setConfirmCancelModalVisible] =
    useState(false);

  const handleCancelButton = () => {
    setConfirmCancelModalVisible(false);
  };
  return (
    <SafeAreaView style={{ flex: 1, paddingTop: "10%" }}>
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
          {user && (
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
                <Text style={styles.title}>Thông tin chi tiết</Text>
              </View>
              <View style={styles.userInformationContainer}>
                <View style={styles.card}>
                  <Image source={user.avatarUri} style={styles.avatar} />
                  <View style={styles.textContainer}>
                    <Text style={styles.textInfo}>
                      Họ và tên: {user.fullName}
                    </Text>
                    <Text style={styles.textInfo}>
                      Biệt danh: {user.nickname}
                    </Text>
                    <Text style={styles.textInfo}>
                      Ngày sinh: {user.birthdate}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.activityContainer}>
                <TouchableOpacity style={styles.activityButton}>
                  <Text style={styles.activityText}>Thời gian biểu</Text>

                  <Image
                    source={require("../../assets/images/dashboard/scheduleIcon.png")}
                    style={styles.activityIcon}
                  />
                </TouchableOpacity>

                <TouchableOpacity style={styles.activityButton}>
                  <Text style={styles.activityText}>Huy hiệu</Text>
                  <Image
                    source={require("../../assets/images/dashboard/badgeIcon.png")}
                    style={styles.activityIcon}
                  />
                </TouchableOpacity>

                <TouchableOpacity style={styles.activityButton}>
                  <Text style={styles.activityText}>Nhắc nhở</Text>
                  <Image
                    source={require("../../assets/images/dashboard/remindIcon.png")}
                    style={styles.activityIcon}
                  />
                </TouchableOpacity>

                <TouchableOpacity style={styles.activityButton}>
                  <Text style={styles.activityText}>Hoạt động mạng</Text>
                  <Image
                    source={require("../../assets/images/dashboard/networkIcon.png")}
                    style={styles.activityIcon}
                  />
                </TouchableOpacity>
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
    marginTop: "6%",
    alignSelf: "center",
  },
  userInformationContainer: {
    marginTop: "4%",
  },
  card: {
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    marginLeft: "7.5%",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 40,
  },
  textInfo: {
    color: "#242425",
    fontSize: 16,
    textAlign: "left",
    fontWeight: "500",
    paddingVertical: 3,
  },
  activityContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: "12.5%",
  },
  activityButton: {
    width: 150,
    height: 150,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 10,
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  activityIcon: {
    width: 65,
    height: 65,
    marginBottom: 5,
    marginTop: "10%",
  },
  activityText: {
    fontSize: 16.5,
    textAlign: "center",
    color: "#242425",
    fontWeight: "bold",
  },
  cancelButtonContainer: {
    marginTop: "10%",
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
});

export default UserDetailsScreen;
