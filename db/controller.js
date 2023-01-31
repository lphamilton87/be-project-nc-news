const {
  fetchTopics,
  fetchArticles,
  fetchArticleId,
  fetchComments,
  insertComments,
  updateVotes,
  fetchUsers,
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
  const { topic, sort_by, order } = request.query;
  fetchArticles(topic, sort_by, order)
    .then((articles) => {
      response.status(200).send(articles);
    })
    .catch(next);
};

exports.getArticleById = (request, response, next) => {
  const articleId = request.params.article_id;
  fetchArticleId(articleId)
    .then((article) => {
      response.status(200).send({ article: article });
    })
    .catch(next);
};

exports.getArticleComments = (request, response, next) => {
  const articleId = request.params.article_id;
  fetchArticleId(articleId)
    .then((comments) => {
      response.status(200).send(comments);
    })
    .catch(next);
};

exports.getComments = (request, response, next) => {
  const articleId = request.params.article_id;
  fetchComments(articleId)
    .then((comments) => {
      // Promise.all([fetchComments(articleId), fetchArticleId(articleId)])
      //   .then(([result]) => {
      response.status(200).send({ comments: comments });
    })
    .catch(next);
};

exports.postNewComments = (request, response, next) => {
  const { article_id } = request.params;
  const { username, body } = request.body;
  insertComments(article_id, { username, body })
    .then((newComm) => {
      response.status(201).send(newComm);
    })
    .catch(next);
};

exports.patchVotes = (request, response, next) => {
  const { article_id } = request.params;
  const { inc_votes } = request.body;
  updateVotes(article_id, inc_votes)
    .then((updatedArticle) => {
      response.status(201).send({ updatedArticle: updatedArticle });
    })
    .catch(next);
};

exports.getUsers = (request, response) => {
  fetchUsers().then((users) => {
    response.status(200).send(users);
  });
};
