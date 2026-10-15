// Global "Randomize design" counter for kevinebaugh.com.
// Routed at kevinebaugh.com/api/redesigns, so the page calls it same-origin.
import { DurableObject } from "cloudflare:workers";

const PATH = "/api/redesigns";
const SITE_ORIGIN = "https://kevinebaugh.com";

export class Counter extends DurableObject {
  async read() {
    return (await this.ctx.storage.get("count")) ?? 0;
  }

  async increment() {
    const count = (await this.read()) + 1;
    await this.ctx.storage.put("count", count);
    return count;
  }
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

export default {
  async fetch(request, env) {
    if (new URL(request.url).pathname !== PATH) return json({ error: "not found" }, 404);

    const counter = env.COUNTER.get(env.COUNTER.idFromName("global"));

    if (request.method === "GET") return json({ count: await counter.read() });

    if (request.method === "POST") {
      // Only the site itself may bump the count. Easy to forge outside a browser,
      // but it stops other pages from inflating it from visitors' browsers.
      if (request.headers.get("Origin") !== SITE_ORIGIN) return json({ error: "forbidden" }, 403);
      return json({ count: await counter.increment() });
    }

    return new Response(null, { status: 405, headers: { Allow: "GET, POST" } });
  },
};
