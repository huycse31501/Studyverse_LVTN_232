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
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";

type FamilyInfoNavigationProp = StackNavigationProp<{
  Setting: undefined;
  FamilyAcceptScreen: undefined;
}>;

type FamilyInfoProp = {
  listOfMember?: User[];
};

const FamilyInfoScreen = () => {
  const familyList = useSelector(
    (state: RootState) => state.familyMember.familyMembers
  );
  const user = useSelector((state: RootState) => state.user.user);

  const navigation = useNavigation<FamilyInfoNavigationProp>();

  const listOfMember =
    Array.isArray(familyList) && familyList.length !== 0
      ? familyList.map((item) => ({
          fullName: `${item.firstName} ${item.lastName}`,
          nickName: `${item.nickName}`,
          birthday: `${item.dateOfBirth}`,
          avatarUri:
            item?.role === "parent"
              ? "https://img.freepik.com/free-photo/cute-ai-generated-cartoon-bunny_23-2150288870.jpg"
              : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdkYe42R9zF530Q3WcApmRDpP6YfQ6Ykexa3clwEWlIw&s",
        }))
      : [];
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
              source={{
                uri:
                  user?.role === "parent"
                    ? "https://img.freepik.com/free-photo/cute-ai-generated-cartoon-bunny_23-2150288870.jpg"
                    : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdkYe42R9zF530Q3WcApmRDpP6YfQ6Ykexa3clwEWlIw&s",
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
              type={"List"}
              onWaitListPress={() => navigation.navigate("FamilyAcceptScreen")}
            />
          </View>
          <View style={styles.familyList}>
            {listOfMember.map((member, index) => (
              <View key={index} style={styles.familyMember}>
                <View style={styles.userInformationContainer}>
                  <View style={styles.card}>
                    <Image
                      source={{ uri: member.avatarUri }}
                      style={styles.avatarCard}
                    />
                    <View style={styles.textContainer}>
                      <Text style={styles.textInfo}>
                        Họ và tên: {member.fullName}
                      </Text>
                      <Text style={styles.textInfo}>
                        Biệt danh: {member.nickName}
                      </Text>
                      <Text style={styles.textInfo}>
                        Ngày sinh: {member.birthday}
                      </Text>
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
  familyList: {},
  familyMember: {},
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
});

export default FamilyInfoScreen;
