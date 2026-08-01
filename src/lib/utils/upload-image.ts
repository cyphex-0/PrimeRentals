/**
 * Image upload utility using ImgBB free hosting API.
 * 
 * This module handles uploading images to ImgBB and returning
 * hosted URLs. This avoids sending base64 data in JSON payloads
 * to the backend, preventing 413 "Request Entity Too Large" errors.
 */

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

export interface UploadResult {
  url: string;
  deleteUrl: string;
  name: string;
  size: number;
}

/**
 * Upload a single image file to ImgBB.
 * Returns the hosted image URL on success, or throws on failure.
 */
export async function uploadImageToImgBB(file: File): Promise<UploadResult> {
  if (!IMGBB_API_KEY) {
    throw new Error("ImgBB API key is not configured. Set NEXT_PUBLIC_IMGBB_API_KEY in your .env.local file.");
  }

  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`ImgBB upload failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error("ImgBB upload failed: " + (data.error?.message || "Unknown error"));
  }

  return {
    url: data.data.display_url,
    deleteUrl: data.data.delete_url,
    name: file.name,
    size: file.size,
  };
}

/**
 * Upload multiple image files to ImgBB concurrently.
 * Returns an array of results for successful uploads and an array of error messages.
 */
export async function uploadMultipleImages(
  files: File[]
): Promise<{ successes: UploadResult[]; errors: string[] }> {
  const results = await Promise.allSettled(
    files.map((file) => uploadImageToImgBB(file))
  );

  const successes: UploadResult[] = [];
  const errors: string[] = [];

  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      successes.push(result.value);
    } else {
      errors.push(`Failed to upload '${files[index].name}': ${result.reason?.message || "Unknown error"}`);
    }
  });

  return { successes, errors };
}
