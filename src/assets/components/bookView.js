import React, { useState, useEffect } from "react";
import "./../css/styles.sass";
import { useParams } from "react-router-dom";
import { AppContext } from "../../appcontext.js";

const BookView = (props) => {
  const { db } = React.useContext(AppContext);
  const { id } = useParams();
  const [book, setBook] = useState({
    isbn: "",
    title: "",
    subtitle: "",
    author: "",
    published: "",
    publisher: "",
    pages: "",
    description: "",
    website: "",
  });
  useEffect(() => {
    db.getBook(id).then((book) => {
      console.log(book);
      setBook(book);
    });
  }, [id, db]);
  return (
    <div className="inputData">
      <header>Book Info</header>
      <div>
        <label className="inputlabels" htmlFor="isbn">
          Book ISBN
        </label>
        <span id="isbn" type="text">
          {book.isbn}
        </span>
        <br />
        <label className="inputlabels" htmlFor="title">
          Book title
        </label>
        <span id="title" type="text">
          {book.title}
        </span>
        <br />
        <label className="inputlabels" htmlFor="subtitle">
          Book subtitle <span className="smalltext">optional</span>
        </label>
        <span id="subtitle" type="text">
          {book.subtitle}
        </span>
        <br />
        <label className="inputlabels" htmlFor="author">
          Author
        </label>
        <span id="author" type="text">
          {book.author}
        </span>
        <br />
        <label className="inputlabels" htmlFor="published">
          Published
        </label>
        <span id="published" type="text">
          {book.published}
        </span>
        <br />
        <label className="inputlabels" htmlFor="publisher">
          Publisher
        </label>
        <span id="publisher" type="text">
          {book.publisher}
        </span>
        <br />
        <label className="inputlabels" htmlFor="pages">
          Number of pages
        </label>
        <span id="pages" type="text">
          {book.pages}
        </span>
        <br />
        <label className="inputlabels" htmlFor="description">
          Description
        </label>
        <span id="description" type="text"></span>
        <br />
        <label className="inputlabels" htmlFor="website">
          website <span className="smalltext">optional</span>
        </label>
        <span id="website" type="text">
          {book.website}
        </span>
        <br />
      </div>
    </div>
  );
};
export default BookView;
