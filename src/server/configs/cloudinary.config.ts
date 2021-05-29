/**
 * @file
 * Cloudinary configuration
 */

import { v2 } from "cloudinary";
import { CloudinaryConfig } from "../helpers/constants";

const { config } = v2;
const { name, apiKey, apiSecret } = CloudinaryConfig;

config({
  cloud_name: name,
  api_key: apiKey,
  api_secret: apiSecret,
});

export { v2 as cloudinary };
