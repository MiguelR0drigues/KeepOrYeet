import { MaterialCommunityIcons } from "@expo/vector-icons";
import { OpaqueColorValue, StyleProp, StyleSheet, TextStyle, TouchableOpacity, View } from "react-native";
import { PhotoCardHandle } from "./PhotoCard";
import { ThemedText } from "./ThemedText";

interface ActionButtonsProps {
  photoCardRef: React.RefObject<PhotoCardHandle | null>;
}

interface Button {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  label: string;
  onPress: () => void;
  size?: number;
  color?: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
}

export const ActionButtons = ({ photoCardRef }: ActionButtonsProps) => {

  const buttons: Button[] = [
    {
      icon: "fire",
      label: "Yeet",
      onPress: () => photoCardRef.current?.swipeLeft(),
      size: 24,
      color: "#ff4d4d",
    },
    {
      icon: "paperclip",
      label: "Details",
      onPress: () => photoCardRef.current?.swipeUp(),
      size: 20,
      color: "#4da6ff",
      style: { transform: [{ rotate: "45deg" }] },
    },
    {
      icon: "undo-variant",
      label: "Undo",
      onPress: () => console.log("Undo"),
      size: 20,
      color: "lightblue",
    },
    {
      icon: "shield-check",
      label: "Keep",
      onPress: () => photoCardRef.current?.swipeRight(),
      size: 24,
      color: "#4dff88",
    },
  ]

  return (
    <View style={styles.buttonBar}>
      {buttons.map((button, index) => (
        <TouchableOpacity key={index} style={styles.button} onPress={button.onPress}>
          <MaterialCommunityIcons name={button.icon as any} size={button.size} color={button.color} style={button.style} />
          <ThemedText style={styles.buttonLabel}>{button.label}</ThemedText>
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
        aspectRatio: 1,
        height: '100%',
        backgroundColor: '#000',
        borderWidth: 1,
        borderColor: 'rgb(54, 0, 108)',
        borderRadius: 999,
        shadowColor: '#36006C',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.7,
        shadowRadius: 12,
        elevation: 16,
      },
      buttonLabel: {
        color: '#FFF',
        fontSize: 12,
        marginTop: 2,
      },
  })