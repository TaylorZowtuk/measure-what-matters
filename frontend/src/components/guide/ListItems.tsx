import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { Link } from "react-router-dom";

export const mainListItems = (
  <div>
    <a href="#start" style={{ textDecoration: "none", color: "#000000DE" }}>
      <ListItem button>
        <ListItemText primary="Start" />
      </ListItem>
    </a>
    <a href="#dashboard" style={{ textDecoration: "none", color: "#000000DE" }}>
      <ListItem button>
        <ListItemText primary="Dashboard" />
      </ListItem>
    </a>
    <a
      href="#create-match"
      style={{ textDecoration: "none", color: "#000000DE" }}
    >
      <ListItem button>
        <ListItemText primary="Create Match" />
      </ListItem>
    </a>
    <a href="#recording" style={{ textDecoration: "none", color: "#000000DE" }}>
      <ListItem button>
        <ListItemText primary="Recording" />
      </ListItem>
    </a>
    <a href="#teams" style={{ textDecoration: "none", color: "#000000DE" }}>
      <ListItem button>
        <ListItemText primary="Teams" />
      </ListItem>
    </a>
    <a href="#account" style={{ textDecoration: "none", color: "#000000DE" }}>
      <ListItem button>
        <ListItemText primary="Account" />
      </ListItem>
    </a>
  </div>
);

export const secondaryListItems = (
  <div>
    <Link
      to="/dashboard"
      style={{ textDecoration: "none", color: "#000000DE" }}
    >
      <ListItem button>
        <ListItemText primary="< back" />
      </ListItem>
    </Link>
  </div>
);
