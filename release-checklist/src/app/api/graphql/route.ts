import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { NextRequest } from 'next/server';
import { typeDefs } from '../../../graphql/schema';
import { resolvers } from '../../../graphql/resolvers';

// Create the Apollo Server instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Create the Next.js handler
const handler = startServerAndCreateNextHandler<NextRequest>(server);

// Export GET and POST handlers so Apollo Server can process requests
export { handler as GET, handler as POST };