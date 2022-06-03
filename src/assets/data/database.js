import axios from "axios";

const apiLocation = "http://localhost:3004";
const cacheTime = 5 * 60 * 1000; // 5min in ms
const parentPath = (path) => {
  const arr = path.split("/");
  arr.pop();
  return arr.join("/");
};
/**
 * Caches the reads from the server. After cacheTime the data is read again.
 */
export const CACHE = {
  /**
   * Callback for apicontent changed
   * @param {string} apiPath
   * @param {*} value
   */
  apiUpdated: (apiPath, value) => {},
  apiNeedsUpdate: (apiPath) => {},
  values: {},
  get: async (apiPath) => {
    let val = CACHE.values[apiPath];
    const time = new Date().getTime();
    if (!val || time - val.time > cacheTime) {
      delete CACHE.values[apiPath];
      const res = await axios.get(`${apiLocation}/${apiPath}`);
      val = { data: res.data, time };
      CACHE.values[apiPath] = val;
    }
    return val.data;
  },
  set: async (apiPath, data) => {
    const time = new Date().getTime();
    const res = await axios.put(`${apiLocation}/${apiPath}`, data);
    CACHE.values[apiPath] = { data: res.data, time };
    CACHE.apiUpdated(apiPath, res.data);
    return res.data;
  },
  add: async (apiPath, data) => {
    const time = new Date().getTime();
    const res = await axios.post(`${apiLocation}/${apiPath}`, data);
    const id = res.data.id;
    if (!id) throw new Error("Response didn't have id");
    CACHE.values[`${apiPath}/${id}`] = { data: res.data, time };
    CACHE.apiUpdated(`${apiPath}/${id}`, res.data);
    CACHE.apiUpdated(apiPath, id);
    delete CACHE.values[apiPath]; // invalidate parent or modify list?
    return id;
  },
  del: async (apiPath) => {
    const res = await axios.delete(`${apiLocation}/${apiPath}`);
    const parent = parentPath(apiPath);
    CACHE.apiUpdated(apiPath, undefined);
    delete CACHE.values[apiPath];
    delete CACHE.values[parent]; // this or modify list?
  },
};

const validISBN = (isbn) => true; // maybe add some validation

/**
 * The functions to access the book database
 */
export const db = {
  /**
   * Gets book data from the database
   * @param {number} id
   * @returns {Promise<object?>} fulfilled -> book obj, rejected -> null
   */
  getBook: (id) => CACHE.get(`books/${id}`),
  /**
   * Updates existing books
   * @param {int} id
   * @param {object} book
   * @returns {Promise<bool>} update success status
   */
  setBook: (id, book) => CACHE.set(`books/${id}`, book),
  /**
   *Adds new book to database. Returns id of added book if succesful, error message otherwise.
   * @param {object} book
   * @returns {Promise<int | string>} id of the added book or error message
   */
  addBook: async (book) => {
    const books = await CACHE.get("books");
    delete book.id;
    if (!books) throw new Error("could not connect to the server!");
    const hasAlready = books.reduce((hasISBN, curBook) => hasISBN || curBook.isbn === book.isbn, false);
    if (hasAlready) throw new Error("book with this isbn already exists!"); // Add counter?
    const validation = db.validBook(book);
    if (validation !== "ok") throw new Error(validation);
    const id = await CACHE.add("books", book);
    return id;
  },
  /**
   *Removes a book
   * @param {int} id
   */
  removeBook: (id) => CACHE.del(`books/${id}`),
  /**
   * Gets all the books from the database (optionally sorted by a property)
   * @param {string} sortedBy The property you want to sort by, if none given, unsorted.
   * @param {bool} ascending ascending or descending order. default ascending
   * @returns {Promise<object[] | null>} succesful -> array of books, failed -> null
   */
  getAllBooks: async (sortedBy = "", ascending = true) => {
    const books = await CACHE.get("books");
    if (sortedBy) {
      books.sort((left, right) => {
        const x = left[sortedBy];
        const y = right[sortedBy];
        const cmp = (y > x) - (x > y);
        return ascending ? -cmp : cmp;
      });
    }
    return [...books];
  },
  /**
   *Checks that all the fields in the book are set with acceptable values.
   *If the are problems the returned string is "property-name:err-message"
   * @param {object} book
   * @returns {string} "ok" if no problems.
   */
  validBook: (book) => {
    const errs = [];
    //these properties are tested to be present and have a value other than "" or 0
    const req_props = ["isbn", "title", "author", "published", "publisher", "pages", "description"];
    for (const req of req_props) if (!(req in book) || !book[req]) errs.push(`${req}:required`);
    // not required to have value, but enforced to exist as property.
    const opt_props = ["subtitle", "website"];
    opt_props.forEach((prop) => (book[prop] = book[prop] || ""));

    const validators = { isbn: validISBN, pages: (x) => Number(x) > 0 };
    for (const prop in validators) if (!validators[prop](book[prop]) && book[prop]) errs.push(`${prop}:invalid value`);
    return errs.length ? errs.join(";") : "ok";
  },
  /**
   * TODO: Add queries, like author, publisher, etc. also string matching
   */
  queryBooks: async (queryParams) => {},
};

// *****************************************
// *             TESTING                   *
// *****************************************
// Ignore code below.

const testReads = async () => {
  // console.log("Single book");
  // const book = await db.getBook(1);
  // console.log(book?.title);
  console.log("All books");
  const bytitle_des = await db.getAllBooks("author", true);
  console.log(bytitle_des.map((x) => x.author).join(" | "));
  // const byauth_asc = await db.getAllBooks("author", false);
  // console.log(byauth_asc.map((x) => x.author).join(" | "));
};

const testWrites = async () => {
  // console.log("New book");
  // const newBook = {
  //   isbn: "nada",
  //   title: "How to code like a monkey",
  //   author: "Jamppa",
  //   published: new Date().toISOString(),
  //   publisher: "buutti",
  //   pages: 2,
  //   description: "it's a pamflet",
  // };
  // const id = await db.addBook(newBook);
  const readBook = await db.getBook(9);
  // console.table(newBook);
  console.table(readBook);
  readBook.website = "http://localhost:3004";
  const res = await db.setBook(9, readBook);
  console.table(readBook);
};

const testRemove = async () => {
  let allbooks = await db.getAllBooks();
  console.log("before del", allbooks?.map((x) => x.title).join(", "));
  const book = await db.getBook(1);
  await db.removeBook(1);
  console.log("after del", allbooks?.map((x) => x.title).join(", "));
  delete book.id;
  await db.addBook(book);
  console.log("after add", allbooks?.map((x) => x.title).join(", "));
};

// testWrites();
//testReads();
//testRemove();
