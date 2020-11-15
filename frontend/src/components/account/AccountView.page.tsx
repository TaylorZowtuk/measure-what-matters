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
  errorMessage: string;
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
      errorMessage: "",
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
    if (this.state.lastDisable) {
      this.setState({ lastDisable: false });
    }
    console.log("clicked");
  };

  handleFirstSave = (): void => {
    if (this.state.firstEdit.trim() === "") {
      this.setState({ errorMessage: "Cannot have empty first/last name" });
    } else {
      let tempFirst = this.state.firstEdit;
      this.setState({
        firstName: tempFirst,
        firstDisable: true,
        errorMessage: "",
      });
      axios
        .post(
          "/users/profile/edit",
          { name: this.state.firstEdit + " " + this.state.lastName },
          { headers: authHeader() }
        )
        .then(
          (response) => {
            console.log(response);
          },
          (error) => {
            console.log(error);
          }
        );
    }
  };

  handleFirstCancel = (): void => {
    let tempFirst = this.state.firstName;
    this.setState({
      firstEdit: tempFirst,
      firstDisable: true,
      errorMessage: "",
    });
  };

  handleLastSave = (): void => {
    if (this.state.lastEdit.trim() === "") {
      this.setState({ errorMessage: "Cannot have empty first/last name" });
    } else {
      let tempLast = this.state.lastEdit;
      this.setState({
        lastName: tempLast,
        lastDisable: true,
        errorMessage: "",
      });
      axios
        .post(
          "/users/profile/edit",
          { name: this.state.firstName + " " + this.state.lastEdit },
          { headers: authHeader() }
        )
        .then(
          (response) => {
            console.log(response);
          },
          (error) => {
            console.log(error);
          }
        );
    }
  };

  handleLastCancel = (): void => {
    let tempLast = this.state.lastName;
    this.setState({ lastEdit: tempLast, lastDisable: true, errorMessage: "" });
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
        <p
          style={{
            color: "crimson",
            fontSize: 14,
            width: "30ch",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          {this.state.errorMessage}
        </p>
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
            <div
              style={{
                display: this.state.firstDisable ? "none" : "flex",
                margin: 0,
              }}
            >
              <p
                style={{ fontSize: "14px", margin: "0 10px", color: "crimson" }}
                onClick={this.handleFirstSave}
              >
                Save
              </p>
              <p
                style={{ fontSize: "14px", margin: "0 10px", color: "crimson" }}
                onClick={this.handleFirstCancel}
              >
                Cancel
              </p>
            </div>
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
          <div style={{ display: "block" }}>
            <TextField
              margin="dense"
              variant="outlined"
              color="secondary"
              value={this.state.lastEdit}
              disabled={this.state.lastDisable}
              style={{ margin: "auto" }}
              onChange={
                this.state.lastDisable ? (): void => {} : this.handleLastEdit
              }
            />
            <div
              style={{
                display: this.state.lastDisable ? "none" : "flex",
                margin: 0,
              }}
            >
              <p
                style={{ fontSize: "14px", margin: "0 10px", color: "crimson" }}
                onClick={this.handleLastSave}
              >
                Save
              </p>
              <p
                style={{ fontSize: "14px", margin: "0 10px", color: "crimson" }}
                onClick={this.handleLastCancel}
              >
                Cancel
              </p>
            </div>
          </div>
          <EditIcon onClick={this.handleLastDisable}></EditIcon>
        </div>
      </div>
    );
  }
}

export default AccountView;
