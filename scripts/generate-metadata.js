import fs from "fs";
import path from "path";
import http from "http";

const API_URL = process.env.API_URL || "http://localhost:48080/api";
const OUTPUT_DIR = process.argv[2] || `../output/instagram-metadata`;

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

async function fetchAPI(endpoint) {
  return new Promise((resolve, reject) => {
    http
      .get(API_URL + endpoint, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            console.error(`Failed to parse ${endpoint}:`, e.message);
            resolve([]);
          }
        });
      })
      .on("error", reject);
  });
}

function clean(text) {
  if (!text) return "";
  return text.replace(/\*\*/g, "").replace(/\s+/g, " ").trim();
}

// Trim a summary to ~n chars without cutting words in half
function shorten(text, max = 200) {
  const t = clean(text);
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(" ")).trim() + " …";
}

function slug(text) {
  return clean(text)
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Build a hashtag from free text: "Sprache & Medien" -> #SpracheMedien
function tag(text) {
  return (
    "#" +
    clean(text)
      .replace(/ä/g, "ae")
      .replace(/ö/g, "oe")
      .replace(/ü/g, "ue")
      .replace(/ß/g, "ss")
      .replace(/&/g, " ")
      .split(/[\s-]+/)
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join("")
  );
}

// Remove duplicate hashtags, keep order
function dedupeTags(tags) {
  const seen = new Set();
  return tags.filter(Boolean).filter((t) => {
    const k = t.toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

const BASE_TAGS = [
  "#AI",
  "#AINews",
  "#up2daite",
  "#ArtificialIntelligence",
  "#Tech",
  "#TechNews",
];

const CTA = "";

// ─────────────────────────────────────────────────────────────
// Caption builders per type
// ─────────────────────────────────────────────────────────────

function renderCaption({ hook, body, hashtags }) {
  const tags = dedupeTags(hashtags).slice(0, 20).join(" ");
  return `${hook}

${body}

${CTA}
.
.
.
${tags}
`;
}

function editionCaption(e, editionStories) {
  const hook = `🗞️ Edition #${e.number}: ${clean(e.title)}`;
  const intro = e.editorNote
    ? shorten(e.editorNote, 350)
    : `The most important AI news of the week – curated and put into context.`;

  // All stories of the edition as an "In this edition" list
  const storyList = editionStories.length
    ? "\n\n📰 In this edition:\n" +
      editionStories.map((s) => `• ${clean(s.title)}`).join("\n")
    : "";

  const body = intro + storyList;

  // Collect hashtags from all story topics of the edition
  const topicTags = editionStories.flatMap((s) =>
    (s.topics || []).map((t) => tag(t.replace(/^ai-/, ""))),
  );
  const hashtags = [
    ...BASE_TAGS,
    ...topicTags,
    "#AIUpdate",
    "#Newsletter",
    "#WeeklyAI",
    "#AInews",
  ];
  return { hook, body, hashtags };
}

function modelCaption(m) {
  const highlights = (m.highlights || []).join(" · ");
  const hook = `🤖 #${m.rank} ${clean(m.name)} – ${clean(m.company)}`;
  const body =
    `Category: ${clean(m.category)}` +
    (highlights ? `\nHighlights: ${highlights}` : "") +
    (m.releaseYear ? `\nRelease: ${m.releaseYear}` : "");
  const hashtags = [
    ...BASE_TAGS,
    tag(m.company),
    tag(m.name),
    tag(m.category),
    "#LLM",
    "#AIModels",
    "#MachineLearning",
    "#GenAI",
  ];
  return { hook, body, hashtags };
}

function jobCaption(j) {
  const trendLabel =
    { rising: "rising ↗️", stable: "stable →", falling: "falling ↘️" }[
      j.trend
    ] || j.trend;
  const hook = `⚠️ ${clean(j.title)} – automation risk ${j.riskScore}/100`;
  const affected = (j.affectedTasks || []).join(" · ");
  const body =
    `Trend: ${trendLabel}\n` +
    shorten(j.reasoning, 260) +
    (affected ? `\n\nAffected tasks: ${affected}` : "");
  const hashtags = [
    ...BASE_TAGS,
    tag(j.category),
    "#FutureOfWork",
    "#Automation",
    "#JobsOfTheFuture",
    "#AIatWork",
  ];
  return { hook, body, hashtags };
}

// ─────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────

async function main() {
  console.log("📊 Loading data from", API_URL, "...");
  const [editions, stories, models, jobs] = await Promise.all([
    fetchAPI("/editions"),
    fetchAPI("/stories"),
    fetchAPI("/ai-models"),
    fetchAPI("/ai-jobs"),
  ]);
  console.log(
    `✓ ${editions.length} editions · ${stories.length} stories · ${models.length} models · ${jobs.length} jobs`,
  );

  for (const sub of ["editions", "models", "jobs"]) {
    fs.mkdirSync(path.join(OUTPUT_DIR, sub), { recursive: true });
  }

  const manifest = [];
  const write = (dir, filename, caption) => {
    fs.writeFileSync(
      path.join(OUTPUT_DIR, dir, filename),
      renderCaption(caption),
    );
    manifest.push(`${dir}/${filename}`);
    console.log(`  ✓ ${dir}/${filename}`);
  };

  // Editions – one post per edition (incl. story overview)
  console.log("\n📰 Editions:");
  for (const e of editions) {
    const editionStories = stories.filter((s) => s.editionId === e.id);
    write(
      "editions",
      `edition-${e.number}-${slug(e.title)}.txt`,
      editionCaption(e, editionStories),
    );
  }

  // Models
  console.log("\n🤖 Models:");
  for (const m of models) {
    write("models", `rank-${m.rank}-${slug(m.name)}.txt`, modelCaption(m));
  }

  // Jobs
  console.log("\n💼 Jobs:");
  for (const j of jobs) {
    write("jobs", `${slug(j.title)}.txt`, jobCaption(j));
  }

  // Manifest
  const manifestContent = `📸 INSTAGRAM CAPTION MANIFEST
Generated: ${new Date().toISOString()}
Files: ${manifest.length}

Each .txt file is a ready-to-post caption: hook, summary, CTA and hashtags – just copy-paste.

${manifest.map((f) => "• " + f).join("\n")}

🎨 TO RENDER JOB CARDS:
1. Open: scripts/render-cards-en.html in your browser
2. Paste this JSON and click "Rendern":

${JSON.stringify({ type: "jobs", jobs }, null, 2)}
`;
  fs.writeFileSync(path.join(OUTPUT_DIR, "MANIFEST.txt"), manifestContent);

  console.log(`\n✅ Done – ${manifest.length} captions in: ${OUTPUT_DIR}`);
  console.log("\n🎨 Job card JSON appended to MANIFEST.txt – copy-paste into render-cards-en.html");
}

main().catch((err) => {
  console.error("❌ Error:", err.message || err);
  process.exit(1);
});
