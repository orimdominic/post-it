import { UserModel } from "../../models";
import {
  emailExists,
  emailInexistent,
  isAuthenticated,
} from "../auth.middleware";
import { connect, clear, close } from "../../configs/jest-db.config";
import { createRequest, createResponse } from "node-mocks-http";
import { NextFunction } from "express";
import { AppHttpError, AppHttpResponse } from "../../helpers";
import { StatusCodes } from "http-status-codes";
import { Message } from "../../helpers/constants";
import { createJwt } from "../../helpers/util-fns";

describe("emailExists", () => {
  beforeAll(async () => {
    await connect();
  });

  afterEach(async () => {
    await clear();
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await close();
  });

  it("continues the request if the email exists", async () => {
    const user = { email: "hello@world.com" };
    await UserModel.create(user);
    const reqMock = createRequest({
      body: { ...user },
    });
    const resMock = createResponse();
    const nextMockFn: NextFunction = jest.fn((e: string) => void 0);

    expect.assertions(1);
    await emailExists(reqMock, resMock, nextMockFn);

    expect(nextMockFn).toHaveBeenCalledWith();
  });

  it(`halts the request with ${StatusCodes.BAD_REQUEST} if the email doesn't exist`, async () => {
    const user = { email: "hello@world.com" };
    const reqMock = createRequest({
      body: { ...user },
    });
    const resMock = createResponse();
    const nextMockFn: NextFunction = jest.fn((e: string) => void 0);

    expect.assertions(1);
    await emailExists(reqMock, resMock, nextMockFn);
    expect(nextMockFn).toHaveBeenCalledWith(
      new AppHttpError(StatusCodes.BAD_REQUEST, Message.EmailInexistent)
    );
  });
});

describe("emailInexistent", () => {
  beforeAll(async () => {
    await connect();
  });

  afterEach(async () => {
    await clear();
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await close();
  });

  it(`halts the request with ${StatusCodes.CONFLICT} if the email exists`, async () => {
    const user = { email: "hello@world.com" };
    await UserModel.create(user);
    const reqMock = createRequest({
      body: { ...user },
    });
    const resMock = createResponse();
    const nextMockFn: NextFunction = jest.fn((e: string) => void 0);

    expect.assertions(1);
    await emailInexistent(reqMock, resMock, nextMockFn);

    expect(nextMockFn).toHaveBeenCalledWith(
      new AppHttpError(StatusCodes.CONFLICT)
    );
  });

  it(`continues the request if the email doesn't exist`, async () => {
    const user = { email: "hello@world.com" };
    const reqMock = createRequest({
      body: { ...user },
    });
    const resMock = createResponse();
    const nextMockFn: NextFunction = jest.fn((e: string) => void 0);

    expect.assertions(1);
    await emailInexistent(reqMock, resMock, nextMockFn);
    expect(nextMockFn).toHaveBeenCalledWith();
  });
});

describe("isAuthenticated", () => {
  beforeAll(async () => {
    await connect();
  });

  afterEach(async () => {
    await clear();
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await close();
  });

  it(`halts the request with ${StatusCodes.UNAUTHORIZED} if no authorization header and/or cookie`, async () => {
    expect.assertions(1);

    const reqMock = createRequest({
      headers: {},
    });
    const resMock = createResponse();
    const nextMockFn: NextFunction = jest.fn((e: string) => void 0);
    const mockSendFn = jest.spyOn(AppHttpResponse, "send");
    await isAuthenticated(reqMock, resMock, nextMockFn);

    expect(mockSendFn).toHaveBeenCalledWith(
      resMock,
      StatusCodes.UNAUTHORIZED,
      null
    );
  });

  it(`halts the request with ${StatusCodes.UNAUTHORIZED} if authorization header is false`, async () => {
    expect.assertions(1);

    const reqMock = createRequest({
      headers: {
        authorization: "xxxxxxxxxxxxxxxxxxxxxx",
      },
    });
    const resMock = createResponse();
    const nextMockFn: NextFunction = jest.fn((e: string) => void 0);
    const mockSendFn = jest.spyOn(AppHttpResponse, "send");
    await isAuthenticated(reqMock, resMock, nextMockFn);

    expect(mockSendFn).toHaveBeenCalledWith(
      resMock,
      StatusCodes.UNAUTHORIZED,
      null
    );
  });

  it(`halts the request with ${StatusCodes.UNAUTHORIZED} if the token cookie is false`, async () => {
    expect.assertions(1);

    const reqMock = createRequest({
      cookies: {
        token: "xxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    });
    const resMock = createResponse();
    const nextMockFn: NextFunction = jest.fn((e: string) => void 0);
    const mockSendFn = jest.spyOn(AppHttpResponse, "send");
    await isAuthenticated(reqMock, resMock, nextMockFn);

    expect(mockSendFn).toHaveBeenCalledWith(
      resMock,
      StatusCodes.UNAUTHORIZED,
      null
    );
  });

  it(`continues the request with if the auth header is true`, async () => {
    expect.assertions(1);

    const userDoc = await UserModel.create({
      email: "postit@mail.com",
      password: "postit",
    });
    delete userDoc._doc.password;

    const token = await createJwt(userDoc.toJSON());

    const reqMock = createRequest({
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    const resMock = createResponse();
    const nextMockFn: NextFunction = jest.fn((e: string) => void 0);
    await isAuthenticated(reqMock, resMock, nextMockFn);

    expect(nextMockFn).toHaveBeenCalledWith();
  });
});
