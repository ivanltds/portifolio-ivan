/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GA_ID: string;
  readonly VITE_TURNSTILE_SITE_KEY: string;
  readonly VITE_CLOUDINARY_CLOUD_NAME: string;
  readonly VITE_CLOUDINARY_FOLDER: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
