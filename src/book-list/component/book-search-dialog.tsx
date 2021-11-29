import { BookSearchDialogProps } from "../type/book-search-dialog-props";
import React, { useEffect, useState, useRef } from "react";
import { BookDescription } from "../type/book-description";
import { BookSearchItem } from "./book-search-item";

function buildSearchUrl(
  title: string,
  author: string,
  maxResults: number
): string {
  const url = "https://www.googleapis.com/books/v1/volumes?q=";
  const conditions: string[] = [];
  if (title) {
    conditions.push(`in title:${title}`);
  }
  if (author) {
    conditions.push(`in author:${author}`);
  }
  return url + conditions.join("+") + `&maxResults=${maxResults}`;
}

type JsonItem = {
  volumeInfo: {
    title: string;
    authors?: string[];
    imageLinks?: {
      smallThumbnail: string;
    };
  };
};

function extractBooks(json: { items: JsonItem[] }): BookDescription[] {
  const items: JsonItem[] = json.items;
  return items.map((item) => {
    const volumeInfo = item.volumeInfo;
    return {
      title: volumeInfo.title,
      authors: volumeInfo.authors ? volumeInfo.authors.join(", ") : "",
      thumbnail: volumeInfo.imageLinks
        ? volumeInfo.imageLinks.smallThumbnail
        : "",
    };
  });
}

export const BookSearchDialog = (props: BookSearchDialogProps): JSX.Element => {
  const [books, setBooks] = useState([] as BookDescription[]);
  const titleRef = useRef<HTMLInputElement>(null);
  const authorRef = useRef<HTMLInputElement>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (isSearching) {
      const url = buildSearchUrl(
        titleRef.current!.value,
        authorRef.current!.value,
        props.maxResults
      );
      fetch(url)
        .then((res) => {
          return res.json();
        })
        .then((json) => {
          return extractBooks(json);
        })
        .then((books) => {
          setBooks(books);
        })
        .catch((err) => {
          console.error(err);
        });
    }
    setIsSearching(false);
  }, [isSearching]);

  const handleSearchClick = () => {
    if (!titleRef.current!.value && !authorRef.current!.value) {
      alert("条件を入力してください");
      return;
    }
    setIsSearching(true);
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
          <input type="text" ref={titleRef} placeholder="タイトルで検索" />
          <input type="text" ref={authorRef} placeholder="著者名で検索" />
        </div>
        <div className="button-like" onClick={handleSearchClick}>
          検索
        </div>
      </div>
      <div className="search-results">{bookItems}</div>
    </div>
  );
};
