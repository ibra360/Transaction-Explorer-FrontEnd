import React, { useState } from "react";
import DropDownArrow from "../Assets/DropDownArrow.png";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

export default function CustomDropdown() {
  const [toggleState, setToggleState] = useState(false);
  const [selectedValue, setSelectedValue] = useState("Select Network");

  function toggle() {
    setToggleState(!toggleState);
  }

  return (
    <Dropdown isOpen={toggleState} toggle={() => toggle()}>
      <DropdownToggle
        className="p-2"
        data-toggle="dropdown"
        onClick={toggle}
        style={{
          width: "400px",
          border: "1px solid grey",
          borderRadius: "6px",
          width: "100%",
          fontWeight: "500",
        }}
        role="button"
        tag="p"
      >
        {selectedValue}
        <img
          src={DropDownArrow}
          width="20px"
          style={{ position: "absolute",right:"14px", top:"12px" }}
        />
      </DropdownToggle>
      <DropdownMenu style={{ width: "100%" }}>
        <DropdownItem onClick={() => setSelectedValue(" Ethreum Mainnet")}>
          Ethreum Mainnet
        </DropdownItem>

        <DropdownItem onClick={() => setSelectedValue(" Rinkeby Testnet")}>
          Rinkeby Testnet
        </DropdownItem>
        <DropdownItem onClick={() => setSelectedValue(" Goerli Testnet")}>
          Goerli Testnet
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
