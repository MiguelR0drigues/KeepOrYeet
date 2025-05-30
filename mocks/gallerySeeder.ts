import { Asset } from "expo-asset";
import * as MediaLibrary from "expo-media-library";

// Import sample images from assets
const SAMPLE_IMAGES = [
  require("../assets/images/samples/sample1.jpg"),
  require("../assets/images/samples/sample2.jpg"),
  require("../assets/images/samples/sample3.jpg"),
  require("../assets/images/samples/sample4.jpg"),
];

const TOTAL_IMAGES = 500;
const BATCH_SIZE = 10; // Process images in batches to avoid overwhelming the device

const downloadAndSaveImage = async (index: number): Promise<void> => {
  try {
    // Get a random sample image
    const sampleImage = SAMPLE_IMAGES[index % SAMPLE_IMAGES.length];

    // Load the asset
    const asset = Asset.fromModule(sampleImage);
    await asset.downloadAsync();

    if (!asset.localUri) {
      throw new Error("Failed to load asset");
    }

    // Save to media library
    await MediaLibrary.saveToLibraryAsync(asset.localUri);

    console.log(`✓ Saved image ${index + 1}/${TOTAL_IMAGES}`);
  } catch (error) {
    console.error(`✗ Failed to save image ${index + 1}:`, error);
  }
};

const processBatch = async (startIndex: number): Promise<void> => {
  const promises = [];
  const endIndex = Math.min(startIndex + BATCH_SIZE, TOTAL_IMAGES);

  for (let i = startIndex; i < endIndex; i++) {
    promises.push(downloadAndSaveImage(i));
  }

  await Promise.all(promises);
};

export const seedGallery = async (): Promise<void> => {
  try {
    // Request permissions first
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      throw new Error("Media library permission not granted");
    }

    console.log(`Starting to seed gallery with ${TOTAL_IMAGES} images...`);
    console.log(
      "This process might take several minutes. Please keep the app open."
    );

    // Process images in batches
    for (let i = 0; i < TOTAL_IMAGES; i += BATCH_SIZE) {
      await processBatch(i);
      console.log(
        `Completed batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(
          TOTAL_IMAGES / BATCH_SIZE
        )}`
      );
    }

    console.log("✨ Gallery seeding completed successfully!");
  } catch (error) {
    console.error("Failed to seed gallery:", error);
    throw error;
  }
};
