# Bug test kit for the RCA pipeline

`make-test-repo.sh` builds a tiny repo with a KNOWN history so you can check every stage.

    ./make-test-repo.sh ./bug-repo      # then push it to GitHub and let your pipeline scan i
## Planted defects (ground truth in `ground_truth.json`)v
| Defect | File | Introduced by | Expected scanners |    
|---|---|---|---|
| SQL injection (CWE-89) | src/userController.ts:8 | `add user lookup endpoint` | SonarQube, Semgrep |
| Vulnerable deps (lodash 4.17.15, minimist 1.2.5) | package.json | `add lodash and minimist deps` | Trivy |
| Reflected XSS (CWE-79) | src/render.ts:6 | `render profile html` | Semgrep, SonarQube |
| Hard-coded FAKE API secret (CWE-798) | src/config.ts:2 | `add api secret config` | Gitleaks |

## The trap

Commit `chore: reformat with prettier` rewrites the SQLi and XSS lines and touches 62 files.
`git blame` points at it for both. The correct answer is the original commit.

## What a correct pipeline should output

- 4 root-cause groups from about 6 to 8 raw findings (SQLi pair, XSS, secret, deps pair)
- SQLi group top commit = `add user lookup endpoint`; the reformat commit ranks last
- Nothing ranked at 100%; the reformat commit should be near 0%
- Verified here: `git blame` returns the reformat commit; `git log -L` with noise skipping returns the true introducer (3 of 3 traced defects)

## Metrics to report

Cluster purity (4 groups vs ground truth), top-1 and top-3 commit accuracy, alert-count reduction.
