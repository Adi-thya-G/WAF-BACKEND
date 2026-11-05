// SINGLE-FILE BUG FIXTURE for scanner tests. All secrets are FAKE. Never deploy.
import express from "express";
import { db } from "./db";
const router = express.Router();

// BUG 1: SQL injection (CWE-89): input concatenated into SQL. Expect SonarQube + Semgrep.
router.get("/user", async (req, res) => {
  const id = req.query.id;
  const query = "SELECT * FROM users WHERE id=" + id;
  res.json(await db.query(query));
});

// BUG 2: reflected XSS (CWE-79): query param written into HTML. Expect Semgrep + SonarQube.
router.get("/hello", (req, res) => {
  res.send("<h1>Hello " + req.query.name + "</h1>");
});

// BUG 3: hard-coded credential (CWE-798), FAKE key. Expect Gitleaks.
export const API_SECRET = "x7Kq9Zp2LmV4tR8bN3wY6cH1dF5gJ0sA";

export default router;
