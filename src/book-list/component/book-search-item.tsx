import React from "react";
import { BookSearchItemProps } from "../type/book-search-item-props";

export const BookSearchItem = (props: BookSearchItemProps): JSX.Element => {
  const { title, authors, thumbnail } = props.description;
  const handleAddBookClick = () => {
    props.onBookAdd(props.description);
  };
  return (
    <div className="book-search-item">
      <h2 title={title}>{title}</h2>
      <div className="authors" title={authors}>
        {authors}
      </div>
      {thumbnail ? <img src={thumbnail} alt="" /> : null}
      <div className="add-book" onClick={handleAddBookClick}>
        <span>+</span>
      </div>
    </div>
  );
};
