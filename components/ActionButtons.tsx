import { useTheme } from "@/hooks/useTheme";
import { palette } from "@/theme/colors";
import { ActionButton, SwipeableCardHandle } from "@/types/ui";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "./ThemedText";

interface ActionButtonsProps {
  photoCardRef: React.RefObject<SwipeableCardHandle | null>;
}

export const ActionButtons = ({ photoCardRef }: ActionButtonsProps) => {
  const { colors, shadows } = useTheme();
  
  const buttons: ActionButton[] = [
    {
      icon: "fire",
      label: "Yeet",
      onPress: () => photoCardRef.current?.swipeLeft(),
      size: 24,
      color: colors.yeetLight,
    },
    {
      icon: "paperclip",
      label: "Details",
      onPress: () => photoCardRef.current?.swipeUp(),
      size: 20,
      color: colors.details,
      style: { transform: [{ rotate: "45deg" }] },
    },
    {
      icon: "shield-check",
      label: "Keep",
      onPress: () => photoCardRef.current?.swipeRight(),
      size: 24,
      color: colors.keepLight,
    },
  ]

  return (
    <View style={styles.buttonBar}>
      {buttons.map((button, index) => (
        <TouchableOpacity key={index} style={[styles.button, shadows.button]} onPress={button.onPress}>
          <MaterialCommunityIcons name={button.icon} size={button.size} color={button.color} style={button.style} />
          <ThemedText numberOfLines={2} style={styles.buttonLabel}>{button.label}</ThemedText>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonBar: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 30,
    zIndex: 10,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    width: 73,
    height: 73,
    backgroundColor: palette.overlay.dark,
    borderWidth: 1,
    borderColor: palette.primary,
    borderRadius: 999,
  },
  buttonLabel: {
    color: palette.text.primary,
    fontSize: 12,
    marginTop: 2,
    textAlign: 'center',
    width: '100%',
  },
});