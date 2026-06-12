import http from 'node:http';
import { config } from 'dotenv';
import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

config();

const PORT = process.env.PORT || 3000;

const model = new ChatOpenAI({
  temperature: 0.7,
  modelName: process.env.MODEL_NAME,
  apiKey: process.env.OPENAI_API_KEY,
  configuration: {
    baseURL: process.env.OPENAI_BASE_URL,
  },
});

const prompt = PromptTemplate.fromTemplate('请回答以下问题：\n\n{query}');
const chain = prompt.pipe(model).pipe(new StringOutputParser());

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '', `http://${req.headers.host}`);

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'GET' && url.pathname === '/ai/chat') {
    const query = url.searchParams.get('query') || '';
    try {
      const answer = await chain.invoke({ query });
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ answer }));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: (error as Error).message }));
    }
    return;
  }

  if (req.method === 'GET' && url.pathname === '/ai/chat/stream') {
    const query = url.searchParams.get('query') || '';

    res.writeHead(200, {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });

    try {
      const stream = await chain.stream({ query });
      for await (const chunk of stream) {
        // const message = JSON.stringify({ data: chunk });
        res.write(`data:${chunk}\n\n`);
      }
      res.end();
    } catch (error) {
      const message = JSON.stringify({ data: `[ERROR] ${(error as Error).message}` });
      res.write(`data: ${message}\n\n`);
      res.end();
    }

    req.on('close', () => {
      res.end();
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify({ error: 'Not Found' }));
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
