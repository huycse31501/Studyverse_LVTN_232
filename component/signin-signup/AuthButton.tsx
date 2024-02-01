import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import AuthButtonProps from '../type/AuthButton';

const AuthButton = ({ type }: AuthButtonProps) => {
  return (

    <View style={styles.container}>
      <TouchableOpacity  disabled={type === 'SignUp'}>
            <View style={styles.buttonContainer} >
                <Text style={type === 'SignUp' ? [styles.text, styles.bold] : styles.text}>ĐĂNG KÝ</Text>
                {type === 'SignUp' && <View style={styles.underline} />}
            </View>
      </TouchableOpacity>
      <TouchableOpacity disabled={type === 'SignIn'}>
      <View style={styles.buttonContainer}>
        <Text style={type === 'SignIn' ? [styles.text, styles.bold] : styles.text}>ĐĂNG NHẬP</Text>
        {type === 'SignIn' && <View style={styles.underline} />}
      </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 7,
  },
  text: {
    color: '#FF2D55',
    fontSize: 18,
  },
  bold: {
    fontWeight: 'bold',
    marginTop: 5,
  },
  underline: {
    height: 3, // Adjust the thickness of the underline as needed
    backgroundColor: '#FF0076',
    width: '100%', 
    marginTop: 2, // Adjust spacing between text and underline as needed
  },
});

export default AuthButton;