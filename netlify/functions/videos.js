// Set NOTION_API_KEY in Netlify dashboard → Site settings → Environment variables
const NOTION_KEY = process.env.NOTION_API_KEY;
const DB_ID      = "37576fc4-5495-80a8-8f17-de4fe77d714d";

function getYouTubeId(url) {
  if (!url) return null;
  var m = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/);
  return m ? m[1] : null;
}

exports.handler = async function () {
  try {
    let results = [];
    let cursor  = undefined;

    do {
      const body = {
        sorts: [{ property: "Date", direction: "descending" }],
        page_size: 100,
      };
      if (cursor) body.start_cursor = cursor;

      const res = await fetch(`https://api.notion.com/v1/databases/${DB_ID}/query`, {
        method: "POST",
        headers: {
          Authorization:    `Bearer ${NOTION_KEY}`,
          "Content-Type":   "application/json",
          "Notion-Version": "2022-06-28",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Notion API ${res.status}: ${err}`);
      }

      const data = await res.json();
      results = results.concat(data.results);
      cursor  = data.has_more ? data.next_cursor : undefined;
    } while (cursor);

    const videos = results.map(page => {
      const props      = page.properties;
      const titleParts = props.Name?.title ?? [];
      const name       = titleParts.length ? titleParts[0].plain_text : "";
      const date       = props.Date?.date?.start ?? null;
      const url        = props.URL?.url ?? null;
      const blurb      = (props.Blurb?.rich_text ?? []).map(t => t.plain_text).join('');
      const youtubeId  = getYouTubeId(url);

      return { name, date, url, youtubeId, blurb };
    }).filter(v => v.name && v.youtubeId);

    return {
      statusCode: 200,
      headers: {
        "Content-Type":                "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control":               "public, max-age=300",
      },
      body: JSON.stringify(videos),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
