const { fetchTopics, fetchArticles, fetchArticleId } = require("./model");

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

exports.getArticleById = (request, response, next) => {
  const articleId = request.params.article_id;
  fetchArticleId(articleId)
    .then((article) => {
      response.status(200).send(article);
    })
    .catch(next);
};
