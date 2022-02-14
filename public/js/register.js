document.addEventListener('DOMContentLoaded', () => {
  const message = document.querySelector('#checkMessage');
  message.innerHTML = '닉네임을 입력해주세요.';
  const submit = document.querySelector('#submit');
  submit.disabled = true;

  const nickname = document.querySelector('#nickname');

  nickname.addEventListener('input', async (e) => {
    await validateNickname(nickname.value);
  });

  const form = document.querySelector('#register');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await validateAndSubmitNickname(nickname.value);
  });
});

// 닉네임 검증만
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

  const message = document.querySelector('#checkMessage');
  const submit = document.querySelector('#submit');

  // !!!!!입력한 닉네임이 중복임을 확인하는 부분!!!!!!
  if (nickname === '') {
    message.innerHTML = '닉네임을 입력해주세요.';
    submit.disabled = true;
  }
  //
  else if (state === 1) {
    message.innerHTML = '중복된 닉네임입니다.';
    submit.disabled = true;
  }
  //
  else if (state === 2) {
    message.innerHTML =
      '닉네임에는 영어, 한글, 숫자, 언더바(_)만 입력 가능합니다.';
    submit.disabled = true;
  }
  //
  else if (state === 0) {
    message.innerHTML = '사용가능한 닉네임입니다.';
    submit.disabled = false;
  }
  return;
}

// 닉네임 검증하고 서버에 저장까지
async function validateAndSubmitNickname(nickname) {
  /**상태코드
   * 0 : 사용 가능하여 저장 완료
   * 1 : 중복
   * 2 : 형식 지키지 않음
   */
  const response = await fetch(`/auth/register`, {
    method: 'POST',
    body: JSON.stringify({ nickname: nickname }),
    headers: { 'Content-Type': 'application/json' },
  });
  const state = await response.json();
  console.log(state);

  if (nickname === '') {
    alert('닉네임을 입력해주세요.');
  }
  //
  else if (state === 1) {
    alert('중복된 닉네임입니다.');
  }
  //
  else if (state === 2) {
    alert('닉네임에는 영어, 한글, 숫자, 언더바(_)만 입력 가능합니다.');
  }
  //
  else if (state === 0) {
    alert('회원가입이 완료되었습니다.');
    location.replace('/');
  }
}
