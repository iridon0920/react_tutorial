import { BookSearchDialogProps } from "../type/book-search-dialog-props";
import React, { useState } from "react";
import { BookDescription } from "../type/book-description";
import { BookSearchItem } from "./book-search-item";

export const BookSearchDialog = (props: BookSearchDialogProps) => {
  const [books, setBooks] = useState([] as BookDescription[]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  const handleTitleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleAuthorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthor(e.target.value);
  };

  const handleSearchClick = () => {
    if (!title && !author) {
      alert("条件を入力してください");
      return;
    }
  };

  const handleBookAdd = (book: BookDescription) => {
    props.onBookAdd(book);
  };

  const bookItems = books.map((book, idx) => {
    return (
      <BookSearchItem
        description={book}
        onBookAdd={(book) => handleBookAdd(book)}
        key={idx}
      />
    );
  });

  return (
    <div className="dialog">
      <div className="operation">
        <div className="conditions">
          <input
            type="text"
            onChange={handleTitleInputChange}
            placeholder="タイトルで検索"
          />
          <input
            type="text"
            onChange={handleAuthorInputChange}
            placeholder="著者名で検索"
          />
        </div>
        <div className="button-like" onClick={handleSearchClick}>
          検索
        </div>
      </div>
      <div className="search-results">{bookItems}</div>
    </div>
  );
};
