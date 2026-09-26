# 🌱 아이아이 (iEye Growth)

**KDST 기반 영유아 월령별 발달 선별 & 양육 가이드 서비스**

> 첫아이 부모를 위한, KDST(한국 영유아 발달선별검사) 표준 기반 맥맞춤 발달 성장 추적 앱

---

## ✨ 주요 기능

- 한 생녀월일 입력 시 자동 월령 계산 및 KDST 차수 자동 매핑
- 6대 발달 영역(대근육, 소근육, 인지, 언어, 사회성/정서, 자조) KDST 자가 진단
- 4단계 레벨 판정: 빠른 발달 / 정상 / 추적검사 요망 / 정밀평가 필요
- 월령별 심리 상태 및 맞수양육 가이드
- Google Sheets 데이터 저장 및 누적 성장 그래프

---

## 🚀 시작하기

### 1. 클론 및 설치

```bash
git clone https://github.com/your-username/ieye-growth.git
cd ieye-growth
npm install
```

### 2. Google Sheets 연동 설정

[SETUP.md](./SETUP.md) 보다서 Google Cloud 서비스 계정 설정 및 Sheets ID 발급 방법을 확인하세요.

### 3. 환경 변수 설정

```bash
cp .env.example .env.local
# .env.local 파일에 Google Sheets API 키 입력
```

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:3000 접속

---

## 🌐 배포 (Vercel)

1. GitHub에 레포지토리 업로드
2. [Vercel](https://vercel.com)에서 GitHub 레포지토리 연결
3. 환경 변수 (`.env.local` 내용)을 Vercel 대시보드에 입력
4. 자동 배포 완료!

---

## 🛡️ 중요 안내

> 본 서비스의 진단 결과는 KDST 표준 가이드라인에 기반한 **자가선별 도구**이며, 의료적 진단을 대신할 수 없습니다.  
> 추적검사 요망 이상의 결과가 나오면 반드시 소아청소년과 또는 발달 전문 센터 상담을 받으세요.

---

## 📚 기술 스택

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Charts**: Recharts
- **DB**: Google Sheets API (Service Account)
- **Deploy**: Vercel + GitHub
