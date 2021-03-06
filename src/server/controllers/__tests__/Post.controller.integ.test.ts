import { PostController } from "../Post.controller";
import { connect, clear, close } from "../../configs/jest-db.config";
import { createRequest, createResponse } from "node-mocks-http";
import { PostModel, UserModel } from "../../models";
import { NextFunction } from "express";
import { AppHttpResponse } from "../../helpers";
import { StatusCodes } from "http-status-codes";
import { Types } from "mongoose";
import { Message } from "../../helpers/constants";

describe("static getOnePost", () => {
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

  it(`it returns ${StatusCodes.NOT_FOUND} with null data if the post does not exist`, async () => {
    const reqMock = createRequest({
      params: { id: "fake_post_id" },
    });
    const resMock = createResponse();
    const nextMockFn: NextFunction = jest.fn((e: string) => void 0);
    await PostController.getOnePost(reqMock, resMock, nextMockFn);
    expect(mockSendFn).toBeCalledWith(resMock, StatusCodes.NOT_FOUND, null);
  });
});

describe("static deleteOnePost", () => {
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

  it(`it returns ${StatusCodes.NOT_FOUND} with null data if the post does not exist`, async () => {
    const reqMock = createRequest({
      params: { id: "fake_post_id" },
    });
    const resMock = createResponse();
    const nextMockFn: NextFunction = jest.fn((e: string) => void 0);
    await PostController.getOnePost(reqMock, resMock, nextMockFn);
    expect(mockSendFn).toBeCalledWith(resMock, StatusCodes.NOT_FOUND, null);
  });

  it(`it responds with ${StatusCodes.FORBIDDEN} response if the auth user is not the owner of the post`, async () => {
    const postDoc = await PostModel.create({
      content: "post it today",
      timestamp: new Date(),
      author: Types.ObjectId(),
    });
    const reqMock = createRequest({
      params: { id: postDoc._id },
      body: {
        user: {
          _id: "fake_user_id",
        },
      },
    });
    const resMock = createResponse();
    const nextMockFn: NextFunction = jest.fn((e: string) => void 0);
    await PostController.deleteOnePost(reqMock, resMock, nextMockFn);
    expect(mockSendFn).toBeCalledWith(resMock, StatusCodes.FORBIDDEN, null);
  });

  it(`it responds with ${StatusCodes.NO_CONTENT} response if the deletion is auth valid`, async () => {
    // if the auth user is the owner of the post and the id is correct
    const postDoc = await PostModel.create({
      content: "post it today",
      timestamp: new Date(),
      author: Types.ObjectId(),
    });
    const reqMock = createRequest({
      params: { id: postDoc._id },
      body: {
        user: {
          _id: postDoc.author,
        },
      },
    });
    const resMock = createResponse();
    const nextMockFn: NextFunction = jest.fn((e: string) => void 0);
    await PostController.deleteOnePost(reqMock, resMock, nextMockFn);
    expect(mockSendFn).toBeCalledWith(resMock, StatusCodes.NO_CONTENT, null);
  });
});

describe("static createOnePost", () => {
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

  it(`it creates a post and responds with ${StatusCodes.CREATED} and post data after creating a post`, async () => {
    const reqMock = createRequest({
      body: {
        content: "Lorem ipsum",
        timestamp: new Date(),
        user: {
          _id: Types.ObjectId(),
        },
      },
      files: undefined,
    });
    const resMock = createResponse();
    const nextMockFn: NextFunction = jest.fn((e: string) => void 0);
    await PostController.createOnePost(reqMock, resMock, nextMockFn);
    const postDoc = await PostModel.findOne({
      author: reqMock.body.user._id,
      content: reqMock.body.content,
    });
    expect(postDoc).toBeTruthy();
    expect(resMock.getHeader("Location")).toBe(`/posts/${postDoc._id}`);
    expect(mockSendFn).toBeCalledWith(resMock, StatusCodes.CREATED, {
      post: postDoc.toJSON(),
    });
  });
});

