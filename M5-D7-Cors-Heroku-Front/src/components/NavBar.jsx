import React from "react";
import { Navbar } from "react-bootstrap";

const NavBar = (prop) => {
  return (
    <Navbar bg="light">
      <Navbar.Brand href="#home">{prop.title}</Navbar.Brand>
    </Navbar>
  );
};

export default NavBar;
