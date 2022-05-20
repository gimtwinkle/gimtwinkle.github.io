/****************************/
/****   사용자이름 저장 JS   ****/
/****************************/

const loginForm = document.querySelector("#login-form");
const loginInput = document.querySelector("#login-form input"); //인풋 두개일경우 변수는 input 하나로 지정 후 이벤트 트리거로 역할분리 
const greeting = document.querySelector("#greeting");

//string을 반복할 경우 오타 방지를 위해 대문자 변수로 공통사용
const HIDDEN_CLASSNAME = "hidden"; 
const USERNAME_KEY = "username";

//폼 최초 제출시 function
function onLoginSubmit(event){
    event.preventDefault();
    loginForm.classList.add(HIDDEN_CLASSNAME);

    const username = loginInput.value;

    greeting.innerText = `Hello ${username}`; //백쿼트로 전체 문자입력 가능 
    greeting.classList.remove(HIDDEN_CLASSNAME);

    localStorage.setItem(USERNAME_KEY,username);
}

//폼 기제출시 function
function paintGreetings(username){
  greeting.innerText = `Hello ${username}`; 
  greeting.classList.remove(HIDDEN_CLASSNAME);
  
}

const savedUserName = localStorage.getItem(USERNAME_KEY);//로컬스토리지 저장값(사용자이름) 가져오기
if(savedUserName === null){
  //로컬 스토리지 저장값(사용자이름) 있을시
  loginForm.classList.remove(HIDDEN_CLASSNAME);
  loginForm.addEventListener("submit",onLoginSubmit);
}else{
  //로컬 스토리지 저장값(사용자이름) 없을시
  paintGreetings(savedUserName);
}




