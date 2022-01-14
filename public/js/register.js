const SERVER_URL = `http://localhost:3000`;

document.addEventListener('DOMContentLoaded', () => {
  const message = document.querySelector('#checkMessage');
  message.innerHTML = '닉네임을 입력해주세요.';
  const submit = document.querySelector('#submit');
  submit.disabled = true;

  document.addEventListener('input', async () => {
    const inputNickname = document.querySelector('#nickname').value;
    const response = await fetch(`${SERVER_URL}/users/list`, {
      method: 'POST',
    });
    const list = await response.json();

    // !!!!!입력한 닉네임이 중복임을 확인하는 부분!!!!!!
    if (inputNickname === '') {
      // 빈칸일 때
      message.innerHTML = '닉네임을 입력해주세요.';
      submit.disabled = true;
    } else if (list.includes(inputNickname)) {
      // 중복일 때
      message.innerHTML = '중복된 닉네임입니다.';
      submit.disabled = true;
    } else {
      // 중복이 아닐 때
      message.innerHTML = '사용가능한 닉네임입니다.';
      submit.disabled = false;
    }
  });
});
