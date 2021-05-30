import { createPostSchema, getUsersQuerySchema } from "..";

describe("createPostSchema", () => {
  it("throws an error when content length argument is < 10", async () => {
    await expect(
      createPostSchema.validateAsync({
        content: "xxxxxxxxx",
        timestamp: new Date(),
      })
    ).rejects.toThrowError();
  });

  it("throws an error when timestamp argument is not a date", async () => {
    await expect(
      createPostSchema.validateAsync({
        content: "xxxxxxxxxxxx",
        timestamp: "lorem ipsum",
      })
    ).rejects.toThrowError();
  });
});

describe("getUsersQuerySchema", () => {
  it("throws an error when limit argument is not a number string", async () => {
    await expect(
      getUsersQuerySchema.validateAsync({
        limit: "xoxo",
        page: "1",
      })
    ).rejects.toThrowError();
  });

  it("throws an error when page argument is not a number string", async () => {
    await expect(
      getUsersQuerySchema.validateAsync({
        limit: "1",
        page: "xoxo",
      })
    ).rejects.toThrowError();
  });

  it("throws no error on valid arguments", async () => {
    await expect(
      getUsersQuerySchema.validateAsync({
        limit: "1",
        page: "1",
      })
    ).resolves.toEqual({
      limit: "1",
      page: "1",
    });
  });
});
