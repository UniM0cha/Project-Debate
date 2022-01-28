const topicSocket = io.connect('/topic');

document.addEventListener('DOMContentLoaded', () => {
  topicSocket.emit('request-refresh-opinion-type', { reserveId: reserveId });
  getAllChat();
});

const ul = document.querySelector('.live-debate');

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
    chatList.forEach(item => {
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

      const nickname = item.chatId;
      const opinion = item.chatMessage;
      const time = ampm + ' ' + hour + ':' + min
      const opinionType = item.opinionType

      //채팅 작성하기
      ul.scrollTop = ul.scrollHeight;
      if (opinionType === 'agree') {
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
      } else if (opinionType === 'disagree') {
        const li = document.createElement('li');
        li.classList.add(opinionType);
        //클래스 agree와 disagree추가
        const dom = `
            <div class='nickname'>${nickname}</div>
            <div class='opinion-time'>${time}</div>
              <div
                class='user-opinion'
              >${opinion}</div>
            `;
        li.innerHTML = dom;
        ul.appendChild(li);
      }
    });
    console.log(`chatList: ${JSON.stringify(chatList, null, 4)}`);
  }
  return;
}
