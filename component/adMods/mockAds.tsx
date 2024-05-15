import React, { useState, useRef, useCallback } from "react";
import { View, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

const mockAds = [
  { id: 1, adsImg: require("../../assets/images/shared/samsungads.jpg") },
  { id: 2, adsImg: require("../../assets/images/shared/xiaomi.jpg") },
  { id: 3, adsImg: require("../../assets/images/shared/iphone-ads.jpg") },
  { id: 4, adsImg: require("../../assets/images/shared/nokiaads.jpg") },
];

const getRandomAd = () => {
  const randomIndex = Math.floor(Math.random() * mockAds.length);
  return mockAds[randomIndex].adsImg;
};

const MockAdBanner = () => {
  const [visible, setVisible] = useState(false);
  const adRef = useRef(getRandomAd());

  useFocusEffect(
    useCallback(() => {
        const shouldShowAd = Math.random() < 0.5;
      if (shouldShowAd) {
        adRef.current = getRandomAd();
        setVisible(true);
      } else {
        setVisible(false);
      }
    }, [])
  );

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.banner}>
      <Image source={adRef.current} style={styles.addLogo} />
      <TouchableOpacity onPress={() => setVisible(false)}>
        <Image
          source={require("../../assets/images/shared/closedModal.png")}
          style={styles.logoStyle}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 20,
  },
  addLogo: {
    width: 350,
    height: 120,
  },
  logoStyle: {
    width: 26,
    height: 26,
    position: "absolute",
    right: 10,
    top: 10,
  },
});

export default MockAdBanner;