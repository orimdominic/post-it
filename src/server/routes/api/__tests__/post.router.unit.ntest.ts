import postRouter from "../post.router";
import mongoose from "mongoose";

describe("postRouter", () => {
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it(`has the following routes
- get /posts,
- get /posts/:id,
- patch /posts/:id,
- post /posts,
- delete /posts/:id`, () => {
    const routes = [
      "get /posts",
      "get /posts/:id",
      "patch /posts/:id",
      "post /posts",
      "delete /posts/:id",
    ];
    for (const r of routes) {
      const [method, path] = r.split(" ");
      const match = postRouter.stack.find(
        (s) => s.route.path === path && s.route.methods[method]
      );
      expect(match).toBeTruthy();
    }
  });
});
