import React from "react";
import "./book-list.css";
import { dummyBooks } from "../mock/dummy-books";
import { BookRow } from "../component/book-row";

export const BookListPage: React.VFC = () => {
  const bookRows = dummyBooks.map((book) => {
    return (
      <BookRow
        book={book}
        key={book.id}
        onMemoChange={(id) => {}}
        onDelete={(id) => {}}
      />
    );
  });
  return (
    <div className="BookList">
      <section className="nav">
        <h1>読みたい本リスト</h1>
        <div className="button-like">本を追加</div>
      </section>
      <section className="main">{bookRows}</section>
    </div>
  );
};
