# 현장도면 뷰어 (DWG / DXF)

휴대폰(안드로이드·아이폰)에 **설치해서 앱처럼 쓰는** 현장 도면 뷰어입니다.
빌드 도구·앱스토어 심사 없이, HTML 파일 하나로 동작합니다. (`index.html`)

---

## 지금 바로 테스트 (PC)

`index.html` 을 크롬/엣지로 열고 → 상단 **예제** 버튼.
확대·축소(휠), 이동(드래그), 거리/면적/마킹 툴을 바로 확인할 수 있습니다.
`.dxf` 파일을 창에 드래그해서 열어볼 수도 있습니다.

> DXF 는 파일을 더블클릭해 열어도 동작합니다.
> **DWG 는 웹서버(호스팅)나 앱(APK)에서만** 열립니다 — 브라우저가 `file://` 에서는
> 엔진 모듈 로딩을 막기 때문입니다. 로컬에서 DWG 테스트하려면
> `npx serve site-cad` 같은 간단한 서버로 열어보세요.

---

## 휴대폰에 앱으로 설치하기

브라우저에서 접속할 주소가 하나 필요합니다. 셋 중 편한 방법:

### 방법 A. GitHub Pages (무료, 추천 — 일보 AI와 같은 방식)
1. 새 저장소 생성 → `index.html` 업로드
2. Settings → Pages → Branch `main` / `/root` 저장
3. 몇 분 뒤 `https://<아이디>.github.io/<저장소>/` 접속

### 방법 B. Netlify Drop (무료, 가입 최소)
`https://app.netlify.com/drop` 에 `site-cad` 폴더를 드래그 → 나오는 주소 사용

### 방법 C. 사내 웹서버 / NAS
`index.html` 을 정적 호스팅 후 그 주소 사용

### 설치
- **안드로이드(크롬)**: 접속 → 상단 배너 **설치**, 또는 메뉴(⋮) → *앱 설치 / 홈 화면에 추가*
- **아이폰(사파리)**: 접속 → 공유 버튼 → *홈 화면에 추가*

설치 후에는 홈 화면 아이콘으로 전체화면 실행되고, 한 번 연 뒤에는 오프라인(현장 통신 불량)에서도 열립니다.

---

## 도면 파일 여는 법

앱에서 **📂 도면 열기** → 파일앱 / 카카오톡 저장함 / 메일 첨부에서 선택.

- **DXF (.dxf)** : 즉시 열립니다.
- **DWG (.dwg)** : **그대로 열립니다.** 앱에 내장된 LibreDWG(WASM) 엔진이
  내부에서 DXF 로 변환해 표시합니다. 최초 1회는 엔진 로딩으로 10~30초 걸리고,
  이후에는 빠릅니다.

지원 객체 — LINE, LWPOLYLINE/POLYLINE(호 bulge 포함), CIRCLE, ARC, ELLIPSE,
SPLINE(근사), TEXT, MTEXT, POINT, 3DFACE/SOLID, LEADER, INSERT(블록 1단계 전개)

### DWG 엔진이 로드되는 순서
1. 앱에 포함된 `vendor/libredwg/libredwg-web.js` (오프라인 가능)
2. 없으면 온라인에서 CDN(jsDelivr)의 엔진
3. 둘 다 안 되면(오프라인 + 미포함) "DXF 로 변환" 안내 표시

APK/오프라인에서도 DWG 를 열려면 빌드 때 엔진을 포함해야 합니다 →
`npm run fetch-dwg-engine` (BUILD.md, GitHub Actions 워크플로에는 이미 포함됨).

> **라이선스 주의**: LibreDWG 는 GPL-3.0 입니다. 이 엔진을 포함해 앱을
> **공개 배포**하면 앱 전체가 GPL-3.0 조건(소스 공개)을 따릅니다.
> 개인/사내 현장용은 무방. 자세한 내용과 회피법은 [THIRD-PARTY.md](THIRD-PARTY.md).

DWG 가 안 열릴 때의 확실한 대안: PC에서 무료 **ODA File Converter**(opendesign.com →
Guest) 로 DXF 변환, 또는 AutoCAD *다른 이름으로 저장 → DXF*.

---

## 기능

| 구분 | 내용 |
|---|---|
| 파일 | **DWG · DXF 직접 열기** (DWG 는 내장 LibreDWG WASM 엔진이 자동 변환) |
| 보기 | 손가락 확대/축소/이동, 두 손가락 핀치, 휠 줌, **전체 맞춤** |
| 레이어 | 목록 표시, 색상 스와치, 개별 ON/OFF, 전체 ON/OFF |
| 측정 | **거리**(2점), **면적**(다각형, 평 환산·둘레 표시) |
| 단위 | INSUNITS 자동 감지 + 수동 축척(도면단위→m) 조정 |
| 마킹 | 도면 위 지적/메모 핀, 목록·이동·수정·삭제, 기기에 자동 저장(파일별) |
| **도면 비교** | 개정 전/후 DXF 2장 중첩 → **추가(초록) / 삭제(빨강) / 동일(회색)** 색 구분, 개수 표시, 항목별 켜기·끄기 |
| 내보내기 | 화면 캡처 PNG, 마킹 JSON |
| 도면 배경 | 밝게/어둡게 전환 (현장 햇빛 / 실내) |

