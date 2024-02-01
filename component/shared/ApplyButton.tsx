import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

// Define the type for your props
type ApplyButtonProps = {
  label: string;
  onPress?: () => void; // You can add more props if needed, like an onPress function
}

const ApplyButton = ({ label, onPress }: ApplyButtonProps) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
  button: {
    width: '45%',
    backgroundColor: '#FF2D55', // Button background color
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  text: {
    color: '#FFFFFF', // Text color
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ApplyButton;