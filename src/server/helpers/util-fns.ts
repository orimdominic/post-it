import { isEmpty } from "lodash";
import bcrypt from "bcrypt";
import appRoot from "app-root-path";
import jwt from "jsonwebtoken";
import fs from "fs/promises";

/**
 * Trim request inputs
 * @param {Record<string, unknown>} form request object
 * @returns {Record<string, unknown>} trimmed data
 */
export const trimInputs = (
  form: Record<string, unknown>
): Record<string, unknown> => {
  // replace every value with trimmed content, except arrays
  const arr = Object.keys(form);

  for (let i = 0; i < arr.length; i += 1) {
    if (Object.prototype.hasOwnProperty.call(form, arr[i])) {
      if (
        Array.isArray(form[arr[i]]) ||
        form[arr[i]] instanceof Object ||
        isEmpty(form[arr[i]])
      ) {
        continue;
      }
      form[arr[i]] = (form[arr[i]] as string).trim();
    }
  }
  return form;
};

/**
 * Hash a user's password
 * @param {string} password - the plain password
 * @return {Promise<string>} the hashed password
 */
export const hashPassword = async (password: string): Promise<string> =>
  await bcrypt.hash(password, 10);

/**
 * Compares password with encrypted password hash
 * @param {string} password - the raw password submitted during login
 * @param {string} hash - the hashed password in the database
 * @return {boolean} - true if they are equal
 */
export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => bcrypt.compare(password, hash);

/**
 * Returns a generated a JWT from a payload
 * @param {Record<string, unknown>} payload
 * @returns  Promise<string> the JWT
 */
export const createJwt = async (
  payload: Record<string, unknown>
): Promise<string> => {
  const algorithm = "RS256";
  const privateKey = await fs.readFile(`${appRoot}/.private.pem`, "utf8");
  return jwt.sign(payload, privateKey, {
    algorithm,
    expiresIn: "24h",
  });
};

/**
 * Extract the payload from a JWT
 * @param {string} token the JWT
 * @returns Promise<Record<string, unknown>> the payload
 */
export const decryptJwt = async (
  token: string
): Promise<Record<string, unknown>> => {
  const algorithm = "RS256";
  try {
    const publicKey = await fs.readFile(`${appRoot}/.private.pem`, "utf8");
    const payload = jwt.verify(token, publicKey, {
      algorithms: [algorithm],
    }) as Record<string, unknown>;
    return payload;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

/**
 * Pagination helper
 * @param {number} total - document count
 * @param {string} page - requested page number
 * @param {string} limit - requested batched amount
 * @param {boolean} lite - if we need only part of the document, albeit the whole collection
 * @returns {start, parsedLimit: number, main: Record<string, number>}
 */
export const paginatorMetadata = (
  total: number,
  page: string,
  limit: string,
  lite = false
): { start: number; parsedLimit: number; main: Record<string, number> } => {
  const currentPage = parseInt(page, 10);
  const previousPage = currentPage - 1;
  const nextPage = currentPage + 1;
  const parsedLimit = parseInt(limit, 10);

  const start = parsedLimit * previousPage;
  const end = parsedLimit * currentPage;

  return {
    start: !lite ? start : 0,
    parsedLimit: !lite ? parsedLimit : 0,
    main: {
      ...(previousPage > 0 && !lite && { previousPage }),
      ...(end < total && !lite && { nextPage }),
      total,
    },
  };
};

// TODO: Manage error handling for all code properly
