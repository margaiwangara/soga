export const gqlEndpoint =
  process.env.NODE_ENV === 'development' ? 'http://localhost:2111/graphql' : '';
