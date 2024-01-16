import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import TextInputField from './component/signin-signup/TextInputField';



export default function App() {
  return (
    <>
      <StatusBar style='dark' />
        <View style={styles.container}>
          <TextInputField placeHolder='Email' />
        </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: '6.8%',
    paddingRight: '6.8%'
  },
});
