document.addEventListener('DOMContentLoaded', function () {
  
  //채팅 입력 부분
  const ul = document.querySelector('.live-debate');
  const opinion_input = document.querySelector('.opinion-input');
  const send = document.querySelector('.send');

  send.addEventListener('click', () => {
    send_opinion('nickname', opinion_input.value, 'timeset');

  });

  send.addEventListener('keypress', (event) => {
    if (event.keyCode === 13) {
      send_opinion('nickname', opinion_input.value, 'timeset');
    }
  })


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
    ul.scrollTop = ul.scrollHeight
    opinion_input.value = "";
  }

});
