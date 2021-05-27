import { Router } from "express";
import { Route } from "../../helpers/constants";
import { PostController } from "../../controllers";

const router = Router();

router.use(Route.Posts, PostController.mock);

export default router;
