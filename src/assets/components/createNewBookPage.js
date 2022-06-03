import React, { useState, useContext } from "react";
// import axios from "axios";
import "./../css/styles.sass";
import { db } from "../data/database.js";
import { AppContext } from "../../appcontext.js";

const CreateNewBook = () => {
    const app = useContext(AppContext);


    //let's create state for the book to be changed
    const [postBooks, setBooks] = useState({
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
        isVisible: false,
    });
    // a function to handle the visibility change
    const toggleBox = () => {
        setVisible((prevState) => ({ isVisible: !prevState.isVisible }));
    };

    // here we post the data collected to the state
    const submitHandler = () => {
        console.log(postBooks);
        //add code here to use tuoppis database
        app.db.addBook(postBooks);
        // setBooks(''); //clear out state and form
        toggleBox();
    };

    return (
        <div>
            <div className={`submitReceipt ${isVisible ? "hidden" : ""}`}>
                {/* above a ternary that handles the visibility change*/}
                <h4>Added a new book</h4>
            </div>
            <div className="inputData">
                <header>Please input data for a new book</header>
                <form id="createNewBookForm">
                    <label className="inputlabels" htmlFor="isbn">
                        Book ISBN
                    </label>
                    <input
                        name="isbn"
                        type="number"
                        value={postBooks.isbn}
                        required
                        placeholder="Book ISBN"
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
                        value={postBooks.published}
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
                        id="bookSaveButton"
                        type="submit"
                        onClick={(event) => {
                            // event.preventDefault();
                            submitHandler();
                        }}
                    >
                        Save a new book to database
                    </button>
                    {/* above form created the state and clicking submit posted it */}
                </form>
            </div>
        </div>
    );
};

export default CreateNewBook;
