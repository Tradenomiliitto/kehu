import { get, post } from "./ApiUtil";

describe("client:util:ApiUtil", () => {
  const token = "asd123";
  const url = "/url";
  const apiUrl = `/api/v1/${url}`;
  const body = { body: 1 };
  let getAttributeStub;

  beforeEach(() => {
    getAttributeStub = jest.fn(() => token);
    global.document.querySelector = jest.fn(() => ({
      getAttribute: getAttributeStub
    }));
  });

  describe("get", () => {
    it("calls api with given url", async () => {
      const jsonResponse = { response: 1 };
      const response = {
        status: 200,
        json: () => new Promise(resolve => resolve(jsonResponse))
      };
      fetch = jest.fn(() => {
        return new Promise(resolve => resolve(response));
      });

      const res = await get(url, body);

      expect(getAttributeStub).toBeCalledWith("content");
      expect(fetch).toBeCalledWith(apiUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "content-type": "application/json",
          "CSRF-Token": token
        }
      });
      expect(res).toEqual(jsonResponse);
    });
  });

  describe("post", () => {
    it("calls api with given parameters", async () => {
      const jsonResponse = { response: 1 };
      const response = {
        status: 200,
        json: () => new Promise(resolve => resolve(jsonResponse))
      };
      fetch = jest.fn(() => {
        return new Promise(resolve => resolve(response));
      });

      const res = await post(url, body);

      expect(getAttributeStub).toBeCalledWith("content");
      expect(fetch).toBeCalledWith(apiUrl, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "content-type": "application/json",
          "CSRF-Token": token
        },
        body: JSON.stringify(body)
      });
      expect(res).toEqual(jsonResponse);
    });
  });

  describe("when status is not successful", () => {
    it("throws an error", async () => {
      const statusText = "error status";
      const response = new Promise(resolve =>
        resolve({
          status: 400,
          statusText,
          json: () => new Promise(resolve => resolve({ error: "error" }))
        })
      );
      fetch = jest.fn(() => {
        return new Promise(resolve => resolve(response));
      });

      expect(post(url, body)).rejects.toEqual(new Error(statusText));
    });
  });
});
