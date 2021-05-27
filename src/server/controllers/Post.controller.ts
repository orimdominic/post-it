import { RequestHandler } from "express";

export class PostController {
  static mock: RequestHandler = async (req, res) => {
    console.log("hitting PostController.mock ctrl via", req.url);
    res.status(200).send();
  };
}
