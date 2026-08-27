// android/ 프로젝트에서 gradlew 를 OS에 맞게 실행한다. (Windows: gradlew.bat)
import { spawnSync, execSync } from 'node:child_process';
import { existsSync, chmodSync } from 'node:fs';
import { join } from 'node:path';

const androidDir = join(process.cwd(), 'android');
if (!existsSync(androidDir)) {
  console.error('! android/ 폴더가 없습니다. 먼저 `npx cap add android` 를 실행하세요.');
  process.exit(1);
}

const isWin = process.platform === 'win32';
const cmd = isWin ? 'gradlew.bat' : './gradlew';
if (!isWin) {
  try { chmodSync(join(androidDir, 'gradlew'), 0o755); } catch {}
}

const args = process.argv.slice(2).length ? process.argv.slice(2) : ['assembleDebug'];
const res = spawnSync(cmd, args, { cwd: androidDir, stdio: 'inherit', shell: isWin });
if (res.status !== 0) process.exit(res.status ?? 1);

const apk = join(androidDir, 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk');
if (existsSync(apk)) console.log(`\n✅ APK: ${apk}`);
