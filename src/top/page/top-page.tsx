import React from "react";
import { Link } from "react-router-dom";

export const TopPage: React.VFC = () => {
  return (
    <div>
      <p>
        <Link to="/game">OXゲーム</Link>
      </p>
      <p>
        <Link to="/book-list">書籍情報</Link>
      </p>
    </div>
  );
};
