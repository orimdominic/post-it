import { RequestHandler } from "express";
import { StatusCodes, getReasonPhrase } from "http-status-codes";
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
      res.setHeader("Location", `/posts/${newPost.id}`);
      res.status(StatusCodes.CREATED).send(JSON.stringify(newPost, null, 2));
    } catch (err) {
      console.error(err);
      res.status(500).send(JSON.stringify(err, null, 2));
    }
  };

  static getPost: RequestHandler = async (req, res) => {
    const { id } = req.params;
    console.log("post id:", id);

    try {
      const post = await PostModel.findById({ _id: id });
      if (!post) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .send(getReasonPhrase(StatusCodes.NOT_FOUND));
      }
      return res.status(StatusCodes.OK).json(post);
    } catch (err) {
      console.error(err);
      res.status(500).send(JSON.stringify(err, null, 2));
    }
  };
}
