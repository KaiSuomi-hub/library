import React from "react";
import { ButtonGroup, ToggleButton } from "react-bootstrap";
import { AppContext } from "../../appcontext.js";

const AdminSwitch = () => {
  const { setAdmin } = React.useContext(AppContext);
  const [value, setValue] = React.useState("1");

  const handleChange = (e) => {
    const value = e.currentTarget.value;
    if (value === "2") {
      setAdmin(true);
    } else {
      setAdmin(false);
    }
    setValue(value);
  };

  return (
    <ButtonGroup className="mb-2">
      <ToggleButton
        id="tbg-btn-1"
        type="radio"
        value="1"
        checked={value === "1"}
        onChange={handleChange}
      >
        User
      </ToggleButton>
      <ToggleButton
        id="tbg-btn-2"
        type="radio"
        value="2"
        checked={value === "2"}
        onChange={handleChange}
      >
        Admin
      </ToggleButton>
    </ButtonGroup>
  );
};

export default AdminSwitch;
