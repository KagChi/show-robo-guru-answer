// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import type { NextApiRequest, NextApiResponse } from 'next';
import { fetch } from 'undici';
import { load } from 'cheerio';

const parse = async (req: NextApiRequest, res: NextApiResponse) => {
    const response = await fetch(JSON.parse(req.body).url);
    if (response.ok) {
      const $ = load(await response.text());
      return res.send(JSON.parse($("#__NEXT_DATA__").text()))
    }

    return res.status(response.status).send(await response.text());
};

export default parse;
