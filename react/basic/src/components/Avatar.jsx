import React from "react";

export default function Avatar({ img, isNew }) {
  return (
    <div>
      <img src={img} alt=""></img>
      {isNew && <span className="new">new</span>}
    </div>
  );
}
