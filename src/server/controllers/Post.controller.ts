import { RequestHandler } from "express";
import { StatusCodes, getReasonPhrase } from "http-status-codes";
import { PostModel } from "../models";

// TODO: Set response data to follow a format
// TODO: Write docs for controller fns
// TODO: Write tests

export class PostController {
  static createPost: RequestHandler = async (req, res) => {
    // TODO: User should be able to upload images
    const { post } = req.body;
    const { timestamp } = post;
    delete post.timestamp;
    try {
      const postDoc = await PostModel.create({
        ...post,
        // TODO: Get author name from user in db
        author: "author",
        createdAt: timestamp,
        updatedAt: timestamp,
      });
      res.setHeader("Location", `/posts/${postDoc.id}`);
      res.status(StatusCodes.CREATED).json(postDoc);
    } catch (err) {
      console.error(err);
      res.status(500).send(JSON.stringify(err, null, 2));
    }
  };

  static updatePost: RequestHandler = async (req, res) => {
    // TODO: User should be able to upload images
    const { id } = req.params;
    const { post } = req.body;
    try {
      const postDoc = await PostModel.findById({ _id: id });
      if (!postDoc) {
        return res.status(404).send("Not found");
      }
      postDoc.updatedAt = post.timestamp;
      postDoc.content = post.content;
      const newPostDoc = await postDoc.save();
      res.status(StatusCodes.CREATED).send(JSON.stringify(newPostDoc, null, 2));
    } catch (err) {
      console.error(err);
      res.status(500).send(JSON.stringify(err, null, 2));
    }
  };

  static getOnePost: RequestHandler = async (req, res) => {
    const { id } = req.params;

    try {
      const postDoc = await PostModel.findById({ _id: id });
      if (!postDoc) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .send(getReasonPhrase(StatusCodes.NOT_FOUND));
      }
      return res.status(StatusCodes.OK).json(postDoc);
    } catch (err) {
      console.error(err);
      res.status(500).send(JSON.stringify(err, null, 2));
    }
  };

  static getAllPosts: RequestHandler = async (req, res) => {
    // TODO: Add limit and skip
    // TODO: Add length, size etc
    try {
      const postDocs = await PostModel.find();
      if (!postDocs) {
        return res.status(StatusCodes.OK).json([]);
      }
      return res.status(StatusCodes.OK).json(postDocs);
    } catch (err) {
      console.error(err);
      res.status(500).send(JSON.stringify(err, null, 2));
    }
  };
}
