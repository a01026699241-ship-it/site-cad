// 웹 자산(index.html 등)을 Capacitor 가 읽는 www/ 로 복사한다.
// 원본은 프로젝트 루트에 그대로 두고(=PC/호스팅용), www/ 는 빌드시 재생성한다.
import { mkdirSync, copyFileSync, cpSync, rmSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const FILES = ['index.html', 'manifest.webmanifest', 'icon.svg'];

const www = join(root, 'www');
rmSync(www, { recursive: true, force: true });
mkdirSync(www, { recursive: true });

for (const f of FILES) {
  const src = join(root, f);
  if (!existsSync(src)) {
    console.error(`! 원본 없음: ${f}`);
    process.exit(1);
  }
  copyFileSync(src, join(www, f));
}

// DWG 엔진(있으면) 포함 → 오프라인 DWG 열기
const vendor = join(root, 'vendor');
if (existsSync(vendor)) {
  cpSync(vendor, join(www, 'vendor'), { recursive: true });
  console.log('vendor/ 포함됨 (DWG 오프라인 지원)');
} else {
  console.log('vendor/ 없음 → DWG 는 온라인 시 CDN 엔진으로 열림 (오프라인 DWG 원하면 `npm run fetch-dwg-engine`)');
}

console.log(`www/ 생성 완료: ${FILES.join(', ')}`);
