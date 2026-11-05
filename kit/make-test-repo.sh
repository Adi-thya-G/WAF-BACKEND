#!/usr/bin/env bash
# Builds a tiny vulnerable repo with a KNOWN history, to test the RCA pipeline.
# Usage: ./make-test-repo.sh ./bug-repo
# All secrets below are FAKE. Never deploy this code.
set -euo pipefail
DIR="${1:-./bug-repo}"; rm -rf "$DIR"; mkdir -p "$DIR/src/gen"; cd "$DIR"
git init -q -b main
c() { GIT_AUTHOR_NAME="$1" GIT_AUTHOR_EMAIL="$1@test.dev" GIT_COMMITTER_NAME="$1" GIT_COMMITTER_EMAIL="$1@test.dev" \
      GIT_AUTHOR_DATE="$2" GIT_COMMITTER_DATE="$2" git commit -q -m "$3"; }
# C0: scaffold (60 harmless files, so a later bulk commit can touch them)
echo "# bug-repo (test fixture)" > README.md
for i in $(seq -w 1 60); do echo "export const v$i = $((10#$i));" > "src/gen/file$i.ts"; done
git add -A ;   c dev.rao 2026-10-01T10:00:00 "initial scaffold"; git tag c0
# C1: SQL injection introduced (TRUE introducer of defect "sqli")
cat > src/db.ts <<'EOF'
export const db = { query: async (_q: string) => [] as any[] };
EOF
cat > src/userController.ts <<'EOF'
import express from "express";
import { db } from "./db";
const router = express.Router();

// BUG 1: SQL injection (CWE-89). User input is concatenated into the query.
router.get("/user", async (req, res) => {
  const id = req.query.id;
  const query = "SELECT * FROM users WHERE id=" + id;
  const rows = await db.query(query);
  res.json(rows);
});

export default router;
EOF
git add -A; c dev.rao 2026-10-02T10:00:00 "add user lookup endpoint"; git tag c1

# C2: vulnerable dependencies (TRUE introducer of defect "deps")
cat > package.json <<'EOF'
{
  "name": "bug-repo",
  "version": "1.0.0",
  "dependencies": {
    "express": "4.19.2",
    "lodash": "4.17.15",
    "minimist": "1.2.5"
  }
}
EOF
git add -A; c dev.iyer 2026-10-03T10:00:00 "add lodash and minimist deps"; git tag c2

# C3: reflected XSS introduced (TRUE introducer of defect "xss")
cat > src/render.ts <<'EOF'
import express from "express";
const router = express.Router();

// BUG 2: reflected XSS (CWE-79). Query param is written into HTML unescaped.
router.get("/hello", (req, res) => {
  res.send('<h1>Hello ' + req.query.name + '</h1>');
});

export default router;
EOF
git add -A; c dev.mehta 2026-10-04T10:00:00 "render profile html"; git tag c3

# C4: hard-coded secret (FAKE secret; TRUE introducer of defect "secret")
cat > src/config.ts <<'EOF'
// BUG 3: hard-coded credential (CWE-798). This key is FAKE.
export const API_SECRET = "x7Kq9Zp2LmV4tR8bN3wY6cH1dF5gJ0sA";
EOF
git add -A; c dev.rao 2026-10-05T10:00:00 "add api secret config"; git tag c4

# C5: NOISE. Prettier-style reformat touching the buggy lines + 60 other files.
sed -i 's/WHERE id=" + id/WHERE id = " + id/' src/userController.ts
sed -i "s/'<h1>Hello ' + req.query.name + '<\/h1>'/\"<h1>Hello \" + req.query.name + \"<\/h1>\"/" src/render.ts
for f in src/gen/*.ts; do echo "// formatted" >> "$f"; done
git add -A; c bot.fmt 2026-10-20T10:00:00 "chore: reformat with prettier"; git tag c5

# C6: unrelated change
cat > src/health.ts <<'EOF'
export const health = () => ({ ok: true });
EOF
git add -A; c dev.mehta 2026-10-21T10:00:00 "add health endpoint"; git tag c6

# Ground truth for metrics (purity, top-1 commit accuracy)
cat > ground_truth.json <<EOF
{
  "defects": [
    { "id": "sqli",   "file": "src/userController.ts", "line": $(grep -n 'SELECT' src/userController.ts | cut -d: -f1), "true_commit": "$(git rev-parse c1)", "expected_tools": ["sonarqube","semgrep"] },
    { "id": "deps",   "file": "package.json",          "line": $(grep -n 'lodash' package.json | cut -d: -f1),            "true_commit": "$(git rev-parse c2)", "expected_tools": ["trivy"] },
    { "id": "xss",    "file": "src/render.ts",         "line": $(grep -n 'Hello' src/render.ts | cut -d: -f1),            "true_commit": "$(git rev-parse c3)", "expected_tools": ["semgrep","sonarqube"] },
    { "id": "secret", "file": "src/config.ts",         "line": 2,                                                         "true_commit": "$(git rev-parse c4)", "expected_tools": ["gitleaks"] }
  ],
  "noise_commit": "$(git rev-parse c5)"
}
EOF
git add ground_truth.json; c dev.rao 2026-10-22T10:00:00 "add ground truth"
echo "Built $DIR"; git log --oneline
