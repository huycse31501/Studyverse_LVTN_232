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
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import userReducer from "../../redux/reducers/userReducer";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import ApplyButton from "../shared/ApplyButton";
import Constants from "expo-constants";

// const initialMilestones = [
//   { key: "1", name: "TOEIC", status: "done" },
//   { key: "2", name: "IELTS", status: "done" },
//   { key: "3", name: "Giao tiếp", status: "done" },
//   { key: "4", name: "Giao tiếp", status: "pending" },
//   { key: "5", name: "Giao tiếp", status: "in-progress" },
//   { key: "6", name: "IELTS", status: "in-progress" },
//   { key: "7", name: "Unit 7: Learning", status: "in-progress" },
// ];

interface MilestoneListProps {
  studyPackage?: any;
  deleteMilestone?: (index: number) => void;
  shiftLeft?: (index: number) => void;
  shiftRight?: (index: number) => void;
  isCreated?: Boolean;
  indexPass?: any;
  studyPackageToPass?: any;
  childrenId?: any;
  userId?: any;
  updateStudyPackage?: any;
  updateToCreateStudyPackage?: any;
}

type MilestonesNavigationProp = StackNavigationProp<{
  AddMoreMilestoneScreen: {
    userId: number;
    routeBefore?: string;
    studyPackage?: any;
    index?: any;
    updateStudyPackage?: any;
  };
  EditMilestoneScreen: {
    userId: number;
    routeBefore?: string;
    studyPackage?: any;
    index?: any;
    currentMilestone?: any;
  };
}>;

let host = Constants?.expoConfig?.extra?.host;

