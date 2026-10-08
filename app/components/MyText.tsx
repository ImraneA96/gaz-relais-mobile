import React from 'react';
import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native';

const MyText = ({ children, style, ...props }: {children: React.ReactNode, style?:  StyleProp<TextStyle>}) => {
  return (
    <Text style={[styles.defaultText, style]} {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  defaultText: {
    fontFamily: 'Arial',
    fontSize: 14,
    color: '#504e4e',
  },
});

export default MyText;