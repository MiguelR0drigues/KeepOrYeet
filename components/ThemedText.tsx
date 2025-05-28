import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...props
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  const typeStyle = {
    default: styles.default,
    title: styles.title,
    defaultSemiBold: styles.defaultSemiBold,
    subtitle: styles.subtitle,
    link: styles.link,
  }

  // Check if the style prop contains fontWeight: 'bold'
  const isBold = StyleSheet.flatten(style)?.fontWeight === 'bold';

  return (
    <Text
      style={[
        { color },
        typeStyle[type] || undefined,
        style,
        isBold ? styles.boldFontFamily : styles.fontFamily,
      ]}  
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  fontFamily: {
    fontFamily: 'Montserrat_400Regular',
  },
  boldFontFamily: {
    fontFamily: 'Montserrat_700Bold',
  },
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
  },
});
