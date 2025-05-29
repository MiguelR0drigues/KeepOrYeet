import { borders, palette, shadows } from "@/theme/colors";
import { useColorScheme } from "react-native";

export function useTheme() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return {
    colors: palette,
    shadows,
    borders,
    isDark,
  };
}
