import { RequestHandler } from "express";
import { StatusCodes, getReasonPhrase } from "http-status-codes";
import { PostModel } from "../models";

// TODO: Set response data to follow a format
// TODO: Write docs for controller fns
// TODO: Write tests
// TODO: Use AppHttpError

interface CloudinaryFileResponse {
  originalname: string;
  encoding: string;
  mimetype: string;
  path: string;
  filename: string;
}

interface PostImage {
  mimetype: string;
  URL: string;
  name: string;
}

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
    const { timestamp, content, user } = req.body;

    let images = PostController.parseImages(
      req.files as CloudinaryFileResponse[]
    );
    try {
      const postDoc = await PostModel.findOne({ _id: id });
      if (!postDoc) {
        return res.status(404).send("Not found");
      }
      // If user is not the owner of the post
      if (postDoc.author.toString() !== user._id.toString()) {
        return res.status(403).send();
      }
      const updatedPostDoc = await PostModel.findByIdAndUpdate(
        { _id: id },
        {
          updatedAt: timestamp,
          content: content,
          images: images ? [...postDoc.images, ...images] : postDoc.images,
        },
        {
          new: true,
        }
      );

      res.status(StatusCodes.OK).json(updatedPostDoc.toJSON());
    } catch (err) {
      console.error(err);
      res.status(500).send(JSON.stringify(err, null, 2));
    }
  };

  static createOnePost: RequestHandler = async (req, res) => {
    // TODO: User should be able to upload images
    let images = PostController.parseImages(
      req.files as CloudinaryFileResponse[]
    );

    const { content, timestamp, user } = req.body;
    try {
      const postDoc = await PostModel.create({
        content: content,
        author: user._id,
        images: images ? [...images] : [],
        createdAt: timestamp,
        updatedAt: timestamp,
      });
      res.setHeader("Location", `/posts/${postDoc._id}`);
      return res.status(StatusCodes.CREATED).json(postDoc.toJSON());
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

  private static parseImages(
    files: CloudinaryFileResponse[]
  ): PostImage[] | undefined {
    if (!files) {
      return;
    }
    const images = [];
    for (const file of files) {
      images.push({
        URL: file.path,
        mimetype: file.mimetype,
        name: file.originalname,
      });
    }
    return images;
  }
}

// TODO: Return statement at all `res`
