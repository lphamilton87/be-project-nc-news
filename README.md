## NC-News

Welcome to NC-News. This is the back end project for a news article app. Allowing you to browse through various articles and vote and comment on them

## Description

This is an API for a backend server and PSQL database, developed with Node.js and Express. I have used the MVC (Model, View, Controller) pattern in order to develop clear and concise code for the user and have taken a full TDD (Test Driven Developement) approach to build functionality, using Jest and Supertest.

## Here are the API endpoints

## GET

* /api
* /api/topics
* /api/articles
* /api/articles/:article_id
* /api/articles/:article_id
* /api/users

## PATCH

* /api/articles/:article_id

## POST

* /api/articles/:article_id/comments

## DELETE

* /api/comments/:comment_id

## Getting Started

* To use this repository on your local machine you can for the repository run the command git clone add_url_here
* You can then install the required dependencies by running npm install in your terminal
* Run the commands npm setup-dbs and npm run seed to create and seed the databases
* Run the tests by running the command npm test
* Create the following files:
* .env.development - add PGDATABASE=nc_games
* .env.test - add PGDATABASE=nc_games_test

## Links

Front end repo: https://github.com/lphamilton87/nc-news-front-end

Hosted link: https://nc-news-lee.netlify.app/

