// DWG 직접 열기용 LibreDWG(WASM) 번들을 vendor/ 로 내려받는다.
// 이 파일 하나(약 8.8MB, wasm base64 내장)면 오프라인 DWG 열기가 된다.
//
// 라이선스 주의: LibreDWG 는 GPL-3.0-or-later. 이 번들을 포함해 앱을 "배포"하면
// 앱 전체가 GPL-3.0 조건을 따르며 소스 공개 의무가 생긴다. 개인/사내 현장용은 무방.
// (자세히: THIRD-PARTY.md)

import { mkdirSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const VER = '0.7.3';
const URLS = [
  `https://cdn.jsdelivr.net/npm/@mlightcad/libredwg-web@${VER}/dist/libredwg-web.js`,
  `https://unpkg.com/@mlightcad/libredwg-web@${VER}/dist/libredwg-web.js`
];

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'vendor', 'libredwg');
const outFile = join(outDir, 'libredwg-web.js');

if (existsSync(outFile) && statSync(outFile).size > 1_000_000 && !process.argv.includes('--force')) {
  console.log(`이미 있음: vendor/libredwg/libredwg-web.js (${(statSync(outFile).size / 1e6).toFixed(1)} MB) — --force 로 재다운로드`);
  process.exit(0);
}

mkdirSync(outDir, { recursive: true });

let lastErr;
for (const url of URLS) {
  try {
    process.stdout.write(`내려받는 중: ${url}\n`);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 1_000_000) throw new Error(`파일이 너무 작습니다 (${buf.length} bytes)`);
    writeFileSync(outFile, buf);
    console.log(`완료: vendor/libredwg/libredwg-web.js (${(buf.length / 1e6).toFixed(1)} MB)`);
    process.exit(0);
  } catch (e) {
    lastErr = e;
    console.warn(`  실패: ${e.message}`);
  }
}
console.error('DWG 엔진 다운로드 실패. 네트워크 확인 후 다시 실행하세요.');
console.error(String(lastErr));
process.exit(1);
