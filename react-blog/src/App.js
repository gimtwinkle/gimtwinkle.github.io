import logo from "./logo.svg";
import "./App.css";
import Button from "./components/button/Button";

function App() {
  return (
    <div className="App">
      <Button bgColor="green">asdfasdf</Button>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

// 글 쓰는 화면 : CreatePost
// 작성버튼, 목록버튼, 타이틀 인풋, 본문 텍스트 아레아, 카테고리 셀렉박스
// 쓴글 상세 화면 : ReadPost
// 타이틀 텍스트, 본문 텍스트, 목록 버튼, 수정버튼
// 글 리스트 : PostList
// a태그(타이틀), 본문 미리보기, 리스트 테이블
