const chatSocket = io.connect('/message');
const topicSocket = io.connect('/topic');

//서버시간 가져오기
async function getTime() {
  const res = await fetch('/time', { method: 'post' });
  return res.headers.get('date');
}

//채팅 타이머
function countDownTimer(date) {
  const topicTime = document.getElementById('topic-time');
  const input_box = document.querySelector('.opinion-input');
  const send_btn = document.querySelector('.send');
  const live_debate = document.querySelector('.live-debate');

  if (date === '') {
    topicTime.textContent = '다음 주제가 없습니다.';
    return;
  }

  let _vDate = new Date(date); // 전달 받은 일자
  let _second = 1000;
  let _minute = _second * 60;
  let _hour = _minute * 60;
  let _day = _hour * 24;
  let timer;

  function showRemaining() {
    let now = new Date();
    let distDt = _vDate - now;
    if (distDt <= 0) {
      clearInterval(timer);
      document.getElementById(id).textContent = '해당 주제가 종료 되었습니다!';
      input_box.style.display = 'none';
      send_btn.style.display = 'none';
      live_debate.style.height = '100%';
      location.reload();

      //이 부분에 서버시간 받아서 데베에 집어넣기

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
    topicTime.textContent = '남은 주제 기간 : ';
    topicTime.textContent += days + '일 ';
    topicTime.textContent += hours + '시간 ';
    topicTime.textContent += minutes + '분 ';
    topicTime.textContent += seconds + '초';
  }

  showRemaining();
  timer = setInterval(showRemaining, 1000);
}

countDownTimer(endDate); // 이부분 수정하면 시간 변경 가능
// countDownTimer('02/28/2022 09:27 PM'); // 이부분 수정하면 시간 변경 가능

document.addEventListener('DOMContentLoaded', function () {
  // 맨 처음 찬성 반대 비율 요청
  topicSocket.emit('request-refresh-opinion-type', { reserveId: reserveId });

  // 모든 채팅 가져옴
  getAllChat();

  // //로그인, 로그아웃 버튼 구현
  // const loginform = document.querySelector('.form-login');
  // const logoutform = document.querySelector('.form-logout');

  // //로그인했을때->로그아웃버튼, 로그인안했을때->로그인 버튼
  // if (isLogined == true) {
  //   loginform.style.display = 'none';
  //   logoutform.style.display = 'block';
  // } else {
  //   loginform.style.display = 'block';
  //   logoutform.style.display = 'none';
  // }
  //로그인, 로그아웃 버튼 구현

  //로그인 시 채팅 가능
  const opinion_input = document.querySelector('.opinion-input');
  const send_btn = document.querySelector('.send');
  const live_debate = document.querySelector('.live-debate');
  const input_box = document.querySelector('.input-box');
  // //찬성반대바 구현
  const agree_btn = document.querySelector('.agree-btn');
  const disagree_btn = document.querySelector('.disagree-btn');
  //스크롤 아래 고정
  live_debate.scrollTop = live_debate.scrollHeight;

  if (isLogined === false) {
    input_box.style.display = 'none';
    live_debate.style.height = '100%';
  }

  if (isLogined === true && hasOpinion === false) {
    input_box.style.display = 'none';
    opinion_input.style.display = 'none';
    send_btn.style.display = 'none';

    //찬성 선택시
    agree_btn.addEventListener('click', () => {
      sendAgreeToServer();
    });

    //반대 선택시
    disagree_btn.addEventListener('click', () => {
      sendDisagreeToServer();
    });
  } else {
    agree_btn.style.display = 'none';
    disagree_btn.style.display = 'none';
  }
  //찬성반대 비율바 구현

  /**전송버튼 클릭 이벤트 등록 */
  const send = document.querySelector('#send');
  send.addEventListener('click', (e) => {
    e.preventDefault();
    send_chat_socket_emit();
  });

  /**엔터 이벤트 등록 */
  opinion.addEventListener('keypress', (event) => {
    if (event.keyCode === 13) {
      if (!event.shiftKey) {
        send_chat_socket_emit();
      } else {
        opinion.value = opinion.value + '\n';
        opinion.scrollTop = opinion.scrollHeight;
      }
    }
  });
});

const opinion = document.querySelector('#message');

///////////////////////////////
///// 찬성/반대 관련 함수 /////
///////////////////////////////

/**서버로부터 찬성/반대 비율 새로고침 이벤트 등록 */
topicSocket.on('refresh-opinion-type', ({ agree, disagree }) => {
  const agree_bar = document.querySelector('.agree-bar');
  const disagree_bar = document.querySelector('.disagree-bar');
  const agree_sign = document.querySelector('.agree-sign');
  const disagree_sign = document.querySelector('.disagree-sign');
  let agree_persent = document.querySelector('.agree-persent');
  let disagree_persent = document.querySelector('.disagree-persent');
  let agreebar_width = 50;
  let disagreebar_width = 50;

  if (agree === 0 && disagree === 0) {
    // 0대 0이면 50대 50으로 고정
    agreebar_width = 50;
    disagreebar_width = 50;
  } else {
    // 찬성/반대 넓이 비율 계산
    bar_width_calculate(agree, disagree);
  }

  // 비율에 따라 바의 넓이 표시
  agree_bar.style.width = agreebar_width + '%';
  disagree_bar.style.width = disagreebar_width + '%';
  agree_persent.innerHTML = agreebar_width + '%';
  disagree_persent.innerHTML = disagreebar_width + '%';

  //찬성 100%일 때 css 수정
  if (agreebar_width === 100) {
    agree_bar.style.borderRadius = '7px';
    disagree_bar.style.display = 'none';
    disagree_sign.style.display = 'none';
  }

  // 반대 100%일 때 css 수정
  else if (disagreebar_width === 100) {
    disagree_bar.style.borderRadius = '7px';
    agree_bar.style.display = 'none';
    agree_sign.style.display = 'none';
  }

  // 나머지 상황
  else {
    //찬성 반대 비율 바 보여주기
    agree_bar.style.display = 'block';
    disagree_bar.style.display = 'block';
    agree_sign.style.display = 'block';
    disagree_sign.style.display = 'block';
  }

  function bar_width_calculate(agree, disagree) {
    sum = agree + disagree;
    agree = sum / agree;
    agreebar_width = 100 / agree;
    disagreebar_width = 100 - agreebar_width;
  }
});

/**찬성/반대 요청을 한 후 서버로부터 상태코드 응답 이벤트 등록 */
topicSocket.on('option-type-state-to-client', ({ state }) => {
  switch (state) {
    // 찬성/반대 저장 성공
    case 0:
      //찬성 반대 선택 이후 버튼 숨기기
      const agree_btn = document.querySelector('.agree-btn');
      const disagree_btn = document.querySelector('.disagree-btn');
      const opinion_input = document.querySelector('.opinion-input');
      const send_btn = document.querySelector('.send');
      const input_box = document.querySelector('.input-box');
      agree_btn.style.display = 'none';
      disagree_btn.style.display = 'none';
      opinion_input.style.display = 'block';
      send_btn.style.display = 'block';
      input_box.style.display = 'flex';
      break;
    // 존재하지 않는 유저
    case 1:
      alert(`로그인 후 이용해 주세요.`);
      break;
    // 유효하지 않은 주제
    case 2:
      alert(`유효하지 않은 주제입니다.`);
      break;
    // 유저가 의견을 제시하지 않음
    case 3:
      alert(`이미 투표하셨습니다.`);
      break;
  }
});

// 찬성 버튼 클릭 시 서버로 요청 전송
function sendAgreeToServer() {
  topicSocket.emit('opinion-type-to-server', {
    userId: userId,
    reserveId: reserveId,
    opinionType: 'agree',
  });
}

// 반대 버튼 클릭 시 서버로 요청 전송
function sendDisagreeToServer() {
  topicSocket.emit('opinion-type-to-server', {
    userId: userId,
    reserveId: reserveId,
    opinionType: 'disagree',
  });
}

//////////////////////////
///// 채팅 관련 함수 /////
//////////////////////////

/**서버로부터 메시지 도착 이벤트 등록 */
chatSocket.on('new-message-to-client', (data) => {
  send_opinion(data.nickname, data.newmessage, data.date, data.opinionType);
});

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
      alert(`유효하지 않은 주제입니다.`);
      break;
    // 유저가 의견을 제시하지 않음
    case 3:
      alert(`의견 제시 후 이용해주세요.`);
      break;
    // 도배로 인한 채팅 금지 상태
    case 4:
      alert(`도배로 인해 채팅이 제한된 상태입니다..`);
      break;
  }
});

