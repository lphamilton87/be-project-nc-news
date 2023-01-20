const db = require("./connection");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics").then((topics) => {
    return topics.rows;
  });
};

exports.fetchArticles = () => {
  return db
    .query(
      `SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url,
    COUNT(comments.article_id) 
    AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY articles.article_id
    ORDER BY created_at DESC`
    )
    .then((article) => {
      return article.rows;
    });
};

exports.fetchArticleId = (article_id) => {
  const query = `SELECT * FROM articles
  WHERE articles.article_id=$1`;
  return db.query(query, [article_id]).then((article) => {
    if (article.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Not found" });
    } else return article.rows;
  });
};

exports.fetchComments = (article_id) => {
  const queryComments = `SELECT * FROM comments
  WHERE comments.article_id=$1
  ORDER BY created_at DESC`;
  return db.query(queryComments, [article_id]).then((comments) => {
    return comments.rows;
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
