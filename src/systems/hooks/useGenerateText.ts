import { useState, useCallback } from 'react';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const basePrompt = "You are a helpful assistant. You will be given an instruction and an input which may contain HTML. Your answer should be in plaintext unless otherwise specified."

export async function generateText(
  prompt: string,
  onToken: (partialResponse: string) => void
) {
  let partial = '';
  const stream = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [{ role: 'system', content: basePrompt }, { role: 'user', content: prompt }],
    stream: true,
  });
  for await (const chunk of stream) {
    partial += chunk.choices[0]?.delta?.content || ''
    onToken(partial);
  }
  onToken(partial);
}
