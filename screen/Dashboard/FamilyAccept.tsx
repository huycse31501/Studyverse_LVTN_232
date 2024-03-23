import { RouteProp, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  SafeAreaView,
  Platform,
  Alert,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import FamilyInfoSwitcher from "../../component/dashboard/familyInfoSwitcher";
import { User } from "./Details";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import Constants from "expo-constants";
import { useDispatch } from "react-redux";
import { setFamilyMember } from "../../redux/actions/familyAction";
import { setWaitList } from "../../redux/actions/waitListAction";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { avatarList } from "../../utils/listOfAvatar";

type FamilyInfoNavigationProp = StackNavigationProp<{
  Setting: undefined;
  FamilyInfoScreen: undefined;
}>;

const FamilyAcceptScreen = () => {
  let host = Constants?.expoConfig?.extra?.host;
  let port = Constants?.expoConfig?.extra?.port;

  const dispatch = useDispatch<AppDispatch>();
  const waitList = useSelector((state: RootState) => state.waitList.waitList);
  const familyMemberList = useSelector(
    (state: RootState) => state.familyMember.familyMembers
  );

  const user = useSelector((state: RootState) => state.user.user);

  const waitListInput =
    Array.isArray(waitList) && waitList.length !== 0
      ? waitList.map((item) => ({
          accountID: item.userId,
          fullName: `${item.firstName} ${item.lastName}`,
          avatarUri: avatarList[Number(item?.avatarId) - 1] ?? avatarList[0],
        }))
      : [];

  //[
  //   {
  //     accountID: "0082161929",
  //     fullName: "Nguyễn Minh Trúc",
  //     avatarUri: require("../../assets/images/dashboard/avatar-NMT.png"),
  //   },
  //   {
  //     accountID: "0082039123",
  //     fullName: "Nguyễn Minh Tuấn",
  //     avatarUri: require("../../assets/images/dashboard/avatar-NMTuan.png"),
  //   },
  // ];
  const insets = useSafeAreaInsets();

  const navigation = useNavigation<FamilyInfoNavigationProp>();
  return (
    <SafeAreaView style={{ flex: 1, paddingTop: insets.top }}>
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
            <View style={styles.backButtonContainer}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.navigate("Setting")}
              >
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
            </View>
            <Image
              source={{
                uri: avatarList[Number(user?.avatarId) - 1] ?? avatarList[0],
              }}
              style={styles.avatar}
            />
          </View>
          <View style={styles.familyNameContainer}>
            <Text style={styles.familyText}>Zoo Family</Text>
            <TouchableOpacity style={styles.editIconContainer}>
              <Image
                source={require("../../assets/images/dashboard/familyNameChange.png")}
                style={styles.editIcon}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.switcherContainer}>
            <FamilyInfoSwitcher
              type={"WaitList"}
              onListPress={() => navigation.navigate("FamilyInfoScreen")}
            />
          </View>
          <View style={styles.waitListContainer}>
            {waitListInput.map((member, index) => (
              <View key={index} style={styles.newMember}>
                <View style={styles.userInformationContainer}>
                  <View style={styles.card}>
                    <Image
                      source={{ uri: member.avatarUri }}
                      style={styles.avatarCard}
                    />
                    <View style={styles.textContainer}>
                      <Text style={styles.textInfo}>
                        Mã tài khoản: {member.accountID}
                      </Text>
                      <Text style={styles.textInfo}>
                        Họ và tên: {member.fullName}
                      </Text>
                    </View>
                    <View style={styles.decisionIconContainer}>
                      <TouchableOpacity
                        onPress={async () => {
                          const userToAcceptInfo = waitList?.filter(
                            (item: any) =>
                              item.userId === String(member.accountID)
                          )[0];
                          try {
                            let declineMemberUrl = `http://${host}:${port}/family/approveLinkFamily`;

                            const declinceMember = await fetch(
                              declineMemberUrl,
                              {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                  familyId: user?.familyId,
                                  email: userToAcceptInfo?.email,
                                  code: 0,
                                }),
                              }
                            );
                            const declinceMemberResponse =
                              await declinceMember.json();

                            if (
                              declinceMemberResponse &&
                              declinceMemberResponse?.msg == "1" &&
                              Array.isArray(waitList)
                            ) {
                              const updatedWaitList = waitList.filter(
                                (item: any) => item.userId !== member.accountID
                              );
                              dispatch(setWaitList(updatedWaitList));
                            } else {
                              Alert.alert("Hủy liên kết thất bại");
                            }
                          } catch (e) {
                            Alert.alert(
                              "Lỗi xảy ra trong quá trình hủy liên kết"
                            );
                          }
                        }}
                      >
                        <Image
                          source={require("../../assets/images/shared/declineIcon.png")}
                          style={styles.decisionIcon}
                        ></Image>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={async () => {
                          const userToAcceptInfo = waitList?.filter(
                            (item: any) =>
                              item.userId === String(member.accountID)
                          )[0];
                          try {
                            let acceptMemberUrl = `http://${host}:${port}/family/approveLinkFamily`;

                            const acceptMember = await fetch(acceptMemberUrl, {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify({
                                familyId: user?.familyId,
                                email: userToAcceptInfo?.email,
                                code: 1,
                              }),
                            });
                            const acceptMemberResponse =
                              await acceptMember.json();

                            if (
                              acceptMemberResponse &&
                              acceptMemberResponse?.msg == "1" &&
                              Array.isArray(familyMemberList) &&
                              Array.isArray(waitList)
                            ) {
                              if (
                                userToAcceptInfo &&
                                typeof userToAcceptInfo === "object"
                              ) {
                                const updatedFamilyMemberList = [
                                  ...familyMemberList,
                                  userToAcceptInfo,
                                ];

                                dispatch(
                                  setFamilyMember(updatedFamilyMemberList)
                                );
                              }

                              const updatedWaitList = waitList.filter(
                                (item: any) => item.userId !== member.accountID
                              );
                              dispatch(setWaitList(updatedWaitList));
                            } else {
                              Alert.alert("Liên kết thất bại");
                            }
                          } catch (e) {
                            Alert.alert("Lỗi xảy ra trong quá trình liên kết");
                          }
                        }}
                      >
                        <Image
                          source={require("../../assets/images/shared/acceptIcon.png")}
                          style={styles.decisionIcon}
                        ></Image>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </KeyboardAwareScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
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
  avatar: {
    width: 50,
    height: 50,
    marginRight: "7.5%",
    marginTop: "6%",
    borderRadius: 50,
  },
  familyNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: "5%",
  },
  familyText: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
  },
  editIconContainer: {
    marginLeft: "5%",
  },
  editIcon: {
    width: 35,
    height: 35,
  },
  switcherContainer: {
    marginTop: "10%",
  },
  waitListContainer: {},
  newMember: {},
  userInformationContainer: {
    marginTop: "2.5%",
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
  avatarCard: {
    width: 50,
    height: 50,
    borderRadius: 30,
  },
  textInfo: {
    color: "#242425",
    fontSize: 14,
    textAlign: "left",
    fontWeight: "600",
    paddingVertical: 3,
  },
  decisionIconContainer: {
    flexDirection: "row",
    position: "absolute",
    right: 10,
    top: 30,
  },
  decisionIcon: {
    width: 30,
    height: 30,
    paddingHorizontal: "6.5%",
  },
});

export default FamilyAcceptScreen;
