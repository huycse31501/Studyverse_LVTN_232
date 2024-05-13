import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { setEnglishEnabled } from "../../redux/actions/languageAction";

const LanguageDropdown = () => {
  const dispatch = useDispatch();
  const isEnglishEnabled = useSelector(
    (state: RootState) => state.language.isEnglishEnabled
  );

  const [modalVisible, setModalVisible] = useState(false);

  const handleLanguageChange = (language: boolean) => {
    dispatch(setEnglishEnabled(language));
    setModalVisible(false);
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.dropdownButton}
      >
        <Image
          source={
            isEnglishEnabled
              ? require("../../assets/images/shared/ENGFlag.png")
              : require("../../assets/images/shared/VNFlag.png")
          }
          style={styles.logoIcon}
        />
        <Text style={styles.dropdownButtonText}>
          {isEnglishEnabled ? "ENG" : "VIE"}
        </Text>
      </TouchableOpacity>
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity
              onPress={() => handleLanguageChange(true)}
              style={styles.modalOption}
            >
              <Text style={styles.modalOptionText}>ENG</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleLanguageChange(false)}
              style={styles.modalOption}
            >
              <Text style={styles.modalOptionText}>VIE</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownButton: {
    padding: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#D1D1D1",
    marginRight: 20,
    flexDirection: "row",
  },
  dropdownButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  modalOption: {
    padding: 10,
  },
  modalOptionText: {
    fontSize: 18,
    fontWeight: "600",
  },
  logoIcon: {
    width: 30,
    height: 20,
    marginRight: 10,
    alignSelf: "center",
  },
});

export default LanguageDropdown;
