export * from "./mongodb.config";
export * from "./cloudinary.config";

/**
 * Initialise a connection to MongoDB
 */
export const initMongoDb = (): void => {
  require("./mongodb.config");
};
