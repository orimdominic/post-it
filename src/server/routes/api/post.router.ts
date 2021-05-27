import { Router } from "express";
import { Route } from "../../helpers/constants";
import { PostController } from "../../controllers";
import {
  createPostSchemaValidator,
  updatePostSchemaValidator,
} from "../../validators";

// TODO: Write tests
// TODO: Include relevant middlewares

const router = Router();

router.get(Route.PostWithIdParam, PostController.getOnePost);

router.get(Route.Posts, PostController.getAllPosts);

router.patch(Route.PostWithIdParam, [
  updatePostSchemaValidator,
  PostController.updateOnePost,
]);

router.post(Route.Posts, [
  createPostSchemaValidator,
  PostController.createOnePost,
]);

router.delete(Route.PostWithIdParam, PostController.deleteOnePost);

export default router;
