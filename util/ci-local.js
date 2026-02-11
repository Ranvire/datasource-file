'use strict';

const { execSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

function runStep(label, command) {
  console.log(`\n==> ${label}`);
  execSync(command, { stdio: 'inherit' });
}

console.log('ci:local mirrors .github/workflows/ci.yml');

// CI: Install dependencies
runStep('Install dependencies', 'npm ci');

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
