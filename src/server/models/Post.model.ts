import { Schema, model } from "mongoose";

const PostSchema = new Schema({});

export const PostModel = model("Post", PostSchema);
