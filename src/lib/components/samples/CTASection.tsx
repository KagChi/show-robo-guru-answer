import {
  FormControl,
  Input,
  FormHelperText,
  Box,
  Text,
  Stack,
  Avatar,
  useColorModeValue,
  chakra,
  Flex,
  Image,
  Link,
} from '@chakra-ui/react';
import { decode } from 'html-entities';
import type { ChangeEvent } from 'react';
import { useState } from 'react';
import removeMD from 'remove-markdown';

const CTASection = () => {
  const [answerState, answerUpdate] = useState<AnswerState[] | undefined>();
  const [questionState, questionUpdate] = useState<QuesionState | undefined>();

  async function onUserType(
    data: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) {
    const response = await fetch('/api/parse', {
      method: 'POST',
      body: JSON.stringify({ url: data.target.value }),
    });
    if (response.ok) {
      const jsonResponse = await response.json();
      const props = jsonResponse.props.pageProps;
      questionUpdate({
        user: {
          username: props.forumDetail
            ? props.forumDetail.thread.createdByUser.username
            : props.question.createdByUser.username,
          photoUrl: props.forumDetail
            ? props.forumDetail.thread.createdByUser.photoUrl
            : props.question.createdByUser.photoUrl,
        },
        choices: props.question?.options ?? [],
        question: props.cleanContent,
      });

      answerUpdate(
        jsonResponse.props.pageProps.forumDetail
          ? jsonResponse.props.pageProps.forumDetail.items.map(
              (x: {
                createdByUser: { username: string; photoUrl: string };
                content: string;
              }) => {
                return {
                  user: {
                    username: x.createdByUser.username,
                    photoUrl: x.createdByUser.photoUrl,
                  },
                  answer: x.content,
                };
              }
            )
          : [
              {
                user: {
                  username: props.question.createdByUser.username,
                  photoUrl: props.question.createdByUser.photoUrl,
                },
                answer: props.question.shortAnswer,
              },
            ]
      );
    }
  }

  return (
    <Box textAlign="center" marginTop={8}>
      <Box>
        <FormControl>
          <FormHelperText>Roboguru link</FormHelperText>
          <Input
            onChange={onUserType}
            type="text"
            id="link"
            boxShadow="md"
            required
            autoComplete="off"
            autoCorrect="off"
          />
        </FormControl>
      </Box>
      <br />
      {questionState && (
        <Stack
          bg={useColorModeValue('gray.50', 'gray.800')}
          py={16}
          px={8}
          spacing={{ base: 8, md: 10 }}
          align="center"
          direction="column"
        >
          <Text
            fontSize={{ base: 'xl', md: '2xl' }}
            textAlign="center"
            maxW="3xl"
          >
            {decode(removeMD(questionState.question))}
            {questionState.choices &&
              questionState.choices.map((x, index) => (
                <Text>
                  {' '}
                  {String.fromCharCode(index + 1 + 64)}. {decode(removeMD(x))}{' '}
                </Text>
              ))}
          </Text>
          <Box textAlign="center">
            <Avatar src={questionState.user.photoUrl} mb={2} />

            <Text fontWeight={600}>{questionState.user.username}</Text>
            <Text
              fontSize="sm"
              color={useColorModeValue('gray.400', 'gray.400')}
            >
              Quesioned by
            </Text>
          </Box>
        </Stack>
      )}
      {answerState &&
        answerState.map((x) => (
          <Flex mt={5} w="full" alignItems="center" justifyContent="center">
            <Box
              mx="auto"
              px={2}
              py={4}
              rounded="lg"
              shadow="lg"
              bg="white"
              _dark={{
                bg: 'gray.800',
              }}
              maxW="2xl"
            >
              <Box mt={2}>
                <chakra.p
                  mt={2}
                  color="gray.600"
                  _dark={{
                    color: 'gray.300',
                  }}
                >
                  {decode(removeMD(x.answer))}
                </chakra.p>
              </Box>

              <Flex justifyContent="space-between" alignItems="center" mt={4}>
                <Flex alignItems="center">
                  <Image
                    mx={4}
                    w={10}
                    h={10}
                    rounded="full"
                    fit="cover"
                    src={x.user.photoUrl}
                    alt="avatar"
                  />
                  <Link
                    color="gray.700"
                    _dark={{
                      color: 'gray.200',
                    }}
                    fontWeight="700"
                    cursor="pointer"
                  >
                    {x.user.username}
                  </Link>
                </Flex>
              </Flex>
            </Box>
          </Flex>
        ))}
    </Box>
  );
};

export default CTASection;

interface AnswerState {
  user: {
    username: string;
    photoUrl: string;
  };
  answer: string;
}

interface QuesionState {
  user: {
    username: string;
    photoUrl: string;
  };
  choices: string[];
  question: string;
}
