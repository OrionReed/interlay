import * as vectordb from 'vectordb';
import { pipeline } from '@xenova/transformers';

export async function useVectorstore() {
  const pipe = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

  // Define the function. `sourceColumn` is required for LanceDB to know
  // which column to use as input.
  const embed_fun: any = {}
  embed_fun.sourceColumn = 'text'
  embed_fun.embed = async (batch) => {
    const result = []
    // Given a batch of strings, we will use the `pipe` function to get
    // the vector embedding of each string.
    for (const text of batch) {
      // 'mean' pooling and normalizing allows the embeddings to share the
      // same length.
      const res = await pipe(text, { pooling: 'mean', normalize: true })
      result.push(Array.from(res.data))
    }
    return (result)
  }

  // Link a folder and create a table with data
  const db = await vectordb.connect('data/sample-lancedb')

  // You can also import any other data, but make sure that you have a column
  // for the embedding function to use.
  const data = [
    { id: 1, text: 'Cherry', type: 'fruit' },
    { id: 2, text: 'Carrot', type: 'vegetable' },
    { id: 3, text: 'Potato', type: 'vegetable' },
    { id: 4, text: 'Apple', type: 'fruit' },
    { id: 5, text: 'Banana', type: 'fruit' }
  ]

  // Create the table with the embedding function
  //@ts-ignore
  const table = await db.createTable('food_table', data, "create", embed_fun)

  // Query the table
  const results = await table
    .search("a sweet fruit to eat")
    //@ts-ignore
    .metricType("cosine")
    .limit(2)
    .execute()
  console.log(results.map(r => r.text))
}