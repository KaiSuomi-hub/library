import React, { useContext, useState } from "react";
import { Form } from "react-bootstrap";
import { AppContext } from "../../appcontext";

const ReturnBookView = () => {
  const { bookExchanger } = useContext(AppContext);
  const [code, setCode] = useState(0);
  const [bookId, setBookId] = useState(0);
  const [error, setError] = useState("");

  const onBorrowCodeChange = (e) => {
    setCode(e.target.value);
  };

  const onBookIdChange = (e) => {
    setBookId(e.target.value);
  };
  const onSubmit = async () => {
    try {
      if (bookExchanger) {
        const ret = await bookExchanger.returnBook(bookId, code);
        if (!ret.available) {
          setError("Not available");
        }
      }
    } catch (error) {
      setError("Wrong code or book id");
    }
  };

  const isError = error !== "";

  return (
    <div className="inputData">
      <Form>
        <header>Please enter the return book details </header>
        <label className="inputlabels" htmlFor="bookId">
          Book Id
        </label>
        <input
          name="bookId"
          type="number"
          value={bookId}
          required
          placeholder="Enter the book id"
          onChange={onBookIdChange}
        ></input>
        <br />
        <label className="inputlabels" htmlFor="borrowCode">
          Borrow Code
        </label>

        <input
          name="borrowCode"
          type="number"
          value={code}
          required
          placeholder="Enter the four digit code"
          onChange={onBorrowCodeChange}
        ></input>
        <br />
        <button id="bookReturnButton" type="submit" onClick={onSubmit}>
          Return book to library
        </button>
        {isError ? <p>{error}</p> : null}
      </Form>
    </div>
  );
};

export default ReturnBookView;
