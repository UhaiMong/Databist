import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

export const CLOUDINARY_FOLDER =
  process.env.CLOUDINARY_FOLDER?.trim() || "databist";

export function assertCloudinaryConfig() {
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
    );
  }
}

export function getCloudinary() {
  assertCloudinaryConfig();

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  return cloudinary;
}

export type CloudinaryUploadResult = {
  public_id: string;
  secure_url: string;
  url: string;
  resource_type: string;
  format?: string;
  width?: number;
  height?: number;
  bytes?: number;
  original_filename?: string;
  folder?: string;
};

export async function uploadImageBuffer(
  buffer: Buffer,
  options?: {
    filename?: string;
    folder?: string;
  },
): Promise<CloudinaryUploadResult> {
  const client = getCloudinary();
  const folder = options?.folder || CLOUDINARY_FOLDER;

  return new Promise((resolve, reject) => {
    const stream = client.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        overwrite: false,
        unique_filename: true,
        use_filename: Boolean(options?.filename),
        filename_override: options?.filename,
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed"));
          return;
        }
        resolve(result as CloudinaryUploadResult);
      },
    );

    stream.end(buffer);
  });
}

export async function deleteCloudinaryAsset(
  publicId: string,
  resourceType: "image" | "video" | "raw" | "auto" = "image",
) {
  const client = getCloudinary();
  return client.uploader.destroy(publicId, {
    resource_type: resourceType === "auto" ? "image" : resourceType,
  });
}
