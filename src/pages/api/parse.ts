// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { load } from 'cheerio';
import type { NextApiRequest, NextApiResponse } from 'next';
import { fetch } from 'undici';

const parse = async (req: NextApiRequest, res: NextApiResponse) => {
  const body = JSON.parse(req.body);
  if (!body.url) return res.status(500).send('Invalid url');
  const response = await fetch(body.url);
  if (response.ok) {
    const $ = load(await response.text());
    return res.send(JSON.parse($('#__NEXT_DATA__').text()));
  }

  return res.status(response.status).send(await response.text());
};

export default parse;
