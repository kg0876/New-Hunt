// netlify/functions/jsearch.js
exports.handler = async (event) => {
  try {
    const params = new URLSearchParams(event.queryStringParameters || {});
    const query = params.get("query") || "Financial Analyst in Ontario, Canada";
    const raw = (params.get("date_posted") || "today").toLowerCase();
    const dateMap = { "last_24_hours":"today","24h":"today","past_24_hours":"today","today":"today","3day":"3days","3days":"3days","week":"week","month":"month","anytime":"anytime" };
    const date_posted = dateMap[raw] || "today";
    const page = params.get("page") || "1";
    const num_pages = params.get("num_pages") || "1";

    const apiUrl = new URL("https://jsearch.p.rapidapi.com/search");
    apiUrl.searchParams.set("query", query);
    apiUrl.searchParams.set("date_posted", date_posted);
    apiUrl.searchParams.set("page", page);
    apiUrl.searchParams.set("num_pages", num_pages);

    const res = await fetch(apiUrl.toString(), {
      headers: { "X-RapidAPI-Key": process.env.RAPIDAPI_KEY || "", "X-RapidAPI-Host": "jsearch.p.rapidapi.com" }
    });

    const text = await res.text();
    return { statusCode: res.status, headers: { "content-type": res.headers.get("content-type") || "application/json", "access-control-allow-origin": "*" }, body: text };
  } catch (err) {
    return { statusCode: 500, headers: { "content-type": "application/json","access-control-allow-origin": "*" }, body: JSON.stringify({ error: err.message || String(err) }) };
  }
};
