const SERVER_URL = `http://localhost:3000`;

document.addEventListener('DOMContentLoaded', () => {
  const message = document.querySelector('#checkMessage');
  message.innerHTML = '닉네임을 입력해주세요.';
  const submit = document.querySelector('#submit');
  submit.disabled = true;

  const nickname = document.querySelector('#nickname');

  nickname.addEventListener('input', async () => {
    const inputNickname = nickname.value;
    const state = await validateNickname(inputNickname);

    // !!!!!입력한 닉네임이 중복임을 확인하는 부분!!!!!!
    if (inputNickname === '') {
      message.innerHTML = '닉네임을 입력해주세요.';
      submit.disabled = true;
    } else if (state === 1) {
      message.innerHTML = '중복된 닉네임입니다.';
      submit.disabled = true;
    } else if (state === 2) {
      message.innerHTML =
        '닉네임에는 영어, 한글, 숫자, 언더바(_)만 입력 가능합니다.';
      submit.disabled = true;
    } else if (state === 0) {
      message.innerHTML = '사용가능한 닉네임입니다.';
      submit.disabled = false;
    }
  });

  const form = document.querySelector('#register');
  form.addEventListener('submit', async (e) => {
    const inputNickname = nickname.value;
    const state = await validateNickname(inputNickname);
    if (inputNickname === '') {
      e.preventDefault();
      alert('닉네임을 입력해주세요.');
    } else if (state === 1) {
      e.preventDefault();
      alert('중복된 닉네임입니다.');
    } else if (state === 2) {
      e.preventDefault();
      alert('닉네임에는 영어, 한글, 숫자, 언더바(_)만 입력 가능합니다.');
    } else if (state === 0) {
      e.submit();
    }
  });
});

async function validateNickname(nickname) {
  /**상태코드
   * 0 : 사용 가능
   * 1 : 중복
   * 2 : 형식 지키지 않음
   */
  const response = await fetch(`/users/check`, {
    method: 'POST',
    body: JSON.stringify({ nickname: nickname }),
    headers: { 'Content-Type': 'application/json' },
  });
  const state = await response.json();
  return state;
}
