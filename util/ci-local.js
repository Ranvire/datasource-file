'use strict';

const { execSync } = require('node:child_process');

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
