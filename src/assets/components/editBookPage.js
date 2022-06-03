import React, { useState, useContext, useEffect } from "react";
// import axios from "axios";
import "./../css/styles.sass";
import { db } from "../data/database.js";
import { AppContext } from "../../appcontext.js";
//let's include props if we want to call this later on some other page
const EditBook = (props) => {
    const app = useContext(AppContext); //I'm really clueless about this use context, we pass along the props?
    const { db } = useContext(AppContext);

    const [books, setAllBooks] = useState([]); //Empty state for all the books

    useEffect(() => {
        db.getAllBooks().then((books) => {
            setAllBooks(books);
        });
    }, [db, setAllBooks]);
    // we pass all the books to above state "books"

    // console.log(books);

    //let's create state for the book to be changed
    const [postBooks, setBooks] = useState({
        id: "",
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

    //add a state to handle receipt div's visibility change
    const [isVisible, setVisible] = useState({
      visibility: "notvisible"
      }
    );
    // a function to handle the visibility change
    const toggleBox = () => {
      if (isVisible.visibility !== "notvisible") {
        setVisible({visibility:"notvisible"});
      } else {
        setVisible({visibility:"dd"});
      }


    };

    // we use below to get an id of book and populate the form
    const pickHandler = (value) => {
        // console.log(value);
        db.getBook(value).then((books) => {
            setBooks(books);
        });
    };

    // here we post the data collected to the state
    const submitHandler = () => {
        //add code here to use tuoppis database
        db.setBook(postBooks.id, postBooks); //get id from state and pass object to database
        // setBooks([]); //clear out state and form
      toggleBox();

    };

    return (
        <div>
            {/* Here we map out all the books from the api  */}
            <select
                name="bookDropdown"
                id="selectAllBooks"
                onChange={
                    (e) => pickHandler(e.target.value) //call pickhandler and pass along event target value
                }
            >
                <option>Select a book</option>
                {books.map((book, index) => {
                    return (
                        <option key={index} value={book.id}>
                            {book.title}
                        </option>
                    );
                })}
            </select>

            <div id={isVisible.visibility} className="submitReceipt">
                {/* above a ternary that handles the visibility change state ? iftrue:iffalse*/}
              <span onClick={toggleBox}>X</span>
              <h4>Changed the book!</h4>
            </div>
            <div className="inputData">
                <header>Please edit your selected book</header>
                <form id="editBookForm" onSubmit={(event) => {
                            event.preventDefault();
                            submitHandler();
                        }}>
                    <label className="inputlabels" htmlFor="isbn">
                        Book ISBN
                    </label>
                    <input
                        name="id"
                        id="id"
                        type="number"
                        value={postBooks.id}
                        readOnly
                        className="hidden"
                        onChange={(e) =>
                            setBooks({ ...postBooks, id: e.target.value })
                        }
                    ></input>
                    <input
                        name="isbn"
                        id="isbn"
                        type="number"
                        value={postBooks.isbn}
                        readOnly
                        placeholder="ISBN cannot be edited"
                        onChange={(e) =>
                            setBooks({ ...postBooks, isbn: e.target.value })
                        }
                    ></input>
                    <br />
                    <label className="inputlabels" htmlFor="btitle">
                        Book title
                    </label>
                    <input
                        name="title"
                        value={postBooks.title}
                        type="text"
                        required
                        placeholder="Book title"
                        onChange={(e) =>
                            setBooks({ ...postBooks, title: e.target.value })
                        }
                    ></input>
                    <br />
                    <label className="inputlabels" htmlFor="subtitle">
                        Book subtitle{" "}
                        <span className="smalltext">optional</span>
                    </label>
                    <input
                        name="subtitle"
                        type="text"
                        value={postBooks.subtitle}
                        placeholder="Book subtitle"
                        onChange={(e) =>
                            setBooks({ ...postBooks, subtitle: e.target.value })
                        }
                    ></input>
                    <br />
                    <label className="inputlabels" htmlFor="author">
                        Author
                    </label>
                    <input
                        name="author"
                        type="text"
                        value={postBooks.author}
                        required
                        placeholder="Book author"
                        onChange={(e) =>
                            setBooks({ ...postBooks, author: e.target.value })
                        }
                    ></input>
                    <br />
                    <label className="inputlabels" htmlFor="published">
                        Published
                    </label>
                    <input
                        name="published"
                        type="date"
              value={postBooks.published.split("T")[0]}
              // make the date to yyyy-mm-dd from iso8601 format
                        required
                        placeholder="Date"
                        onChange={(e) =>
                            setBooks({
                                ...postBooks,
                                published: e.target.value,
                            })
                        }
                    ></input>
                    <br />
                    <label className="inputlabels" htmlFor="publisher">
                        Publisher
                    </label>
                    <input
                        name="publisher"
                        type="text"
                        value={postBooks.publisher}
                        required
                        placeholder="Publisher"
                        onChange={(e) =>
                            setBooks({
                                ...postBooks,
                                publisher: e.target.value,
                            })
                        }
                    ></input>
                    <br />
                    <label className="inputlabels" htmlFor="pages">
                        Number of pages
                    </label>
                    <input
                        name="pages"
                        type="number"
                        value={postBooks.pages}
                        required
                        placeholder="# of pages"
                        onChange={(e) =>
                            setBooks({ ...postBooks, pages: e.target.value })
                        }
                    ></input>
                    <br />
                    <label className="inputlabels" htmlFor="description">
                        Description
                    </label>
                    <input
                        name="description"
                        type="text"
                        value={postBooks.description}
                        required
                        placeholder="Description"
                        onChange={(e) =>
                            setBooks({
                                ...postBooks,
                                description: e.target.value,
                            })
                        }
                    ></input>
                    <br />
                    <label className="inputlabels" htmlFor="website">
                        Website <span className="smalltext">optional</span>
                    </label>
                    <input
                        name="website"
                        value={postBooks.website}
                        type="text"
                        placeholder="Website"
                        onChange={(e) =>
                            setBooks({ ...postBooks, website: e.target.value })
                        }
                    ></input>
                    <br />
                    <button
                        id="bookEditButton"
                        type="submit"

                    >
                        Change the data
                    </button>
                    {/* above form created the state and clicking submit posted it */}
                </form>
            </div>
        </div>
    );
};

export default EditBook;
