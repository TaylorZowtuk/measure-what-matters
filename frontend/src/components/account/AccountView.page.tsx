import React from "react";
import axios from "axios";
import authHeader from "../../services/auth.header";
import { TextField } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";

interface accountState {
  firstName: string;
  lastName: string;
  username: string;
  firstDisable: boolean;
  lastDisable: boolean;
  firstEdit: string;
  lastEdit: string;
}

class AccountView extends React.Component<{}, accountState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      username: "",
      firstDisable: true,
      lastDisable: true,
      firstEdit: "",
      lastEdit: "",
    };

    // get user profile
    axios.get("/users/profile", { headers: authHeader() }).then((response) => {
      if (response.data) {
        console.log(response.data);
        let splitted = response.data.name.split(" ");
        this.setState({
          firstName: splitted[0],
          lastName: splitted[1],
          username: response.data.username,
          firstEdit: splitted[0],
          lastEdit: splitted[1],
        });
      }
    });
  }

  handleFirstEdit = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({ firstEdit: e.target.value });
  };

  handleFirstDisable = (): void => {
    if (this.state.firstDisable) {
      this.setState({ firstDisable: false });
    }
    console.log("clicked");
  };

  handleLastEdit = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({ lastEdit: e.target.value });
  };

  handleLastDisable = (): void => {
    if (this.state.firstDisable) {
      this.setState({ lastDisable: false });
    }
    console.log("clicked");
  };

  render() {
    return (
      <div
        style={{
          backgroundColor: "white",
          color: "#282c34",
          borderRadius: "5px",
        }}
      >
        <h2 style={{ padding: 0, margin: "20px" }}>Account Information</h2>
        <div
          style={{
            display: "flex",
            marginBottom: "20px",
            marginLeft: "20px",
            marginRight: "20px",
          }}
        >
          <p
            style={{
              textAlign: "left",
              margin: "0",
              padding: "10px",
              fontSize: "22px",
              width: "12ch",
            }}
          >
            Username:
          </p>
          <TextField
            margin="dense"
            variant="outlined"
            color="secondary"
            value={this.state.username}
            disabled={true}
          />
        </div>
        <div
          style={{
            display: "flex",
            marginBottom: "20px",
            marginLeft: "20px",
            marginRight: "20px",
          }}
        >
          <p
            style={{
              textAlign: "left",
              margin: "auto",
              marginTop: 0,
              padding: "10px",
              fontSize: "22px",
              width: "12ch",
            }}
          >
            First Name:
          </p>
          <div style={{ display: "block" }}>
            <TextField
              margin="dense"
              variant="outlined"
              color="secondary"
              value={this.state.firstEdit}
              disabled={this.state.firstDisable}
              style={{ margin: "auto" }}
              onChange={
                this.state.firstDisable ? (): void => {} : this.handleFirstEdit
              }
            />
            <p style={{ fontSize: "14px" }}>Ok</p>
          </div>
          <EditIcon onClick={this.handleFirstDisable}></EditIcon>
          {/* <p style={{ fontSize: "14px" }}>Ok</p> */}
        </div>

        <div
          style={{
            display: "flex",
            marginBottom: "20px",
            marginLeft: "20px",
            marginRight: "20px",
          }}
        >
          <p
            style={{
              textAlign: "left",
              margin: "auto",
              padding: "10px",
              fontSize: "22px",
              width: "12ch",
            }}
          >
            Last Name:
          </p>
          <TextField
            margin="dense"
            variant="outlined"
            color="secondary"
            value={this.state.lastEdit}
            disabled={this.state.lastDisable}
            style={{ margin: "auto" }}
            onChange={
              this.state.firstDisable ? (): void => {} : this.handleFirstEdit
            }
          />
          <EditIcon onClick={this.handleLastDisable}></EditIcon>
        </div>
      </div>
    );
  }
}

export default AccountView;
