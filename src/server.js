const { ApolloServer, gql } = require('apollo-server');
const fs = require('fs');
const path = require('path');

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// HackerNewsの1つ1つの投稿
// const links = [
//   {
//     id: 'link-0',
//     description: 'APEX LEGENDS',
//     url: 'www.udemy-graphql-tutorial.com',
//   },
//   {
//     id: 'link-1',
//     description: 'FORT NIGHT',
//     url: 'aaaaa',
//   },
// ];


// リゾルバ関数
const resolvers = {
  Query: {
    info: () => "HackerNews クローン",
    feed: async (parent, args, context) => {
      return context.prisma.link.findMany();
    },
  },

  Mutation: {
    post: (parent, args, context) => {
      const newLink = context.prisma.link.create({
        data: {
          url: args.url,
          description: args.description,
        },
      });
      return newLink;
    }
  }
};

const server = new ApolloServer({ 
  typeDefs: fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf-8'),
  resolvers,
  context: {
    prisma,
  },
});

server.listen().then(({ url }) => {
  console.log(`${url}でサーバーを起動中`);
});
