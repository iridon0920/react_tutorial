import React, { useState } from "react";
import "./book-list.css";
import { dummyBooks } from "../mock/dummy-books";
import { BookRow } from "../component/book-row";

export const BookListPage = (): JSX.Element => {
  const [books, setBooks] = useState(dummyBooks);

  const handleBookDelete = (id: number) => {
    const newBooks = books.filter((book) => book.id !== id);
    setBooks(newBooks);
  };

  const handleBookMemoChange = (id: number, memo: string) => {
    const newBooks = books.map((book) => {
      if (book.id === id) {
        book.memo = memo;
      }
      return book;
    });
    setBooks(newBooks);
  };

  const bookRows = books.map((book) => {
    return (
      <BookRow
        book={book}
        key={book.id}
        onMemoChange={(id, memo) => handleBookMemoChange(id, memo)}
        onDelete={(id) => handleBookDelete(id)}
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
