/**
 * Fetch a pinned or movable revision of kamyu104/LeetCode-Solutions.
 * ALGOFORGE_UPSTREAM_REF may be a branch, tag, or commit SHA.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { RAW, DATA } from "./paths";

const REPO = "https://github.com/kamyu104/LeetCode-Solutions.git";
const UPSTREAM_REF = process.env.ALGOFORGE_UPSTREAM_REF ?? "4351f2d3e00b32787c2c5c4763395f681dc723df";

function git(args: string[], cwd = RAW): string {
  return execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] }).trim();
}

function main() {
  const parent = path.dirname(RAW);
  fs.mkdirSync(parent, { recursive: true });

  if (!fs.existsSync(path.join(RAW, ".git"))) {
    if (fs.existsSync(RAW)) fs.rmSync(RAW, { recursive: true, force: true });
    fs.mkdirSync(RAW, { recursive: true });
    console.log(`Initializing upstream checkout at ${UPSTREAM_REF}…`);
    git(["init"], RAW);
    git(["remote", "add", "origin", REPO], RAW);
  }

  console.log(`Fetching upstream revision ${UPSTREAM_REF}…`);
  git(["fetch", "--depth", "1", "origin", UPSTREAM_REF], RAW);
  git(["checkout", "--detach", "FETCH_HEAD"], RAW);
  const commit = git(["rev-parse", "HEAD"], RAW);

  fs.writeFileSync(
    path.join(DATA, "raw", "fetch-meta.json"),
    JSON.stringify({ fetchedAt: new Date().toISOString(), repo: REPO, requestedRef: UPSTREAM_REF, commit }, null, 2),
  );
  console.log(`Fetch complete: ${commit}`);
}

main();
