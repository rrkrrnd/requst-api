# Requst Client

Requst Client는 API 요청을 보내고 응답을 확인하며, 요청 기록을 관리하고 컬렉션으로 저장할 수 있는 강력하고 직관적인 웹 기반 도구입니다.

## 기능

### 1. 요청 및 응답 처리

- **요청 생성**: HTTP 메서드(GET, POST, PUT, DELETE 등)를 선택하고 요청 URL을 입력하여 API 요청을 생성합니다.
- **요청 본문**: JSON 형식의 요청 본문을 지원하며, 편리한 JSON 형식 지정 기능을 제공합니다.
- **헤더 관리**: 요청 헤더를 키-값 쌍으로 추가, 편집, 활성화/비활성화할 수 있습니다.
- **인증**: Bearer Token 인증을 지원합니다.
- **쿼리 파라미터**: 쿼리 파라미터를 키-값 쌍으로 쉽게 관리하고 활성화/비활성화할 수 있습니다.
- **전역 헤더**: 모든 요청에 자동으로 적용되는 전역 헤더를 설정하고 관리할 수 있습니다.
- **응답 보기**: 요청에 대한 응답 상태 코드, 상태 텍스트, 응답 시간, 헤더 및 본문을 명확하게 표시합니다. 응답 본문은 JSON 형식으로 자동 변환되어 가독성을 높입니다.

### 2. 데이터 관리 및 구성

- **컬렉션**: 자주 사용하는 요청을 컬렉션으로 저장하고 관리할 수 있습니다.
- **그룹화**: 컬렉션 내에서 요청을 그룹으로 묶어 체계적으로 정리할 수 있습니다.
- **드래그 앤 드롭**: 컬렉션 내의 요청과 그룹을 드래그 앤 드롭으로 쉽게 재정렬할 수 있습니다.
- **필터링**: 컬렉션 및 히스토리에서 이름 또는 URL을 기준으로 요청을 빠르게 검색할 수 있습니다.
- **히스토리**: 전송된 모든 요청의 기록을 자동으로 저장하여 이전에 보낸 요청을 쉽게 다시 로드하거나 컬렉션으로 저장할 수 있습니다.
- **데이터 내보내기/가져오기**: 모든 요청 기록, 컬렉션, 전역 헤더 및 UI 설정을 JSON 파일로 내보내거나 가져올 수 있어 데이터를 백업하고 복원하기 용이합니다.

### 3. 사용자 인터페이스 및 설정

- **직관적인 UI**: 깔끔하고 사용하기 쉬운 인터페이스를 제공하여 API 테스트 과정을 간소화합니다.
- **테마**: 다양한 UI 테마 중에서 선택하여 사용자 환경을 개인화할 수 있습니다.

## 사용법

### 1. 프로젝트 설치 및 실행

프로젝트를 로컬 환경에서 실행하려면 다음 단계를 따르세요:

```bash
# 1. 저장소 클론
git clone https://github.com/your-username/requst-client.git
cd requst-client

# 2. 의존성 설치
npm install

# 3. 애플리케이션 실행
npm start
```

애플리케이션이 `http://localhost:3000` (또는 사용 가능한 다른 포트)에서 실행됩니다.

### 2. API 요청 보내기

1.  **URL 및 메서드 입력**: "Request" 패널에서 요청할 API의 URL을 입력하고 드롭다운 메뉴에서 HTTP 메서드(GET, POST 등)를 선택합니다.
2.  **요청 세부 정보 구성**:
    - **Body**: POST, PUT 요청의 경우 "Body" 탭에서 JSON 형식의 요청 본문을 입력합니다. "Format JSON" 버튼을 클릭하여 본문을 보기 좋게 정렬할 수 있습니다.
    - **Headers**: "Headers" 탭에서 필요한 요청 헤더를 키-값 쌍으로 추가합니다.
    - **Auth**: "Auth" 탭에서 Bearer Token을 입력합니다.
    - **Query**: "Query" 탭에서 URL 쿼리 파라미터를 키-값 쌍으로 추가합니다.
    - **Global Headers**: "Global Headers" 탭에서 모든 요청에 적용될 전역 헤더를 설정합니다.
3.  **요청 전송**: "Send" 버튼을 클릭하여 API 요청을 보냅니다.
4.  **응답 확인**: "Response" 패널에서 요청에 대한 응답(상태, 시간, 헤더, 본문)을 확인합니다.

### 3. 컬렉션 및 히스토리 관리

- **컬렉션**: "Collections" 탭에서 새 요청을 저장하거나 기존 요청을 편집, 삭제, 그룹화할 수 있습니다. 드래그 앤 드롭으로 순서를 변경할 수 있습니다.
- **히스토리**: "History" 탭에서 이전에 보낸 요청 목록을 확인하고, 클릭하여 요청 패널로 다시 로드하거나 컬렉션에 저장할 수 있습니다.

### 4. 설정 변경

- 애플리케이션 상단의 톱니바퀴 아이콘을 클릭하여 "Settings" 모달을 엽니다.
- **테마**: "Select Theme" 드롭다운에서 원하는 UI 테마를 선택합니다.
- **데이터 관리**: "Data Management" 섹션에서 "Export Data"를 클릭하여 모든 데이터를 백업하거나, "Import Data"를 통해 이전에 백업한 데이터를 복원할 수 있습니다.

---
