import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import TextInputField from './component/signin-signup/TextInputField';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import PasswordInputField from './component/signin-signup/PasswordInputField';
import DateInputField from './component/signin-signup/DateInputField';

export default function App() {

  const [fontsLoaded, setFontsLoaded] = useState<boolean>(false);

    useEffect(() => {
      async function loadFonts() {
        try {
          await SplashScreen.preventAutoHideAsync();
          await Font.loadAsync({
            'roboto-regular': require('./assets/fonts/Roboto-Regular.ttf'),
          });
        } catch (e) {
          console.warn('Error loading fonts', e);
        } finally {
          setFontsLoaded(true);
          await SplashScreen.hideAsync();
        }
      }

      loadFonts();
    }, []);

    if (!fontsLoaded) {
      return null; // Or a loading indicator of your choice
    }

  return (
    <>
      <StatusBar style='dark' />
        <View style={styles.container}>
          <TextInputField placeHolder='Email' required />
          <PasswordInputField placeHolder='Mật khẩu' />
          <DateInputField placeHolder='Ngày sinh' required />
        </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: '6.8%',
    paddingRight: '6.8%',
    backgroundColor: '#F9F9F9',
  },
});
