import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../appcontext.js";

const BookList = () => {
  const { db, bookExchanger } = useContext(AppContext);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const getBooks = async () => {
      try {
        const books = await db.getAllBooks();
        const availableBooks = books.filter((book) => {
          return bookExchanger.bookAvailable(book.id);
        });
        setBooks(availableBooks);
      } catch (error) {
        console.error(error);
      }
    };
    if (bookExchanger !== null) {
      getBooks();
    }
  }, [db, bookExchanger, setBooks]);

  return (
    <ul>
      {books.map((book, index) => {
        return (
          <li key={index}>
            <Link to={`/bookview/${book.id}`}>{book.title}</Link>
          </li>
        );
      })}
    </ul>
  );
};

export default BookList;
