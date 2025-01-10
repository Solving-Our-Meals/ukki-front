# Collaboration Rules

## 1. Branch Rule

### main (최종 병합 브랜치)
> 1. develop 브랜치에서 문제가 없을 경우, 해당 브랜치에 최종 merge
> 2. 일주일에 한번 develop에서 main으로 병합

### develop (병합 전 테스트 브랜치)
> 1. 기본 브랜치에 가까운 main 브랜치에 올리기 전 merge하는 공간
> 2. 평일에 한번씩 머지하는 공간은 이 공간으로 우리가 업데이트하는 브랜치

### feature (기능 개발 브랜치)
> 1. 영문 대문자 금지 <br>
> 2. "-"(하이픈)만 사용 <br>
> 3. 명명규칙 예시 : feature/#1(이슈번호)-add-resource-files <br>
> 4. 1기능 당 한개의 브랜치 생성 <br>

### hotfix (긴급 문제수정용 브랜치)
> 1. 영문 대문자 금지
> 2. "-"(하이픈)만 사용
> 3. 명명규칙 예시 : hotfix/#2(이슈번호)-fix-add-resource-files
> 4. 1기능 당 한개의 브랜치 생성

<br/>

## 2. Issue Rule

### issue 작성
> 1. 명명 규칙 예시 : [대문자][카멜케이스(영문 기능설명)] 한글 기능설명 <br>
> 2. [FEATURE][Function]기능 설명(한글) <br>
> 3. 1 기능당 1개의 이슈 생성 (세세하게 작성) <br>
> 4. pull request까지 마치고 merge했다면 관련된 자신의 이슈는 직접 close <br>
> 5. 발생 유형은 한개만 남기고 전부 제거 및 체크 <br>
> 6. Assignees는 담당자 작성 필수 <br>
> 7. Label은 카테고리 선택 필수 <br>
> 8. 내용 작성 시 선택을 제외한 나머지는 전부 작성 <br>
> 9. 이슈는 형상관리자가 전부 작성 (긴급할 경우에만 다른 사람이 작성 - 형상관리자 확인)
> 10. 형상관리자가 작성했지만 TODO의 경우에는 직접 수정해서 사용 및 작성

<br/>

## 3. Pull Request Rule

### Pull Request 작성
> 1. 명명 규칙 예시 : [대문자][카멜케이스(영문 기능설명)] 한글 기능설명 <br>
> 2. [FEATURE][PullRequest]기능 <br>
> 3. Reviewer는 2명 이상 지정 필수(리뷰어가 아니더라도 확인했다면 코멘트 작성) <br>
> 4. Assinees는 담당자 작성 필수 <br>
> 5. Label은 카테고리 작성 필수 <br>
> 6. 선택사항 제외 전부 작성 필수 <br>
> 7. 스크린샷은 선택이지만 작성 권장 <br>
> 8. 자신이 리뷰어가 아니어도 확인했다면 코멘트 작성 <br>
> 9. 2인 이상의 코멘트가 달렸을 때만 Merge
> 10. 모두 확인됐다면 형상관리자가 최종 확인 및 Merge

<br/>

## 4. Commit Rule

### 명명 규칙
> - 헤더 : type (소문자) <br>
> - 본문 : 기능 (카멜케이스 사용 및 띄어쓰기 사용) <br>
> - 푸터 : 날짜 <br>

### type의 종류
> - feat : 새로운 기능 <br>
> - fix : 버그 수정 <br>
> - build : 빌드 파일 수정 (모듈 설치 또는 삭제) <br>
> - chore : 작은 수정 <br>
> - ci : ci 수정 <br>
> - docs : 문서 수정 <br>
> - style : 코드 스타일 수정 <br>
> - refactor : 코드 리팩토링 <br>
> - test : 테스트 <br>
> - perf : 성능 개선 <br>

### 규칙
> 1. 예시에 맞게 사용 <br>
> type: 띄어쓰기 후 내용 삽입

### 예시
> feat: Plus Function/2024-10-21
