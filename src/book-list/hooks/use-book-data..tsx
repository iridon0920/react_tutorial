import { BookDescription } from "../type/book-description";
import { useState, useEffect } from "react";

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

export const useBookData = (
  title: string,
  author: string,
  maxResults: number
) => {
  const [books, setBooks] = useState([] as BookDescription[]);

  useEffect(() => {
    if (title || author) {
      const url = buildSearchUrl(title, author, maxResults);
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
    //  title, authorの値が前回から変わったときのみ第一引数の関数実行
  }, [title, author, maxResults]);

  return books;
};
