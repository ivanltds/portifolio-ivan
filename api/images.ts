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
    // Fetch all resources from the cloud name to handle suffixes and folders dynamically
    const result = await cloudinary.api.resources({
      type: 'upload',
      max_results: 500 // Increased to catch everything
    });

    // Map to a simpler structure, being smarter about file names
    const images = result.resources.map((resource: any) => {
      const publicId = resource.public_id;
      const fullFilename = publicId.split('/').pop() || "";
      // Strip potential Cloudinary suffixes like _o7v0v9
      const cleanFilename = fullFilename.replace(/_[a-z0-9]{6}$/i, "");
      
      return {
        public_id: publicId,
        url: resource.secure_url,
        format: resource.format,
        clean_name: cleanFilename.toLowerCase(),
        full_name: fullFilename.toLowerCase()
      };
    });

    return res.status(200).json({ images });
  } catch (error: any) {
    console.error('Error fetching Cloudinary images:', error);
    return res.status(500).json({ error: error.message || 'Failed to fetch images' });
  }
}
