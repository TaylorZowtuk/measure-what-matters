import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import DashboardIcon from "@material-ui/icons/Dashboard";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import PeopleIcon from "@material-ui/icons/People";
import BarChartIcon from "@material-ui/icons/BarChart";
import LayersIcon from "@material-ui/icons/Layers";
import AssignmentIcon from "@material-ui/icons/Assignment";

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
    <ListSubheader inset>Saved reports</ListSubheader>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Current month" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Last quarter" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Year-end sale" />
    </ListItem>
  </div>
);
