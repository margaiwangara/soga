import { Button } from '@chakra-ui/button';
import { Box } from '@chakra-ui/layout';
import { Form, Formik } from 'formik';
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';
import { useLoginMutation } from '../generated/graphql';
import { InitialRegisterFormInput } from '../initials';
import { useRouter } from 'next/router';
import { toErrorMap } from '../utils/toErrorMap';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../lib/createUrqlClient';

const INPUT_SPACING = 4;

function Login() {
  const router = useRouter();
  const [, login] = useLoginMutation();

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={InitialRegisterFormInput}
        onSubmit={async (values, { setErrors }) => {
          const { email, password } = values;
          try {
            const response = await login({ email, password });

            if (response.data?.login.errors) {
              setErrors(toErrorMap(response.data.login.errors));
            } else if (response.data?.login.user) {
              router.push('/');
            }
          } catch (error) {
            console.log('login error', error);
          }
        }}
      >
        {({ isSubmitting }) => {
          return (
            <Form>
              <Box mt={INPUT_SPACING}>
                <InputField
                  name="email"
                  placeholder="Email"
                  type="email"
                  label="Email"
                  required={true}
                />
              </Box>
              <Box mt={INPUT_SPACING}>
                <InputField
                  name="password"
                  placeholder="Password"
                  type="password"
                  label="Password"
                  required={true}
                />
              </Box>
              <Button
                mt={INPUT_SPACING}
                type="submit"
                isLoading={isSubmitting}
                colorScheme="teal"
              >
                login
              </Button>
            </Form>
          );
        }}
      </Formik>
    </Wrapper>
  );
}

export default withUrqlClient(createUrqlClient)(Login);