const MilestoneList: React.FC<MilestoneListProps> = ({
  studyPackage,
  deleteMilestone,
  shiftLeft,
  shiftRight,
  isCreated,
  indexPass,
  userId,
  studyPackageToPass,
  childrenId,
  updateStudyPackage,
}) => {
  const navigation = useNavigation<MilestonesNavigationProp>();
  const user = useSelector((state: RootState) => state.user.user);
  const [isLoading, setIsLoading] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  const [currentCompleteMilestone, setCurrentCompleteMilestone] =
    useState<any>(null);
  const [currentDeleteMilestone, setCurrentDeleteMilestone] =
    useState<any>(null);
  let { milestones } = studyPackage;
  const getMilestoneStatus = (milestone: any, index: any, milestones: any) => {
    if (milestone.pass) {
      return "done";
    } else if (index === milestones.findIndex((m: any) => !m.pass)) {
      return "in-progress";
    }
    return "pending";
  };

  const handleDeleteMilestone = async (
    milestoneId: string | number | undefined
  ) => {
    if (milestoneId === undefined) {
      return;
    }

    setIsLoading(true);
    setShowDeleteModal(false);

    let requestCreateEventURL = `https://${host}/milestone/${currentDeleteMilestone?.id}`;
    try {
      const response = await fetch(requestCreateEventURL, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.msg == "1") {
        const index = studyPackage.milestones.findIndex(
          (item: any) => item.id === milestoneId
        );
        if (index !== -1) {
          studyPackage.milestones.splice(index, 1);
        }
        setIsLoading(false);
      } else {
        setIsLoading(false);

        Alert.alert("Thất bại", "Xóa cột mốc thất bại");
      }
    } catch (e) {
      setIsLoading(false);

      Alert.alert(`Xóa cột mốc thất bại`);
    }
  };

  const completeMilestone = async (milestoneId: any, childrenId: any) => {
    let requestCompleteMilestoneURL = `https://${host}/milestone/complete`;
    setIsLoading(true);
    setShowCompleteModal(false);

    try {
      const response = await fetch(requestCompleteMilestoneURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: Number(milestoneId),
          childrenId: Number(childrenId),
        }),
      });

      const data = await response.json();
      if (data.msg == "1") {
        const updatedMilestones = studyPackage.milestones.map(
          (milestone: any) => {
            if (milestone.id === milestoneId) {
              return { ...milestone, pass: true };
            }
            return milestone;
          }
        );
        studyPackageToPass.courseInfo[indexPass].milestones = updatedMilestones;
        updateStudyPackage(studyPackageToPass);
        setIsLoading(false);
      } else {
        setIsLoading(false);

        Alert.alert("Thất bại", "Hoàn thành cột mốc thất bại");
      }
    } catch (e) {
      setIsLoading(false);

      Alert.alert(`Hoàn thành cột mốc thất bại`);
    }
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0b0b0d" />
        </View>
      )}
      <ScrollView style={{ marginBottom: 20, zIndex: 1 }}>
        {milestones.map((item: any, index: any) => (
          <View style={styles.totalContainer} key={index}>
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
                        item.status == "in-progress" || item.pass !== true
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
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate("EditMilestoneScreen", {
                            userId: userId,
                            studyPackage: studyPackageToPass,
                            index: indexPass,
                            currentMilestone: item,
                          });
                        }}
                      >
                        <Image
                          source={
                            item.status === "in-progress" ||
                            getMilestoneStatus(item, index, milestones) ===
                              "pending"
                              ? require("../../assets/images/studyPlan/padlock.png")
                              : item.status === "done" ||
                                getMilestoneStatus(item, index, milestones) ===
                                  "done"
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
                          {isCreated && shiftLeft && shiftRight && (
                            <>
                              <TouchableOpacity
                                onPress={() => shiftLeft(index)}
                              >
                                <Image
                                  source={require("../../assets/images/studyPlan/shiftLeft.png")}
                                  style={styles.milestoneEditLogo}
                                />
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => shiftRight(index)}
                              >
                                <Image
                                  source={require("../../assets/images/studyPlan/shiftRight.png")}
                                  style={styles.milestoneEditLogo}
                                />
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => {
                                  if (deleteMilestone) {
                                    deleteMilestone(index);
                                  }
                                }}
                              >
                                <Image
                                  source={require("../../assets/images/studyPlan/deleteMilestone.png")}
                                  style={styles.milestoneEditLogo}
                                />
                              </TouchableOpacity>
                            </>
                          )}
                          {!isCreated &&
                            user?.role === "parent" &&
                            item.pass !== true &&
                            !item?.isNewCreated && (
                              <>
                                <TouchableOpacity
                                  onPress={() => {
                                    setShowDeleteModal(true);
                                    setCurrentDeleteMilestone({
                                      id: item.id,
                                      name: item.name,
                                    });
                                  }}
                                >
                                  <Image
                                    source={require("../../assets/images/studyPlan/deleteMilestone.png")}
                                    style={styles.milestoneEditLogo}
                                  />
                                </TouchableOpacity>
                              </>
                            )}
                          {user?.role === "parent" &&
                            !isCreated &&
                            getMilestoneStatus(item, index, milestones) ===
                              "in-progress" && (
                              <>
                                <TouchableOpacity
                                  onPress={() => {
                                    setShowCompleteModal(true);
                                    setCurrentCompleteMilestone({
                                      milestoneId: item.id,
                                      name: item.name,
                                    });
                                  }}
                                >
                                  <Image
                                    source={require("../../assets/images/shared/acceptIcon.png")}
                                    style={styles.milestoneEditLogo}
                                  />
                                </TouchableOpacity>
                              </>
                            )}
                        </View>
                      </View>
                    </View>
                  </View>
                ) : (
                  <>
                    <Image
                      source={
                        item.status == "in-progress" || item.pass !== true
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
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate("EditMilestoneScreen", {
                            userId: userId,
                            studyPackage: studyPackageToPass,
                            index: indexPass,
                            currentMilestone: item,
                          });
                        }}
                      >
                        <Image
                          source={
                            item.status === "in-progress" ||
                            getMilestoneStatus(item, index, milestones) ===
                              "pending"
                              ? require("../../assets/images/studyPlan/padlock.png")
                              : item.status === "done" ||
                                getMilestoneStatus(item, index, milestones) ===
                                  "done"
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
                          {isCreated &&
                            shiftLeft &&
                            shiftRight &&
                            !item?.isNewCreated(
                              <>
                                <TouchableOpacity
                                  onPress={() => shiftLeft(index)}
                                >
                                  <Image
                                    source={require("../../assets/images/studyPlan/shiftLeft.png")}
                                    style={styles.milestoneEditLogo}
                                  />
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() => shiftRight(index)}
                                >
                                  <Image
                                    source={require("../../assets/images/studyPlan/shiftRight.png")}
                                    style={styles.milestoneEditLogo}
                                  />
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() => {
                                    if (deleteMilestone) {
                                      deleteMilestone(index);
                                    }
                                  }}
                                >
                                  <Image
                                    source={require("../../assets/images/studyPlan/deleteMilestone.png")}
                                    style={styles.milestoneEditLogo}
                                  />
                                </TouchableOpacity>
                              </>
                            )}
                          {!isCreated &&
                            user?.role === "parent" &&
                            item.pass !== true &&
                            !item?.isNewCreated && (
                              <>
                                <TouchableOpacity
                                  onPress={() => {
                                    setShowDeleteModal(true);
                                    setCurrentDeleteMilestone({
                                      id: item.id,
                                      name: item.name,
                                    });
                                  }}
                                >
                                  <Image
                                    source={require("../../assets/images/studyPlan/deleteMilestone.png")}
                                    style={styles.milestoneEditLogo}
                                  />
                                </TouchableOpacity>
                              </>
                            )}
                          {user?.role === "parent" &&
                            getMilestoneStatus(item, index, milestones) ===
                              "in-progress" &&
                            !isCreated && (
                              <>
                                <TouchableOpacity
                                  onPress={() => {
                                    setShowCompleteModal(true);
                                    setCurrentCompleteMilestone({
                                      milestoneId: item.id,
                                      name: item.name,
                                    });
                                  }}
                                >
                                  <Image
                                    source={require("../../assets/images/shared/acceptIcon.png")}
                                    style={styles.milestoneEditLogo}
                                  />
                                </TouchableOpacity>
                              </>
                            )}
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
                    item.status == "in-progress" || item.pass !== true
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
                      {isCreated && shiftLeft && shiftRight && (
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
                          <TouchableOpacity
                            onPress={() => {
                              if (deleteMilestone) {
                                deleteMilestone(index);
                              }
                            }}
                          >
                            <Image
                              source={require("../../assets/images/studyPlan/deleteMilestone.png")}
                              style={styles.milestoneEditLogo}
                            />
                          </TouchableOpacity>
                        </>
                      )}
                      {!isCreated &&
                        user?.role === "parent" &&
                        item.pass !== true &&
                        !item?.isNewCreated && (
                          <>
                            <TouchableOpacity
                              onPress={() => {
                                setShowDeleteModal(true);
                                setCurrentDeleteMilestone({
                                  id: item.id,
                                  name: item.name,
                                });
                              }}
                            >
                              <Image
                                source={require("../../assets/images/studyPlan/deleteMilestone.png")}
                                style={styles.milestoneEditLogo}
                              />
                            </TouchableOpacity>
                          </>
                        )}
                      {user?.role === "parent" &&
                        getMilestoneStatus(item, index, milestones) ===
                          "in-progress" &&
                        !isCreated && (
                          <>
                            <TouchableOpacity
                              onPress={() => {
                                setShowCompleteModal(true);
                                setCurrentCompleteMilestone({
                                  milestoneId: item.id,
                                  name: item.name,
                                });
                              }}
                            >
                              <Image
                                source={require("../../assets/images/shared/acceptIcon.png")}
                                style={styles.milestoneEditLogo}
                              />
                            </TouchableOpacity>
                          </>
                        )}
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("EditMilestoneScreen", {
                        userId: userId,
                        studyPackage: studyPackageToPass,
                        index: indexPass,
                        currentMilestone: item,
                      });
                    }}
                  >
                    <Image
                      source={
                        item.status === "in-progress" ||
                        getMilestoneStatus(item, index, milestones) ===
                          "pending"
                          ? require("../../assets/images/studyPlan/padlock.png")
                          : item.status === "done" ||
                            getMilestoneStatus(item, index, milestones) ===
                              "done"
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
        {!isCreated && user?.role === "parent" && (
          <TouchableOpacity
            style={styles.addMileStoneContainer}
            onPress={() => {
              navigation.navigate("AddMoreMilestoneScreen", {
                userId: userId,
                studyPackage: studyPackageToPass,
                index: indexPass,
              });
            }}
          >
            <Image
              source={require("../../assets/images/studyPlan/addMileStone.png")}
              style={styles.addLogo}
            />
          </TouchableOpacity>
        )}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showDeleteModal}
          onRequestClose={() => {
            setShowDeleteModal(false);
            setCurrentDeleteMilestone(null);
          }}
          statusBarTranslucent
        >
          <TouchableWithoutFeedback
            onPress={() => {
              setShowDeleteModal(false);
              setCurrentDeleteMilestone(null);
            }}
          >
            <View style={styles.centeredDeleteModalView}>
              <TouchableWithoutFeedback>
                <View style={styles.DeleteModalView}>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => {
                      setShowDeleteModal(false);
                      setCurrentDeleteMilestone(null);
                    }}
                  >
                    <Image
                      source={require("../../assets/images/shared/closedModal.png")}
                      style={styles.closeIcon}
                    />
                  </TouchableOpacity>
                  <Text style={styles.deleteHeaderText}>Xóa cột mốc</Text>
                  <Text style={styles.deleteMilestoneText}>
                    {currentDeleteMilestone?.name}
                  </Text>
                  <View style={styles.deleteButtonContainer}>
                    <ApplyButton
                      label="Xác nhận"
                      extraStyle={{
                        width: 150,
                      }}
                      onPress={() =>
                        handleDeleteMilestone(currentDeleteMilestone?.id)
                      }
                    />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={showCompleteModal}
          onRequestClose={() => {
            setShowCompleteModal(false);
            setCurrentCompleteMilestone(null);
          }}
          statusBarTranslucent
        >
          <TouchableWithoutFeedback
            onPress={() => {
              setShowCompleteModal(false);
              setCurrentCompleteMilestone(null);
            }}
          >
            <View style={styles.centeredDeleteModalView}>
              <TouchableWithoutFeedback>
                <View style={styles.DeleteModalView}>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => {
                      setShowCompleteModal(false);
                      setCurrentCompleteMilestone(null);
                    }}
                  >
                    <Image
                      source={require("../../assets/images/shared/closedModal.png")}
                      style={styles.closeIcon}
                    />
                  </TouchableOpacity>
                  <Text style={styles.deleteHeaderText}>Hoàn thành </Text>
                  <Text style={styles.deleteMilestoneText}>
                    {currentCompleteMilestone?.name}
                  </Text>
                  <View style={styles.deleteButtonContainer}>
                    <ApplyButton
                      label="Xác nhận"
                      extraStyle={{
                        width: 150,
                      }}
                      onPress={() =>
                        completeMilestone(
                          currentCompleteMilestone.milestoneId,
                          childrenId
                        )
                      }
                    />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </ScrollView>
    </>
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
  loadingContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 999,
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
  centeredDeleteModalView: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.25)",
  },
  DeleteModalView: {
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: 300,
    height: 250,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 15,
    right: 15,
    zIndex: 1,
  },
  closeIcon: {
    width: 30,
    height: 30,
  },
  deleteHeaderText: {
    fontSize: 25,
    fontWeight: "600",
    top: -60,
  },
  deleteMilestoneText: {
    fontSize: 20,
    fontWeight: "500",
    top: -5,
  },
  deleteButtonContainer: {
    bottom: -45,
  },
});

export default MilestoneList;
