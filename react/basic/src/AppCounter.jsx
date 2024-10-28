import { useState } from "react";
import "./App.css";
import Counter from "./components/Counter";

export default function AppCounter() {
  const [count, setCount] = useState(0);

  //토탈 수 내려줄 함수
  const getCountData = () => {
    setCount((prev) => prev + 1);
  };

  return (
    <div className="App">
      <div className="countTotalBox">
        total{count}
        {count < 10 ? "❄️" : "🔥"}
      </div>
      <Counter totalCount={count} getCountData={getCountData} />
    </div>
  );
}
