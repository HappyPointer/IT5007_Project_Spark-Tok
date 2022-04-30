const fs = require('fs');
require('dotenv').config();
const { ApolloServer } = require('apollo-server-express');

const users = require('./users.js');
const papers = require('./papers.js');

// resolve the APIs defined in schema.graphql
const resolvers = {
  Query: {
    recommendPaper: papers.recommend_paper,
    randomPaper: papers.random_paper,
    checkLogin: users.check_login,
  },
  Mutation: {
    addUser: users.add_user,
    likePaper: users.likes_paper,
  },
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync('schema.graphql', 'utf-8'),
  resolvers,
  formatError: (error) => {
    console.log(error);
    return error;
  },
});

function installHandler(app) {
  const enableCors = (process.env.ENABLE_CORS || 'true') === 'true';
  console.log('CORS setting:', enableCors);
  server.applyMiddleware({ app, path: '/graphql', cors: enableCors });
}

module.exports = { installHandler };
