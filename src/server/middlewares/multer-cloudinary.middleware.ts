import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinary } from "../configs";

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: () => "post-it",
    allowed_formats: () => ["jpg", "png", "jpeg"],
  },
});

/**
 * Express middleware
 *
 * Receives and stores images in cloudinary.
 * Attaches the files it stored in `req.files
 */
export const multerUploads = multer({ storage: cloudinaryStorage }).array(
  "images",
  2
);
