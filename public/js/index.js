document.addEventListener('DOMContentLoaded', function () {
  // 상단 메뉴바 _ 이전 주제 리스트 버튼

  // 상단 메뉴바 _ 가운데 로고
  // 다시 돌아가는데 리스트 내용 실시간으로 바뀐거 받아와야 함

  //상단 메뉴바 _ 로그인 버튼

  //토론 주제 시간
  const time = document.querySelector('.time');

  //토론 주제
  const topic = document.querySelector('.topic');

  //찬성 반대 버튼
  const agree_bar = document.querySelector('.agree-bar');
  const disagree_bar = document.querySelector('.disagree-bar');
  const agree_btn = document.querySelector('.agree-btn');
  const disagree_btn = document.querySelector('.disagree-btn');

  //데이터 베이스에서 비율 값 받아오기
  let agree = 50;
  let disagree = 50;

  //로그인 안하고 그냥 볼 때 찬성 반대 비율 바 보여주기
  //   agree_btn.style.display = 'none';
  //   disagree_btn.style.display = 'none';
  //   agree_bar.style.display = 'block';
  //   disagree_bar.style.display = 'block';

  //   agree_bar.style.width = agree + '%';
  //   disagree_bar.style.width = disagree + '%';

  //로그인 했을때
  //찬성 반대 바 숨기기
  agree_bar.style.display = 'none';
  disagree_bar.style.display = 'none';

  agree_btn.addEventListener('click', () => {
    agree = agree + 1;
    disagree = disagree - 1;
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

  //채팅 입력 부분
  const ul = document.querySelector('.live-debate');
  const opinion_input = document.querySelector('.opinion-input');
  const send = document.querySelector('.send');

  send.addEventListener('click', () => {
    add_agree_opinion('Hi', opinion_input, 'time');
  });

  function add_agree_opinion(nickname, opinion, time) {
    const li = document.createElement('li');
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
  }
});
