import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import AuthButtonProps from '../type/AuthButton';



const AuthButton = ({ type }: AuthButtonProps) => {
  return (
    <View style={styles.container}>
      {type === 'SignIn' ? (
        <Text style={[styles.text, styles.bold]}>ĐĂNG NHẬP</Text>
      ) : (
        <Text style={styles.text}>ĐĂNG NHẬP</Text>
      )}
      {type === 'SignUp' ? (
        <Text style={[styles.text, styles.bold, styles.underline]}>ĐĂNG KÝ</Text>
      ) : (
        <Text style={[styles.text, styles.underline]}>ĐĂNG KÝ</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#FF2D55',
    fontSize: 16,
    paddingHorizontal: 5,
  },
  bold: {
    fontWeight: 'bold',
  },
  underline: {
    textDecorationLine: 'underline',
    textDecorationColor: '#FF0076',
  },
});

export default AuthButton;