export const endpoint =
  process.env.NODE_ENV === 'development' ? 'http://localhost:2111' : '';
export const gqlEndpoint =
  process.env.NODE_ENV === 'development' ? `${endpoint}/graphql` : '';
