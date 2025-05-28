import { Dimensions } from "react-native";

export const SCREEN_WIDTH = Dimensions.get("window").width;
export const SCREEN_HEIGHT = Dimensions.get("window").height;
export const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;
export const MAX_HORIZONTAL_DRAG_DISTANCE = SCREEN_WIDTH * 0.5;
export const MAX_ROTATION = 15;
export const VERTICAL_SWIPE_THRESHOLD = -50;
export const BOTTOM_SHEET_HEIGHT = SCREEN_HEIGHT * 0.5;
export const VERTICAL_DRAG_THRESHOLD = 100;
