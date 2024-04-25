import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Touchable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface MilestoneListProps {
  studyPackage?: any;
}

const initialMilestones = [
  { key: "1", name: "TOEIC", status: "done" },
  { key: "2", name: "IELTS", status: "done" },
  { key: "3", name: "Giao tiếp", status: "done" },
  { key: "4", name: "Giao tiếp", status: "pending" },
  { key: "5", name: "Giao tiếp", status: "in-progress" },
  { key: "6", name: "IELTS", status: "in-progress" },
  { key: "7", name: "Unit 7: Learning", status: "in-progress" },
];

const isCreate = true;
const MilestoneList: React.FC<MilestoneListProps> = ({ studyPackage }) => {
  const [milestones, setMilestones] = useState(initialMilestones);

  const deleteMilestone = (index: number) => {
    const newMilestones = milestones.filter((_, i) => i !== index);
    setMilestones(newMilestones);
  };

  const shiftLeft = (index: number) => {
    if (index > 0) {
      const newMilestones = [...milestones];
      [newMilestones[index], newMilestones[index - 1]] = [
        newMilestones[index - 1],
        newMilestones[index],
      ];
      setMilestones(newMilestones);
    }
  };

  const shiftRight = (index: number) => {
    if (index < milestones.length - 1) {
      const newMilestones = [...milestones];
      [newMilestones[index], newMilestones[index + 1]] = [
        newMilestones[index + 1],
        newMilestones[index],
      ];
      setMilestones(newMilestones);
    }
  };

  return (
    <ScrollView style={{ marginBottom: 20 }}>
      {milestones.map((item: any, index: any) => (
        <View style={styles.totalContainer} key={item.index}>
          {index % 2 == 0 ? (
            <View
              style={[
                styles.leftSideContainer,
                index !== 0 && {
                  top: -8 * index,
                },
              ]}
            >
              {index === 0 ? (
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <Image
                    source={
                      item.status == "in-progress"
                        ? require("../../assets/images/studyPlan/leftCircle.png")
                        : require("../../assets/images/studyPlan/leftCircle-done.png")
                    }
                    style={styles.roadLogo}
                  />
                  <View
                    style={[
                      styles.leftContentContainer,
                      {
                        position: "absolute",
                        left: 40,
                        top: 25,
                      },
                    ]}
                  >
                    <TouchableOpacity>
                      <Image
                        source={
                          item.status === "in-progress"
                            ? require("../../assets/images/studyPlan/padlock.png")
                            : item.status === "done"
                            ? require("../../assets/images/studyPlan/doneMilestone.png")
                            : require("../../assets/images/studyPlan/milestone-inprogress.png")
                        }
                        style={styles.padlockLogo}
                      />
                    </TouchableOpacity>
                    <View style={styles.textContainer}>
                      <Text style={styles.milestoneName}>
                        {item.name.slice(0, 20)}
                      </Text>
                      <View style={styles.logoListContainer}>
                        {isCreate && (
                          <>
                            <TouchableOpacity onPress={() => shiftLeft(index)}>
                              <Image
                                source={require("../../assets/images/studyPlan/shiftLeft.png")}
                                style={styles.milestoneEditLogo}
                              />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => shiftRight(index)}>
                              <Image
                                source={require("../../assets/images/studyPlan/shiftRight.png")}
                                style={styles.milestoneEditLogo}
                              />
                            </TouchableOpacity>
                          </>
                        )}
                        <TouchableOpacity onPress={() => deleteMilestone(index)}>
                          <Image
                            source={require("../../assets/images/studyPlan/deleteMilestone.png")}
                            style={styles.milestoneEditLogo}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              ) : (
                <>
                  <Image
                    source={
                      item.status == "in-progress"
                        ? require("../../assets/images/studyPlan/progressCircle.png")
                        : require("../../assets/images/studyPlan/in-progress-done.png")
                    }
                    style={styles.roadLogo}
                  />
                  <View
                    style={[
                      styles.leftContentContainer,
                      {
                        position: "absolute",
                        left: 40,
                        top: 25,
                      },
                    ]}
                  >
                    <TouchableOpacity>
                      <Image
                        source={
                          item.status === "in-progress"
                            ? require("../../assets/images/studyPlan/padlock.png")
                            : item.status === "done"
                            ? require("../../assets/images/studyPlan/doneMilestone.png")
                            : require("../../assets/images/studyPlan/milestone-inprogress.png")
                        }
                        style={styles.padlockLogo}
                      />
                    </TouchableOpacity>
                    <View style={styles.textContainer}>
                      <Text style={styles.milestoneName}>
                        {item.name.slice(0, 20)}
                      </Text>
                      <View style={styles.logoListContainer}>
                        {isCreate && (
                          <>
                            <TouchableOpacity onPress={() => shiftLeft(index)}>
                              <Image
                                source={require("../../assets/images/studyPlan/shiftLeft.png")}
                                style={styles.milestoneEditLogo}
                              />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => shiftRight(index)}>
                              <Image
                                source={require("../../assets/images/studyPlan/shiftRight.png")}
                                style={styles.milestoneEditLogo}
                              />
                            </TouchableOpacity>
                          </>
                        )}
                        <TouchableOpacity onPress={() => deleteMilestone(index)}>
                          <Image
                            source={require("../../assets/images/studyPlan/deleteMilestone.png")}
                            style={styles.milestoneEditLogo}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </>
              )}
            </View>
          ) : (
            <View
              style={[
                styles.rightSideContainer,
                index !== 1 && {
                  top: -8 * index - 0.45,
                },
              ]}
            >
              <Image
                source={
                  item.status == "in-progress"
                    ? require("../../assets/images/studyPlan/rightCircle.png")
                    : require("../../assets/images/studyPlan/rightCircle-done.png")
                }
                style={styles.roadLogo}
              />
              <View
                style={[
                  styles.leftContentContainer,
                  {
                    position: "absolute",
                    right: 40,
                    top: 25,
                  },
                ]}
              >
                <View style={styles.textContainer}>
                  <Text
                    style={[
                      styles.milestoneName,
                      {
                        alignSelf: "flex-end",
                      },
                    ]}
                  >
                    {item.name.slice(0, 20)}
                  </Text>
                  <View style={styles.logoListContainer}>
                    {isCreate && (
                      <>
                        <TouchableOpacity onPress={() => shiftLeft(index)}>
                          <Image
                            source={require("../../assets/images/studyPlan/shiftLeft.png")}
                            style={styles.milestoneEditLogo}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => shiftRight(index)}>
                          <Image
                            source={require("../../assets/images/studyPlan/shiftRight.png")}
                            style={styles.milestoneEditLogo}
                          />
                        </TouchableOpacity>
                      </>
                    )}
                    <TouchableOpacity onPress={() => deleteMilestone(index)}>
                      <Image
                        source={require("../../assets/images/studyPlan/deleteMilestone.png")}
                        style={styles.milestoneEditLogo}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity>
                  <Image
                    source={
                      item.status === "in-progress"
                        ? require("../../assets/images/studyPlan/padlock.png")
                        : item.status === "done"
                        ? require("../../assets/images/studyPlan/doneMilestone.png")
                        : require("../../assets/images/studyPlan/milestone-inprogress.png")
                    }
                    style={styles.padlockLogo}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      ))}
      <TouchableOpacity style={styles.addMileStoneContainer}>
        <Image
          source={require("../../assets/images/studyPlan/addMileStone.png")}
          style={styles.addLogo}
        />
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  totalContainer: {
    alignSelf: "center",
  },
  leftSideContainer: {
    marginRight: 70,
  },
  rightSideContainer: {
    marginLeft: 80,
    top: -8.5,
    left: -1,
  },
  addMileStoneContainer: {
    marginRight: 70,
  },
  roadLogo: {
    width: 222,
    height: 130,
  },
  leftContentContainer: {
    flexDirection: "row",
  },
  textContainer: {
    alignSelf: "center",
    marginHorizontal: 10,
  },
  addLogo: {
    width: 90,
    height: 90,
    alignSelf: "center",
    marginLeft: 60,
    marginTop: 10,
  },
  padlockLogo: {
    width: 80,
    height: 80,
  },
  milestoneName: {
    fontSize: 21,
    fontWeight: "600",
    marginHorizontal: 20,
  },
  logoListContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  milestoneEditLogo: {
    width: 25,
    height: 25,
    marginHorizontal: 7,
    marginTop: 7,
  },
});

export default MilestoneList;
