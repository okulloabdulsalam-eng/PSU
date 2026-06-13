import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

export function getOptimizedImageUrl(
  url: string,
  width = 800,
  quality = "auto"
): string {
  if (!url.includes("cloudinary.com")) return url;
  return url.replace(
    "/upload/",
    `/upload/w_${width},q_${quality},f_auto/`
  );
}
