import React from "react";
import { Navbar, Nav, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import AuthService from "../services/auth.service";

export default function AppNavbar() {
  return (
    <Navbar bg="light" expand="md">
      <Navbar.Brand href="#home">Measure What Matters</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml auto">
          <Link to="/">
            <Button
              variant="outline-secondary"
              onClick={() => {
                AuthService.logout();
              }}
            >
              Logout
            </Button>{" "}
          </Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
