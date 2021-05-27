import { RequestHandler } from "express";
import { PostModel } from "../models";

export class PostController {
  static createPost: RequestHandler = async (req, res) => {
    const { post } = req.body;
    const { timestamp } = post;
    delete post.timestamp;
    try {
      const newPost = await PostModel.create({
        ...post,
        author: "author",
        createdAt: timestamp,
        updatedAt: timestamp,
      });
      res.setHeader("Location", `/posts/${newPost.id}`)
      res.status(200).send(JSON.stringify(newPost, null, 2));
    } catch (err) {
      console.error(err)
      res.status(500).send(JSON.stringify(err, null, 2));
    }
  };
}
