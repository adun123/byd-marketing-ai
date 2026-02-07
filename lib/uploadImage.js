import multer from "multer";
import os from "os";

export const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    // Vercel cuma ngizinin nulis ke /tmp
    cb(null, os.tmpdir());
  },
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^\w.\-]+/g, "_");
    cb(null, `${Date.now()}_${safeName}`);
  },
});

export const fileFilter = (_req, file, cb) => {
  const isImage = /^image\/(png|jpe?g|webp|gif)$/i.test(file.mimetype);
  cb(isImage ? null : new Error("Only image files are allowed"), isImage);
};
