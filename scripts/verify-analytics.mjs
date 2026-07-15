#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const WEBHOOK = '16afb4a2-3919-4805-bb4f-5928d9dc2585';
const VIEWER = `https://webhook.site/#!/${WEBHOOK}`;

function readEnv(file) {
  if (!existsSync(file)) return '';
  return readFileSync(file, 'utf8');
}

const prod = readEnv(resolve(root, '.env.production'));
const local = readEnv(resolve(root, '.env.local'));
const hasEndpoint = prod.includes('VITE_ANALYTICS_ENDPOINT') || local.includes('VITE_ANALYTICS_ENDPOINT');
const hasPosthog = (prod + local)
  .split('\n')
  .some((line) => /^VITE_POSTHOG_KEY=phc_/.test(line.trim()));

console.log('');
console.log('职前动物�?· 埋点状�?);
console.log('────────────────────────');

if (hasEndpoint || hasPosthog) {
  console.log('�?埋点已启用（用户无感知）');
  if (hasEndpoint) {
    console.log(`   实时事件�?�?${VIEWER}`);
  }
  if (hasPosthog) console.log('   PostHog 已配�?);
} else {
  console.log('�?未配置，运行：npm run analytics:setup');
}

console.log('   本机调试�?�?网站地址 + #pa-data');
console.log('');
