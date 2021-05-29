import multer from "multer";
const { CloudinaryStorage } = require("multer-storage-cloudinary");
import { cloudinary } from "../configs";

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: "post-it",
  allowedFormats: ["jpg", "png", "jpeg"],
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
