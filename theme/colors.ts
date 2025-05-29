export const palette = {
  // Brand Colors
  primary: "#36006C",

  // Action Colors
  yeet: "#F44336",
  yeetLight: "#ff4d4d",
  keep: "#4CAF50",
  keepLight: "#4dff88",
  details: "#4da6ff",

  // Monochrome
  white: "#FFFFFF",
  black: "#000000",

  // Text
  text: {
    primary: "#FFFFFF",
    secondary: "rgba(255, 255, 255, 0.7)",
    muted: "rgba(255, 255, 255, 0.1)",
  },

  // Overlays
  overlay: {
    light: "rgba(255, 255, 255, 0.25)",
    dark: "rgba(0, 0, 0, 0.60)",
    shadow: "rgba(0, 0, 0, 0.3)",
  },
} as const;

export const shadows = {
  button: {
    shadowColor: palette.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.7,
    shadowRadius: 12,
    elevation: 16,
  },
  card: {
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
} as const;

export const borders = {
  primary: {
    borderWidth: 1,
    borderColor: palette.primary,
  },
  action: {
    borderWidth: 3,
    borderRadius: 20,
  },
} as const;
