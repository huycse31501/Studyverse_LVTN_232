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

type FamilyInfoNavigationProp = StackNavigationProp<{
  Setting: undefined;
}>;

type FamilyMember = {
  name: string;
  nickname: string;
  dob: string;
};

type FamilyInfoProp = {
  listOfMember?: FamilyMember[];
};

const FamilyInfoScreen = ({ listOfMember }: FamilyInfoProp) => {
  const navigation = useNavigation<FamilyInfoNavigationProp>();
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
            <FamilyInfoSwitcher type={"List"} />
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
});

export default FamilyInfoScreen;
