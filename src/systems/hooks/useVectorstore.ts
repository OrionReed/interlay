import { useState, useEffect } from 'react';
import { ChromaClient, OpenAIEmbeddingFunction, DefaultEmbeddingFunction, Collection } from 'chromadb';
// import { pipeline } from '@xenova/transformers';
// const extractor = pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

// Create a feature-extraction pipeline
// const embedder = new OpenAIEmbeddingFunction({
//   openai_api_key: import.meta.env.VITE_OPENAI_API_KEY,
//   ope
// });

export const useChroma = () => {
  const [client, setClient] = useState<ChromaClient | null>(null);
  const [collection, setCollection] = useState<Collection | null>(null);
  const embedder = new DefaultEmbeddingFunction();

  useEffect(() => {
    const initChromaClient = async () => {
      const chromaClient = new ChromaClient({ path: "http://localhost:8000" });
      chromaClient.reset();
      const chromaCollection = await chromaClient.getOrCreateCollection({ name: "sample_collection", embeddingFunction: embedder });
      setClient(chromaClient);
      setCollection(chromaCollection);
    };

    initChromaClient();
  }, []);

  const embedText = async (text) => {
    if (!client || !collection) return;
    await collection.add({
      documents: [text], // Embedding the text
      metadatas: [{ source: "user_input" }], // Arbitrary metadata
      ids: [`${Date.now()}`] // Unique ID for each document, using timestamp for simplicity
    });
  };

  const similaritySearch = async (queryText) => {
    if (!client || !collection) return;
    const results = await collection.query({
      queryTexts: [queryText],
      nResults: 5, // Adjust number of results as needed
      // Optional filters can be added here
    });
    console.log('results', results);
    return results;
  };

  return { embedText, similaritySearch };
};