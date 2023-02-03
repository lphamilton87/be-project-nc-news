const db = require("./connection");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics").then((topics) => {
    return topics.rows;
  });
};

exports.fetchArticles = (topic, sort_by = "created_at", order = "desc") => {
  const acceptedSortBy = [
    "created_at",
    "comment_count",
    "votes",
    "author",
    "title",
    "article_img_url",
  ];

  const acceptedOrder = ["asc", "desc"];

  let queryValues = [];

  if (!acceptedSortBy.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Not found" });
  }
  if (!acceptedOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "Not found" });
  }

  let queryStr = `SELECT articles.author, title, articles.article_id, articles.topic, articles.created_at, articles.votes, article_img_url,
    COUNT(comments.article_id) 
    AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id`;

  if (topic !== undefined) {
    queryStr += ` WHERE articles.topic = $1`;
    queryValues.push(topic);
  }

  queryStr += ` GROUP BY articles.article_id
ORDER BY ${sort_by} ${order}`;

  return db.query(queryStr, queryValues).then((article) => {
    if (article.rows.length === 0) {
      return Promise.reject({ status: 400, msg: "Not found" });
    } else return article.rows;
  });
};

exports.fetchArticleId = (article_id) => {
  const query = `SELECT articles.*,
  COUNT(comments.article_id) AS comment_count FROM articles
  LEFT JOIN comments ON comments.article_id = articles.article_id
  WHERE articles.article_id=$1
  GROUP BY articles.article_id`;
  return db.query(query, [article_id]).then((article) => {
    if (article.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Not found" });
    } else return article.rows;
  });
};

exports.fetchComments = (article_id) => {
  const queryId = `SELECT * FROM articles WHERE article_id=$1`;
  return db.query(queryId, [article_id]).then((article) => {
    if (article.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Not found" });
    } else {
      const queryComments = `SELECT * FROM comments
  WHERE comments.article_id=$1
  ORDER BY created_at DESC`;
      return db.query(queryComments, [article_id]).then((comments) => {
        return comments.rows;
      });
    }
  });
};

exports.insertComments = (articleId, { username, body }) => {
  const queryId = `SELECT * FROM articles WHERE article_id=$1`;
  return db.query(queryId, [articleId]).then((article) => {
    if (article.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Not found" });
    } else {
      const query = `INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING*`;
      return db.query(query, [articleId, username, body]).then((comment) => {
        return comment.rows[0];
      });
    }
  });
};

exports.updateVotes = (article_id, vote) => {
  const query = `UPDATE articles SET votes = votes + $2 WHERE article_id=$1 RETURNING *`;
  return db.query(query, [article_id, vote]).then((updatedArticle) => {
    if (updatedArticle.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Not found" });
    } else return updatedArticle.rows[0];
  });
};

exports.fetchUsers = () => {
  return db.query("SELECT * FROM users").then((users) => {
    return users.rows;
  });
};

exports.commentToDelete = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [
      comment_id,
    ])
    .then((deletedComment) => {
      if (!deletedComment.rows.length) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return deletedComment;
    });
};
