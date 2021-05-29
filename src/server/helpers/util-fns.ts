import { isEmpty } from "lodash";
import bcrypt from "bcrypt";
import appRoot from "app-root-path";
import jwt from "jsonwebtoken";
import fs from "fs/promises";

/**
 * Trim form inputs
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
 * Encrypt a user's password
 * @param {string} password - the plain password
 * @return {Promise<string>} the hashed password
 */
export const hashPassword = async (password: string): Promise<string> =>
  await bcrypt.hash(password, 10);

/**
 * Compares the password for correctness
 * @param {string} password - the raw password submitted during login
 * @param {string} hash - the hashed password in the database
 * @return {boolean} - true if they are equal
 */
export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => bcrypt.compare(password, hash);

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

export const decryptJwt = async (token: string) => {
  const algorithm = "RS256";
  try {
    const publicKey = await fs.readFile(`${appRoot}/.private.pem`, "utf8");
    const claim = jwt.verify(token, publicKey, { algorithms: [algorithm] });
    return claim;
  } catch (err) {
    // log error
    throw err;
  }
};

// TODO: Manage error handling for all code properly
