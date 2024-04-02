import { useState, useCallback } from 'react';
// import OpenAI from 'openai';

// const openai = new OpenAI({
//   apiKey: import.meta.env.VITE_OPENAI_API_KEY,
//   // !! SPICY !!
//   dangerouslyAllowBrowser: true
// });

export const useGenerateText = () => {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateText = useCallback(async (prompt) => {
    setLoading(true);
    setError(null);
    const messagePrompts: { role: 'user' | 'system'; content: string; }[] = [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: prompt },
    ]
    const query = {
      model: "gpt-4",
      stream: true,
      messages: messagePrompts,
    };

    try {
      console.log('try fetch for prompt', prompt);

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify(query),
      });
      console.log('response', response);
      const reader = response?.body
        ?.pipeThrough(new TextDecoderStream())
        .getReader();
      if (!reader) return;

      console.log('reader', reader);

      // This is a hacky way to read the stream, but it works for now
      // and there isn't any particularly good way to do this without the OpenAI lib
      let s = "";
      while (true) {
        console.log('while');

        const { value, done } = await reader.read();
        console.log('value', value);
        if (done) break;
        let dataDone = false;
        const arr = value.split("\n");
        console.log('arr', arr);

        for (const data of arr) {
          if (data.length === 0) return; // ignore empty message
          if (data.startsWith(":")) return; // ignore sse comment message
          if (data === "data: [DONE]") {
            dataDone = true;
            return;
          }
          const json = JSON.parse(data.substring(6));
          console.log('json', json);
          const newToken = json.choices[0].delta.content;
          // if (!newToken) return;
          s += newToken;
          // onToken(s);
          console.log('s', s);

        };
        if (dataDone) break;
      }
      console.log('done while');
      // onDone(s);
    } catch (error) {
      console.error("Error calling LLM:", error);
    }
    finally {
      console.log('finally');
      setLoading(false);
    }
  }, []);

  return { response, loading, error, generateText };
};