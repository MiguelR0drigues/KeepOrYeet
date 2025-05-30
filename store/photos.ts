import { useLoadingStore } from "@/store/loading";
import { PhotoAsset } from "@/types/generic";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { Platform } from "react-native";
import { create } from "zustand";

const YEETED_ALBUM_NAME = "Yeeted Content";

const isCoreDataError = (error: any) => {
  return (
    error?.message?.includes("CoreData") ||
    error?.message?.includes("connection to service") ||
    error?.userInfo?.NSDebugDescription?.includes("connection to service")
  );
};

type MediaLibraryResult = Awaited<
  ReturnType<typeof MediaLibrary.getAssetsAsync>
>;
type AlbumsResult = Awaited<ReturnType<typeof MediaLibrary.getAlbumsAsync>>;

const handleMediaLibraryError = (
  error: any,
  fallback: Partial<MediaLibraryResult> = {}
) => {
  if (isCoreDataError(error)) {
    console.warn(
      "Photo library connection temporarily unavailable, retrying..."
    );
    return fallback;
  }
  throw error;
};

const handleAlbumsError = (error: any): AlbumsResult => {
  if (isCoreDataError(error)) {
    console.warn(
      "Photo library connection temporarily unavailable, retrying..."
    );
    return [];
  }
  throw error;
};

async function ensureYeetedDirectoryExists(): Promise<string> {
  if (Platform.OS !== "android") return "";

  const yeetedDir = `${FileSystem.documentDirectory}YeetedContent`;
  const dirInfo = await FileSystem.getInfoAsync(yeetedDir);

  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(yeetedDir, { intermediates: true });
  }

  return yeetedDir;
}

interface PhotosState {
  photos: PhotoAsset[];
  yeetedPhotos: PhotoAsset[];
  currentIndex: number;
  hasLoaded: boolean;

  // Actions
  setPhotos: (photos: PhotoAsset[]) => void;
  setYeetedPhotos: (photos: PhotoAsset[]) => void;
  setCurrentIndex: (index: number) => void;
  incrementCurrentIndex: () => void;

  // Async Actions
  loadPhotos: () => Promise<void>;
  loadYeetedPhotos: () => Promise<void>;
  yeetPhoto: (photoId: string) => Promise<void>;
  restorePhoto: (photoId: string) => Promise<void>;
  deletePhoto: (photoId: string) => Promise<void>;
  deletePhotos: (photoIds: string[]) => Promise<void>;
}

