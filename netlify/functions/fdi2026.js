const NOTION_KEY = process.env.NOTION_API_KEY;
const DB_ID      = "37a76fc4-5495-8009-96a3-f383f4b2abd1";

exports.handler = async function () {
  try {
    let results = [];
    let cursor  = undefined;

    do {
      const body = {
        sorts: [{ property: "Slot", direction: "ascending" }],
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

    const items = results.map(page => {
      const props       = page.properties;
      const titleParts  = props.Name?.title ?? [];
      const name        = titleParts.length ? titleParts[0].plain_text : "";
      const slot        = (props.Slot?.rich_text ?? []).map(t => t.plain_text).join('');
      const description = (props.Description?.rich_text ?? []).map(t => t.plain_text).join('');
      const title       = (props.Title?.rich_text ?? []).map(t => t.plain_text).join('');
      const imgFiles    = props.Image?.files ?? [];
      const imageUrl    = imgFiles.length
        ? (imgFiles[0].file?.url ?? imgFiles[0].external?.url ?? null)
        : null;

      return { name, title, slot, description, imageUrl };
    }).filter(e => e.name);

    return {
      statusCode: 200,
      headers: {
        "Content-Type":                "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control":               "public, max-age=300",
      },
      body: JSON.stringify(items),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
