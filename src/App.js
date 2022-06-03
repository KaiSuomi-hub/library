import "./App.css";
import { useState, useEffect } from "react";
import { db } from "./assets/data/database.js";
import { AppContext } from "./appcontext.js";
import CreateNewBook from "./assets/components/createNewBookPage.js";
import EditBook from "./assets/components/editBookPage.js";
import BookView from "./assets/components/bookView.js";
import BookList from "./assets/components/bookList.js";
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import BookExchange from "./assets/data/bookexchange";
import AdminSwitch from "./assets/components/adminSwitch.js";
import ReturnBookView from "./assets/components/returnBookView";

function App() {
  const [database] = useState(db);
  const [admin, setAdmin] = useState(false);
  const [bookExchanger, setBookExchanger] = useState(null); // before using check that it's not null

  useEffect(() => {
    const loadExchanger = async () =>
      setBookExchanger(await BookExchange.Create());
    loadExchanger();
  }, []); // only run once at start

  return (
    <AppContext.Provider
      value={{ db: database, admin, setAdmin, bookExchanger }}
    >
      <div className="App">
        <header className="App-header">
          <Router>
            <div>
              <nav>
                <ul>
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <Link to="/booklist">Book List</Link>
                  </li>
                  <li>
                    <Link to="/returnbook">Return book</Link>
                  </li>

                  {admin ? (
                    <li>
                      <Link to="/createbook">Create book</Link>
                    </li>
                  ) : null}
                  {admin ? (
                    <li>
                      <Link to="/editbook">Edit a book</Link>
                    </li>
                  ) : null}
                </ul>
                <br />
                <AdminSwitch />
              </nav>
              <Routes>
                <Route path="/bookview/:id" element={<BookView />} />
                <Route path="/booklist" element={<BookList />} />
                <Route path="/returnbook" element={<ReturnBookView />} />
                <Route path="/createbook" element={<CreateNewBook />} />
                <Route path="/editbook" element={<EditBook />} />
                <Route path="/" element={<Home />} />
              </Routes>
            </div>
          </Router>
        </header>
      </div>
    </AppContext.Provider>
  );
}
function Home() {
  return <h2>Home</h2>;
}

export default App;
