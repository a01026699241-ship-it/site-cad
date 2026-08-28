# APK / 앱 빌드 가이드

`index.html` 은 그대로 두고 **Capacitor** 로 감싸서 설치형 APK 를 만듭니다.
웹 자산(`index.html`, `manifest.webmanifest`, `icon.svg`)이 APK 안에 들어가므로 **완전 오프라인** 으로 동작합니다.

---

## 경로 1 — GitHub Actions 자동 빌드 (내 PC에 아무것도 설치 안 함) ★추천

1. **GitHub 저장소 생성** 후 `site-cad` 폴더 내용을 전부 push
   ```
   cd site-cad
   git init
   git add .
   git commit -m "site-cad"
   git branch -M main
   git remote add origin https://github.com/<아이디>/site-cad.git
   git push -u origin main
   ```
2. push 되면 `.github/workflows/android.yml` 이 자동 실행됩니다.
   저장소 → **Actions** 탭 → "Build Android APK" 실행 확인 (약 3~5분)
3. 완료되면 APK 를 받는 곳 2군데:
   - 해당 실행 페이지 하단 **Artifacts → `sitecad-debug-apk`** (zip)
   - 저장소 → **Releases → 최신 APK (자동 빌드)** 의 `app-debug.apk`
4. `app-debug.apk` 를 휴대폰으로 보내 설치 (아래 "APK 설치" 참고)

> 이후엔 `index.html` 만 고쳐서 push 하면 APK 가 자동으로 다시 빌드됩니다.

권한 오류로 Release 생성이 안 되면: 저장소 **Settings → Actions → General → Workflow permissions → Read and write** 로 변경.

---

## 경로 2 — 내 PC에서 로컬 빌드

**필요:** Node 18+ , JDK 17 , Android Studio(또는 Android SDK + 플랫폼 도구)

```
cd site-cad
npm install
npm run build:android      # DWG엔진 받기 → www/ 복사 → android/ 생성 → 디버그 APK
```
결과: `site-cad/android/app/build/outputs/apk/debug/app-debug.apk`

Android Studio 에서 열어 빌드/서명하려면:
```
npm run fetch-dwg-engine   # DWG 오프라인 열기용 (약 8.8MB, 1회)
npm run copy
npx cap add android
npm run open:android
```

> `npm run fetch-dwg-engine` 를 건너뛰면 APK 는 정상 빌드되지만,
> **오프라인에서 DWG 열기가 안 됩니다**(온라인이면 CDN 엔진으로 열림).
> GitHub Actions 워크플로에는 이 단계가 이미 들어 있습니다.
> LibreDWG 는 GPL-3.0 → 공개 배포 시 THIRD-PARTY.md 참고.

---

## 경로 3 — PWABuilder (Node/Android Studio 불필요, 사이트 호스팅만)

1. `index.html`, `manifest.webmanifest`, `icon.svg` 를 GitHub Pages 등에 호스팅
2. <https://www.pwabuilder.com> 접속 → 그 주소 입력
3. **Android → Generate Package** → 서명된 `.apk` / `.aab` 다운로드
   - `.apk` : 폰에 바로 설치
   - `.aab` : Play Console 업로드용 (개발자 등록 1회 $25)

> PWABuilder 로 만든 APK 는 사이트를 감싸는 방식(TWA)이라, 완전 오프라인 동작은
> 경로 1·2(Capacitor, 자산 내장) 가 유리합니다.

---

## APK 설치 (사이드로드)

1. `app-debug.apk` 를 카톡/메일/USB 로 휴대폰에 전송
2. 파일 탭 → 실행 → "출처를 알 수 없는 앱 설치 허용" 한 번 승인
3. 설치 완료 → 홈 화면에 **현장도면** 아이콘

> 디버그 APK 는 자동 빌드마다 서명이 달라질 수 있어, 재설치 시 기존 앱을
> 먼저 삭제해야 할 수 있습니다. 안정 배포가 필요하면 고정 keystore 로 서명하세요
> (Play 배포 시 필수, 아래 참고).

---

## iOS

프레임워크와 무관하게 **Mac + Xcode + Apple Developer 계정($99/년)** 이 있어야 아이폰에 올라갑니다(애플 정책).

- 무료: 사파리 → 공유 → **홈 화면에 추가** (지금도 앱처럼 실행됨)
- 빌드가 필요하면 Mac 에서:
  ```
  npm install
  npm run copy
  npx cap add ios
  npx cap open ios      # Xcode 에서 서명 후 실기기 빌드
  ```

---

## Play 스토어 배포용 서명 (선택)

디버그 APK 는 테스트용입니다. 스토어에 올리려면 고정 keystore 로 서명한 **AAB** 가 필요합니다.

```
keytool -genkey -v -keystore sitecad.keystore -alias sitecad \
  -keyalg RSA -keysize 2048 -validity 10000
```
`android/app/build.gradle` 의 `signingConfigs` 에 keystore 를 연결하고
`./gradlew bundleRelease` → `app/build/outputs/bundle/release/app-release.aab` 업로드.

CI 에서 자동 서명하려면 keystore 를 base64 로 GitHub Secret 에 저장하고
워크플로에서 복원해 `bundleRelease` 를 실행하도록 확장하면 됩니다.
