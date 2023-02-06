exports.endPoints = {
  "GET /api": {
    description:
      "serves up a json representation of all the available endpoints of the api",
  },
  "GET /api/topics": {
    description: "serves an array of all topics",
    queries: [],
    exampleResponse: {
      topics: [{ slug: "football", description: "Footie!" }],
    },
  },
  "GET /api/articles": {
    description: "serves an array of all topics",
    queries: ["author", "topic", "sort_by", "order"],
    exampleResponse: {
      articles: [
        {
          title: "Seafood substitutions are increasing",
          topic: "cooking",
          author: "weegembump",
          body: "Text from the article..",
          created_at: 1527695953341,
        },
      ],
    },
  },
  "GET /api/articles/:article_id": {
    description: "serves an specific article by its review_id",
    queries: [],
    exampleResponse: {
      articles: [
        {
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: 1594329060000,
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        },
      ],
    },
  },
  "GET /api/articles/:article_id": {
    description: "serves the comments for an article by its article_id",
    queries: [],
    exampleResponse: {
      body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      votes: 16,
      author: "butter_bridge",
      article_id: 9,
      created_at: 1586179020000,
    },
  },
  "POST /api/articles/:article_id/comments": {
    description: "posts a new comment on the article specified by article_id",
    queries: [
      {
        username: "username required",
        bosy: "This is a new comment",
      },
    ],
    exampleResponse: {
      username: "test user",
      body: "test comment",
    },
  },
};

// app.get("/api", checkApiResponse);

// app.get("/api/topics", getTopics);

// app.get("/api/articles", getArticles);

// app.get("/api/articles/:article_id", getArticleById);

// app.get("/api/articles/:article_id/comments", getComments);

// app.post("/api/articles/:article_id/comments", postNewComments);

// app.patch("/api/articles/:article_id", patchVotes);

// app.get("/api/users", getUsers);

// app.delete("/api/comments/:comment_id", deleteComment);
