import { useTheme } from '@/hooks/useTheme';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from './ThemedText';

export const Logo: React.FC = () => {
  const { colors } = useTheme();
  
  return (
    <View style={styles.container}>
      <ThemedText style={[styles.text, { color: colors.keep }]}>Keep</ThemedText>
      <ThemedText style={[styles.text, { color: 'white', marginHorizontal: 8 }]}>or</ThemedText>
      <ThemedText style={[styles.text, { color: colors.yeet }]}>Yeet</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
  },
}); 