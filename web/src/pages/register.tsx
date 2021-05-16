import { Button } from '@chakra-ui/button';
import { Box } from '@chakra-ui/layout';
import { Form, Formik } from 'formik';
import { useMutation, gql } from 'urql';
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';
import { InitialRegisterFormInput } from '../initials';

interface Props {}

const INPUT_SPACING = 4;

const REGISTER = gql`
  mutation REGISTER($input: RegisterUserInput!) {
    register(input: $input) {
      id
      name
      surname
      email
      createdAt
      updatedAt
    }
  }
`;

function Register() {
  const [, register] = useMutation(REGISTER);
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={InitialRegisterFormInput}
        onSubmit={(values) => {
          return register({ input: values });
        }}
      >
        {({ isSubmitting }) => {
          return (
            <Form>
              <InputField name="name" placeholder="Name" label="Name" />
              <Box mt={INPUT_SPACING}>
                <InputField
                  name="surname"
                  placeholder="Surname"
                  label="Surname"
                />
              </Box>
              <Box mt={INPUT_SPACING}>
                <InputField
                  name="email"
                  placeholder="Email"
                  type="email"
                  label="Email"
                />
              </Box>
              <Box mt={INPUT_SPACING}>
                <InputField
                  name="password"
                  placeholder="Password"
                  type="password"
                  label="Password"
                />
              </Box>
              <Button
                mt={INPUT_SPACING}
                type="submit"
                isLoading={isSubmitting}
                colorScheme="teal"
              >
                Register
              </Button>
            </Form>
          );
        }}
      </Formik>
    </Wrapper>
  );
}

export default Register;
