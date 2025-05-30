import * as MediaLibrary from "expo-media-library";
import { create } from "zustand";

interface PermissionsState {
  hasMediaPermissions: boolean | null;
  hasDeletePermissions: boolean | null;
  isLoading: boolean;

  // Actions
  checkPermissions: () => Promise<void>;
  requestPermissions: () => Promise<void>;
}

export const usePermissionsStore = create<PermissionsState>((set, get) => ({
  hasMediaPermissions: null,
  hasDeletePermissions: null,
  isLoading: false,

  checkPermissions: async () => {
    try {
      set({ isLoading: true });

      // Check media library permissions
      const { status: mediaStatus, accessPrivileges } =
        await MediaLibrary.getPermissionsAsync();
      const hasMedia = mediaStatus === "granted" && accessPrivileges === "all";

      // Check write permissions (needed for deletion)
      const { status: writeStatus } = await MediaLibrary.getPermissionsAsync(
        true
      );
      const hasWrite = writeStatus === "granted";

      set({
        hasMediaPermissions: hasMedia,
        hasDeletePermissions: hasWrite,
      });
    } catch (error) {
      console.error("Error checking permissions:", error);
      set({
        hasMediaPermissions: false,
        hasDeletePermissions: false,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  requestPermissions: async () => {
    try {
      set({ isLoading: true });

      // Request media library permissions
      const { status: mediaStatus, accessPrivileges } =
        await MediaLibrary.requestPermissionsAsync(false, ["photo", "video"]);
      const hasMedia = mediaStatus === "granted" && accessPrivileges === "all";

      // Request write permissions (needed for deletion)
      const { status: writeStatus } =
        await MediaLibrary.requestPermissionsAsync(true);
      const hasWrite = writeStatus === "granted";

      set({
        hasMediaPermissions: hasMedia,
        hasDeletePermissions: hasWrite,
      });
    } catch (error) {
      console.error("Error requesting permissions:", error);
      set({
        hasMediaPermissions: false,
        hasDeletePermissions: false,
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));
