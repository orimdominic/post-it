import { AuthController } from "../Auth.controller";
import { connect, clear, close } from "../../configs/jest-db.config";
import { createRequest, createResponse } from "node-mocks-http";
import { UserModel } from "../../models";
import { NextFunction } from "express";
import { AppHttpResponse } from "../../helpers";
import { StatusCodes } from "http-status-codes";
import { Key, Message } from "../../helpers/constants";
import { hashPassword, createJwt } from "../../helpers/util-fns";

describe("static login", () => {
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

  it(`it responds with ${StatusCodes.UNAUTHORIZED} if supplied email does not exist`, async () => {
    const reqMock = createRequest({
      body: {
        email: "fake_email",
        password: "fake_password",
      },
    });
    const resMock = createResponse();
    const nextMockFn: NextFunction = jest.fn((e: string) => void 0);
    await AuthController.login(reqMock, resMock, nextMockFn);
    expect(mockSendFn).toHaveBeenCalledWith(
      resMock,
      StatusCodes.UNAUTHORIZED,
      null
    );
  });

  it(`it responds with ${StatusCodes.UNAUTHORIZED} if supplied password is wrong`, async () => {
    const hashedPass = await hashPassword("real_password");
    await UserModel.create({
      email: "user@mail.com",
      password: hashedPass,
    });
    const reqMock = createRequest({
      body: {
        email: "user@mail.com",
        password: "fake_password",
      },
    });
    const resMock = createResponse();
    const nextMockFn: NextFunction = jest.fn((e: string) => void 0);
    await AuthController.login(reqMock, resMock, nextMockFn);
    expect(mockSendFn).toHaveBeenCalledWith(
      resMock,
      StatusCodes.UNAUTHORIZED,
      null
    );
  });

  it(`it responds with cookie and header token if login is successful`, async () => {
    const hashedPass = await hashPassword("real_password");
    const userDoc = await UserModel.create({
      email: "user@mail.com",
      password: hashedPass,
    });
    const reqMock = createRequest({
      body: {
        email: "user@mail.com",
        password: "real_password",
      },
    });
    delete userDoc._doc.password;
    const jwt = await createJwt(userDoc.toJSON());
    const resMock = createResponse();
    const nextMockFn: NextFunction = jest.fn((e: string) => void 0);
    await AuthController.login(reqMock, resMock, nextMockFn);
    expect(resMock.getHeader(Key.AccessToken)).toBe(jwt);
    expect(resMock.cookies["token"].value).toBe(jwt);
    expect(mockSendFn).toHaveBeenCalledWith(
      resMock,
      StatusCodes.OK,
      {
        user: userDoc.toJSON(),
        token: jwt,
      },
      Message.LoginSuccessful
    );
  });
});
