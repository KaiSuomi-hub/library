/**
 * Create a handler for book loaning and reservations
 */
import { db } from "./database.js";
import Loans from "./loans.js";
import Reservations from "./reservations.js";

const bookExists = async (bookId) => {
  try {
    await db.getBook(bookId);
    return true;
  } catch (err) {
    return false;
  }
};

export default class BookExchange {
  #loans;
  #reservations;
  constructor() {
    this.#loans = new Loans();
    this.#reservations = new Reservations();
    this.promises = [this.#loans.promise, this.#reservations.promise];
  }
  /**
   * Checks if book is available
   * @param {integer} bookId
   * @returns {bool}
   */
  bookAvailable(bookId) {
    return !this.#loans.loaned(bookId) && !this.#reservations.hasReservations(bookId);
  }
  /**
   * Returns the number of people to wait to get the book. 0 if available, 1 if loaned but no reservations.
   * @param {integer} bookId
   * @returns {integer} number of people ahead
   */
  bookQueueLength(bookId) {
    return this.bookAvailable(bookId) ? 0 : this.#reservations.forBook(bookId).length + 1;
  }
  /**
   * Returns all loans and reservations by username
   * @param {string} username
   * @returns {object} loans and reservations
   */
  activityOf(username) {
    return { loans: this.#loans.loanedBy(username), reservations: this.#reservations.reservedBy(username) };
  }

  allLoans() {
    return this.#loans.all();
  }

  allReservations() {
    return this.#reservations.all();
  }

  canLoan(bookId, byWho) {
    if (this.#loans.loaned(bookId)) return false;
    const reservations = this.#reservations.forBook(bookId);
    if (reservations.length === 0) return true;
    return reservations[0].reserver === byWho;
  }

  /**********************************************
   *        ASYNC
   **********************************************/

  async #bookRemoved(bookId) {
    if (await bookExists(bookId)) return false; // if book is still there, do nothing
    //remove reservations but keep loan if it exists
    const reservations = this.#reservations.forBook(bookId);
  }
  /**
   *
   * @param {integer} bookId
   * @param {string} byWho
   * @returns {bool} true
   */
  async cancelReservation(bookId, byWho) {
    if (!(await bookExists(bookId))) {
      // cancel all reservations of the book
    }
  }

  /**
   * Loan if book is available, else throw.
   * @param {integer} bookId
   * @returns {object} loan object
   */
  async tryLoan(bookId, byWho) {
    if (!(await bookExists(bookId))) throw new Error(`Book ${bookId} does not exist!`);
    if (this.#loans.loaned(bookId)) throw new Error(`Book ${bookId} is already loaned`);
    const val = await this.#loans.loan(bookId, byWho);
    return val;
  }
  /**
   * Loan if available, else reserve book. Throws error if already loaned or reserved.
   * @param {integer} bookId
   * @param {string} byWho
   * @returns {Promise<object>} loan object if loaned, null if reserved
   */
  async tryLoanReserve(bookId, byWho) {
    if (!(await bookExists(bookId))) throw new Error(`Book ${bookId} does not exist!`);
    const loan = this.#loans.loanData(bookId);
    if (loan?.loanedBy === byWho) throw new Error(`${byWho} already loaned this book!`);
    if (loan) {
      await this.#reservations.reserveBook(bookId, byWho);
      return null;
    }
    return await this.#loans.loan(bookId, byWho);
  }
  /**
   *Returns the book if code supplied is correct.
   * @param {integer} bookId
   * @param {string} code return code
   * @returns {object} data about the return
   */
  async returnBook(bookId, code) {
    if (!(await bookExists(bookId))) throw new Error(`Book ${bookId} does not exist!`);
    if (!code || typeof code != "string" || code.length !== 4) throw new TypeError("Code must be a 4 digit string");
    //    if (!code || code.length !== 4) throw new Error("Code is wrong");
    const fee = await this.#loans.return(bookId, Number(code));
    if (this.#reservations.hasReservations(bookId)) {
      const reservation = await this.#reservations.popBook(bookId);
      await this.#loans.loan(bookId, reservation.reserver);
      return { available: false, fee }; // book is not available
    }
    return { available: true, fee }; // book is available
  }

  /**
   * Creates a new book exchanger
   * @returns {Promise<BookExchange>} the exchanger
   */
  static async Create() {
    const exchanger = new BookExchange();
    await Promise.all(exchanger.promises);
    return exchanger;
  }
}

const mainTest = async () => {
  const exchanger = await BookExchange.Create();

  //test loaning
  //   try {
  //     let loan = await exchanger.tryLoanReserve(6, "Totally a dude");
  //   } catch (err) {
  //     console.log(err.message, "could not do it");
  //   }

  // test returning and removing a reservation
  //   try {
  const ret = await exchanger.returnBook(6, "1197");
  console.table(ret);
  //   } catch (err) {
  //     console.log(err.message);
  //   }
};

//mainTest();
