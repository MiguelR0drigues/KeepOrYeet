import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet } from 'react-native';

export const Background: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <LinearGradient
      colors={['#000', '#1a0036']}
      style={StyleSheet.absoluteFill}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      locations={[0.9, 0.4]}
    >
      {children}
    </LinearGradient>
  );
}; 