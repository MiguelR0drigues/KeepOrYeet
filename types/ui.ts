import { MaterialCommunityIcons } from "@expo/vector-icons";
import { OpaqueColorValue, StyleProp, TextStyle } from "react-native";

export interface ActionButton {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  label: string;
  onPress: () => void;
  size?: number;
  color?: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
}

export interface SwipeableCardHandle {
  swipeLeft: () => void;
  swipeRight: () => void;
  swipeUp: () => void;
}
