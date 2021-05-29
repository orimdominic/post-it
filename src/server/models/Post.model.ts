import { Schema, model } from "mongoose";
import { ModelName } from "../helpers/constants";

const postSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: ModelName.User,
    },
    content: String,
    images: [
      new Schema(
        {
          URL: String,
          mimetype: String,
          name: String,
        },
        {
          versionKey: false,
          _id: false,
        }
      ),
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

export const PostModel = model(ModelName.Post, postSchema);
