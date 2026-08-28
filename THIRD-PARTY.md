# 서드파티 구성요소 / 라이선스

## LibreDWG (DWG 직접 열기 엔진)

- 패키지: `@mlightcad/libredwg-web` (LibreDWG 를 WebAssembly 로 빌드)
- 원본: GNU LibreDWG — <https://www.gnu.org/software/libredwg/>
- 라이선스: **GPL-3.0-or-later**
- 이 저장소에는 포함돼 있지 않고, 빌드 시 `npm run fetch-dwg-engine` 이
  `vendor/libredwg/libredwg-web.js` 로 내려받습니다. (`.gitignore` 처리됨)

### 중요 — 배포 시 의무
GPL-3.0 코드를 포함한 채로 앱(APK/웹/IPA)을 **제3자에게 배포**하면,
그 앱 전체가 GPL-3.0 조건을 따르게 되며 **대응 소스코드를 제공**해야 합니다.

- 본인/사내 현장에서만 사용 → 사실상 문제 없음
- Google Play 등 공개 배포 → 앱을 GPL-3.0 으로 공개하거나,
  DWG 엔진을 빼고(자동으로 DXF 변환 안내 화면으로 fallback) 배포

### DWG 엔진 없이 빌드하려면
`vendor/` 를 만들지 않고 빌드하면 됩니다.
- 온라인 상태에서는 앱이 CDN(jsDelivr)에서 엔진을 받아 DWG 를 엽니다.
- 오프라인에서는 DWG 열기가 비활성화되고 "DXF 로 변환" 안내가 표시됩니다.
- 이 경우 배포물 자체에는 GPL 코드가 포함되지 않습니다.

## 그 외

- 앱 본문(`index.html`)의 DXF 파서·렌더러·측정·비교 기능은 자체 구현이며
  외부 런타임 의존성이 없습니다.
- Capacitor (`@capacitor/*`): MIT 라이선스.
