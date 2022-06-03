import { useState, useEffect, useContext } from "react";
import { AppContext } from "../../appcontext.js";

function Reservation({ reservation, admin, onClick, canLoan }) {
  const BorrowButton = () => canLoan && <button onClick={() => onClick("borrow", reservation)}>borrow</button>;
  const RemoveButton = () => <button onClick={() => onClick("delete", reservation)}>remove</button>;
  return (
    <div className="reservation-element">
      <p>{}</p>
      {admin ? <RemoveButton /> : <BorrowButton />};
    </div>
  );
}

function ReservationView({}) {
  const app = useContext(AppContext);
  const handleReservation = async (cmd, res) => {
    switch (cmd) {
      case "borrow":
        const loan = await app.bookExchanger.tryLoan(res.bookId, res.reserver);
        window.alert(`Your return code is '${loan.code}'`);
        break;
      case "delete":
        const ans = window.confirm(`Do you want to remove reservation: Book ${res.bookId} by ${res.reserver}`);
        if (ans) app.bookExchanger.cancelReservation(res.bookId, res.reserver);
        break;
      default:
        break;
    }
  };
  const Empty = ({ msg }) => (
    <div className="reservation-element">
      <p>{msg}</p>
    </div>
  );
  const elements = app.bookExchanger
    ?.allReservations()
    .map((res, idx) => (
      <Reservation
        key={`reservation${idx}`}
        canLoan={app.bookExchanger.canLoan(res.bookId, res.reservee)}
        reservation={res}
        admin={app.admin}
        onClick={handleReservation}
      />
    )) ?? [<Empty msg="Not connected to the database" />];

  return (
    <div className="reservation-container">
      <div className="reservation-header"></div>
      <div className="reservation-list">{elements.length !== 0 ? elements : <Empty msg="No reservations" />}</div>
      <div className="reservation-footer"></div>
    </div>
  );
}

export default ReservationView;
