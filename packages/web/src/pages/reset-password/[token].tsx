import { NextPage } from 'next';

const ResetPassword: NextPage<{ token: string }> = ({ token }) => {
  return <p>Token is {token}</p>;
};

ResetPassword.getInitialProps = ({ query }) => {
  return {
    token: query.token as string,
  };
};
export default ResetPassword;
