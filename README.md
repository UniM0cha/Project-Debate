# Project-Debate
프로젝트 Notion 주소 : https://solstice99.notion.site/Project_Debate-699a06ea4aa04af48fb524084ff68600

<div align="center">
  <h1>- 디베이톡(Debatalk) -</h1>
  2학년 겨울방학 그룹 프로젝트 <br>
  2021. 12. 30. ~ 2022. 2. 27. <br> <br>
  <img src="https://img.shields.io/badge/node.js-16-gray?logo=nodedotjs&logoColor=white&labelColor=339933&style=for-the-badge"/>
  <img src="https://img.shields.io/badge/mysql-8-gray?logo=mysql&logoColor=white&labelColor=4479A1&style=for-the-badge"/>
  <img src="https://img.shields.io/badge/socket.io-4.4-gray?logo=socketdotio&logoColor=white&labelColor=010101&style=for-the-badge"/>
  <img src="https://img.shields.io/badge/passport-0.5.2-gray?logo=passport&logoColor=white&labelColor=34E27A&style=for-the-badge"/>
  <img src="https://img.shields.io/badge/nestjs-8-gray?logo=nestjs&logoColor=white&labelColor=E0234E&style=for-the-badge"/>
</div>

## Contributer
<table>
  <tr>
    <td align="center">
      <a href="https://www.github.com/UniM0cha">
        <img src="https://github.com/UniM0cha.png" width="100px;"/>
        <br/><b>@UniM0cha</b>
      </a>
    </td>
    <td>
      <ul>
        <li>백엔드</li>
        <li>TypeORM을 사용한 데이터베이스 관리</li>
        <li>NestJS 인프라 구축</li>
        <li>AWS 서버 배포</li>
      </ul>
    </td>
    <tr>
    <td align="center">
      <a href="https://www.github.com/ksemin99">
        <img src="https://github.com/ksemin99.png" width="100px;"/>
        <br/><b>@ksemin99</b>
      </a>
    </td>
    <td>
      <ul>
        <li>프론트엔드</li>
        <li>웹페이지 디자인</li>
      </ul>
    </td>
    <tr>
    <td align="center">
      <a href="https://www.github.com/qsc0415">
        <img src="https://github.com/qsc0415.png" width="100px;"/>
        <br/><b>@qsc0415</b>
      </a>
    </td>
    <td>
      <ul>
        <li>백엔드</li>
        <li>Socket.IO를 사용한 채팅 기능 구현</li>
      </ul>
    </td>
</table>

## Preview

## File Manifest
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
