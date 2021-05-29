import { StatusCodes } from "http-status-codes";

/**
 * @class AppHttpError
 * @extends Error
 * HTTP response error type for the app
 */
export class AppHttpError extends Error {
  /**
   * @constructor
   * @param {StatusCodes} code - The HTTP status code of the error
   * @param {string | undefined} message - The error message
   */
  constructor(public code: StatusCodes, message?: string) {
    super(message);
  }
}
