const express = require("express");
const { checkApiResponse, getTopics } = require("./controller");

const app = express();

app.use(express.json());

app.get("/api", checkApiResponse);

app.get("/api/topics", getTopics);

app.use((err, req, res, next) => {
  if (err.status) {
    response.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
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
