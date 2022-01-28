document.addEventListener('DOMContentLoaded', () => {
  getAllChat();
});

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
