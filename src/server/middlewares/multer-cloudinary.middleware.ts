import multer from "multer";
import { CloudinaryStorage, Options } from "multer-storage-cloudinary";
import { cloudinary } from "../configs";

const uploadOptions = {
  folder: "post-it",
  allowed_formats: ["jpg", "png", "jpeg"],
};

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: uploadOptions,
} as Options);

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
