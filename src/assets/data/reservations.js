import { CACHE } from "./database.js";
/**
 * Keeps track of reservations
 */
export default class Reservations {
  #reservations; // by bookId
  #ready;
  constructor() {
    this.#reservations = {};
    this.#ready = false;
    this.promise = this.#loadFromDb();
  }

  get ready() {
    return this.#ready;
  }

  all() {
    const res = [];
    for (const book in this.#reservations) res.concat(this.forBook(book));
    return res;
  }

  /**
   * Returns a reservation array for given book.
   * @param {number} bookId
   * @returns {reservation[]} book reservations for a given book
   */
  forBook(bookId) {
    return this.#reservations[bookId] || [];
  }

  /**
   *
   * @param {integer} bookId
   * @returns {bool} true if there are reservations
   */
  hasReservations(bookId) {
    return this.forBook(bookId).length > 0;
  }
  /**
   * Finds all the
   * @param {string} username
   * @returns {interger[]} the books reserved
   */
  reservedBy(username) {
    const ret = [];
    for (const [bookId, reservations] of Object.entries(this.#reservations)) {
      const reservation = reservations.find((x) => x.reserver === username);
      if (reservation) ret.push(bookId);
    }
    return ret;
  }

  /****************************************
   *            ASYNC
   * **************************************/

  /**
   * Reserves book for 'byWho'
   * @param {integer} bookId
   * @param {string} byWho
   */
  async reserveBook(bookId, byWho) {
    if (this.#hasReserver(bookId, byWho)) throw new Error(`${byWho} has already reserved this book!`);
    await this.#createReservation(bookId, byWho);
  }
  /**
   * Cancel reservation by byWho of the book bookId.
   * @param {integer} bookId
   * @param {string} byWho
   * @returns {object} reservation data that was removed
   */
  async cancel(bookId, byWho) {
    const resData = this.#reservations[bookId]?.find((res) => res.reserver === byWho);
    if (!resData) throw new Error(`${byWho} has not reserved book ${bookId}`);
    await this.#removeReservation(bookId, byWho);
    return resData;
  }

  async cancelAll(bookId) {
    const reservations = this.forBook(bookId);
    if (reservations.length === 0) return;
    await Promise.all(reservations.map((res) => CACHE.del(`reservations/${res.id}`)));
    this.#reservations[bookId] = [];
  }

  /**
   * Removes and returns next in line reservation, if none, throw error. Intendeed to become the next loaner.
   * @param {integer} bookId
   * @returns {object} reservation data
   */
  async popBook(bookId) {
    const reservation = this.forBook(bookId)[0];
    if (!reservation) throw new Error(`Book ${bookId} does not have reservations`);
    await this.#removeReservation(bookId, reservation.reserver);
    return reservation;
  }

  #hasReserver(bookId, reserver) {
    for (const res of this.forBook(bookId)) if (res.reserver === reserver) return true;
    return false;
  }
  async #loadFromDb() {
    const reservations = await CACHE.get("reservations");
    reservations.forEach((res) => {
      this.#reservations[res.bookId] = this.#reservations[res.bookId] || [];
      this.#reservations[res.bookId].push(res);
    });
    //TODO: check that bookIds are still in the database
    this.#ready = true;
  }
  async #createReservation(bookId, byWho) {
    const reservation = { bookId, reserver: byWho, time: new Date().getTime() };
    reservation.id = await CACHE.add("reservations", reservation);
    if (!(bookId in this.#reservations)) this.#reservations[bookId] = [];
    this.#reservations[bookId].push(reservation);
  }
  async #removeReservation(bookId, byWho) {
    const reservations = this.forBook(bookId);
    const idx = reservations.findIndex((x) => x.reserver === byWho);
    if (idx < 0) throw new Error(`${byWho} does not have reservation for this book`);
    await CACHE.del(`reservations/${reservations[idx].id}`);
    reservations.splice(idx, 1);
  }
}
