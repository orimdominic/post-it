import { Router } from "express";
import { Route } from "../../helpers/constants";
import { PostController } from "../../controllers";
import { createPostSchemaValidator, updatePostSchemaValidator } from "../../validators";

// TODO: Write tests
// TODO: Include relevant middlewares

const router = Router();

router.post(Route.Posts, createPostSchemaValidator, PostController.createPost);

router.patch(Route.PostWithIdParam, updatePostSchemaValidator, PostController.updatePost);

router.get(Route.Posts, PostController.getAllPosts);

router.get(Route.PostWithIdParam, PostController.getOnePost);

export default router;
