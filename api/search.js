// /api/search.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

  const { query } = req.body;

  try {
    const response = await fetch(
      `https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/Search/WebSearchAPI?q=${encodeURIComponent(query)}&pageNumber=1&pageSize=5&autoCorrect=true`,
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'contextualwebsearch-websearch-v1.p.rapidapi.com',
        },
      }
    );
    const data = await response.json();
    res.status(200).json(data.value); // array of search result objects
  } catch (error) {
    console.error('Search API error:', error);
    res.status(500).json({ error: 'Search API failed.' });
  }
}
