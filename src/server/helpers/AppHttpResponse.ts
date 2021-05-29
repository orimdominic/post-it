import { Response } from "express";
import { getReasonPhrase, StatusCodes } from "http-status-codes";

/**
 * Wrapper for sending HTTP responses
 * @class AppHttpResponse
 */
export class AppHttpResponse {
  /**
   * Configure and send an HTTP response
   * @param {Response} res - The response object
   * @param {StatusCodes} code - The status code
   * @param {Record<string, unknown>} data - data for the client
   * @param {string | undefined} message - optional message
   */

  static send(
    res: Response,
    code: StatusCodes,
    data: Record<string, unknown> | null,
    message?: string
  ): void {
    message = message ? message : getReasonPhrase(code);
    res.status(code).json({
      message,
      status: code < 400 ? "OK" : "ERROR",
      data,
    });
  }
}
