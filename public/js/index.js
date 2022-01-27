let chatSocket = io.connect('http://localhost:3000/message');
let topicSocket = io.connect('/topic');
//서버시간 가져오기
// let xmlHttpRequest;
async function getTime() {
  const res = await fetch('/time', { method: 'post' });
  return res.headers.get('date');

  // if (window.XMLHttpRequest) {
  //   xmlHttpRequest = new XMLHttpRequest();
  //   xmlHttpRequest.open('HEAD', window.location.href.toString(), false);
  //   xmlHttpRequest.setRequestHeader('ContentType', 'text/html');
  //   xmlHttpRequest.send('');
  //   return xmlHttpRequest.getResponseHeader('date');
  // } else if (window.ActiveXObject) {
  //   xmlHttpRequest = new ActiveXObject('Microsoft.XMLHTTP');
  //   xmlHttpRequest.open('HEAD', window.location.href.toString(), false);
  //   xmlHttpRequest.setRequestHeader('ContentType', 'text/html');
  //   xmlHttpRequest.send('');
  //   return xmlHttpRequest.getResponseHeader('date');
  // }
}

//채팅 타이머
const input_box = document.querySelector('.opinion-input');
const send_btn = document.querySelector('.send');
const live_debate = document.querySelector('.live-debate');
const countDownTimer = function (id, date) {
  let _vDate = new Date(date); // 전달 받은 일자
  let _second = 1000;
  let _minute = _second * 60;
  let _hour = _minute * 60;
  let _day = _hour * 24;
  let timer;
  function showRemaining() {
    let now = new Date();
    let distDt = _vDate - now;
    if (distDt < 0) {
      clearInterval(timer);
      document.getElementById(id).textContent =
        '해당 이벤트가 종료 되었습니다!';
      input_box.style.display = 'none';
      send_btn.style.display = 'none';
      live_debate.style.height = '100%';

      //이 부분에 서버시간 받아서 데베에 집어넣기

      //
      return;
    } else if (isLogined === false && distDt > 0) {
      input_box.style.display = 'none';
      send_btn.style.display = 'none';
    }
    let days = Math.floor(distDt / _day);
    let hours = Math.floor((distDt % _day) / _hour);
    let minutes = Math.floor((distDt % _hour) / _minute);
    let seconds = Math.floor((distDt % _minute) / _second);
    //document.getElementById(id).textContent = date.toLocaleString() + "까지 : ";
    document.getElementById(id).textContent = '남은 주제 기간 : ';
    document.getElementById(id).textContent += days + '일 ';
    document.getElementById(id).textContent += hours + '시간 ';
    document.getElementById(id).textContent += minutes + '분 ';
    document.getElementById(id).textContent += seconds + '초';
  }
  showRemaining();
  timer = setInterval(showRemaining, 1000);
};

countDownTimer('topic-time', '02/27/2022 04:22 PM'); // 이부분 수정하면 시간 변경 가능

