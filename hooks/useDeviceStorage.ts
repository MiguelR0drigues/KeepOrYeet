import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { Platform } from "react-native";

const YEETED_ALBUM_NAME = "Yeeted Content";

interface UseDeviceStorageReturn {
  moveToYeeted: (assetIds: string[]) => Promise<void>;
  restoreFromYeeted: (assetIds: string[]) => Promise<void>;
  clearYeetedContent: () => Promise<void>;
}

async function ensurePermissions() {
  const { status } = await MediaLibrary.getPermissionsAsync(false, [
    "photo",
    "video",
  ]);

  if (status !== "granted") {
    const { status: newStatus } = await MediaLibrary.requestPermissionsAsync(
      false,
      ["photo", "video"]
    );

    if (newStatus !== "granted") {
      throw new Error("Media library permission not granted");
    }
  }
}

async function createYeetedAlbumIfNeeded(): Promise<string | null> {
  if (Platform.OS !== "ios") return null;

  await ensurePermissions();

  const albums = await MediaLibrary.getAlbumsAsync();
  const yeetedAlbum = albums.find((album) => album.title === YEETED_ALBUM_NAME);

  if (yeetedAlbum) {
    return yeetedAlbum.id;
  }

  const newAlbum = await MediaLibrary.createAlbumAsync(YEETED_ALBUM_NAME);
  return typeof newAlbum.id === "string" ? newAlbum.id : null;
}

async function ensureYeetedDirectoryExists(): Promise<string> {
  if (Platform.OS !== "android") return "";

  await ensurePermissions();

  const yeetedDir = `${FileSystem.documentDirectory}YeetedContent`;
  const dirInfo = await FileSystem.getInfoAsync(yeetedDir);

  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(yeetedDir, { intermediates: true });
  }

  return yeetedDir;
}

export function useDeviceStorage(): UseDeviceStorageReturn {
  const moveToYeeted = async (assetIds: string[]) => {
    try {
      await ensurePermissions();

      if (Platform.OS === "ios") {
        const albumId = await createYeetedAlbumIfNeeded();
        if (!albumId) throw new Error("Failed to create or find Yeeted album");

        await MediaLibrary.addAssetsToAlbumAsync(assetIds, albumId);
      } else {
        const yeetedDir = await ensureYeetedDirectoryExists();

        for (const assetId of assetIds) {
          const asset = await MediaLibrary.getAssetInfoAsync(assetId);
          if (!asset) continue;

          const fileName = asset.filename;
          const newPath = `${yeetedDir}/${fileName}`;

          await FileSystem.moveAsync({
            from: asset.uri,
            to: newPath,
          });

          await MediaLibrary.deleteAssetsAsync([assetId]);
        }
      }
    } catch (error) {
      console.error("Error moving assets to yeeted:", error);
      throw error;
    }
  };

  const restoreFromYeeted = async (assetIds: string[]) => {
    try {
      await ensurePermissions();

      if (Platform.OS === "ios") {
        const albums = await MediaLibrary.getAlbumsAsync();
        const yeetedAlbum = albums.find(
          (album) => album.title === YEETED_ALBUM_NAME
        );

        if (yeetedAlbum) {
          await MediaLibrary.removeAssetsFromAlbumAsync(
            assetIds,
            yeetedAlbum.id
          );
        }
      } else {
        const yeetedDir = await ensureYeetedDirectoryExists();

        for (const assetId of assetIds) {
          const asset = await MediaLibrary.getAssetInfoAsync(assetId);
          if (!asset) continue;

          const fileName = asset.filename;
          const yeetedPath = `${yeetedDir}/${fileName}`;

          const galleryDir = `${FileSystem.documentDirectory}DCIM/Camera`;
          await FileSystem.makeDirectoryAsync(galleryDir, {
            intermediates: true,
          });
          const galleryPath = `${galleryDir}/${fileName}`;

          await FileSystem.moveAsync({
            from: yeetedPath,
            to: galleryPath,
          });

          await MediaLibrary.createAssetAsync(galleryPath);
        }
      }
    } catch (error) {
      console.error("Error restoring assets from yeeted:", error);
      throw error;
    }
  };

  const clearYeetedContent = async () => {
    try {
      await ensurePermissions();

      if (Platform.OS === "ios") {
        const albums = await MediaLibrary.getAlbumsAsync();
        const yeetedAlbum = albums.find(
          (album) => album.title === YEETED_ALBUM_NAME
        );

        if (yeetedAlbum) {
          const assets = await MediaLibrary.getAssetsAsync({
            album: yeetedAlbum.id,
          });

          if (assets.assets.length > 0) {
            await MediaLibrary.deleteAssetsAsync(
              assets.assets.map((asset) => asset.id)
            );
          }
        }
      } else {
        const yeetedDir = await ensureYeetedDirectoryExists();
        await FileSystem.deleteAsync(yeetedDir, { idempotent: true });
        await ensureYeetedDirectoryExists(); // Recreate the empty directory
      }
    } catch (error) {
      console.error("Error clearing yeeted content:", error);
      throw error;
    }
  };

  return {
    moveToYeeted,
    restoreFromYeeted,
    clearYeetedContent,
  };
}
