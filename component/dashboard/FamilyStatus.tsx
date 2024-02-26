import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ImageSourcePropType,
} from "react-native";

type FamilyStatus = {
  name: string;
  status: string;
  avatarUri: ImageSourcePropType;
  lastOnline?: string;
  currentStatus: "onl" | "busy" | "off";
};

export type FamilyStatusData = {
  [key: string]: FamilyStatus;
};

type StatusCardProps = {
  FamilyStatusData: FamilyStatusData;
  onCardPress: (status: FamilyStatus) => void;
};

const StatusCard: React.FC<StatusCardProps> = ({
  FamilyStatusData,
  onCardPress,
}) => {
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

  return (
    <View style={styles.cardContainer}>
      {Object.values(FamilyStatusData).map((FamilyStatus, index) => (
        <TouchableOpacity
          key={index}
          style={styles.statusContainer}
          onPress={() => onCardPress(FamilyStatus)}
        >
          <Image source={FamilyStatus.avatarUri} style={styles.avatar} />
          <View style={styles.textContainer}>
            <View style={styles.nameAndStatus}>
              <View
                style={[
                  styles.statusIndicator,
                  {
                    backgroundColor: getCurrentStatusColor(
                      FamilyStatus.currentStatus
                    ),
                  },
                ]}
              />
              <Text style={styles.name}>{FamilyStatus.name}</Text>
            </View>
            <Text style={styles.status}>{FamilyStatus.status}</Text>
          </View>
          {FamilyStatus.lastOnline && (
            <Text style={styles.lastOnline}>{FamilyStatus.lastOnline}</Text>
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
    color: "#C2C1C1",
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