export const usePhotosStore = create<PhotosState>((set, get) => {
  // Get loading store actions
  const { show: showLoading, hide: hideLoading } = useLoadingStore.getState();

  return {
    photos: [],
    yeetedPhotos: [],
    currentIndex: 0,
    hasLoaded: false,

    // Simple Actions
    setPhotos: (photos) => set({ photos }),
    setYeetedPhotos: (photos) => set({ yeetedPhotos: photos }),
    setCurrentIndex: (index) => set({ currentIndex: index }),
    incrementCurrentIndex: () =>
      set((state) => ({ currentIndex: state.currentIndex + 1 })),

    // Async Actions
    loadPhotos: async () => {
      if (!get().hasLoaded) {
        showLoading("Loading your photos...");
      }

      try {
        const result = await MediaLibrary.getAssetsAsync({
          mediaType: "photo",
        }).catch((error) => {
          return handleMediaLibraryError(error, { totalCount: 0, assets: [] });
        });

        const { assets = [] } = await MediaLibrary.getAssetsAsync({
          mediaType: "photo",
          first: result.totalCount || 0,
          sortBy: ["creationTime"],
        }).catch((error) => {
          return handleMediaLibraryError(error, { assets: [] });
        });

        set({ photos: assets, hasLoaded: true });
      } catch (error) {
        console.error("Error loading photos:", error);
        set({ photos: [], hasLoaded: true });
      } finally {
        hideLoading();
      }
    },

    loadYeetedPhotos: async () => {
      try {
        showLoading("Loading yeeted photos...");
        if (Platform.OS === "ios") {
          const albums = await MediaLibrary.getAlbumsAsync().catch((error) =>
            handleAlbumsError(error)
          );

          const yeetedAlbum = albums.find(
            (album: MediaLibrary.Album) => album.title === YEETED_ALBUM_NAME
          );

          if (yeetedAlbum) {
            const { assets = [] } = await MediaLibrary.getAssetsAsync({
              album: yeetedAlbum.id,
              mediaType: "photo",
            }).catch((error) => {
              return handleMediaLibraryError(error, { assets: [] });
            });
            set({ yeetedPhotos: assets });
          } else {
            set({ yeetedPhotos: [] });
          }
        } else {
          const yeetedDir = await ensureYeetedDirectoryExists();
          const dirContents = await FileSystem.readDirectoryAsync(yeetedDir);

          const yeetedAssets = [];
          for (const fileName of dirContents) {
            const assetPath = `${yeetedDir}/${fileName}`;
            const asset = await MediaLibrary.createAssetAsync(assetPath);
            if (asset) {
              yeetedAssets.push(asset);
            }
          }

          set({ yeetedPhotos: yeetedAssets });
        }
      } catch (error) {
        console.error("Error loading yeeted photos:", error);
        set({ yeetedPhotos: [] });
      } finally {
        hideLoading();
      }
    },

    yeetPhoto: async (photoId: string) => {
      try {
        showLoading("Moving photo to yeeted...");
        if (Platform.OS === "ios") {
          const albums = await MediaLibrary.getAlbumsAsync().catch((error) =>
            handleAlbumsError(error)
          );

          let yeetedAlbum = albums.find(
            (album: MediaLibrary.Album) => album.title === YEETED_ALBUM_NAME
          );

          if (!yeetedAlbum) {
            const createdAlbum = await MediaLibrary.createAlbumAsync(
              YEETED_ALBUM_NAME
            ).catch((error) => {
              if (isCoreDataError(error)) {
                // If we can't create the album, try loading it again
                return MediaLibrary.getAlbumsAsync()
                  .then((albums) =>
                    albums.find(
                      (a: MediaLibrary.Album) => a.title === YEETED_ALBUM_NAME
                    )
                  )
                  .catch(() => undefined);
              }
              throw error;
            });

            if (createdAlbum) {
              yeetedAlbum = createdAlbum;
            }
          }

          if (yeetedAlbum) {
            await MediaLibrary.addAssetsToAlbumAsync(
              [photoId],
              yeetedAlbum.id
            ).catch((error) => {
              if (!isCoreDataError(error)) throw error;
            });
          }
        } else {
          const yeetedDir = await ensureYeetedDirectoryExists();
          const asset = await MediaLibrary.getAssetInfoAsync(photoId);

          if (asset) {
            const fileName = asset.filename;
            const newPath = `${yeetedDir}/${fileName}`;

            await FileSystem.moveAsync({
              from: asset.uri,
              to: newPath,
            });

            await MediaLibrary.deleteAssetsAsync([photoId]);
          }
        }

        // Refresh both photo lists
        await get().loadPhotos();
        await get().loadYeetedPhotos();

        // Increment the current index
        get().incrementCurrentIndex();
      } catch (error) {
        console.error("Error yeeting photo:", error);
      } finally {
        hideLoading();
      }
    },

    restorePhoto: async (photoId: string) => {
      try {
        showLoading("Restoring photo...");
        if (Platform.OS === "ios") {
          const albums = await MediaLibrary.getAlbumsAsync();
          const yeetedAlbum = albums.find(
            (album) => album.title === YEETED_ALBUM_NAME
          );

          if (yeetedAlbum) {
            await MediaLibrary.removeAssetsFromAlbumAsync(
              [photoId],
              yeetedAlbum.id
            );
          }
        } else {
          const yeetedDir = await ensureYeetedDirectoryExists();
          const asset = await MediaLibrary.getAssetInfoAsync(photoId);

          if (asset) {
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

        // Refresh both photo lists
        await get().loadPhotos();
        await get().loadYeetedPhotos();
      } catch (error) {
        console.error("Error restoring photo:", error);
      } finally {
        hideLoading();
      }
    },

    deletePhotos: async (photoIds: string[]) => {
      if (!photoIds.length) return;

      try {
        showLoading("Deleting photos...");
        if (Platform.OS === "ios") {
          // Delete all photos in a single batch operation
          await MediaLibrary.deleteAssetsAsync(photoIds);
        } else {
          const yeetedDir = await ensureYeetedDirectoryExists();

          // Get all assets info in parallel
          const assetsInfo = await Promise.all(
            photoIds.map((id) => MediaLibrary.getAssetInfoAsync(id))
          );

          // Delete all files in parallel
          await Promise.all(
            assetsInfo.map(async (asset) => {
              if (asset) {
                const filePath = `${yeetedDir}/${asset.filename}`;
                await FileSystem.deleteAsync(filePath, { idempotent: true });
              }
            })
          );
        }

        // Refresh yeeted photos list
        await get().loadYeetedPhotos();
      } catch (error) {
        console.error("Error deleting photos:", error);
      } finally {
        hideLoading();
      }
    },

    deletePhoto: async (photoId: string) => {
      return get().deletePhotos([photoId]);
    },
  };
});
