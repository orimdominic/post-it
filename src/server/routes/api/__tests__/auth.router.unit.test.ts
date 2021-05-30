import authRouter from "../auth.router";
jest.useFakeTimers();

describe("authRouter", () => {
  it(`has the following routes
- post /auth/register,
- post /auth/login,
- post /auth/forgot-password,
- patch /auth/password-reset,`, () => {
    const routes = [
      "post /auth/register",
      "post /auth/login",
      "post /auth/forgot-password",
      "patch /auth/password-reset",
    ];
    for (const r of routes) {
      const [method, path] = r.split(" ");
      const match = authRouter.stack.find(
        (s) => s.route.path === path && s.route.methods[method]
      );
      expect(match).toBeTruthy();
    }
  });
});
