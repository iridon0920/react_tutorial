import React, { useState } from "react";
import "./book-list.css";
import { BookRow } from "../component/book-row";
import ReactModal from "react-modal";
import { BookSearchDialog } from "../component/book-search-dialog";
import { BookToRead } from "../type/board-to-read";
import { BookDescription } from "../type/book-description";

ReactModal.setAppElement("#root");

const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    padding: 0,
    transform: "translate(-50%, -50%)",
  },
};

export const BookListPage = (): JSX.Element => {
  const [books, setBooks] = useState([] as BookToRead[]);
  const [modalIsOpen, setModalIsOpen] = useState(false);

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

  const handleAddClick = () => {
    setModalIsOpen(true);
  };

  const handleModalClose = () => {
    setModalIsOpen(false);
  };

  const handleBookAdd = (book: BookDescription) => {
    const newBook: BookToRead = { ...book, id: Date.now(), memo: "" };
    const newBooks = [...books, newBook];
    setBooks(newBooks);
    setModalIsOpen(false);
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
        <div className="button-like" onClick={handleAddClick}>
          本を追加
        </div>
      </section>
      <section className="main">{bookRows}</section>
      <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={handleModalClose}
        style={customStyles}
      >
        <BookSearchDialog
          maxResults={20}
          onBookAdd={(book) => {
            handleBookAdd(book);
          }}
        />
      </ReactModal>
    </div>
  );
};
