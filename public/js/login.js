document.addEventListener('DOMContentLoaded', () => {
  //로그인, 로그아웃 버튼 구현
  const loginform = document.querySelector('.form-login');
  const logoutform = document.querySelector('.form-logout');

  //로그인했을때->로그아웃버튼, 로그인안했을때->로그인 버튼
  if (isLogined === true) {
    loginform.style.display = 'none';
    logoutform.style.display = 'block';
  } else {
    loginform.style.display = 'block';
    logoutform.style.display = 'none';
  }
  //로그인, 로그아웃 버튼 구현
});