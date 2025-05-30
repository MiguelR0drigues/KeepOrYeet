import { useTheme } from '@/hooks/useTheme';
import React from 'react';
import { StyleProp, Text, TextProps, TextStyle } from 'react-native';

const hasBoldWeight = (style: StyleProp<TextStyle>) => {
  if (!style) return false;
  
  const flattenedStyles = Array.isArray(style) ? style : [style];
  return flattenedStyles.some(s => {
    if (!s || typeof s !== 'object') return false;
    const textStyle = s as TextStyle;
    return textStyle.fontWeight === 'bold' || textStyle.fontWeight === '700';
  });
};

export const ThemedText: React.FC<TextProps> = ({ style, ...props }) => {
  const { colors } = useTheme();
  const isBold = hasBoldWeight(style);

  return (
    <Text 
      style={[
        { 
          fontFamily: isBold ? 'Montserrat_700Bold' : 'Montserrat_400Regular',
          color: colors.text.primary 
        },
        style
      ]} 
      {...props} 
    />
  );
};

