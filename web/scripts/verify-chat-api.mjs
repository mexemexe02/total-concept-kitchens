/**
 * Smoke-test POST/GET /api/chat against a running Next server.
 * Requires `npm run dev` (or production server) already listening.
 *
 *   CHAT_API_BASE=http://localhost:3012 node scripts/verify-chat-api.mjs
 */
const base = (process.env.CHAT_API_BASE ?? "http://localhost:3012").replace(/\/$/, "");

function fail(msg) {
  console.error("verify-chat-api:", msg);
  process.exit(1);
}

async function main() {
  const getRes = await fetch(`${base}/api/chat`);
  if (!getRes.ok) fail(`GET /api/chat expected 2xx, got ${getRes.status}`);
  const getJson = await getRes.json();
  if (typeof getJson.enabled !== "boolean") fail("GET body missing boolean enabled");
  if (typeof getJson.greeting !== "string" || !getJson.greeting.length) {
    fail("GET body missing greeting string");
  }
  console.log("OK GET /api/chat (enabled, greeting)");

  const hiRes = await fetch(`${base}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: "hi" }),
  });
  if (!hiRes.ok) fail(`POST hi expected 200, got ${hiRes.status}`);
  const hiJson = await hiRes.json();
  if (hiJson.source !== "greeting") fail(`POST hi expected source=greeting, got ${hiJson.source}`);
  if (typeof hiJson.reply !== "string" || !hiJson.reply.includes("Pantry")) {
    fail("POST hi reply missing Pantry intro");
  }
  console.log("OK POST hi (source=greeting)");

  const emptyRes = await fetch(`${base}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: "" }),
  });
  if (emptyRes.status !== 400) fail(`POST empty message expected 400, got ${emptyRes.status}`);
  const emptyJson = await emptyRes.json();
  if (!emptyJson.error) fail("POST empty expected error field");
  console.log("OK POST empty message (400)");

  // Likely FAQ hit — asserts pipeline beyond greeting without needing OpenAI.
  const faqRes = await fetch(`${base}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "What is your service area for kitchen installs?",
    }),
  });
  if (!faqRes.ok) fail(`POST service-area question expected 200, got ${faqRes.status}`);
  const faqJson = await faqRes.json();
  if (faqJson.source !== "faq") {
    console.warn(
      "WARN POST service-area: expected source=faq (bank/threshold may differ); got",
      faqJson.source,
    );
  } else {
    console.log("OK POST service-area (source=faq, faqId=%s)", faqJson.faqId);
  }

  const jokeRes = await fetch(`${base}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: "tell me a joke" }),
  });
  if (!jokeRes.ok) fail(`POST tell me a joke expected 200, got ${jokeRes.status}`);
  const jokeJson = await jokeRes.json();
  if (jokeJson.source !== "joke") {
    fail(`POST joke expected source=joke, got ${jokeJson.source}`);
  }
  if (typeof jokeJson.reply !== "string" || jokeJson.reply.length < 30) {
    fail("POST joke expected a substantive reply");
  }
  console.log("OK POST tell me a joke (source=joke)");

  console.log("verify-chat-api: all required checks passed.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
