let socket = io.connect('http://localhost:3000/message');

document.addEventListener('DOMContentLoaded', function () {



  //찬성반대 비율바 구현
  const agree_bar = document.querySelector('.agree-bar');
  const disagree_bar = document.querySelector('.disagree-bar');
  const agree_btn = document.querySelector('.agree-btn');
  const disagree_btn = document.querySelector('.disagree-btn');

  let sum
  let agree
  let disagree
  let agreebar_width
  let disagreebar_width

  function calculate() {
    
  }

  if(isLogined == true){
      agree_bar.style.display = 'none';
      disagree_bar.style.display = 'none';

      agree_btn.addEventListener('click', () => {
        agree = agree + 1;
        disagree = disagree - 1;
        //찬성 반대 선택 이후 버튼 숨기기
        agree_btn.style.display = 'none';
        disagree_btn.style.display = 'none';
        //찬성 반대 비율 변경
        agree_bar.style.width = agree + '%';
        disagree_bar.style.width = disagree + '%';
        //찬성 반대 비율 바 보여주기
        agree_bar.style.display = 'block';
        disagree_bar.style.display = 'block';
      });

      disagree_btn.addEventListener('click', () => {
        agree = agree - 1;
        disagree = disagree + 1;
        console.log(agree);
        console.log(disagree);
        //찬성 반대 선택 이후 버튼 숨기기
        agree_btn.style.display = 'none';
        disagree_btn.style.display = 'none';
        //찬성 반대 비율 변경
        agree_bar.style.width = agree + '%';
        disagree_bar.style.width = disagree + '%';
        //찬성 반대 비율 바 보여주기
        agree_bar.style.display = 'block';
        disagree_bar.style.display = 'block';
      });

  }else{
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
});
