import React from "react";
import Button from "@material-ui/core/Button";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import AuthService from "../../services/auth.service";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "block",
      flexWrap: "wrap",
      backgroundColor: "white",
      borderRadius: 5,
      padding: "20px 10px",
      margin: "20px 10px",
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: "15ch",
      marginBottom: 10,
    },
    input: {
      backgroundColor: "white",
      borderRadius: 5,
    },
    button: {
      marginTop: 10,
    },
  })
);

interface SignupState {
  name: string;
  username: string;
  password1: string;
  password2: string;
  showPassword: boolean;
  errorMessage: string;
}

const Signup = () => {
  const classes = useStyles();

  const [currentState, setCurrentState] = React.useState<SignupState>({
    name: "",
    username: "",
    password1: "",
    password2: "",
    showPassword: false,
    errorMessage: ''
  });

  const handleChange = (prop: keyof SignupState) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCurrentState({ ...currentState, [prop]: event.target.value });
  };

  const history = useHistory();

  const handleSignup = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    // reset error message
    setCurrentState({ ...currentState, errorMessage: "" });

    // validate user inputs
    if (currentState.name.trim() === '') {
      setCurrentState({ ...currentState, errorMessage: "Please enter your name." });
    }
    else if (currentState.username.trim() === '' || currentState.username.includes(' ')) {
      setCurrentState({ ...currentState, errorMessage: "Please enter a valid username. It should not contain spaces." });
    }
    else if (currentState.password1.trim() === '' || currentState.password1.includes(' ')) {
      setCurrentState({ ...currentState, errorMessage: "Please enter a valid password. It should not contain spaces." });
    }
    else if (currentState.password1 !== currentState.password2) {
      setCurrentState({ ...currentState, errorMessage: "Passwords must match!" });
    }
    else{
      AuthService.register(currentState.name,currentState.username, currentState.password1, currentState.password2)
      .then(
        (response) => {
          if (response.status) {
            setCurrentState({ ...currentState, errorMessage: response.message});
          }
          else {
            history.push("/");
          }
        },
        (error) => {
          setCurrentState({ ...currentState, errorMessage: error.response.data.message || error.message});
        }
      );
    }
  };

  return (
    <div className="login">
      <h1>Sign Up</h1>
      <div className={classes.root}>
        <p style={{color: 'crimson', fontSize: 14, width: '25ch', marginLeft: 'auto', marginRight: 'auto'}}>{currentState.errorMessage}</p>
        <TextField
          label="name"
          id="outlined-margin-dense"
          className={classes.textField}
          margin="dense"
          variant="outlined"
          color="secondary"
          onChange={handleChange("name")}
        />
        <br />
        <TextField
          label="Username"
          id="outlined-margin-dense"
          className={classes.textField}
          margin="dense"
          variant="outlined"
          color="secondary"
          onChange={handleChange("username")}
        />
        <br />
        <FormControl variant="outlined" className={classes.textField}>
          <InputLabel htmlFor="outlined-adornment-password" color="secondary">
            Password
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={currentState.showPassword ? "text" : "password"}
            value={currentState.password1}
            onChange={handleChange("password1")}
            margin="dense"
            color="secondary"
            labelWidth={70}
          />
        </FormControl>
        <br></br>

        <FormControl variant="outlined" className={classes.textField}>
          <InputLabel htmlFor="outlined-adornment-password" color="secondary">
            Confirm Password
          </InputLabel>
          <OutlinedInput
            label="confirm password"
            id="outlined-adornment-password"
            type={currentState.showPassword ? "text" : "password"}
            value={currentState.password2}
            onChange={handleChange("password2")}
            margin="dense"
            color="secondary"
            labelWidth={70}
          />
        </FormControl>

        <br></br>
        <Button
          variant="contained"
          className={classes.button}
          onClick={handleSignup}
        >
          Sign up
        </Button>
        <br/>
        <p style={{fontSize: '12pt'}}><a href='/'>Log in</a></p>
      </div>
      <p></p>
    </div>
  );
};

export default Signup;
