import React from "react";
import { Navbar, Nav, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import AuthService from "../services/auth.service";
import CSS from "csstype";

const buttonStyling: CSS.Properties = {
  margin: "10px",
};

export default function AppNavbar() {
  return (
    <Navbar bg="light" expand="md">
      <Navbar.Brand href="#home">Measure What Matters</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <Link to="/matches/upcoming">
            <Button variant="outline-secondary" style={buttonStyling}>
              Recording
            </Button>
          </Link>
          <Link to="/teams">
            <Button variant="outline-secondary" style={buttonStyling}>
              Teams
            </Button>
          </Link>
          <Link to="/create-match">
            <Button variant="outline-secondary" style={buttonStyling}>
              Create Match
            </Button>
          </Link>
          <Link to="/view-account">
            <Button variant="outline-secondary" style={buttonStyling}>
              Account
            </Button>
          </Link>
          <Link to="/">
            <Button
              variant="outline-danger"
              onClick={() => {
                AuthService.logout();
              }}
              style={buttonStyling}
            >
              Logout
            </Button>
          </Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
