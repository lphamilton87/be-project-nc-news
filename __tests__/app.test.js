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
        expect(response.body.length).toBe(3);
        response.body.forEach((topic) => {
          expect(topic).toHaveProperty("slug", expect.any(String));
          expect(topic).toHaveProperty("description", expect.any(String));
        });
      });
  });
});
describe("GET/api/articles", () => {
  test("returns 200: array of article objects in descending order by created_at", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        expect(response.body.length).toBe(12);
        expect(response.body[0].created_at).toBe("2020-11-03T09:12:00.000Z");
        expect(response.body[11].created_at).toBe("2020-01-07T14:08:00.000Z");
      });
  });
  test("returns array of objects - including required properties from articles & an added comment_count", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        console.log(response.body);
        response.body.forEach((article) => {
          expect(article).toHaveProperty("author", expect.any(String));
          expect(article).toHaveProperty("title", expect.any(String));
          expect(article).toHaveProperty("article_id", expect.any(Number));
          expect(article).toHaveProperty("topic", expect.any(String));
          expect(article).toHaveProperty("created_at", expect.any(String));
          expect(article).toHaveProperty("votes", expect.any(Number));
          expect(article).toHaveProperty("article_img_url", expect.any(String));
          expect(article).toHaveProperty("comment_count", expect.any(String));
        });
      });
  });
});
