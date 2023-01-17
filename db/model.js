const db = require("./connection");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics").then((topics) => {
    return topics.rows;
  });
};

exports.fetchArticles = () => {
  return db
    .query(
      `SELECT author, title, article_id, topic, created_at, votes, article_img_url,
    (SELECT COUNT(*) FROM comments AS b
    WHERE b.article_id = a.article_id) 
    AS comment_count
    FROM articles AS a
    ORDER BY created_at DESC`
    )
    .then((article) => {
      return article.rows;
    });
};
