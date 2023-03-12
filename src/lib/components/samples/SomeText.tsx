import { Grid, Heading, Text } from '@chakra-ui/react';

const SomeText = () => {
  return (
    <Grid textAlign="center">
      <Heading as="h1" size="md">
        SHOW ROBOGURU ANSWER WITHOUT BEING LOGGED IN
      </Heading>

      <Text fontSize="xs">
        Tired when looking for roboguru answer required to be logged in?
        Probably you needs this !
      </Text>
      <Text fontSize="xs">
        (Page cannot display the right text? sorry it is not easy to parse all
        things from the original. contributions appreciated.)
      </Text>
    </Grid>
  );
};

export default SomeText;
