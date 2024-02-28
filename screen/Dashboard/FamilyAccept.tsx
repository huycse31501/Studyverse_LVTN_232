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
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import FamilyInfoSwitcher from "../../component/dashboard/familyInfoSwitcher";
import { User } from "./Details";

type FamilyInfoNavigationProp = StackNavigationProp<{
  Setting: undefined;
  FamilyInfoScreen: undefined;
}>;

const waitList = [
  {
    accountID: "0082161929",
    fullName: "Nguyễn Minh Trúc",
    avatarUri: require("../../assets/images/dashboard/avatar-NMT.png"),
  },
  {
    accountID: "0082039123",
    fullName: "Nguyễn Minh Tuấn",
    avatarUri: require("../../assets/images/dashboard/avatar-NMTuan.png"),
  },
];
const FamilyAcceptScreen = () => {
  const navigation = useNavigation<FamilyInfoNavigationProp>();
  return (
    <SafeAreaView style={{ flex: 1, paddingTop: 25 }}>
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
              source={require("../../assets/images/dashboard/avatar.png")}
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
            {waitList.map((member, index) => (
              <View key={index} style={styles.newMember}>
                <View style={styles.userInformationContainer}>
                  <View style={styles.card}>
                    <Image
                      source={member.avatarUri}
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
                      <TouchableOpacity>
                        <Image
                          source={require("../../assets/images/shared/declineIcon.png")}
                          style={styles.decisionIcon}
                        ></Image>
                      </TouchableOpacity>
                      <TouchableOpacity>
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
    marginLeft: "5%",
  },
  decisionIcon: {
    width: 30,
    height: 30,
    paddingHorizontal: "6.5%",
  },
});

export default FamilyAcceptScreen;
