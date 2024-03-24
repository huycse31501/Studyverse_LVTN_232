import React, { useState } from "react";
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

type MemberTagListProps = {
  excludeId: number;
  onSelectedMembersChange: (selectedMembers: number[]) => void;
  defaultValue?: number[];
};

const MemberTagList: React.FC<MemberTagListProps> = ({
  onSelectedMembersChange,
  excludeId,
  defaultValue,
}) => {
  const user = useSelector((state: RootState) => state.user.user);
  const familyList = useSelector(
    (state: RootState) => state.familyMember.familyMembers
  );
  const totalList = user ? [...familyList, user] : familyList;
  const memberStatusData = totalList.filter(
    (userInTotalList) => userInTotalList.userId !== String(excludeId)
  );
  const [selectedMembers, setSelectedMembers] = useState<number[]>(
    defaultValue ? defaultValue : []
  );

  const handleSelectMember = (memberId: number) => {
    let updatedSelectedMembers;
    if (selectedMembers.includes(memberId)) {
      updatedSelectedMembers = selectedMembers.filter((id) => id !== memberId);
    } else {
      updatedSelectedMembers = [...selectedMembers, memberId];
    }

    setSelectedMembers(updatedSelectedMembers);
    onSelectedMembersChange(updatedSelectedMembers);
  };

  const isMemberSelected = (memberId: number) => {
    return selectedMembers.includes(memberId);
  };

  return (
    <View style={styles.cardContainer}>
      {Object.values(memberStatusData).map((memberStatus, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.statusContainer,
            isMemberSelected(Number(memberStatus.userId))
              ? { backgroundColor: "#cfd5f1" }
              : {},
          ]}
          onPress={() => {
            handleSelectMember(Number(memberStatus.userId));
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
              <Text style={styles.name}>
                {memberStatus?.nickName ? String(memberStatus.nickName) : ""}
              </Text>
            </View>
          </View>
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
    width: 225,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#dedede",
    shadowColor: "rgba(0,0,0,0.4)",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 2,
    padding: 5,
    marginVertical: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
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
    paddingLeft: 15,
  },
});

export default MemberTagList;
