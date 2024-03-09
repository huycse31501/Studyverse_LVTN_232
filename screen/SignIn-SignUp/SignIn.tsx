import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AuthButton from "../../component/signin-signup/AuthButton";
import TextInputField from "../../component/signin-signup/TextInputField";
import PasswordInputField from "../../component/signin-signup/PasswordInputField";
import ApplyButton from "../../component/shared/ApplyButton";
import TouchableTextComponent from "../../component/shared/TouchableText";
import regexVault from "../../utils/regex";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { setUser } from "../../redux/actions/userActions";
import { User, familyMemberList } from "../../redux/types/actionTypes";
import { setFamilyMember } from "../../redux/actions/familyAction";
import { setWaitList } from "../../redux/actions/waitListAction";
type ForgotPasswordNavigationProp = StackNavigationProp<{
  ForgotPassword: undefined;
  StatusDashboard: undefined;
}>;

const SignIn = () => {
  const navigation = useNavigation<ForgotPasswordNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);
  const familyList = useSelector(
    (state: RootState) => state.familyMember.familyMemberList
  );
  const waitList = useSelector((state: RootState) => state.waitList.waitList);

  const [requestState, setRequestState] = useState(false);

  const [inputs, setInputs] = useState({
    email: {
      value: "",
      required: true,
    },
    password: {
      value: "",
      required: true,
    },
  });

  let host = Constants?.expoConfig?.extra?.host;
  let port = Constants?.expoConfig?.extra?.port;
  function inputChangedHandler(
    inputIdentifier: keyof typeof inputs,
    enteredValue: string
  ) {
    setInputs((curInputs) => {
      const currentInput = curInputs[inputIdentifier];

      if (currentInput) {
        return {
          ...curInputs,
          [inputIdentifier]: {
            ...currentInput,
            value: enteredValue,
          },
        };
      }

      return curInputs;
    });
  }

  useEffect(() => {
    const fetchData = async () => {
      if (user && Number(user.familyId) !== 0) {
        try {
          let requestFamilyListURL = `http://${host}:${port}/family/getFamilyMembers/${user.familyId}`;

          const familyListResponse = await fetch(requestFamilyListURL, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const familyListData = await familyListResponse.json();
          const data = familyListData.data;
          const familyListPayload = data.map((item: any) => ({
            userID: String(item.id),
            phoneNumber: String(item.phone),
            dateOfBirth: item.dob ? String(item.dob) : "",
            email: String(item.email),
            familyId: String(item.familyId),
            firstName: String(item.firstName),
            lastName: String(item.lastName),
            nickName: String(item.nickName) ? String(item.nickName) : "",
            lastLogin: String(item.lastLogin),
            accountStatus: item.accountStatus,
            userStatus: String(item.userStatus),
            role: String(item.role),
          }));
          dispatch(setFamilyMember(familyListPayload));
          setRequestState(true);
        } catch (e) {
          alert("Failed to fetch family list:");
          setRequestState(false);
        }
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      if (user && familyList) {
        try {
          let requestWaitList = `http://${host}:${port}/family/getPendingUsers`;
          const familyWaitListResponse = await fetch(requestWaitList, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              familyId: user.familyId,
              email: user.email,
            }),
          });
          const waitListResponse = await familyWaitListResponse.json();
          if (waitListResponse?.data) {
            const data = waitListResponse.data;
            const waitListPayload = data.map((item: any) => ({
              userID: String(item.id),
              phoneNumber: String(item.phone),
              dateOfBirth: item.dob ? String(item.dob) : "",
              email: String(item.email),
              familyId: String(item.familyId),
              firstName: String(item.firstName),
              lastName: String(item.lastName),
              nickName: item.nickName ? String(item.nickName) : "",
            }));
            dispatch(setWaitList(waitListPayload));
          }
        } catch (e) {
          alert("Failed to fetch family wait list:");
        }
      }
    };

    fetchData();
  }, [familyList]);

  useEffect(() => {
    if (requestState) {
      navigation.navigate("StatusDashboard");
    }
  }, [requestState]);

  async function submitHandler() {
    let allFieldsFilled = true;
    for (const [key, value] of Object.entries(inputs)) {
      if (value.required && !value.value) {
        allFieldsFilled = false;
        break;
      }
    }

    if (!allFieldsFilled) {
      Alert.alert("Thông báo", "Bạn cần nhập đủ thông tin đăng nhập");
    } else {
      setInputs({
        email: { value: "", required: true },
        password: { value: "", required: true },
      });

      let requestUserURL = `http://${host}:${port}/user/login`;
      try {
        const response = await fetch(requestUserURL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: inputs.email.value,
            password: inputs.password.value,
          }),
        });
        const data = await response.json();

        if (data.msg == "1") {
          const userInformation = data.data;
          const userPayload: User = {
            userId: String(userInformation?.id),
            phoneNumber: String(userInformation?.phone),
            dateOfBirth: String(userInformation?.dob),
            email: String(userInformation?.email),
            familyId: String(userInformation?.familyId),
            firstName: String(userInformation?.firstName),
            lastName: String(userInformation?.lastName),
            nickName: String(userInformation?.nickName),
          };

          dispatch(setUser(userPayload));
        } else Alert.alert("Thất bại", "Đăng nhập thất bại");
      } catch (e) {
        alert(`Đăng nhập thất bại: ${e}`);
      }
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: 70 }}>
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
          <View style={styles.authButton}>
            <AuthButton type="SignIn" />
          </View>
          <Image
            source={require("../../assets/images/signIn-signUp/bigLogo.png")}
            style={styles.logo}
          />
          <View style={styles.inputField}>
            <TextInputField
              placeHolder="Email"
              required
              isValid={true}
              value={inputs.email.value}
              textInputConfig={{
                onChangeText: inputChangedHandler.bind(this, "email"),
              }}
            />
            <PasswordInputField
              placeHolder="Mật khẩu"
              isValid={true}
              value={inputs.password.value}
              textInputConfig={{
                onChangeText: inputChangedHandler.bind(this, "password"),
              }}
            />
          </View>
          <View style={styles.applyButton}>
            <ApplyButton label="ĐĂNG NHẬP" onPress={submitHandler} />
          </View>
          <View>
            <TouchableTextComponent
              text="Quên mật khẩu"
              onPress={() => navigation.navigate("ForgotPassword")}
            />
          </View>
        </KeyboardAwareScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  authButton: {
    marginBottom: "10%",
  },
  logo: {
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: "5%",
  },
  inputField: {
    flex: 1,
    paddingLeft: "6.8%",
    paddingRight: "6.8%",
  },
  applyButton: {
    alignItems: "center",
    width: "100%",
    marginTop: "25%",
    marginBottom: "7.5%",
  },
});

export default SignIn;
