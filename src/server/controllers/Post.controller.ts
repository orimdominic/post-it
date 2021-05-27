import { RequestHandler } from "express";
import { StatusCodes, getReasonPhrase } from "http-status-codes";
import { PostModel } from "../models";

// TODO: Set response data to follow a format
// TODO: Write docs for controller fns
// TODO: Write tests

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

  static getOnePost: RequestHandler = async (req, res) => {
    const { id } = req.params;

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

  static getAllPosts: RequestHandler = async (req, res) => {
    // TODO: Add limit and skip
    // TODO: Add length etc
    try {
      const posts = await PostModel.find();
      if (!posts) {
        return res
          .status(StatusCodes.OK)
          .json([]);
      }
      return res.status(StatusCodes.OK).json(posts);
    } catch (err) {
      console.error(err);
      res.status(500).send(JSON.stringify(err, null, 2));
    }
  };
}
