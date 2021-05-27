import { Router } from "express";
import { Route } from "../../helpers/constants";
import { PostController } from "../../controllers";
import { createPostSchemaValidator } from "../../validators";

const router = Router();

router.post(Route.Posts, createPostSchemaValidator, PostController.createPost);

export default router;
