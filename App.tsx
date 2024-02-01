import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import TextInputField from './component/signin-signup/TextInputField';
import React, { useEffect, useState } from 'react';
import PasswordInputField from './component/signin-signup/PasswordInputField';
import DateInputField from './component/signin-signup/DateInputField';
import AuthButton from './component/signin-signup/AuthButton';
import { Asset } from 'expo-asset';

export default function App() {
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  const _loadAssetsAsync = async () => {
    await Promise.all([
      Asset.fromModule(require('./assets/images/signIn-signUp/datePickerIcon.png')).downloadAsync(),
      // ... add other assets you want to load
    ]);
    setAssetsLoaded(true);
  };

  useEffect(() => {
    _loadAssetsAsync();
  }, []);

  if (!assetsLoaded) {
    return null;
  }
  return (
    <>
      <StatusBar style='dark' />
        <View style={styles.container}>
          <TextInputField placeHolder='Email' required />
          <PasswordInputField placeHolder='Mật khẩu' />
          <DateInputField placeHolder='Ngày sinh' required />
          {/* <AuthButton type='SignIn' /> */}
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
