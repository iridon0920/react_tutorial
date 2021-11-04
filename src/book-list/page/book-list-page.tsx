import React from "react";
import './book-list.css';

export const BookList: React.VFC = () => {
  return (
    <div className="BookList">
      <section className="nav">
        <h1>読みたい本リスト</h1>
        <div className="button-like">本を追加</div>
      </section>
      <section className="main">
        <h1>チュートリアルを始めましょう</h1>
      </section>
    </div>
  );
};
