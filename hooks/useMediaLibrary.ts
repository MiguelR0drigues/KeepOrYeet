import { PhotoAsset } from "@/types/generic";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

interface UseMediaLibraryReturn {
  photos: PhotoAsset[];
  hasPermission: boolean | null;
  requestPermission: () => Promise<void>;
}

export function useMediaLibrary(): UseMediaLibraryReturn {
  const [photos, setPhotos] = useState<PhotoAsset[]>([]);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const loadPhotos = async () => {
    try {
      const { totalCount } = await MediaLibrary.getAssetsAsync({
        mediaType: "photo",
      });

      const { assets } = await MediaLibrary.getAssetsAsync({
        mediaType: "photo",
        first: totalCount,
        sortBy: ["creationTime"],
      });

      setPhotos(assets);
    } catch (error) {
      console.error("Error loading photos:", error);
      Alert.alert(
        "Error",
        "Failed to load photos from your gallery. Please check your permissions and try again."
      );
    }
  };

  const checkPermission = async () => {
    try {
      const { status, accessPrivileges } =
        await MediaLibrary.getPermissionsAsync();
      const isGranted = status === "granted" && accessPrivileges === "all";
      setHasPermission(isGranted);
      if (isGranted) {
        await loadPhotos();
      }
    } catch (error) {
      console.error("Error checking permission:", error);
      setHasPermission(false);
    }
  };

  const requestPermission = async () => {
    try {
      const { status, accessPrivileges } =
        await MediaLibrary.requestPermissionsAsync(false, ["photo", "video"]);
      const isGranted = status === "granted" && accessPrivileges === "all";
      setHasPermission(isGranted);
      if (isGranted) {
        await loadPhotos();
      }
    } catch (error) {
      console.error("Error requesting permission:", error);
      setHasPermission(false);
    }
  };

  useEffect(() => {
    checkPermission();
  }, []);

  return {
    photos,
    hasPermission,
    requestPermission,
  };
}
