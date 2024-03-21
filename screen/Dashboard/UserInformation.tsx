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
  TextInput,
  Alert,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RootStackParamList } from "../../component/navigator/appNavigator";
import ApplyButton from "../../component/shared/ApplyButton";
import regexVault from "../../utils/regex";
import { AppDispatch, RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import Constants from "expo-constants";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/actions/userActions";
import { setWaitList } from "../../redux/actions/waitListAction";
import { setFamilyMember } from "../../redux/actions/familyAction";
import { avatarList } from "../../utils/listOfAvatar";

export interface User {
  firstName: string;
  lastName: string;
  nickname: string;
  birthdate: string;
  phoneNumber: string;
  avatarUri: ImageSourcePropType;
}

const mockUser: User = {
  firstName: "Mai",
  lastName: "Ánh Vân",
  nickname: "Mẹ thỏ",
  birthdate: "19/03/1988",
  phoneNumber: "0935816646",
  avatarUri: require("../../assets/images/dashboard/avatar.png"),
};

type UserInformationScreenProp = StackNavigationProp<{
  StatusDashboard: undefined;
}>;

const UserInformationScreen = () => {
  let host = Constants?.expoConfig?.extra?.host;
  let port = Constants?.expoConfig?.extra?.port;

  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);

  const navigation = useNavigation<UserInformationScreenProp>();

  const [changeInfoModal, setChangeInfoModal] = useState(false);

  const [infoToChange, setInfoToChange] = useState("");

  const [curInfoToChangeType, setCurInfoToChangeType] = useState("");

  const [confirmCancelModalVisible, setConfirmCancelModalVisible] =
    useState(false);

  const handleCancelButton = async () => {
    setConfirmCancelModalVisible(false);
    try {
      let requestCancelFamilyUrl = `http://${host}:${port}/family/outFamily`;
      const cancelFamilyResponse = await fetch(requestCancelFamilyUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user?.email,
        }),
      });
      const cancelResponse = await cancelFamilyResponse.json();
      if (cancelResponse.msg === "1") {
        dispatch(
          setUser({
            ...user,
            familyId: "0",
          })
        );
        dispatch(setWaitList([] as any));
        dispatch(setFamilyMember([] as any));
      } else {
        Alert.alert("Hủy liên kết thất bại");
      }
    } catch (e) {
      console.log(e);
      Alert.alert("Lỗi xảy ra trong quá trình hủy liên kết");
    }
  };

  const handleSubmitChangeInfo = () => {
    switch (curInfoToChangeType) {
      case "số điện thoại":
        if (regexVault.phoneNumberValidate.test(infoToChange)) {
          setInfoToChange("");
          setChangeInfoModal(false);
          console.log(infoToChange);
        } else {
          alert("Vui lòng nhập số điện thoại hợp lệ");
        }
        break;
      case "họ":
        if (regexVault.firstNameValidate.test(infoToChange)) {
          setInfoToChange("");
          setChangeInfoModal(false);
          console.log(infoToChange);
        } else {
          alert("Vui lòng nhập họ hợp lệ");
        }
        break;
      case "tên":
        if (regexVault.lastNameValidate.test(infoToChange)) {
          setInfoToChange("");
          setChangeInfoModal(false);
        } else {
          alert("Vui lòng nhập tên hợp lệ");
        }
        break;
      case "biệt danh":
        if (regexVault.firstNameValidate.test(infoToChange)) {
          setInfoToChange("");
          setChangeInfoModal(false);
        } else {
          alert("Vui lòng nhập biệt danh hợp lệ");
        }
        break;
      case "ngày sinh":
        if (regexVault.DOBValidate.test(infoToChange)) {
          setInfoToChange("");
          setChangeInfoModal(false);
        } else {
          alert("Vui lòng nhập ngày sinh hợp lệ");
        }
        break;
      default:
        alert("Đã có lỗi xảy ra, vui lòng quay về màn hình thông tin");
    }
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
                  <Image
                    source={{
                      uri:
                        avatarList[Number(user?.avatarId) - 1] ?? avatarList[0],
                    }}
                    style={styles.avatar}
                  />
                </View>
              </View>
              <View style={styles.textContainer}>
                <View style={styles.informationContainer}>
                  <Text style={styles.textInfo}>Họ: {user?.firstName}</Text>
                  <TouchableOpacity
                    style={styles.editIcon}
                    onPress={() => {
                      setChangeInfoModal(true);
                      setCurInfoToChangeType("họ");
                    }}
                  >
                    <Image
                      source={require("../../assets/images/shared/edit.png")}
                      style={styles.editIcon}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.informationContainer}>
                  <Text style={styles.textInfo}>Tên: {user?.lastName}</Text>
                  <TouchableOpacity
                    style={styles.editIcon}
                    onPress={() => {
                      setChangeInfoModal(true);
                      setCurInfoToChangeType("tên");
                    }}
                  >
                    <Image
                      source={require("../../assets/images/shared/edit.png")}
                      style={styles.editIcon}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.informationContainer}>
                  <Text style={styles.textInfo}>
                    Biệt danh: {user?.nickName}
                  </Text>
                  <TouchableOpacity
                    style={styles.editIcon}
                    onPress={() => {
                      setChangeInfoModal(true);
                      setCurInfoToChangeType("biệt danh");
                    }}
                  >
                    <Image
                      source={require("../../assets/images/shared/edit.png")}
                      style={styles.editIcon}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.informationContainer}>
                  <Text style={styles.textInfo}>
                    Số điện thoại: {user?.phoneNumber}
                  </Text>
                  <TouchableOpacity
                    style={styles.editIcon}
                    onPress={() => {
                      setChangeInfoModal(true);
                      setCurInfoToChangeType("số điện thoại");
                    }}
                  >
                    <Image
                      source={require("../../assets/images/shared/edit.png")}
                      style={styles.editIcon}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.informationContainer}>
                  <Text style={styles.textInfo}>
                    Ngày sinh: {user?.dateOfBirth}
                  </Text>
                  <TouchableOpacity
                    style={styles.editIcon}
                    onPress={() => {
                      setChangeInfoModal(true);
                      setCurInfoToChangeType("ngày sinh");
                    }}
                  >
                    <Image
                      source={require("../../assets/images/shared/edit.png")}
                      style={styles.editIcon}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.cancelButtonContainer}>
                {Number(user?.familyId) !== 0 &&
                Number(user?.familyId) !== 1 ? (
                  <ApplyButton
                    label="Hủy liên kết"
                    onPress={() => {
                      setConfirmCancelModalVisible(true);
                    }}
                    extraStyle={styles.cancelButton}
                  ></ApplyButton>
                ) : (
                  <>
                    <Text style={styles.announceText}>
                      Tài khoản chưa liên kết gia đình
                    </Text>
                  </>
                )}
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={changeInfoModal}
        onRequestClose={() => {
          setChangeInfoModal(false);
          setInfoToChange("");
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            setChangeInfoModal(false);
            setInfoToChange("");
          }}
        >
          <View style={styles.modalCenteredView}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalView}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => {
                    setChangeInfoModal(false);
                    setInfoToChange("");
                  }}
                >
                  <Image
                    source={require("../../assets/images/shared/closedModal.png")}
                    style={styles.closeIcon}
                  />
                </TouchableOpacity>
                <Text style={styles.modalIntroText}>Thay đổi thông tin</Text>
                <TextInput
                  style={styles.modalTextInput}
                  placeholder={`Thay đổi ${curInfoToChangeType}`}
                  value={infoToChange}
                  onChangeText={setInfoToChange}
                  keyboardType={
                    curInfoToChangeType === "số điện thoại"
                      ? "phone-pad"
                      : "default"
                  }
                />
                <ApplyButton
                  extraStyle={styles.modalButton}
                  label="XÁC NHẬN"
                  onPress={handleSubmitChangeInfo}
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
    marginTop: 30,
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
  modalCenteredView: {
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
  modalTextInput: {
    height: 50,
    marginVertical: "7.5%",
    borderWidth: 1,
    borderColor: "#D1D1D1",
    borderRadius: 10,
    paddingHorizontal: 50,
    fontSize: 16,
  },
  announceText: {
    fontSize: 20,
    alignSelf: "center",
    color: "red",
    fontWeight: "600",
  },
});

export default UserInformationScreen;
