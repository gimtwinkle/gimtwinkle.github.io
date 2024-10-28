import React from "react";
import Avatar from "./Avatar";
import "./Profile.css";

export default function Profile({ img, name, position, isNew }) {
  return (
    <div className="profile">
      <Avatar img={img} isNew={isNew} />
      <h1>{name}</h1>
      <div>{position}</div>
    </div>
  );
}
