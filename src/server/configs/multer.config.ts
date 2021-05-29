import multer from "multer";

const multerUploads = multer({ storage: multer.memoryStorage() }).array(
  "images",
  2
);
export { multerUploads };
