import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";

const AvatarIcon = require("../../assets/images/dashboard/avatar.png");
const MessageIcon = require("../../assets/images/dashboard/bubble-chat-big.png");
const MenuIcon = require("../../assets/images/dashboard/ellypsis-vertical.png");

type UserStatusProps = {
  userName: string;
  status: "on" | "off" | "busy";
};

const UserStatus = ({ userName, status }: UserStatusProps) => {
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

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => console.log("Avatar pressed")}>
        <Image source={AvatarIcon} style={styles.avatarIcon} />
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
        <Text style={styles.status}>{"Trạng thái hoạt động"}</Text>
      </View>
      <TouchableOpacity onPress={() => console.log("Message icon pressed")}>
        <Image source={MessageIcon} style={styles.messageIcon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => console.log("Menu icon pressed")}>
        <Image source={MenuIcon} style={styles.menuIcon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
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
    color: "#C2C1C1",
  },
  avatarIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  menuIcon: {
    width: 40,
    height: 40,
    marginHorizontal: 5,
    padding: 8,
    marginTop: 8,
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