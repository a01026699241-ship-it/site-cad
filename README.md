# 현장도면 뷰어 (DWG / DXF)

휴대폰(안드로이드·아이폰)에 **설치해서 앱처럼 쓰는** 현장 도면 뷰어입니다.
빌드 도구·앱스토어 심사 없이, HTML 파일 하나로 동작합니다. (`index.html`)

---

## 지금 바로 테스트 (PC)

`index.html` 을 크롬/엣지로 열고 → 상단 **예제** 버튼.
확대·축소(휠), 이동(드래그), 거리/면적/마킹 툴을 바로 확인할 수 있습니다.
`.dxf` 파일을 창에 드래그해서 열어볼 수도 있습니다.

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

- **DXF (.dxf)** : 바로 열립니다. 지원 객체 — LINE, LWPOLYLINE/POLYLINE(호 bulge 포함), CIRCLE, ARC, ELLIPSE, SPLINE(근사), TEXT, MTEXT, POINT, 3DFACE/SOLID, LEADER, INSERT(블록 1단계 전개)
- **DWG (.dwg)** : 아래 참고

---

## DWG 파일은 왜 바로 안 열리나

DWG는 Autodesk 폐쇄 포맷이라, 어떤 앱이든 DWG를 직접 파싱하려면 상용 CAD 엔진(ODA Drawings SDK 등) 라이선스가 필요합니다. 개인 개발자 기준 연 수천 달러라 현실적으로 탑재가 어렵습니다. (이건 Flutter/네이티브 앱으로 만들어도 동일한 벽입니다.)

**해결 — DWG를 DXF로 한 번 변환하면 끝 (약 1분):**

1. PC에 무료 **ODA File Converter** 설치
   `opendesign.com` → Guest 로그인 → *ODA File Converter* 다운로드
2. 실행 → Input folder = DWG 폴더 지정
3. Output version 아무거나, **Output file type = DXF** 선택 → *Convert*
4. 만들어진 `.dxf` 를 휴대폰으로 보내 앱에서 열기

AutoCAD가 있으면 *다른 이름으로 저장 → DXF* 로도 됩니다.
본사/설계에서 도면을 받을 때 아예 DXF도 같이 달라고 하면 이 과정도 생략됩니다.

---

## 기능

| 구분 | 내용 |
|---|---|
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
2. 비교 결과에서 변경 지점 자동 마킹 → 검측/일보 연계
3. 검측 체크리스트 · 사진 첨부를 마킹에 연결
4. 마킹/측정 결과를 일보(일일보고) 양식으로 내보내기
5. DWG 직접 열기 — LibreDWG(WASM) 연동 검토 (GPL 라이선스 조건 확인 필요)

---

## 파일 구조

```
site-cad/
├─ index.html                 ← 앱 전체 (로직·화면 모두 여기)
├─ manifest.webmanifest       ← 설치용 메타데이터
├─ icon.svg                   ← 앱 아이콘
├─ README.md
├─ BUILD.md                   ← APK/iOS 빌드 단계별 가이드
├─ package.json               ← Capacitor 패키징
├─ capacitor.config.json
├─ scripts/                   ← www/ 복사·gradle 실행 헬퍼
└─ .github/workflows/android.yml  ← push 하면 APK 자동 빌드
```

기능 수정은 `index.html` 한 파일만 고치면 됩니다.
웹으로 호스팅할 때는 `index.html`, `manifest.webmanifest`, `icon.svg` 를 같은 폴더에 올리세요.
PC에서 그냥 열어 볼 때는 `index.html` 만 더블클릭해도 뷰어는 동작합니다(설치 메타데이터만 비활성).
`www/`, `android/`, `node_modules/` 는 빌드 시 생성되며 `.gitignore` 처리되어 있습니다.
