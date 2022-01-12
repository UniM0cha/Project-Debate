let socket = io.connect('http://localhost:3000/message');

document.addEventListener('DOMContentLoaded', function () {

  //로그인, 로그아웃 버튼 구현
  const loginform = document.querySelector('.form-login'); 
  const logoutform = document.querySelector('.form-logout');

  //로그인했을때->로그아웃버튼, 로그인안했을때->로그인 버튼
  if(isLogined== true)
  { loginform.style.display = 'none';
    logoutform.style.display = 'block';
  }
  else
  { loginform.style.display = 'block';
    logoutform.style.display = 'none'
  }
  //로그인, 로그아웃 버튼 구현

  //찬성반대 비율바 구현
  const agree_bar = document.querySelector('.agree-bar');
  const disagree_bar = document.querySelector('.disagree-bar');
  const agree_btn = document.querySelector('.agree-btn');
  const disagree_btn = document.querySelector('.disagree-btn');

  //지금 그냥 초기화 해놨는데 데베에서 가져와야 될듯
  let sum = 0;
  let agree = 0;
  let disagree = 0;
  let agreebar_width = 0;
  let disagreebar_width = 0;

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

  if(isLogined == true){
      agree_bar.style.display = 'none';
      disagree_bar.style.display = 'none';

    agree_btn.addEventListener('click', () => {
        //찬성 반대 선택 이후 버튼 숨기기
        agree_btn.style.display = 'none';
        disagree_btn.style.display = 'none';
        agree = agree + 1;
        //찬성비율 계산
        agree_calculate(agree, disagree);
        //찬성 반대 바 비율 변경
        agree_bar.style.width = agreebar_width + '%';
        disagree_bar.style.width = disagreebar_width + '%';
        //찬성 반대 비율 바 보여주기
        agree_bar.style.display = 'block';
        disagree_bar.style.display = 'block';
      });

    disagree_btn.addEventListener('click', () => {
        //찬성 반대 선택 이후 버튼 숨기기
        agree_btn.style.display = 'none';
        disagree_btn.style.display = 'none';
        disagree = disagree + 1;
        //반대 비율 계산
        disagree_calculate(agree, disagree);
        //찬성 반대 바 비율 변경
        agree_bar.style.width = agreebar_width + '%';
        disagree_bar.style.width = disagreebar_width + '%';
        //찬성 반대 비율 바 보여주기
        agree_bar.style.display = 'block';
        disagree_bar.style.display = 'block';
      });
  }
  else {
    agree_btn.style.display = 'none';
    disagree_btn.style.display = 'none';
  }
  //찬성반대 비율바 구현
    
    
  //실시간 채팅 구현
  const ul = document.querySelector('.live-debate');
  const send = document.querySelector('#send');

  socket.on('new-message-to-client', (data) => {
    console.log(data);

    //let opinion = opinion_input;
    send_opinion(nickname, data.newmessage, 'time');
    console.log(isLogined);
    console.log(nickname);
  });

  send.addEventListener('click', (e) => {
    e.preventDefault();
    const opinion_input = document.querySelector('#message').value;
    socket.emit('new-message-to-server', { opinion_input: opinion_input });
    console.log(opinion_input);
    document.querySelector('#message').value = '';
  });

  send.addEventListener('keypress', (event) => {
    if (event.keyCode === 13) {
      socket.emit('new-message-to-server', { opinion_input: opinion_input });
      document.querySelector('#message').value = '';
    }
  });

  function send_opinion(nickname, opinion, time) {
    const li = document.createElement('li');
    li.classList.add('agree');
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
  //실시간 채팅 구현

  //로그인 시 채팅 가능
  const input_box = document.querySelector('.opinion-input');
  const send_btn = document.querySelector('.send');
  const live_debate = document.querySelector('.live-debate');
  //스크롤 아래 고정
  live_debate.scrollTop = live_debate.scrollHeight

  //로그인에 따른 채팅 가능 불가능 설정
  if(isLogined == true){
    input_box.style.display = 'block';
    send_btn.style.display = 'block';
  }
  else {
    input_box.style.display = 'none';
    send_btn.style.display = 'none';
    live_debate.style.height = "100%";
  }
  //로그인 시 채팅 가능
  
});
