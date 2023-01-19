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
  test("extra test using jest sorted to check the order is descending by created_at", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const result = response.body;
        expect(result).toBeSorted({ descending: "true", key: "created_at" });
      });
  });
  test("returns array of objects - including required properties from articles & an added comment_count", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
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
describe("GET/api/articles/:article_id", () => {
  test("returns 200: a single article object", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        console.log(response.body.article);
        response.body.article.forEach((eachArticle) => {
          expect(eachArticle).toHaveProperty("author", expect.any(String));
          expect(eachArticle).toHaveProperty("title", expect.any(String));
          expect(eachArticle).toHaveProperty("article_id", expect.any(Number));
          expect(eachArticle).toHaveProperty("body", expect.any(String));
          expect(eachArticle).toHaveProperty("topic", expect.any(String));
          expect(eachArticle).toHaveProperty("created_at", expect.any(String));
          expect(eachArticle).toHaveProperty("votes", expect.any(Number));
          expect(eachArticle).toHaveProperty(
            "article_img_url",
            expect.any(String)
          );
        });
      });
  });
  test("if passed an ID that doesnt exists - 404: Not found", () => {
    return request(app)
      .get("/api/articles/1000")
      .expect(404)
      .then((err) => {
        expect(err.body.msg).toBe("Not found");
      });
  });
  test("if passed a request in the wrong format - 400: Bad request ", () => {
    return request(app)
      .get("/api/articles/fakearticle")
      .expect(400)
      .then((err) => {
        expect(err.body.msg).toBe("Bad request");
      });
  });
});

describe("GET/api/articles/:article_id/comments", () => {
  test("returns 200: an array of comments for the given article_id", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then((result) => {
        expect(result.body.comments.length).toBe(2);
        result.body.comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id", expect.any(Number));
          expect(comment).toHaveProperty("votes", expect.any(Number));
          expect(comment).toHaveProperty("created_at", expect.any(String));
          expect(comment).toHaveProperty("author", expect.any(String));
          expect(comment).toHaveProperty("body", expect.any(String));
          expect(comment).toHaveProperty("article_id", expect.any(Number));
        });
      });
  });
  test("returns an empty array when there are no comments on the article", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then((response) => {
        const result = response.body.comments;
        expect(result).toEqual([]);
      });
  });
  test("if a request is made in the wrong format - 404: Not found", () => {
    return request(app)
      .get("/api/articles/1000/comments")
      .expect(404)
      .then((err) => {
        expect(err.body.msg).toBe("Not found");
      });
  });
  test("if passed an ID that doesnt exists - 400: Bad request ", () => {
    return request(app)
      .get("/api/articles/fakearticle/comments")
      .expect(400)
      .then((err) => {
        expect(err.body.msg).toBe("Bad request");
      });
  });
  test("returns in order with the most recent comments first", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        const result = response.body.comments;
        expect(result).toBeSorted({ descending: "true", key: "created_at" });
      });
  });
});

describe("POST/api/articles/:article_id/comments", () => {
  test("returns 201: new comment", () => {
    const testComment = {
      username: "rogersop",
      body: "This is a test comment",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(testComment)
      .expect(201)
      .then((response) => {
        const result = response.body;
        expect(result).toHaveProperty("comment_id", expect.any(Number));
        expect(result).toHaveProperty("votes", expect.any(Number));
        expect(result).toHaveProperty("created_at", expect.any(String));
        expect(result).toHaveProperty("author", expect.any(String));
        expect(result).toHaveProperty("body", expect.any(String));
        expect(result).toHaveProperty("article_id", expect.any(Number));
      });
  });
  test("if the article_id doesn't exist return - 404: Not found", () => {
    const testComment = {
      username: "rogersop",
      body: "This is a test comment",
    };
    return request(app)
      .post("/api/articles/1000/comments")
      .send(testComment)
      .expect(404)
      .then((err) => {
        expect(err.body.msg).toBe("Not found");
      });
  });
  test("if the request is made in the wrong format return - 400: Bad request ", () => {
    const testComment = {
      username: "rogersop",
      body: "This is a test comment",
    };
    return request(app)
      .post("/api/articles/fakearticle/comments")
      .send(testComment)
      .expect(400)
      .then((err) => {
        expect(err.body.msg).toBe("Bad request");
      });
  });
});
