import React, { useState } from "react";

export default function Counter({ totalCount, getCountData }) {
  const [number, setNumber] = useState(0);
  const handleClick = () => {
    setNumber((prev) => prev + 1);
    getCountData((prev) => prev + 1); //토탈 함수 받아옴.
  };

  return (
    <div className="countContainer">
      <div className="number">
        {number} / {totalCount}
      </div>
      <button onClick={handleClick}>Add +</button>
    </div>
  );
}

// 자식:Counter.jsx 부모:AppCounter.jsx
//1. 자식에서 totalCount 프롭을 만든다.
//2. 부모에서 totalCount 속성을 작성한다.
//3. 부모에서 totalCount 속성값을 상태관리 한다. (토탈이 계속 변해야하니까.)
//---------- 1,2,3까지는 일반적, 4,5,6,7은 데이터간 이동
//4. totalCount의 값은 자식컴포에서 발생해야함.(자식컴포넌트 내에 add + 클릭시마다 totalCount가 렌더링 되는거니까)
//5. 자식컴포안에서 발생한 totalCount를 부모에 보내줘야함.
//6. 자식한테서 데이터를 전달 받으려면 부모는 함수를 만들어서 프롭스로 내려줘야됨.
//7. 그 프롭스를 렌더링트리거 안에 넣어주면 됨.

// 결국은 데이터가 어디서 발생해서 어디로 이동해야하는가를 파악해야됨.
