import { isEmpty } from "lodash";

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
