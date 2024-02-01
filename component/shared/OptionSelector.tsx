import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

type OptionType = 'PhuHuynh' | 'ConTre';

const OptionSelector = () => {
  const [selectedOption, setSelectedOption] = useState<OptionType>('PhuHuynh');

  const selectOption = (option: OptionType) => {
    setSelectedOption(option);
  };

  const isOptionSelected = (option: OptionType) => selectedOption === option;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.option, isOptionSelected('PhuHuynh') ? styles.selected : styles.unselected, styles.leftOption]}
        onPress={() => selectOption('PhuHuynh')}
      >
        <Text style={isOptionSelected('PhuHuynh') ? styles.selectedText : styles.unselectedText}>
          Phụ huynh
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.option, isOptionSelected('ConTre') ? styles.selected : styles.unselected,styles.rightOption]}
        onPress={() => selectOption('ConTre')}
      >
        <Text style={isOptionSelected('ConTre') ? styles.selectedText : styles.unselectedText}>
          Con trẻ
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
    option: {
    width: '40%',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  selected: {
      backgroundColor: '#FF2D55',
  },
  unselected: {
    backgroundColor: '#FFFFFF',
    borderWidth: 0,
      borderColor: '#FF2D55',
  },
  selectedText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  unselectedText: {
    color: '#FF2D55',
    textAlign: 'center',
    },
    leftOption: {
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,

    },
    rightOption: {
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
    },
});

export default OptionSelector;