// Set NOTION_API_KEY in Netlify dashboard → Site settings → Environment variables
const NOTION_KEY = process.env.NOTION_API_KEY;
const DB_ID      = "1e34bc26-c647-405e-9503-25d14c11e8a8";

exports.handler = async function () {
  try {
    let results = [];
    let cursor  = undefined;

    do {
      const body = {
        filter: { property: "Type", select: { equals: "Statement" } },
        sorts:  [{ property: "Date", direction: "descending" }],
        page_size: 100,
      };
      if (cursor) body.start_cursor = cursor;

      const res  = await fetch(`https://api.notion.com/v1/databases/${DB_ID}/query`, {
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

    const statements = results.map(page => {
      const titleParts  = page.properties.Name.title;
      const name        = titleParts.length ? titleParts[0].plain_text : "";
      const summary     = page.properties.Summary.rich_text.map(t => t.plain_text).join("");
      const date        = page.properties.Date.date?.start ?? null;
      const docFiles    = page.properties.Document.files;
      const documentUrl = docFiles.length
        ? (docFiles[0].file?.url ?? docFiles[0].external?.url ?? null)
        : null;
      const docName     = docFiles.length ? docFiles[0].name : null;
      const picFiles    = page.properties.Picture.files;
      const pictureUrl  = picFiles.length
        ? (picFiles[0].file?.url ?? picFiles[0].external?.url ?? null)
        : null;

      return { name, summary, date, documentUrl, docName, pictureUrl };
    }).filter(s => s.name);

    return {
      statusCode: 200,
      headers: {
        "Content-Type":                "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control":               "public, max-age=300",
      },
      body: JSON.stringify(statements),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
