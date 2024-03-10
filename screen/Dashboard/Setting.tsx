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
  Alert,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ApplyButton from "../../component/shared/ApplyButton";
import regexVault from "../../utils/regex";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { useDispatch } from "react-redux";
import userReducer from "../../redux/reducers/userReducer";
import { setUser } from "../../redux/actions/userActions";
import { User } from "../../redux/types/actionTypes";
import Constants from "expo-constants";
import { logout } from "../../redux/actions/logoutAction";
import { setWaitList } from "../../redux/actions/waitListAction";
import { setFamilyMember } from "../../redux/actions/familyAction";

type DetailsNavigationProp = StackNavigationProp<{
  StatusDashboard: undefined;
  FamilyInfoScreen: undefined;
  UserInformationScreen: undefined;
  SignIn: undefined;
}>;

const Setting = () => {
  let host = Constants?.expoConfig?.extra?.host;
  let port = Constants?.expoConfig?.extra?.port;

  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector((state: RootState) => state.user.user);
  const familyList = useSelector(
    (state: RootState) => state.familyMember.familyMembers
  );
  const waitList = useSelector((state: RootState) => state.waitList.waitList);

  const navigation = useNavigation<DetailsNavigationProp>();

  const [familyLinkedModalVisible, setFamilyLinkedModalVisible] =
    useState(false);
  const [createFamilyModalVisible, setcreateFamilyModalVisible] =
    useState(false);
  const [familyLinkInfo, setFamilyLinkInfo] = useState("");

  const handleApplyPress = () => {
    setFamilyLinkedModalVisible(true);
  };

  const handleUnlinkPress = async () => {
    try {
      let requestUnlinkURL = `http://${host}:${port}/family/unlinkFamily`;

      const unlinkFamilyResponse = await fetch(requestUnlinkURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user?.email,
        }),
      });
      const unlinkResponse = await unlinkFamilyResponse.json();
      if (unlinkResponse && unlinkResponse?.msg === "1") {
        const newUserPayload: User = {
          ...user,
          familyId: String("0"),
        };
        dispatch(setUser(newUserPayload));
        setcreateFamilyModalVisible(false);
      } else {
        Alert.alert("Hủy liên kết thất bại");
        setcreateFamilyModalVisible(false);
      }
    } catch (e) {
      console.log(e);
      Alert.alert("Lỗi xảy ra khi hủy liên kết");
      setcreateFamilyModalVisible(false);
    }
    setFamilyLinkInfo("");
  };

  const handleCreateFamily = async () => {
    try {
      let requestCreateFamily = `http://${host}:${port}/family/createFamily`;

      const createFamilyResponse = await fetch(requestCreateFamily, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user?.email,
        }),
      });
      const familyIdResponse = await createFamilyResponse.json();
      const newUserPayload: User = {
        ...user,
        familyId: String(familyIdResponse?.familyId),
      };
      dispatch(setUser(newUserPayload));
    } catch (e) {
      Alert.alert("Lỗi khi tạo gia đình");
    }

    setcreateFamilyModalVisible(false);
    setFamilyLinkInfo("");
  };
  const handleConfirmLink = async () => {
    if (regexVault.emailValidate.test(familyLinkInfo)) {
      try {
        let requestLinkFamily = `http://${host}:${port}/family/linkFamily`;

        const linkFamily = await fetch(requestLinkFamily, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user?.email,
            familyEmail: familyLinkInfo,
          }),
        });
        const familyLinkResponse = await linkFamily.json();
        if (familyLinkResponse && familyLinkResponse?.msg == "1") {
          const newUserPayload: User = {
            ...user,
            familyId: String("-1"),
          };
          dispatch(setUser(newUserPayload));
        } else {
          Alert.alert("Liên kết thất bại");
        }
        setFamilyLinkedModalVisible(false);
      } catch (e) {
        console.log(e);
        Alert.alert("Lỗi xảy ra trong quá trình liên kết");
        setFamilyLinkedModalVisible(false);
      }
    } else {
      alert("Vui lòng email hợp lệ");
    }
    setFamilyLinkInfo("");
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
      valid: !!(Number(user?.familyId) === 0) && !!(user?.role === "parent"),
    },
    {
      name: "Thông tin gia đình",
      image: require("../../assets/images/dashboard/setting2.png"),
      onPress: () => navigation.navigate("FamilyInfoScreen"),
      valid: !!(Number(user?.familyId) !== 0 && Number(user?.familyId) !== -1),
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
      onPress: async () => {
        try {
          let requestlogoutUserUrl = `http://${host}:${port}/user/logout`;
          const logoutUserResponse = await fetch(requestlogoutUserUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: user?.email,
            }),
          });
          const logoutResponse = await logoutUserResponse.json();
          if (logoutResponse.msg === "1") {
            dispatch(setUser(null as any));
            dispatch(setWaitList([] as any));
            dispatch(setFamilyMember([] as any));
          } else {
            Alert.alert("Đăng xuất thất bại");
          }
        } catch (e) {
          console.log(e);
          Alert.alert("Lỗi xảy ra trong quá trình đăng xuất");
        }
        dispatch(logout());
        navigation.navigate("SignIn");
      },
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
              source={{
                uri:
                  user?.role === "parent"
                    ? "https://img.freepik.com/free-photo/cute-ai-generated-cartoon-bunny_23-2150288870.jpg"
                    : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdkYe42R9zF530Q3WcApmRDpP6YfQ6Ykexa3clwEWlIw&s",
              }}
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
              <TouchableOpacity
                key={index}
                style={styles.functionContainer}
                onPress={setting.onPress}
              >
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
          {Number(user?.familyId) === 0 && (
            <>
              <Text style={styles.linkText}>Tài khoản chưa liên kết</Text>
              <ApplyButton
                extraStyle={styles.linkButton}
                label="LIÊN KẾT GIA ĐÌNH"
                onPress={handleApplyPress}
              />
            </>
          )}

          {Number(user?.familyId) === -1 && (
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

          {Number(user?.familyId) !== 0 && Number(user?.familyId) !== -1 && (
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