document.addEventListener('DOMContentLoaded', function () {
  // 맨 처음 찬성 반대 비율 요청
  topicSocket.emit('request-refresh-opinion-type', { reserveId: reserveId });

  // 모든 채팅 가져옴
  getAllChat();

  //로그인, 로그아웃 버튼 구현
  const loginform = document.querySelector('.form-login');
  const logoutform = document.querySelector('.form-logout');

  //로그인했을때->로그아웃버튼, 로그인안했을때->로그인 버튼
  if (isLogined == true) {
    loginform.style.display = 'none';
    logoutform.style.display = 'block';
  } else {
    loginform.style.display = 'block';
    logoutform.style.display = 'none';
  }
  //로그인, 로그아웃 버튼 구현

  //로그인 시 채팅 가능
  const opinion_input = document.querySelector('.opinion-input');
  const send_btn = document.querySelector('.send');
  const live_debate = document.querySelector('.live-debate');
  const input_box = document.querySelector('.input-box');
  //찬성반대바 구현
  const agree_bar = document.querySelector('.agree-bar');
  const disagree_bar = document.querySelector('.disagree-bar');
  const agree_sign = document.querySelector('.agree-sign');
  const disagree_sign = document.querySelector('.disagree-sign');
  const agree_btn = document.querySelector('.agree-btn');
  const disagree_btn = document.querySelector('.disagree-btn');
  //스크롤 아래 고정
  live_debate.scrollTop = live_debate.scrollHeight;

  //찬성 선택 시 계산식 -> 반올림 때문에 찬성 반대 계산기 나눔
  function agree_calculate(agree, disagree) {
    sum = agree + disagree;
    agree = sum / agree;
    agreebar_width = 100 / agree;
    disagreebar_width = 100 - agreebar_width;
  }

  //반대 선택 시 계산식 -> 반올림 때문에 찬성 반대 계산기 나눔
  function disagree_calculate(agree, disagree) {
    sum = agree + disagree;
    agree = sum / disagree;
    disagreebar_width = 100 / disagree;
    agreebar_width = 100 - disagreebar_width;
  }

  if (isLogined === true && hasOpinion === false) {
    agree_bar.style.display = 'none';
    disagree_bar.style.display = 'none';
    agree_sign.style.display = 'none';
    disagree_sign.style.display = 'none'
    opinion_input.style.display = 'none';
    send_btn.style.display = 'none';
    input_box.style.display = 'none';

    //찬성 선택시
    agree_btn.addEventListener('click', () => {
      //찬성 반대 선택 이후 버튼 숨기기
      agree_btn.style.display = 'none';
      disagree_btn.style.display = 'none';
      opinion_input.style.display = 'block';
      send_btn.style.display = 'block';
      input_box.style.display = 'flex';
      sendAgreeToServer();
    });

    //반대 선택시
    disagree_btn.addEventListener('click', () => {
      //찬성 반대 선택 이후 버튼 숨기기
      agree_btn.style.display = 'none';
      disagree_btn.style.display = 'none';
      opinion_input.style.display = 'block';
      send_btn.style.display = 'block';
      input_box.style.display = 'flex';
      sendDisagreeToServer();
    });
  } else {
    agree_btn.style.display = 'none';
    disagree_btn.style.display = 'none';
  }
  //찬성반대 비율바 구현

  // 실시간 채팅 구현
  const ul = document.querySelector('.live-debate');
  const send = document.querySelector('#send');

  /**서버로부터 상태코드 도착 이벤트 등록 */
  chatSocket.on('chat-state-to-client', ({ state }) => {
    switch (state) {
      // 메시지 전송 성공
      case 0:
        break;
      // 존재하지 않는 유저
      case 1:
        alert(`로그인 후 이용해 주세요.`);
        break;
      // 유효하지 않은 주제
      case 2:
        alert(`주제가 설정되지 않았습니다.`);
        break;
      // 유저가 의견을 제시하지 않음
      case 3:
        alert(`의견 제시 후 이용해주세요.`);
        break;
    }
  });

  /**서버로부터 메시지 도착 이벤트 등록 */
  chatSocket.on('new-message-to-client', (data) => {
    send_opinion(data.nickname, data.newmessage, data.date, data.opinionType);
  });
  const opinion = document.querySelector('#message');

  /**서버로부터 찬성/반대 비율 새로고침 이벤트 등록 */
  topicSocket.on('refresh-opinion-type', ({ agree, disagree }) => {
    //찬성비율 계산
    agree_calculate(agree, disagree);
    //찬성 반대 바 비율 변경
    agree_bar.style.width = agreebar_width + '%';
    disagree_bar.style.width = disagreebar_width + '%';
    //찬성 반대 비율 바 보여주기
    agree_bar.style.display = 'block';
    disagree_bar.style.display = 'block';
    agree_sign.style.display = 'block';
    disagree_sign.style.display = 'block';
    //찬성 100%일때 css수정
    if (agreebar_width === 100) {
      agree_bar.style.borderRadius = '7px';
      disagree_bar.style.display = 'none';
      disagree_sign.style.display = 'none';
    }

    //반대 비율 계산
    disagree_calculate(agree, disagree);
    //찬성 반대 바 비율 변경
    agree_bar.style.width = agreebar_width + '%';
    disagree_bar.style.width = disagreebar_width + '%';
    //찬성 반대 비율 바 보여주기
    agree_bar.style.display = 'block';
    disagree_bar.style.display = 'block';
    if (disagreebar_width === 100) {
      disagree_bar.style.borderRadius = '7px';
      agree_bar.style.display = 'none';
      agree_sign.style.display = 'none';
    }

  });

  /**찬성/반대 요청을 한 후 서버로부터 받는 상태코드 */
  topicSocket.on('option-type-state-to-client', ({ state }) => {
    switch (state) {
      // 메시지 전송 성공
      case 0:
        break;
      // 존재하지 않는 유저
      case 1:
        alert(`로그인 후 이용해 주세요.`);
        break;
      // 유효하지 않은 주제
      case 2:
        alert(`주제가 설정되지 않았습니다.`);
        break;
      // 유저가 의견을 제시하지 않음
      case 3:
        alert(`이미 투표하셨습니다.`);
        break;
    }
  });

  /**전송버튼 클릭 이벤트 등록 */
  send.addEventListener('click', (e) => {
    e.preventDefault();
    send_chat_socket_emit();
  });

  /**엔터 이벤트 등록 */
  opinion.addEventListener('keypress', (event) => {
    if (event.keyCode === 13) {
      send_chat_socket_emit();
    }
  });

  async function send_chat_socket_emit() {
    const opinion_input = document.querySelector('#message').value;

    if (opinion_input != '') {
      // 현재 날짜 조회
      // let st = await getTime();
      // let today = new Date(st);
      // let hour = today.getHours();
      // let min = today.getMinutes();
      // if (hour / 12 >= 1) {
      //   hour = '오후 ' + (hour - 12);
      //   if (hour - 12 < 10) {
      //     hour = hour.slice(0, 2) + '0' + hour.slice(2, 3);
      //   }
      // } else {
      //   hour = '오전 ' + hour;
      //   if (hour < 10) {
      //     hour = hour.slice(0, 2) + '0' + hour.slice(2, 3);
      //   }
      // }
      // if (min < 10) {
      //   min = '0' + min;
      // }

      console.log('sending message to server');
      chatSocket.emit('new-message-to-server', {
        reserveId: reserveId,
        userId: userId,
        opinion_input: opinion_input,
        // nickname: nickname,
        // date: hour + ':' + min,
        // date 객체로 수정
        // date: today,
      });
    }
    document.querySelector('#message').value = '';
  }

  ////////////////// 정윤: opinionType 변수 넘겨줬으니까 처리 부탁드립니다요 ///////////////////////
  function send_opinion(nickname, opinion, date, opinionType) {
    console.log(opinionType);
    const today = new Date(date);
    let hour = today.getHours();
    let min = today.getMinutes();
    let ampm = '';
    if (hour > 12) {
      hour = hour - 12;
      ampm = '오후';
    } else {
      ampm = '오전';
    }
    hour = hour.toString().padStart(2, '0');
    min = min.toString().padStart(2, '0');
    const time = ampm + ' ' + hour + ':' + min;

    // if (hour / 12 >= 1) {
    //   hour = '오후 ' + (hour - 12);
    //   if (hour.slice(3, 5) - 12 < 10) {
    //     hour = hour.slice(0, 3) + '0' + hour.slice(3, 4);
    //   }
    // } else {
    //   hour = '오전 ' + hour;
    //   if (hour.slice(3, 5) < 10) {
    //     hour = hour.slice(0, 3) + '0' + hour.slice(3, 4);
    //   }
    // }
    // if (min < 10) {
    //   min = '0' + min;
    // }

    // time = hour + ':' + min;

    const li = document.createElement('li');
    li.classList.add(opinionType);
    //클래스 agree와 disagree추가
    const dom = `
        <div class='nickname'>${nickname}</div>
            <div
              class='user-opinion'
            >${opinion}</div>
            <div class='opinion-time'>${time}</div>
        `;
    li.innerHTML = dom;
    ul.appendChild(li);
    ul.scrollTop = ul.scrollHeight;
  }
});

// 찬성 버튼 클릭 시 서버로 요청 전송
function sendAgreeToServer() {
  // fetch(`/topic/agree`, {
  //   method: 'POST',
  // });
  // socket 이벤트로 전환
  topicSocket.emit('opinion-type-to-server', {
    userId: userId,
    reserveId: reserveId,
    opinionType: 'agree',
  });
}

// 반대 버튼 클릭 시 서버로 요청 전송
function sendDisagreeToServer() {
  // fetch(`/topic/disagree`, {
  //   method: 'POST',
  // });
  topicSocket.emit('opinion-type-to-server', {
    userId: userId,
    reserveId: reserveId,
    opinionType: 'disagree',
  });
}

async function getAllChat() {
  const response = await fetch(`/chat/all`, {
    method: 'POST',
  });
  const data = await response.json();

  if (data.state === 1) {
    console.log('주제 예약이 유효하지 않음');
  } else if (data.state === 0) {
    ///////////////////////////////////// 모든 채팅 내용은 chatList 안에 저장됩니다 ///////////////////
    const chatList = data.chat;
    console.log(`chatList: ${JSON.stringify(chatList, null, 4)}`);
  }
  return;
}
