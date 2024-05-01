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
  Alert,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { formatDate } from "../../utils/formatDate";
import Constants from "expo-constants";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import ApplyButton from "../shared/ApplyButton";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

let host = Constants?.expoConfig?.extra?.host;

interface StudyPlanListProps {
  logo?: any;
  color?: any;
  studyPackage?: any;
  userId?: any;
}

type StudyDetailsNavigationProp = StackNavigationProp<{
  StudyPlanDetailsScreen: {
    userId: number;
    routeBefore?: string;
    newPlanCreated?: boolean;
    fromFooter?: string;
    studyPackage?: any;
  };
  ViewStudyPlansScreen: {
    userId: number;
    routeBefore?: string;
    studyPackage?: any;
    index?: any;
  };
  EditStudyPlanScreen: {
    userId: number;
    routeBefore?: string;
    newPlanCreated?: boolean;
    fromFooter?: string;
    studyPackage?: any;
    editStudyPlan?: any;
  };
}>;

const StudyPlanList: React.FC<StudyPlanListProps> = ({
  logo,
  color,
  studyPackage,
  userId,
}) => {
  const user = useSelector((state: RootState) => state.user.user);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentDeleteStudyPlan, setCurrentDeleteStudyPlan] =
    useState<any>(null);

  const navigation = useNavigation<StudyDetailsNavigationProp>();
  const [studyPackageToRender, setStudyPackageToRender] = useState(
    studyPackage.courseInfo.map((item: any) => {
      return {
        id: item.id,
        name: item.name,
        startDate: item.startDate,
        endDate: item.endDate,
        currentProgress: Math.floor(
          (item.milestones.filter((milestone: any) => {
            return milestone.pass === true;
          }).length /
            item.milestones.length) *
            100
        ),
      };
    })
  );

  const handleDeleteStudyPlan = async (
    studyPlanId: string | number | undefined
  ) => {
    if (studyPlanId === undefined) {
      return;
    }
    let requestCreateEventURL = `https://${host}/studyPlan/${studyPlanId}`;
    try {
      const response = await fetch(requestCreateEventURL, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.msg == "1") {
        const updatedStudyPlans = studyPackageToRender.filter(
          (item: any) => item.id !== studyPlanId
        );
        setStudyPackageToRender(updatedStudyPlans);
        setShowDeleteModal(false);
        setShowDeleteModal(false);
      } else {
        Alert.alert("Thất bại", "Xóa cột mốc thất bại");
      }
    } catch (e) {
      Alert.alert(`Xóa cột mốc thất bại`);
    }
  };

  return (
    <ScrollView style={{ marginBottom: 30 }}>
      {studyPackageToRender.map((item: any, index: any) => (
        <TouchableOpacity
          style={[styles.container, { backgroundColor: color }]}
          key={index}
          onPress={() => {
            navigation.navigate("ViewStudyPlansScreen", {
              userId: userId,
              studyPackage: studyPackage,
              index: index,
            });
          }}
        >
          <View style={styles.contentContainer}>
            <Image source={logo} style={styles.iconStyles} />
            <View style={styles.studyPlanInfoContainer}>
              <View style={styles.studyPlanTextContainer}>
                <Text style={styles.studyPlanText}>{item.name}</Text>
                {user?.role === "parent" && (
                  <>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate("EditStudyPlanScreen", {
                          userId: userId,
                          studyPackage: studyPackage,
                          editStudyPlan: item,
                        });
                      }}
                    >
                      <Image
                        source={require("../../assets/images/shared/plus.png")}
                        style={styles.editLogoStyle}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setShowDeleteModal(true);
                        setCurrentDeleteStudyPlan({
                          id: item.id,
                          name: item.name,
                        });
                      }}
                    >
                      <Image
                        source={require("../../assets/images/shared/minus.png")}
                        style={styles.minusLogoStyle}
                      />
                    </TouchableOpacity>
                  </>
                )}
              </View>
              <View style={styles.studyPlanTimeRangeContainer}>
                <Image
                  style={styles.studyPlanLogo}
                  source={require("../../assets/images/shared/calendarStudyPlan.png")}
                />
                <Text style={styles.studyPlanTimeText}>{`${formatDate(
                  item.startDate
                )} - ${formatDate(item.endDate)}`}</Text>
              </View>
              <View style={styles.progressContainer}>
                <LinearGradient
                  colors={["#FFBF1A", "#FF4080"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[
                    styles.progressBar,
                    {
                      width: `${item.currentProgress}%`,
                      borderTopLeftRadius: 10,
                      borderBottomLeftRadius: 10,
                      borderBottomRightRadius: 10,
                    },
                  ]}
                />
                <Text style={styles.label}>{`${item.currentProgress}%`}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ))}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showDeleteModal}
        onRequestClose={() => {
          setShowDeleteModal(false);
        }}
        statusBarTranslucent
      >
        <TouchableWithoutFeedback
          onPress={() => {
            setShowDeleteModal(false);
          }}
        >
          <View style={styles.centeredDeleteModalView}>
            <TouchableWithoutFeedback>
              <View style={styles.DeleteModalView}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => {
                    setShowDeleteModal(false);
                  }}
                >
                  <Image
                    source={require("../../assets/images/shared/closedModal.png")}
                    style={styles.closeIcon}
                  />
                </TouchableOpacity>
                <Text style={styles.deleteHeaderText}>Xóa kế hoạch</Text>
                <Text style={styles.deleteMilestoneText}>
                  {currentDeleteStudyPlan?.name}
                </Text>
                <View style={styles.deleteButtonContainer}>
                  <ApplyButton
                    label="Xác nhận"
                    extraStyle={{
                      width: 150,
                    }}
                    onPress={() =>
                      handleDeleteStudyPlan(currentDeleteStudyPlan?.id)
                    }
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 16,
    shadowColor: "rgba(0,0,0,25)",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    marginTop: 35,
    marginHorizontal: 30,
    padding: 17.5,
    paddingVertical: 25,
  },
  contentContainer: {
    flexDirection: "row",
  },
  iconStyles: {
    width: 55,
    height: 55,
    alignSelf: "center",
  },
  studyPlanInfoContainer: {},
  studyPlanTimeRangeContainer: {
    flexDirection: "row",
    marginLeft: 15,
    marginTop: 3,
  },
  studyPlanLogo: {
    width: 12.5,
    height: 12.5,
    alignSelf: "center",
  },
  studyPlanTimeText: {
    fontSize: 13,
    fontWeight: "400",
    marginLeft: 5,
  },

  studyPlanText: {
    fontSize: 18,
    fontWeight: "600",
    alignSelf: "flex-start",
    color: "#131313",
    marginLeft: 15,
    width: 100,
  },
  progressContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginLeft: 15,
    marginTop: 10,
    height: 18,
  },
  progressBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 10,
    height: "100%",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    position: "relative",
    left: 180,
    top: -1,
    color: "rgba(0,0,0,0.85)",
  },
  studyPlanTextContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  editLogoStyle: {
    width: 20,
    height: 20,
    position: "absolute",
    top: -30,
    left: 80,
    opacity: 0.85,
  },
  minusLogoStyle: {
    width: 20,
    height: 20,
    position: "absolute",
    top: -30,
    left: 110,
    opacity: 0.85,
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

export default StudyPlanList;
