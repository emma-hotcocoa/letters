// Netlify function to talk to Airtable

export async function handler(event, context) {
  const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
  const BASE_ID = process.env.AIRTABLE_BASE;
  const TABLE = "Letters";

  if (event.httpMethod === "POST") {
    // Save a new letter
    const { letter, author } = JSON.parse(event.body);

    const res = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: { Letter: letter, Author: author },
      }),
    });

    const data = await res.json();
    return { statusCode: 200, body: JSON.stringify(data) };
  }

  if (event.httpMethod === "GET") {
    // Get all saved letters
    const res = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE}`, {
      headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` },
    });
    const data = await res.json();
    return { statusCode: 200, body: JSON.stringify(data.records) };
  }

  return { statusCode: 405, body: "Method Not Allowed" };
}