/*서버로 채팅 내용을 보내는 함수 */
async function send_chat_socket_emit() {
  const opinion_input = document
    .querySelector('#message')
    .value.replace(/\n/g, '<br>');
  if (opinion_input != '') {
    console.log('sending message to server');
    chatSocket.emit('new-message-to-server', {
      reserveId: reserveId,
      userId: userId,
      opinion_input: opinion_input,
    });
  }
  document.querySelector('#message').value = '';
}

// const ul = document.querySelector('.live-debate');

// 서버로부터 도착한 채팅을 표시하는 함수
function send_opinion(nickname, opinion, date, opinionType) {
  const ul = document.querySelector('.live-debate');
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

  if (opinionType === 'agree') {
    const li = document.createElement('li');
    li.classList.add(opinionType);
    //클래스 agree와 disagree추가
    const dom = `
      <div class='nickname'>${nickname}</div>
      <div class='user-opinion'>${opinion}</div>
      <div class='opinion-time'>${time}</div>
        `;
    li.innerHTML = dom;
    ul.appendChild(li);
  } else if (opinionType === 'disagree') {
    const li = document.createElement('li');
    li.classList.add(opinionType);
    //클래스 agree와 disagree추가
    const dom = `
      <div class='nickname'>${nickname}</div>
      <div class='opinion-time'>${time}</div>
      <div class='user-opinion'>${opinion}</div>
        `;
    li.innerHTML = dom;
    ul.appendChild(li);
  }
  ul.scrollTop = ul.scrollHeight;
}

