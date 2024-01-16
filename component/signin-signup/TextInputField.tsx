import React from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TextInputFieldProps from '../type/TextInputField';



const InputField = ({ placeHolder, required }: TextInputFieldProps) => {
  

  return (
    <View style={styles.container}>
      <TextInput
        placeholder={placeHolder}
        style={styles.input}
        autoCorrect={false}
      />
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    marginVertical: 20,
  },
  input: {
    fontSize: 18,
  },
});



export default InputField