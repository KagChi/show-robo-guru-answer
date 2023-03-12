import {
  FormControl,
  Input,
  FormHelperText,
  Box,
  Text,
} from '@chakra-ui/react';
import type { ChangeEvent } from 'react';
import { useState } from 'react';

const CTASection = () => {
  const [answerState, answerUpdate] = useState<string[] | undefined>();
  const [questionState, questionUpdate] = useState<string | undefined>();

  async function onUserType(
    data: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) {
    const response = await fetch('/api/parse', {
      method: 'POST',
      body: JSON.stringify({ url: data.target.value }),
    });
    if (response.ok) {
      const jsonResponse = await response.json();
      questionUpdate(jsonResponse.props.pageProps.cleanContent);
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
        <Box>
          <Text>{questionState}</Text>
        </Box>
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
