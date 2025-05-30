import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Logo } from './Logo';

interface TopBarProps {
  onProfilePress: () => void;
  onSummaryPress: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onProfilePress,
  onSummaryPress,
}) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { 
      backgroundColor: colors.primary,
      paddingTop: insets.top || Constants.statusBarHeight,
    }]}>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onProfilePress}
        >
          {/* <Ionicons name="person-circle-outline" size={32} color="white" /> */}
        </TouchableOpacity>

        <Logo />

        <TouchableOpacity
          style={styles.summaryButton}
          onPress={onSummaryPress}
        >
          <Ionicons name="stats-chart" size={24} color="white" style={styles.summaryIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    height: 60,
    width: '100%',
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 20,
  },
  summaryIcon: {
    marginRight: 6,
  },
  summaryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 