### 도면 비교 사용법
1. 툴바 **⇄ 비교** → A(기존) / B(개정) DXF 각각 선택 (현재 열려있는 도면이 자동으로 A)
2. **스냅 반올림** = 같은 위치·형상으로 볼 허용오차 (mm 도면이면 1~5)
3. 기준점이 어긋나면 **B 위치 보정 X/Y** 로 맞춤 (보통 0)
4. **비교 실행** → 상단 칩으로 추가/삭제/동일 표시 토글, **✕ 종료** 로 원래 보기 복귀

판정은 형상 기준입니다(선·원·문자 위치). 레이어만 바뀐 경우는 "동일"로 봅니다.
호(arc)·폴리라인은 점 집합으로 비교하므로, 세그먼트 분할이 크게 달라진 도면은 오차가 생길 수 있습니다.

마킹은 브라우저 저장소에 파일 이름+크기 기준으로 저장됩니다. 같은 도면을 다시 열면 마킹이 그대로 보입니다.

---

## 진짜 APK / iOS 앱으로 만들기

Capacitor 패키징 세팅을 넣어놨습니다. **자세한 단계는 [BUILD.md](BUILD.md).**

- **가장 쉬움 — GitHub Actions 자동 빌드**: 이 폴더를 GitHub 저장소에 push 하면
  `.github/workflows/android.yml` 이 돌아 **APK 를 자동으로 빌드**합니다. Actions 탭이나
  Releases 에서 `app-debug.apk` 를 받아 폰에 설치. 내 PC엔 아무것도 안 깔아도 됩니다.
- **로컬 빌드**: `npm install && npm run build:android` (Node 18+, JDK 17, Android SDK 필요)
- **PWABuilder**: 사이트만 호스팅하면 브라우저에서 서명된 APK/AAB 생성 (BUILD.md 경로 3)
- **iOS**: 아이폰 실기기 설치는 프레임워크 무관하게 Mac + Apple Developer($99/년) 필요(애플 정책).
  무료로는 사파리 → 공유 → 홈 화면에 추가.

웹 자산이 APK 안에 포함되므로(Capacitor) 설치 후 **완전 오프라인** 동작합니다.
기능 수정은 `index.html` 만 고쳐서 다시 push/빌드 하면 됩니다.

---

## 다음 단계 (로드맵)

1. ~~도면 중첩 비교~~ — ✅ 완료 (툴바 ⇄ 비교)
2. ~~DWG 직접 열기~~ — ✅ 완료 (LibreDWG WASM 내장, GPL 주의 → THIRD-PARTY.md)
3. 비교 결과에서 변경 지점 자동 마킹 → 검측/일보 연계
4. 검측 체크리스트 · 사진 첨부를 마킹에 연결
5. 마킹/측정 결과를 일보(일일보고) 양식으로 내보내기

---

## 파일 구조

```
site-cad/
├─ index.html                 ← 앱 전체 (로직·화면 모두 여기)
├─ manifest.webmanifest       ← 설치용 메타데이터
├─ icon.svg                   ← 앱 아이콘
├─ README.md
├─ BUILD.md                   ← APK/iOS 빌드 단계별 가이드
├─ THIRD-PARTY.md             ← LibreDWG(GPL) 라이선스 주의
├─ package.json               ← Capacitor 패키징
├─ capacitor.config.json
├─ scripts/
│  ├─ fetch-dwg-engine.mjs    ← DWG 엔진(LibreDWG wasm) 내려받기
│  ├─ copy-web.mjs            ← www/ 생성
│  └─ gradle.mjs
├─ .github/workflows/android.yml  ← push 하면 APK 자동 빌드
└─ vendor/                    ← (빌드 시 생성) DWG 엔진, .gitignore
```

기능 수정은 `index.html` 한 파일만 고치면 됩니다.
웹으로 호스팅할 때는 `index.html`, `manifest.webmanifest`, `icon.svg` 를 같은 폴더에 올리세요.
PC에서 그냥 열어 볼 때는 `index.html` 만 더블클릭해도 뷰어는 동작합니다(설치 메타데이터만 비활성).
`www/`, `android/`, `node_modules/` 는 빌드 시 생성되며 `.gitignore` 처리되어 있습니다.
