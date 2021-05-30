import { decryptJwt } from "../util-fns";

describe("decryptJwt", () => {
  it("throws an error on invalid JWTs", async () => {
    await expect(decryptJwt("lorem ipsum")).rejects.toThrowError();
    await expect(decryptJwt("-------------")).rejects.toThrowError();
  });
});
