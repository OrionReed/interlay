import { useState, useCallback } from 'react';

export const useGenerateText = () => {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateText = useCallback(async (prompt) => {
    setLoading(true);
    setError(null);

    // !! SPICY !!
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    const endpoint = "https://api.openai.com/v1/chat/completions";
    const query = {
      model: "gpt-4-turbo-preview",
      stream: false, // :(
      messages: [
        { role: "system", content: "You are a helpful assistant. You will be given an instruction and an input which may contain HTML. Your answer should be in plaintext unless otherwise specified." },
        { role: "user", content: prompt },
      ],
    };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(query),
      });
      const data = await response.json();
      setResponse(data.choices[0].message.content);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }

  }, []);

  return { response, loading, error, generateText };
};

export const generate = async (prompt: string) => {
  // !! SPICY !!
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const endpoint = "https://api.openai.com/v1/chat/completions";
  const query = {
    model: "gpt-4-turbo-preview",
    stream: false, // :(
    messages: [
      { role: "system", content: "You are a helpful assistant. You will be given an instruction and an input which may contain HTML. Your answer should be in plaintext unless otherwise specified." },
      { role: "user", content: prompt },
    ],
  };

  try {
    console.log('tring...', query)
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(query),
    });
    const data = await response.json();
    const result = data.choices[0].message.content
    console.log('result', result)
    return result
  } catch (error) {
    console.log(error)
  }
};