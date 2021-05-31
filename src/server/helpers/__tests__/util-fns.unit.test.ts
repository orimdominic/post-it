import {
  comparePassword,
  createJwt,
  decryptJwt,
  hashPassword,
  trimInputs,
} from "../util-fns";
import { createResponse } from "node-mocks-http";
import { AppHttpResponse } from "../AppHttpResponse";
import { getReasonPhrase, StatusCodes } from "http-status-codes";
import { AppHttpError } from "../AppHttpError";

describe("decryptJwt", () => {
  it("throws an error on invalid JWTs", async () => {
    await expect(decryptJwt("lorem ipsum")).rejects.toThrowError();
    await expect(decryptJwt("-------------")).rejects.toThrowError();
  });
});

describe("hashPassword and comparePassword", () => {
  it("hashes and compares passwords correctly", async () => {
    const passwordMock = "Pa$$w0rd!";
    const hashedPassword = await hashPassword(passwordMock);
    const isValidPassword = await comparePassword(passwordMock, hashedPassword);

    expect(isValidPassword).toBe(true);
  });
});

describe("createJwt", () => {
  it("creates a valid JWT from a payload", async () => {
    const payloadMock = { hello: "world" };
    const jwt = await createJwt(payloadMock);
    const decryptedToken = await decryptJwt(jwt);

    expect(decryptedToken).toHaveProperty("hello", "world");
  });
});

describe("trimInputs", () => {
  it("trims input object property values (strings), but not arrays", async () => {
    const inputMock = { hello: `    world  `, arr: ["1", "2"] };
    const trimmed = trimInputs(inputMock);

    expect(trimmed).toEqual({ hello: "world", arr: ["1", "2"] });
  });
});

describe("AppHttpResponse.send", () => {
  it("responds with status == 'OK' when status code is < 400 and message arg == undefined ", () => {
    const resMock = createResponse();
    AppHttpResponse.send(resMock, StatusCodes.CREATED, null);
    const responseCode = resMock._getStatusCode();
    const responseBody = resMock._getJSONData();
    expect(responseCode).toBe(StatusCodes.CREATED);
    expect(responseBody).toEqual({
      message: getReasonPhrase(StatusCodes.CREATED),
      status: "OK",
      data: null,
    });
  });

  it("responds with message == 'ERROR' when status code is >= 400 ", () => {
    const resMock = createResponse();
    AppHttpResponse.send(resMock, StatusCodes.NOT_FOUND, null);
    const responseCode = resMock._getStatusCode();
    const responseBody = resMock._getJSONData();
    expect(responseCode).toBe(StatusCodes.NOT_FOUND);
    expect(responseBody).toEqual({
      message: getReasonPhrase(StatusCodes.NOT_FOUND),
      status: "ERROR",
      data: null,
    });
  });
});

describe("AppHttpError", () => {
  it("creates and error with code arg", () => {
    const err = new AppHttpError(StatusCodes.NOT_FOUND);
    expect(err).toBeInstanceOf(Error);
    expect(err).toHaveProperty("code", StatusCodes.NOT_FOUND);
  });
});
