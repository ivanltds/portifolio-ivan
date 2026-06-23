import { useState, useEffect } from "react";

const CLOUD_NAME = (
  (typeof process !== "undefined" && process.env.VITE_CLOUDINARY_CLOUD_NAME) ||
  "dqt35bpzt"
).trim();

export function useCloudinaryImages() {
  const [cldImages, setCldImages] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/images")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.images) setCldImages(data.images);
      })
      .catch(() => {});
  }, []);

  const getCldUrl = (name: string) => {
    if (!name) return "";
    const nameWithoutExt = name.split(".")[0].toLowerCase().trim();
    const nameWithExt = name.toLowerCase().trim();

    const dynamicImage = cldImages.find((img) => {
      const cleanName = (img.clean_name || "").toLowerCase();
      const fullName = (img.full_name || "").toLowerCase();
      const pubId = (img.public_id || "").toLowerCase();
      return (
        cleanName === nameWithoutExt ||
        fullName.startsWith(nameWithoutExt) ||
        pubId.endsWith(`/${nameWithoutExt}`)
      );
    });

    if (dynamicImage) return dynamicImage.url;

    const cloud = CLOUD_NAME || "dqt35bpzt";
    const extension = nameWithExt.endsWith(".png") ? "png" : "jpg";
    return `https://res.cloudinary.com/${cloud}/image/upload/${nameWithoutExt}.${extension}`;
  };

  return { getCldUrl };
}
