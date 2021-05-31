import { PostController } from "../Post.controller";
import { connect, clear, close } from "../../configs/jest-db.config";
import { createRequest, createResponse } from "node-mocks-http";
import { PostModel } from "../../models";
import { NextFunction } from "express";
import { AppHttpResponse } from "../../helpers";
import { StatusCodes } from "http-status-codes";

describe("static getOne", () => {
  let mockSendFn = jest.spyOn(AppHttpResponse, "send");
  beforeAll(async () => {
    await connect();
  });

  beforeEach(() => {
    mockSendFn = jest.spyOn(AppHttpResponse, "send");
  });

  afterEach(async () => {
    await clear();
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await close();
  });

  it(`it gets a post by its id with a ${StatusCodes.OK} response and the post data`, async () => {
    const postDoc = await PostModel.create({
      content: "post it today",
      timestamp: new Date(),
    });
    const reqMock = createRequest({
      params: { id: postDoc._id },
    });
    const resMock = createResponse();
    const nextMockFn: NextFunction = jest.fn((e: string) => void 0);
    await PostController.getOnePost(reqMock, resMock, nextMockFn);
    expect(mockSendFn).toBeCalledWith(resMock, StatusCodes.OK, {
      post: postDoc.toJSON(),
    });
  });

  it(`it returns ${StatusCodes.NOT_FOUND} iwith null data if the post does not exist`, async () => {
    const reqMock = createRequest({
      params: { id: "fake_post_id" },
    });
    const resMock = createResponse();
    const nextMockFn: NextFunction = jest.fn((e: string) => void 0);
    await PostController.getOnePost(reqMock, resMock, nextMockFn);
    expect(mockSendFn).toBeCalledWith(resMock, StatusCodes.NOT_FOUND, null);
  });
});
