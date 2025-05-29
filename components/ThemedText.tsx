import { useTheme } from '@/hooks/useTheme';
import React from 'react';
import { Text, TextProps } from 'react-native';

export const ThemedText: React.FC<TextProps> = ({ style, ...props }) => {
  const { colors } = useTheme();
  return <Text style={[{ color: colors.text.primary }, style]} {...props} />;
};
