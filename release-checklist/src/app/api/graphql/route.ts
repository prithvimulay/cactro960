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

// Explicitly wrap the handlers to satisfy Next.js App Router type constraints
export async function GET(request: NextRequest) {
  return handler(request);
}

export async function POST(request: NextRequest) {
  return handler(request);
}