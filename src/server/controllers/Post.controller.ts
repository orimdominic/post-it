import { RequestHandler } from "express";
import { StatusCodes, getReasonPhrase } from "http-status-codes";
import { PostModel } from "../models";

// TODO: Set response data to follow a format
// TODO: Write docs for controller fns
// TODO: Write tests
// TODO: Use AppHttpError

export class PostController {
  static getOnePost: RequestHandler = async (req, res) => {
    const { id } = req.params;

    try {
      const postDoc = await PostModel.findById({ _id: id });
      if (!postDoc) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .send(getReasonPhrase(StatusCodes.NOT_FOUND));
      }
      return res.status(StatusCodes.OK).json(postDoc.toJSON());
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

  static updateOnePost: RequestHandler = async (req, res) => {
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
      const updatedPostDoc = await postDoc.save();
      res.status(StatusCodes.CREATED).json(updatedPostDoc.toJSON());
    } catch (err) {
      console.error(err);
      res.status(500).send(JSON.stringify(err, null, 2));
    }
  };

  static createOnePost: RequestHandler = async (req, res) => {
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
      res.status(StatusCodes.CREATED).json(postDoc.toJSON());
    } catch (err) {
      console.error(err);
      res.status(500).send(JSON.stringify(err, null, 2));
    }
  };

  static deleteOnePost: RequestHandler = async (req, res) => {
    const { id } = req.params;
    try {
      const postDoc = await PostModel.findById({ _id: id });
      if (!postDoc) {
        return res.status(404).send("Not found");
      }
      await PostModel.findByIdAndDelete(id);
      res.status(StatusCodes.NO_CONTENT).send();
    } catch (err) {
      console.error(err);
      res.status(500).send(JSON.stringify(err, null, 2));
    }
  };
}
