import multer from "multer";
const { CloudinaryStorage } = require("multer-storage-cloudinary");
import { cloudinary } from "../configs";

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: "post-it",
  allowedFormats: ["jpg", "png", "jpeg"],
});

export const multerUploads = multer({ storage: cloudinaryStorage }).array(
  "images",
  2
);