describe("static getAllPosts", () => {
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

  it(`responds with ${StatusCodes.OK} and an empty array when there are no posts`, async () => {
    const reqMock = createRequest();
    const resMock = createResponse();
    const nextMockFn: NextFunction = jest.fn((e: string) => void 0);
    await PostController.getAllPosts(reqMock, resMock, nextMockFn);
    expect(mockSendFn).toBeCalledWith(
      resMock,
      StatusCodes.OK,
      {
        posts: [],
        total: 0,
      },
      "0/0"
    );
  });

  it(`responds with ${StatusCodes.OK} and data when there are one or more posts`, async () => {
    const userId = Types.ObjectId();
    await PostModel.create(
      {
        author: userId,
        content: "Lorem ipsum",
        timestamp: new Date(),
        images: [],
      },
      {
        author: userId,
        content: "Lorem ipsum",
        timestamp: new Date(),
        images: [],
      }
    );
    const postDocs = await PostModel.find();
    const reqMock = createRequest();
    const resMock = createResponse();
    const nextMockFn: NextFunction = jest.fn((e: string) => void 0);
    await PostController.getAllPosts(reqMock, resMock, nextMockFn);
    expect(mockSendFn).toBeCalledWith(
      resMock,
      StatusCodes.OK,
      {
        posts: postDocs,
        total: postDocs.length,
      },
      `${postDocs.length}/${postDocs.length}`
    );
  });
});

describe("static updateOnePost", () => {
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

  it(`responds with ${StatusCodes.NOT_FOUND} if the post is not found by its id`, async () => {
    const reqMock = createRequest({
      params: {
        id: "fake_post_id",
      },
      body: {
        content: "Hello world",
        timestamp: new Date(),
        user: {
          author: Types.ObjectId(),
          email: "user@email.com",
          password: "wdmpwmeLNLlkjsajd",
        },
      },
    });
    const resMock = createResponse();
    const nextMockFn: NextFunction = jest.fn((e: string) => void 0);
    await PostController.updateOnePost(reqMock, resMock, nextMockFn);
    expect(mockSendFn).toHaveBeenCalledWith(
      resMock,
      StatusCodes.NOT_FOUND,
      null
    );
  });

  it(`responds with ${StatusCodes.FORBIDDEN} if the post to update is not by the author`, async () => {
    const user = await UserModel.create({
      email: "user@email.com",
      password: "password",
    });
    const postDoc = await PostModel.create({
      content: "Lorem ipsum",
      author: user._id,
    });
    const reqMock = createRequest({
      params: {
        id: postDoc._id.toString(),
      },
      body: {
        content: "Hello world",
        timestamp: new Date(),
        user: {
          _id: "fake_author_id",
        },
      },
    });
    const resMock = createResponse();
    const nextMockFn: NextFunction = jest.fn((e: string) => void 0);
    await PostController.updateOnePost(reqMock, resMock, nextMockFn);
    expect(mockSendFn).toHaveBeenCalledWith(
      resMock,
      StatusCodes.FORBIDDEN,
      null
    );
  });

  it(`responds with ${StatusCodes.OK} and post after updating post`, async () => {
    const timestamp = new Date();
    const user = await UserModel.create({
      email: "user@email.com",
      password: "password",
    });
    const postDoc = await PostModel.create({
      content: "Lorem ipsum",
      author: user._id,
    });
    const reqMock = createRequest({
      params: {
        id: postDoc._id.toString(),
      },
      body: {
        content: "Hello world",
        timestamp,
        user: {
          _id: user._id,
        },
      },
    });
    const resMock = createResponse();
    const nextMockFn: NextFunction = jest.fn((e: string) => void 0);
    await PostController.updateOnePost(reqMock, resMock, nextMockFn);
    const updatedPostDoc = await PostModel.findById(postDoc._id);
    expect(mockSendFn).toHaveBeenCalledWith(
      resMock,
      StatusCodes.OK,
      { post: updatedPostDoc.toJSON() },
      Message.Updated
    );
  });
});
