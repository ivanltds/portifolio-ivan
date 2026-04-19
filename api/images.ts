import { v2 as cloudinary } from 'cloudinary';

export default async function handler(req: any, res: any) {
  const cloudName = process.env.VITE_CLOUDINARY_CLOUD_NAME || "dqt35bpzt";
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const folder = process.env.VITE_CLOUDINARY_FOLDER || "portfolio/ivan";

  if (!apiKey || !apiSecret) {
    return res.status(401).json({ error: "Cloudinary API Key or Secret mapping missing" });
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true
  });

  try {
    // Fetch all resources in the specific folder
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: folder,
      max_results: 100
    });

    // Map to a simpler structure
    const images = result.resources.map((resource: any) => ({
      public_id: resource.public_id,
      url: resource.secure_url,
      format: resource.format,
      created_at: resource.created_at,
      filename: resource.public_id.split('/').pop() // Get just the file name
    }));

    return res.status(200).json({ images });
  } catch (error: any) {
    console.error('Error fetching Cloudinary images:', error);
    return res.status(500).json({ error: error.message || 'Failed to fetch images' });
  }
}
