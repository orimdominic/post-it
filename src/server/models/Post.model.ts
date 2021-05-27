import { Schema, model } from "mongoose";
import { ModelName } from "../helpers/constants";

const postSchema = new Schema(
  {
    author: String,
    authorId: {
      type: Schema.Types.ObjectId,
      ref: ModelName.User,
    },
    content: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedAt: Date,
  },
  { versionKey: false }
);

export const PostModel = model(ModelName.Post, postSchema);
