# Google Sheets API 연동 설정 가이드

## 1. Google Cloud 프로젝트 생성

1. [Google Cloud Console](https://console.cloud.google.com) 접속
2. 새 프로젝트 생성 (`ieye-growth` 등)
3. **APIs & Services > Library** 이동
4. **Google Sheets API** 검색 후 사용 설정 (활성화)

## 2. 서비스 계정 생성

1. **APIs & Services > Credentials** 이동
2. **Create Credentials > Service Account** 클릭
3. 서비스 계정 이름 입력 (예: `ieye-sheets`)
4. 역할: **Editor** 또는 **Owner** 선택
5. 생성 완료 후 서비스 계정 클릭
6. **Keys** 탭 > **Add Key > Create new key > JSON** 다운로드

## 3. Google 스프레드시트 생성 및 공유

1. [Google Sheets](https://sheets.google.com) 에서 새 스프레드시트 생성
2. 시트 이름: `아이아이 \ Growth DB` (자유롭게)
3. URL에서 Spreadsheet ID 복사:
   - `https://docs.google.com/spreadsheets/d/[**SPREADSHEET_ID**]/edit`
4. 우측 상단 **공유** 버튼 클릭
5. 서비스 계정 이메일 (`...@...iam.gserviceaccount.com`) 로 **편집자** 권한으로 공유

## 4. .env.local 파일 작성

다운로드한 JSON 파일을 열어 아래 내용을 `.env.local`에 복사:

```env
GOOGLE_PROJECT_ID=json파일의 project_id
GOOGLE_PRIVATE_KEY_ID=json파일의 private_key_id
GOOGLE_PRIVATE_KEY="json파일의 private_key (적따표 포함)"
GOOGLE_CLIENT_EMAIL=json파일의 client_email
GOOGLE_CLIENT_ID=json파일의 client_id
GOOGLE_SPREADSHEET_ID=위에서 복사한 Spreadsheet ID
```

## 5. 스프레드시트 초기화

서버를 실행한 뒤:

```bash
curl -X POST http://localhost:3000/api/init
```

또는 브라우저에서 `http://localhost:3000/api/init` POST 요청

정상 응답: `{"success": true, "message": "Spreadsheet initialized"}`
