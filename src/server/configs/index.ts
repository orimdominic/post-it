export * from "./mongodb.config";
export * from "./cloudinary.config";

export const initMongoDb = (): void => {
  require("./mongodb.config");
};
