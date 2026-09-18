#!/usr/bin/env node
/**
 * Trello sync — crée/met à jour le board du sprint depuis sprint-data.json.
 * Sans dépendance : fetch natif Node 18+.
 *
 * Requis dans .env :
 *   TRELLO_API_KEY=...
 *   TRELLO_TOKEN=...
 *
 * Usage : npm run trello:sync
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ---- Chargement .env (à la racine) sans dépendance ----
function loadEnv() {
  const envPath = join(__dirname, "..", "..", ".env");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !(m[1] in process.env)) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
}

const API = "https://api.trello.com/1";

async function trello(path, params = {}, method = "GET", body = undefined) {
  const url = new URL(API + path);
  url.searchParams.set("key", process.env.TRELLO_API_KEY);
  url.searchParams.set("token", process.env.TRELLO_TOKEN);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url, {
    method,
    headers: { Accept: "application/json" },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    throw new Error(`Trello ${method} ${path} → ${res.status}: ${await res.text()}`);
  }
  return res.status === 204 ? null : res.json();
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  loadEnv();
  if (!process.env.TRELLO_API_KEY || !process.env.TRELLO_TOKEN) {
    console.error(
      "✗ TRELLO_API_KEY / TRELLO_TOKEN manquants dans .env\n" +
        "  Voir docs/team/trello.md — section « Création / synchronisation du board »."
    );
    process.exit(1);
  }

  const data = JSON.parse(readFileSync(join(__dirname, "sprint-data.json"), "utf8"));
  const LIST_ORDER = ["BACKLOG", "READY", "IN PROGRESS", "BLOCKED", "IN REVIEW", "QA", "DONE"];

  // 1. Board (idempotent par nom)
  const member = await trello("/members/me");
  let board = (await trello(`/members/me/boards`, { fields: "name" })).find(
    (b) => b.name === data.boardName && !b.closed,
  );
  if (!board) {
    board = await trello("/boards", { name: data.boardName, defaultLists: "false" }, "POST");
    console.log(`✓ Board créé : ${board.name} (${board.shortUrl})`);
  } else {
    console.log(`✓ Board existant : ${board.name} (${board.shortUrl})`);
  }

  // 2. Labels
  const existingLabels = await trello(`/boards/${board.id}/labels`, { fields: "name", limit: 50 });
  const labelIds = {};
  for (const name of data.labels) {
    let label = existingLabels.find((l) => l.name === name);
    if (!label) label = await trello(`/labels`, { name, color: "black", idBoard: board.id }, "POST");
    labelIds[name] = label.id;
  }
  console.log(`✓ ${data.labels.length} labels prêts`);

  // 3. Listes (dans l'ordre des gates)
  const existingLists = await trello(`/boards/${board.id}/lists`, { fields: "name" });
  const listIds = {};
  for (const name of LIST_ORDER) {
    let list = existingLists.find((l) => l.name === name && !l.closed);
    if (!list) list = await trello(`/lists`, { name, idBoard: board.id }, "POST");
    listIds[name] = list.id;
  }
  console.log(`✓ ${LIST_ORDER.length} listes prêtes`);

  // 4. Cartes : tâches (positions calculées, top de liste par gate suivante)
  //    Les tâches d'une même story entrent dans la liste = statut de la story.
  let created = 0;
  for (const story of data.stories) {
    const targetList = listIds[story.status] ?? listIds["BACKLOG"];
    const cards = await trello(`/lists/${targetList}/cards`, { fields: "name" });
    for (const [i, task] of story.tasks.entries()) {
      const cardName = `${task.id} — ${task.title}`;
      if (cards.some((c) => c.name === cardName)) continue;
      const deps = task.dependencies.length
        ? `\n\nDépendances : ${task.dependencies.join(", ")}`
        : "";
      const description =
        `Story : ${story.id} — ${story.title} (${data.sprint})\n` +
        `Owner : ${task.owner}\n` +
        `Story Owner : ${story.owner}${deps}\n\n` +
        `Acceptance Criteria (story) :\n` +
        story.acceptanceCriteria.map((ac) => `- [ ] ${ac}`).join("\n") +
        `\n\nSource : docs/backlog/sprint-01.md`;
      await trello(
        `/cards`,
        {
          idList: targetList,
          name: cardName,
          desc: description,
          pos: i, // ordre stable : ordre des tâches dans la story
          idLabels: labelIds[task.owner] ?? "",
        },
        "POST",
      );
      created++;
      await sleep(80); // politesse API (rate limit)
    }
  }
  console.log(
    created === 0
      ? `✓ Aucune carte à créer — board déjà à jour`
      : `✓ ${created} carte(s) créée(s) dans les listes « ${[...new Set(data.stories.map((s) => s.status))].join(" », « ")} »`,
  );
  console.log(`\n→ ${board.shortUrl}`);
}

main().catch((err) => {
  console.error(`✗ ${err.message}`);
  process.exit(1);
});
