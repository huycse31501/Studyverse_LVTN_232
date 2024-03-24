import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ImageSourcePropType,
} from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { StackNavigationProp } from "@react-navigation/stack";
import { User } from "../../screen/Dashboard/Details";
import { useNavigation } from "@react-navigation/native";
import { avatarList } from "../../utils/listOfAvatar";
import { getTimeDifference } from "../../utils/takeTimeDif";

type StatusCardNavigationProp = StackNavigationProp<{
  UserDetailsScreen: { user: User };
}>;

const StatusCard: React.FC = ({}) => {
  const getCurrentStatusColor = (currentStatus: "onl" | "busy" | "off") => {
    switch (currentStatus) {
      case "onl":
        return "#5AD539";
      case "busy":
        return "#FF5050";
      case "off":
        return "grey";
      default:
        return "grey";
    }
  };

  const memberStatusData = useSelector(
    (state: RootState) => state.familyMember.familyMembers
  );
  const navigation = useNavigation<StatusCardNavigationProp>();

  return (
    <View style={styles.cardContainer}>
      {Object.values(memberStatusData).map((memberStatus, index) => (
        <TouchableOpacity
          key={index}
          style={styles.statusContainer}
          onPress={() => {
            navigation.navigate("UserDetailsScreen", {
              user: {
                userId: Number(memberStatus.userId),
              },
            });
          }}
        >
          <Image
            source={{
              uri:
                avatarList[Number(memberStatus?.avatarId) - 1] ?? avatarList[0],
            }}
            style={styles.avatar}
          />
          <View style={styles.textContainer}>
            <View style={styles.nameAndStatus}>
              <View
                style={[
                  styles.statusIndicator,
                  {
                    backgroundColor: getCurrentStatusColor(
                      memberStatus?.accountStatus ? "onl" : "off"
                    ),
                  },
                ]}
              />
              <Text style={styles.name}>
                {memberStatus?.nickName ? String(memberStatus.nickName) : ""}
              </Text>
            </View>
            <Text style={styles.status}>
              {memberStatus?.userStatus === "null" ||
              !memberStatus.accountStatus
                ? ""
                : memberStatus?.userStatus}
            </Text>
          </View>
          {memberStatus?.lastLogin && (
            <Text style={styles.lastOnline}>
              {!memberStatus.accountStatus
                ? getTimeDifference(memberStatus?.lastLogin)
                : "Đang trực tuyến"}
            </Text>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 20,
    margin: 10,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(253, 205, 85, 0.25)",
    borderRadius: 20,
    padding: 10,
    marginVertical: "5%",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  textContainer: {
    flex: 1,
    marginLeft: "5%",
  },
  nameAndStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#242425",
  },
  status: {
    fontSize: 15,
    fontWeight: "400",
    color: "#b6adad",
  },
  lastOnline: {
    fontSize: 14,
    color: "#C2C1C1",
    position: "absolute",
    right: 10,
    top: "50%",
  },
});

export default StatusCard;
