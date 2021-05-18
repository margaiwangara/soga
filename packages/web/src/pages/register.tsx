import { Button } from '@chakra-ui/button';
import { Box } from '@chakra-ui/layout';
import { Form, Formik } from 'formik';
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';
import { useRegisterMutation } from '../generated/graphql';
import { InitialRegisterFormInput } from '../initials';
import { useRouter } from 'next/router';
interface Props {}

const INPUT_SPACING = 4;

function Register() {
  const router = useRouter();
  const [, register] = useRegisterMutation();

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={InitialRegisterFormInput}
        onSubmit={async (values, { setErrors }) => {
          try {
            const response = await register(values);
            router.push('/');
          } catch (error) {
            console.log('registration error', error);
          }
        }}
      >
        {({ isSubmitting }) => {
          return (
            <Form>
              <InputField
                name="name"
                placeholder="Name"
                label="Name"
                required={true}
              />
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
                register
              </Button>
            </Form>
          );
        }}
      </Formik>
    </Wrapper>
  );
}

export default Register;
