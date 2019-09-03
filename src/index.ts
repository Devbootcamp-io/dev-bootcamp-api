import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import * as Express from "express";
import { buildSchema, Resolver, Query } from "type-graphql";
import { createConnection } from "typeorm";
import { User } from "./entity/User";

@Resolver()
class HelloResolver {
  @Query(() => String)
  async helloWorld() {
    return "Hello World!";
  }
}

const main = async () => {
  const schema = await buildSchema({
    resolvers: [HelloResolver]
  });

  const apolloServer = new ApolloServer({ schema });

  const app = Express();

  apolloServer.applyMiddleware({ app });

  await createConnection().then(() => {
    console.log("started");
  });

  const user = User.create({ email: "test", password: "test123" });
  await user.save();
  app.listen(4000, () => {
    console.log("server started on http://localhost:4000/graphql");
  });
};

main();
