import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import TextInputField from './component/signin-signup/TextInputField';
import React, { useEffect, useState } from 'react';
import PasswordInputField from './component/signin-signup/PasswordInputField';
import DateInputField from './component/signin-signup/DateInputField';
import AuthButton from './component/signin-signup/AuthButton';
import { Asset } from 'expo-asset';
import OptionSelector from './component/shared/OptionSelector';
import ApplyButton from './component/shared/ApplyButton';

export default function App() {

  return (
    <>
      <StatusBar style='dark' />
      <View style={styles.container}>
        
          {/* <TextInputField placeHolder='Email' required />
          <PasswordInputField placeHolder='Mật khẩu' />
        <DateInputField placeHolder='Ngày sinh' required />
        <TextInputField placeHolder='Họ' required />
        <TextInputField placeHolder='Tên' required />
        <TextInputField placeHolder='Số điện thoại' required />

          <AuthButton type='SignUp' />
        <OptionSelector />
        <ApplyButton label='Đăng ký'/> */}
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
