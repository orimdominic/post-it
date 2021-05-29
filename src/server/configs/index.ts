export * from "./mongodb.config";
export * from "./cloudinary.config"
export * from "./multer.config"

export const initMongoDb = (): void => {
  require("./mongodb.config");
};
