import React, { useEffect, useState } from "react";
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

type MemberOptionProps = {
  onSelectedMembersChange: (selectedMembers: number | null) => void;
  defaultValue?: number[];
};

const MemberOption: React.FC<MemberOptionProps> = ({
  onSelectedMembersChange,
  defaultValue,
}) => {
  const user = useSelector((state: RootState) => state.user.user);
  const familyList = useSelector(
    (state: RootState) => state.familyMember.familyMembers
  );
  const totalList = user ? [...familyList, user] : familyList;
  const excludeList = totalList
    .filter((member) => member.role === "parent")
    .map((member) => Number(member.userId));

  const excludeId = [...excludeList, Number(user?.userId)];
  const memberStatusData = totalList.filter((userInTotalList) => {
    const userIdNumber = Number(userInTotalList.userId);
    return !isNaN(userIdNumber) && !excludeId.includes(userIdNumber);
  });
  const [selectedMember, setSelectedMember] = useState<number | null>(
    defaultValue?.[0] ??
      (memberStatusData.length > 0 ? Number(memberStatusData[0].userId) : null)
  );

  

  useEffect(() => {
    if (selectedMember === null && memberStatusData.length > 0) {
      const defaultSelectedMember = Number(memberStatusData[0].userId);
      setSelectedMember(defaultSelectedMember);
      onSelectedMembersChange(defaultSelectedMember);
    }
  }, [memberStatusData, onSelectedMembersChange]);
  const handleSelectMember = (memberId: number) => {
    setSelectedMember(memberId);
    onSelectedMembersChange(memberId);
  };

  const isMemberSelected = (memberId: number) => {
    return selectedMember === memberId;
  };

  return (
    <View style={styles.cardContainer}>
      {Object.values(memberStatusData).map((memberStatus, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.statusContainer,
            isMemberSelected(Number(memberStatus.userId))
              ? { backgroundColor: "#f3d1d2" }
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
    flexDirection: "row",
    borderRadius: 20,
    margin: 10,

  },
  statusContainer: {
    width: 110,
    height: 140,
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 30,
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
    marginHorizontal: 10,
    paddingTop: 15,
  },
  avatar: {
    marginTop: 12.5,
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textContainer: {
    flex: 1,
  },
  nameAndStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
    color: "#242425",
    marginTop: 7.5,
  },
});

export default MemberOption;
