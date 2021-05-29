import { Router } from "express";
import { Route } from "../../helpers/constants";
import { PostController } from "../../controllers";
import {
  createPostSchemaValidator,
  updatePostSchemaValidator,
  getUsersQuerySchemaValidator
} from "../../validators";
import { isAuthenticated, multerUploads } from "../../middlewares";

const router = Router();

router.get(Route.PostWithIdParam, [isAuthenticated, PostController.getOnePost]);

router.get(Route.Posts, [isAuthenticated,getUsersQuerySchemaValidator, PostController.getAllPosts]);

router.patch(Route.PostWithIdParam, [
  multerUploads,
  isAuthenticated,
  updatePostSchemaValidator,
  PostController.updateOnePost,
]);

router.post(Route.Posts, [
  multerUploads,
  createPostSchemaValidator,
  isAuthenticated,
  PostController.createOnePost,
]);

router.delete(
  Route.PostWithIdParam,
  isAuthenticated,
  PostController.deleteOnePost
);

export default router;
