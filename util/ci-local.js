'use strict';

const { execSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

function runStep(label, command) {
  console.log(`\n==> ${label}`);
  execSync(command, { stdio: 'inherit' });
}

console.log('ci:local mirrors .github/workflows/ci.yml');

// CI: Checkout (SKIPPED)
// Not applicable for local runs; the repo is already present on disk.

// CI: Setup Node
const nodeMajor = Number.parseInt(process.versions.node.split('.')[0], 10);
if (nodeMajor !== 22) {
  throw new Error(`Expected Node.js 22.x, found ${process.versions.node}.`);
}

// CI: Install dependencies
runStep('Install dependencies', 'npm ci --include=dev');

// CI: Run tests
runStep('Run tests', 'npm test');

// CI: Run lint
runStep('Run lint', 'npm run lint');

// CI: Run npm audit
fs.mkdirSync(path.join(__dirname, '..', 'artifacts'), { recursive: true });
runStep(
  'Run npm audit',
  'npm audit --audit-level=high --json > artifacts/npm-audit.json'
);

// CI: Upload npm audit report (SKIPPED)
// Not applicable for local runs; the report is written to artifacts/npm-audit.json.
