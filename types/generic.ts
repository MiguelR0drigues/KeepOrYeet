export type MediaTypeValue =
  | "photo"
  | "video"
  | "audio"
  | "unknown"
  | "pairedVideo";

export interface PhotoAsset {
  id: string;
  uri: string;
  width: number;
  height: number;
  filename: string;
  creationTime: number;
  modificationTime: number;
  duration: number;
  mediaType: MediaTypeValue;
  mediaSubtypes?: string[];
  albumId?: string;
}