// 모든 채팅 가져오는 함수
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
    //채팅 돌리기
    chatList.forEach((item) => {
      //시간 계산
      const today = new Date(item.chatDate);
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
      //시간 계산

      const nickname = item.nickname;
      const opinion = item.chatMessage;
      const time = ampm + ' ' + hour + ':' + min;
      const opinionType = item.opinionType;
      const ul = document.querySelector('.live-debate');

      //채팅 작성하기

      // ul.scrollTop = ul.scrollHeight;
      if (opinionType === 'agree') {
        const li = document.createElement('li');
        li.classList.add(opinionType);
        //클래스 agree와 disagree추가
        const dom = `
          <div class='nickname'>${nickname}</div>
          <div class='user-opinion'>${opinion}</div>
          <div class='opinion-time'>${time}</div>
          `;
        li.innerHTML = dom;
        ul.appendChild(li);
      } else if (opinionType === 'disagree') {
        const li = document.createElement('li');
        li.classList.add(opinionType);
        //클래스 agree와 disagree추가
        const dom = `
          <div class='nickname'>${nickname}</div>
          <div class='opinion-time'>${time}</div>
          <div class='user-opinion'>${opinion}</div>
            `;
        li.innerHTML = dom;
        ul.appendChild(li);
      }
      ul.scrollTop = ul.scrollHeight;
    });
    console.log(`chatList: ${JSON.stringify(chatList, null, 4)}`);
  }
  return;
}
