import { CACHE } from "./database.js";
/**
 * Keeps track of books borrowed
 */
export default class Loans {
  #loans; // by bookId
  #ready;
  constructor() {
    this.#ready = false;
    this.#loans = {};
    this.promise = this.#loadFromDb();
  }

  get ready() {
    return this.#ready;
  }

  all() {
    const loans = [];
    for (const book in this.#loans) loans.push(this.loanData(book));
    return loans;
  }

  /**
   *
   * @param {integer} bookId
   * @returns {bool} true is book is loaned
   */
  loaned(bookId) {
    return bookId in this.#loans;
  }

  /**
   * get loan
   */
  loanData(bookId) {
    return { ...this.#loans[bookId] };
  }

  /**
   * Returns an array of bookIds that the username has loaned
   * @param {string} username
   * @returns {integer[]} the bookIds
   */
  loanedBy(username) {
    const ret = [];
    for (const [bookId, loan] of Object.entries(this.#loans)) {
      if (loan.loanedBy === username) ret.push(bookId);
    }
    return ret;
  }

  /*****************************************
    ASYNC FUNTIONS
  ******************************************/

  /**
   *
   * @param {integer} bookId
   * @param {string} byWho
   * @returns {object} loan data
   */
  async loan(bookId, byWho) {
    if (this.loaned(bookId)) throw new Error(`Book ${bookId} is already loaned!`);
    await this.#createLoan(bookId, byWho, 3 * 60 * 60 * 1000); // 3hour loan
    return { ...this.#loans[bookId] };
  }
  /**
   *
   * @param {integer} bookId
   * @param {integer} code for returning the book
   * @returns {Promise<number>} the late fee
   */
  async return(bookId, code) {
    if (!this.loaned(bookId)) throw new Error(`Book ${bookId} is not loaned!`);
    if (code !== this.#loans[bookId].returnCode) throw new Error("Wrong code!");
    const due = this.#loans[bookId].timeDue;
    const overtime = new Date().getTime() - due;
    await this.#removeLoan(bookId);
    return overtime > 0 ? Math.floor(overtime / 100000000) * 100 : 0;
  }
  /**
   * Cancels a loan for book by id
   * @param {integer} bookId
   * @returns {object} loan data that was removed
   */
  async cancel(bookId) {
    if (!(bookId in this.#loans)) throw new Error(`Book ${bookId} is not on loan!`);
    const loan = this.#loans[bookId];
    await this.#removeLoan(bookId);
    return loan;
  }

  async #loadFromDb() {
    const loans = await CACHE.get("loans");
    loans.forEach((loan) => (this.#loans[loan.bookId] = loan));
    this.#ready = true;
  }

  async #createLoan(bookId, byWho, duration) {
    const time = new Date().getTime();
    const loan = {
      bookId,
      loanedBy: byWho,
      timeLoaned: time,
      timeDue: time + duration,
      returnCode: Math.floor(Math.random() * 10000),
    };
    loan.id = await CACHE.add("loans", loan);
    this.#loans[bookId] = loan;
  }
  async #removeLoan(bookId) {
    const loan = this.#loans[bookId];
    await CACHE.del(`loans/${loan.id}`);
    delete this.#loans[bookId];
  }
}
