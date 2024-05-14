export type QueryResult = {
  page_content: string
  metadata: {
    title: string
    url: string
  }
}

export async function queryVectorstore(
  query: string,
  callback: (results: QueryResult[]) => void,
  k = 5,
) {
  const body = {
    q: query,
    k: k,
  };
  try {
    const response = await fetch("http://127.0.0.1:8000/rag", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    callback(data);
  } catch (error) {
    console.error("Error querying vectorstore:", error);
  }
}