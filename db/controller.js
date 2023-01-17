const { fetchTopics, fetchArticles } = require("./model");

exports.checkApiResponse = (request, response) => {
  response.status(200).send({ message: "all okay!" });
};

exports.getTopics = (request, response) => {
  fetchTopics().then((topics) => {
    response.status(200).send(topics);
  });
};

exports.getArticles = (request, response, next) => {
  fetchArticles().then((articles) => {
    response.status(200).send(articles);
  });
};
