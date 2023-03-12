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
  Icon,
  SimpleGrid,
} from '@chakra-ui/react';
import type { ChangeEvent } from 'react';
import { useState } from 'react';

const CTASection = () => {
  const [answerState, answerUpdate] = useState<string[] | undefined>();
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
      questionUpdate({
        user: {
          username: jsonResponse.props.pageProps.forumDetail?.thread.createdByUser.username,
          photoUrl: jsonResponse.props.pageProps.forumDetail?.thread.createdByUser.photoUrl
        },
        question: jsonResponse.props.pageProps.cleanContent
      });

      answerUpdate(
        jsonResponse.props.pageProps.forumDetail
          ? jsonResponse.props.pageProps.forumDetail.items.map(
              (x: { content: string }) => x.content
            )
          : [jsonResponse.props.pageProps.question.shortAnswer]
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
        align={'center'}
        direction={'column'}>
        <Text
          fontSize={{ base: 'xl', md: '2xl' }}
          textAlign={'center'}
          maxW={'3xl'}>
            {questionState.question}
        </Text>
        <Box textAlign={'center'}>
          <Avatar
            src={questionState.user.photoUrl}
            mb={2}
          />

          <Text fontWeight={600}>{questionState.user.username}</Text>
          <Text fontSize={'sm'} color={useColorModeValue('gray.400', 'gray.400')}>
            Quesioned by
          </Text>
        </Box>
      </Stack>
      )}

      <br />

      {answerState &&
        answerState.map((x) => (
          <Box>
            <Text>{x}</Text>
          </Box>
        ))}
    </Box>
  );
};

export default CTASection;

interface QuesionState {
  user: {
    username: string;
    photoUrl: string;
  };
  question: string;
}
