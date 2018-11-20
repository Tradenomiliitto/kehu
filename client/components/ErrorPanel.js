import React from "react";

export default function ErrorPanel({ message }) {
  return (
    <div className="ErrorPanel error-nw">
      <p className="ErrorPanel-text">{message}</p>
    </div>
  );
}
