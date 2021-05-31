import {
  createPostSchemaValidator,
  forgotPasswordSchemaValidator,
  getUsersQuerySchemaValidator,
  registerUserSchemaValidator,
} from "..";
import { createRequest, createResponse } from "node-mocks-http";
import { NextFunction } from "express";
import { AppHttpError } from "../../helpers";

describe("Validators", () => {
  describe("createPostSchemaValidator", () => {
    it("throws error on invalid create post schema data", async () => {
      const reqMock = createRequest({
        body: {
          timestamp: new Date(),
          content: "Lore",
        },
      });
      const resMock = createResponse();
      const nextMock: NextFunction = jest.fn((f: any) => f);
      const res = await createPostSchemaValidator(reqMock, resMock, nextMock);

      expect(res).toBeInstanceOf(Error);
    });
  });

  describe("forgotPasswordSchemaValidator", () => {
    it("throws error on invalid forgot password schema data", async () => {
      const reqMock = createRequest({
        body: {
          email: "",
        },
      });
      const resMock = createResponse();
      const nextMock: NextFunction = jest.fn((f: any) => f);
      const res = await forgotPasswordSchemaValidator(
        reqMock,
        resMock,
        nextMock
      );

      expect(res).toBeInstanceOf(Error);
    });
  });

  describe("getUsersQuerySchemaValidator", () => {
    it("throws error on invalid get users query schema data", async () => {
      const reqMock = createRequest({
        query: {
          limit: "a",
          page: "i",
        },
      });
      const resMock = createResponse();
      const nextMock: NextFunction = jest.fn((f: any) => f);
      const res = await getUsersQuerySchemaValidator(
        reqMock,
        resMock,
        nextMock
      );

      expect(res).toBeInstanceOf(Error);
    });
  });

  describe("registerUserSchemaValidator", () => {
    it("throws error on invalid create post schema data", async () => {
      const reqMock = createRequest({
        body: {
          email: "",
          password: "immm",
        },
      });
      const resMock = createResponse();
      const nextMock: NextFunction = jest.fn((f: any) => f);
      const res = await registerUserSchemaValidator(reqMock, resMock, nextMock);

      expect(res).toBeInstanceOf(Error);
    });
  });
});
