import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    openaiConfigured: !!process.env.OPENAI_API_KEY
  });
}