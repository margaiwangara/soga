import { cacheExchange } from '@urql/exchange-graphcache';
import { dedupExchange, fetchExchange } from 'urql';
import { gqlEndpoint } from '../config';
import {
  LoginMutation,
  LogoutMutation,
  MeDocument,
  MeQuery,
} from '../generated/graphql';
import { customUpdateQuery } from './customUrqlQueries';

export const createUrqlClient = (ssrExchange: any) => ({
  url: gqlEndpoint,
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
          logout: (_result, _args, cache, _info) => {
            customUpdateQuery<LogoutMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              () => ({ me: null }),
            );
          },
          login: (_result, _args, cache, _info) => {
            customUpdateQuery<LoginMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.login.errors) {
                  return query;
                } else {
                  return {
                    me: result.login.user,
                  };
                }
              },
            );
          },
        },
      },
    }),
    ssrExchange,
    fetchExchange,
  ],
  fetchOptions: {
    credentials: 'include' as const,
  },
});
