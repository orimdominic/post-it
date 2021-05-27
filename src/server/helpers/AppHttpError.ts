import { StatusCodes } from "http-status-codes";

export class AppHttpError extends Error {
  /**
   * @constructor
   * @param {StatusCodes} code - The HTTP status code of the error
   */
  constructor(public code: StatusCodes, message?: string) {
    super(message);
  }
}
