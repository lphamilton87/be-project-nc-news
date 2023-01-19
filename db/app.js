const express = require("express");
const {
  checkApiResponse,
  getTopics,
  getArticles,
  getArticleById,
  getComments,
  postNewComments,
} = require("./controller");

const app = express();

app.use(express.json());

app.get("/api", checkApiResponse);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getComments);

app.post("/api/articles/:article_id/comments", postNewComments);

app.use((err, request, response, next) => {
  if (err.status) {
    response.status(err.status).send({ msg: "Not found" });
  } else {
    next(err);
  }
});

app.use((err, request, response, next) => {
  if (err.code === "22P02") {
    response.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
});

app.use((err, request, response, next) => {
  console.log(err);
  response.status(500).send({ msg: "Internal server error" });
});

module.exports = app;
