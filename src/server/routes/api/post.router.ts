import { Router } from "express";
import { Route } from "../../helpers/constants";
import { PostController } from "../../controllers";
import {
  createPostSchemaValidator,
  updatePostSchemaValidator,
} from "../../validators";
import { isLoggedIn } from "../../middlewares";

// TODO: Write tests

const router = Router();

router.get(Route.PostWithIdParam, [isLoggedIn, PostController.getOnePost]);

router.get(Route.Posts, [isLoggedIn, PostController.getAllPosts]);

router.patch(Route.PostWithIdParam, [
  updatePostSchemaValidator,
  isLoggedIn,
  PostController.updateOnePost,
]);

router.post(Route.Posts, [
  createPostSchemaValidator,
  isLoggedIn,
  PostController.createOnePost,
]);

router.delete(Route.PostWithIdParam, isLoggedIn, PostController.deleteOnePost);

export default router;
