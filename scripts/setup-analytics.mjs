#!/usr/bin/env node
/**
 * 一键完成埋点环境配�? */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { execSync } from 'node:child_process';

const root = resolve(import.meta.dirname, '..');
const WEBHOOK_UUID = '16afb4a2-3919-4805-bb4f-5928d9dc2585';
const ENDPOINT = `https://webhook.site/${WEBHOOK_UUID}`;
const VIEWER = `https://webhook.site/#!/${WEBHOOK_UUID}`;

const envLocal = `# �?npm run analytics:setup 生成
VITE_ANALYTICS_ENDPOINT=${ENDPOINT}
`;

writeFileSync(resolve(root, '.env.local'), envLocal, 'utf8');

console.log('');
console.log('�?埋点已配置完�?);
console.log('');
console.log('用户界面上：无任何变化（完全看不见）');
console.log('');
console.log('你看数据�?);
console.log(`  实时事件�?�?${VIEWER}`);
console.log('  本机调试   �?打开网站后在地址栏加 #pa-data');
console.log('');

const envLocalPath = resolve(root, '.env.local');
const key = process.env.VITE_POSTHOG_KEY?.trim();
if (key?.startsWith('phc_')) {
  try {
    execSync(`gh secret set VITE_POSTHOG_KEY --body "${key}"`, { stdio: 'inherit', cwd: root });
    console.log('�?GitHub Secret VITE_POSTHOG_KEY 已更�?);
  } catch {
    console.log('⚠️  GitHub Secret 未写入（可手动在仓库 Settings �?Secrets 配置�?);
  }
}

console.log('下一步：npm run dev �?随便点点 �?打开上方「实时事件流」链接看数据');
console.log('');
