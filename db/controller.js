const {
  fetchTopics,
  fetchArticles,
  fetchArticleId,
  fetchComments,
  insertComments,
} = require("./model");

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

exports.getComments = (request, response, next) => {
  const articleId = request.params.article_id;
  Promise.all([fetchComments(articleId), fetchArticleId(articleId)])
    .then(([result]) => {
      console.log(result);
      response.status(200).send({ comments: result });
    })
    .catch(next);
};

exports.postNewComments = (request, response, next) => {
  const { article_id } = request.params;
  const { username, body } = request.body;
  insertComments(article_id, { username, body })
    .then((newComms) => {
      response.status(201).send(newComms);
    })
    .catch(next);
};
