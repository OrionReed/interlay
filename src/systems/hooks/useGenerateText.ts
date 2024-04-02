import { useState, useCallback } from 'react';
// import OpenAI from 'openai';
// import fetchAdapter from '@vespaiach/axios-fetch-adapter'
// import { ClientOptions } from 'openai';
// import { SSE } from 'sse.js';
// const options: ClientOptions = {
// }
// const openai = new OpenAI({
//   apiKey: import.meta.env.VITE_OPENAI_API_KEY,
//   // !! SPICY !!
//   dangerouslyAllowBrowser: true,
//   // fetch: fetchAdapter,
// });

export const useGenerateText = () => {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateText = useCallback(async (prompt) => {
    setLoading(true);
    setError(null);

    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    const endpoint = "https://api.openai.com/v1/chat/completions"; // The endpoint for GPT-4 Turbo
    const query = {
      model: "gpt-4-turbo-preview",
      stream: false,
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
    };

    try {
      console.log('trying');
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(query),
      });
      console.log('response', response);

      const data = await response.json();
      console.log('data', data);

      setResponse(data.choices[0].message.content);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
      console.log('finally', response);

    }

  }, []);

  return { response, loading, error, generateText };
};