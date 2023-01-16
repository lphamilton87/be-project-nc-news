const request = require("supertest");
const seed = require("../db/seeds/seed");
const app = require("../db/app");
const db = require("../db/connection");
const data = require("../db/data/test-data");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  db.end();
});

describe("app", () => {
  describe("GET/api", () => {
    test("get a status code of 200 with a success message", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then((result) => {
          expect(result.body.message).toBe("all okay!");
        });
    });
  });
});
describe("GET/api/topics", () => {
  test("returns 200: array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        console.log(response.body);
        expect(response.body.length).toBe(3);
        response.body.forEach((topic) => {
          expect(topic).toHaveProperty("slug", expect.any(String));
          expect(topic).toHaveProperty("description", expect.any(String));
        });
      });
  });
});
