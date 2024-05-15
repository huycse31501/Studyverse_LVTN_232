import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Platform,
  TextInput,
} from "react-native";
import { AppDispatch, RootState } from "../../redux/store";
import { useSelector, useDispatch } from "react-redux";
import { avatarList } from "../../utils/listOfAvatar";
import { setUser } from "../../redux/actions/userActions";
import Constants from "expo-constants";

const MessageIcon = require("../../assets/images/dashboard/bubble-chat-big.png");
const MenuIcon = require("../../assets/images/dashboard/setting.png");

type UserStatusProps = {
  userName: string;
  status: "on" | "off" | "busy";
  onMenuPress?: () => void;
  onChatPress?: () => void;
};

let host = Constants?.expoConfig?.extra?.host;
let port = Constants?.expoConfig?.extra?.port;

const UserStatus = React.memo(
  ({ userName, status, onMenuPress, onChatPress }: UserStatusProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.user.user);
    const [editStatus, setEditStatus] = useState(false);
    const [statusText, setStatusText] = useState<string>(
      user?.userStatus  ??  "Trạng thái hoạt động"
    );

    const getStatusColor = () => {
      switch (status) {
        case "on":
          return "#5AD539";
        case "off":
          return "gray";
        case "busy":
          return "#FF5050";
        default:
          return "gray";
      }
    };

    const handleStatusChange = async () => {
      try {
        let requestChangeStatusUrl = `https://${host}/user/updateStatus`;
        const ChangeStatusResponse = await fetch(requestChangeStatusUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user?.email,
            status: statusText.trim().length > 0 ? statusText : "",
          }),
        });
        const changeResponse = await ChangeStatusResponse.json();
        if (changeResponse.msg === "1") {
          dispatch(
            setUser({
              ...user,
              userStatus: statusText,
            })
          );
          setEditStatus(false);
        } else {
          Alert.alert("Thay đổi trạng thái thất bại");
        }
      } catch (e) {
        console.log(e);
        Alert.alert("Lỗi xảy ra trong quá trình Thay đổi trạng thái thất bại");
      }
    };
    const handleStatusPress = () => {
      if (Platform.OS === "ios") {
        Alert.prompt(
          "Thay đổi trạng thái",
          "Cập nhật trạng thái mới:",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "OK",
              onPress: (inputStatus) => {
                let newStatus =
                  inputStatus && inputStatus.trim().length > 0
                    ? inputStatus
                    : "Trạng thái hoạt động";
                dispatch(
                  setUser({
                    ...user,
                    userStatus: inputStatus,
                  })
                );
                setStatusText(newStatus);
              },
            },
          ],
          "plain-text",
          statusText
        );
      } else {
        setEditStatus(true);
      }
    };

    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => console.log("Avatar pressed")}>
          <Image
            source={{
              uri: avatarList[Number(user?.avatarId) - 1] ?? avatarList[0],
            }}
            style={styles.avatarIcon}
          />
        </TouchableOpacity>
        <View style={styles.textContainer}>
          <View style={styles.statusContainer}>
            <Text style={styles.userName}>{userName}</Text>
            <View
              style={[
                styles.statusIndicator,
                { backgroundColor: getStatusColor() },
              ]}
            />
          </View>
          {editStatus ? (
            <TextInput
              value={statusText === "null" ? "" : statusText}
              onChangeText={setStatusText}
              onEndEditing={handleStatusChange}
              autoFocus={true}
              style={styles.status}
            />
          ) : (
            <TouchableOpacity onPress={handleStatusPress}>
              <Text style={styles.status}>{statusText === "null" ? "Trạng thái hoạt động" : statusText}</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity onPress={onChatPress}>
          <Image source={MessageIcon} style={styles.messageIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onMenuPress}>
          <Image source={MenuIcon} style={styles.menuIcon} />
        </TouchableOpacity>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  textContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },
  status: {
    fontSize: 16,
    color: "#C2C2C1",
  },
  avatarIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  menuIcon: {
    width: 35,
    height: 35,
    marginHorizontal: 10,
    padding: 15,
  },
  messageIcon: {
    width: 35,
    height: 30,
    marginHorizontal: 5,
    padding: 8,
  },

  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 10,
  },
});

export default UserStatus;
