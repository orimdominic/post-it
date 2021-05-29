import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { AppHttpError, AppHttpResponse } from "../helpers";
import { paginatorMetadata } from "../helpers/util-fns";
import { Message } from "../helpers/constants";
import { PostModel } from "../models";

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
  /**
   * Express middleware - Controller
   *
   * Returns a post fetched by its id to the client
   */
  static getOnePost: RequestHandler = async (req, res, next) => {
    const { id } = req.params;

    try {
      const postDoc = await PostModel.findById({ _id: id });
      if (!postDoc) {
        return AppHttpResponse.send(res, StatusCodes.NOT_FOUND, null);
      }
      return AppHttpResponse.send(res, StatusCodes.OK, {
        post: postDoc.toJSON(),
      });
    } catch (err) {
      return next(
        new AppHttpError(StatusCodes.INTERNAL_SERVER_ERROR, err.message)
      );
    }
  };

  /**
   * Express middleware - Controller
   *
   * Returns list of posts to the client. Uses `limit` and `page`
   */
  static getAllPosts: RequestHandler = async (req, res, next) => {
    let { limit, page } = req.query;
    page = page ? page.toString() : "1";
    limit = limit ? limit.toString() : "10";

    try {
      const totalPostDocs = await PostModel.estimatedDocumentCount();
      const { start, main, parsedLimit } = paginatorMetadata(
        totalPostDocs,
        page,
        limit
      );
      const postDocs = await PostModel.find().skip(start).limit(parsedLimit);
      return AppHttpResponse.send(
        res,
        StatusCodes.OK,
        { ...main, postDocs },
        `${postDocs.length}/${totalPostDocs}`
      );
    } catch (err) {
      return next(
        new AppHttpError(StatusCodes.INTERNAL_SERVER_ERROR, err.message)
      );
    }
  };

  /**
   * Express middleware - Controller
   *
   * Updates a post by its id and returns the updated post to the client
   */
  static updateOnePost: RequestHandler = async (req, res, next) => {
    const { id } = req.params;
    const { timestamp, content, user } = req.body;

    const images = PostController.parseImages(
      req.files as CloudinaryFileResponse[]
    );
    try {
      const postDoc = await PostModel.findOne({ _id: id });
      if (!postDoc) {
        return AppHttpResponse.send(res, StatusCodes.NOT_FOUND, null);
      }
      // If user is not the owner of the post
      if (postDoc.author.toString() !== user._id.toString()) {
        return AppHttpResponse.send(res, StatusCodes.FORBIDDEN, null);
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

      return AppHttpResponse.send(
        res,
        StatusCodes.OK,
        {
          post: updatedPostDoc.toJSON(),
        },
        Message.Updated
      );
    } catch (err) {
      return next(
        new AppHttpError(StatusCodes.INTERNAL_SERVER_ERROR, err.message)
      );
    }
  };

  /**
   * Express middleware - Controller
   *
   * Create a post and return it to the client
   */
  static createOnePost: RequestHandler = async (req, res, next) => {
    const images = PostController.parseImages(
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
      return AppHttpResponse.send(res, StatusCodes.CREATED, {
        post: postDoc.toJSON(),
      });
    } catch (err) {
      return next(
        new AppHttpError(StatusCodes.INTERNAL_SERVER_ERROR, err.message)
      );
    }
  };

  /**
   * Express middleware - Controller
   *
   * Delete a post by its id
   */
  static deleteOnePost: RequestHandler = async (req, res, next) => {
    const { id } = req.params;
    const { user } = req.body;
    try {
      const postDoc = await PostModel.findById({ _id: id });
      if (!postDoc) {
        return AppHttpResponse.send(res, StatusCodes.NOT_FOUND, null);
      }
      // If user is not the owner of the post
      if (postDoc.author.toString() !== user._id.toString()) {
        return AppHttpResponse.send(res, StatusCodes.FORBIDDEN, null);
      }
      await PostModel.findOneAndRemove({ _id: id });
      return AppHttpResponse.send(res, StatusCodes.NO_CONTENT, null);
    } catch (err) {
      return next(
        new AppHttpError(StatusCodes.INTERNAL_SERVER_ERROR, err.message)
      );
    }
  };

  /**
   * Extract images from `req.file` and parse into db model
   * @param {CloudinaryFileResponse[]} files files to parse
   * @returns {PostImage[] | undefined} the parsed files or undefined if no files are found
   */
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
