
# Description
> 일정 시간 내에 주제를 하나 정하여 찬성과 반대가 나뉘어 채팅과 같이 토론을 나눔으로써
> 

# Environment
- 현재 각자 개인 컴퓨터의 로컬 데이터베이스 사용중
- Node.js (v16.13.1)
- MySQL (v8.0.27)
  - username : debate
  - database : debate
  - password : *관리자에게 문의*
- TypeORM
- Socket.IO
- 추후에 AWS등 서버로 올릴 예정

# Installation & Run
npm 모듈 설치
```bash
$ npm install
```

서버 실행
```bash
# development (watch mode)
$ npm run start:dev

# production mode
$ npm run start:prod
```

테스트 실행
```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

# File Manifest
- views : 뷰 템플릿
- public : 클라이언트 접근 에셋
- src : Nest.js 백엔드 구성 파일
  - admin : 관리자페이지 관련
  - auth : 로그인 기능 관련
  - chat : 채팅 기능 관련
  - list : 이전 토론 리스트 관련
  - topic : 토론 주제 관련
    - 토론 내용 = Topic
    - 토론 예약 = TopicReserve
    - 토론에 참여한 유저 정보 = TopicUsers
  - users : 유저 관련
  - configs : 설정 관련 (데이터베이스 설정 포함)
- test : e2e 테스트 관련

# Contributer
## FrontEnd
- 김승민(ksemin99) - [ksemin2825@gmail.com]
## BackEnd
- 박정우(qsc0415) - [qsc0415@naver.com]
- 이정윤(UniM0cha) - [solst_ice@naver.com]

# Known Issue
- 회원가입 진행중일 때 닉네임을 입력하고 메인페이지로 이동된 뒤, 뒤로가기를 누르면 닉네임 입력 페이지가 뜨며, 닉네임을 입력하고 확인을 누르면 서버가 터짐 (오류 메시지 캡쳐 필요)

# Troubleshooting

# Changelog

# License
Nest is [MIT licensed](LICENSE).