let socket = io.connect('http://localhost:3000/message');

document.addEventListener('DOMContentLoaded', function () {
  //채팅 입력 부분
  const ul = document.querySelector('.live-debate');
  const send = document.querySelector('#send');

  socket.on('new-message-to-client', (data) => {
    console.log(data);

    //let opinion = opinion_input;
    send_opinion('Hi', data.newmessage, 'time');
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
});
