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

interface LoginState {
  email: string;
  password: string;
  showPassword: boolean;
  errorMessage: string;
}

const Login = () => {
  const classes = useStyles();

  const [currentState, setCurrentState] = React.useState<LoginState>({
    email: "",
    password: "",
    showPassword: false,
    errorMessage: ""
  });

  const handleChange = (prop: keyof LoginState) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCurrentState({ ...currentState, [prop]: event.target.value });
  };

  const history = useHistory();

  const handleLogin = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    // reset error message
    setCurrentState({ ...currentState, errorMessage: "" });
    
    if (currentState.email && currentState.password) {
      AuthService.login(currentState.email, currentState.password).then(
        () => {
          history.push("/dashboard");
        },
        (error) => {
          setCurrentState({ ...currentState, errorMessage: "Wrong username or password."});
        }
      );
    }
    else {
      setCurrentState({ ...currentState, errorMessage: "Please enter username and password."});
    }
  };

  return (
    <div className="login">
      <h1>Login</h1>
      <div className={classes.root}>
        <p style={{color: 'crimson', fontSize: 14, width: '30ch', marginLeft: 'auto', marginRight: 'auto'}}>{currentState.errorMessage}</p>
        <TextField
          label="Username"
          id="outlined-margin-dense"
          className={classes.textField}
          margin="dense"
          variant="outlined"
          color="secondary"
          onChange={handleChange("email")}
        />
        <br />
        <FormControl variant="outlined" className={classes.textField}>
          <InputLabel htmlFor="outlined-adornment-password" color="secondary">
            Password
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={currentState.showPassword ? "text" : "password"}
            value={currentState.password}
            onChange={handleChange("password")}
            margin="dense"
            color="secondary"
            labelWidth={70}
          />
        </FormControl>

        <br></br>
        <Button
          variant="contained"
          className={classes.button}
          onClick={handleLogin}
        >
          Log in
        </Button>
        <br />
        <p style={{ fontSize: "12pt" }}>
          <a href="/signup">Sign up here</a>
        </p>
      </div>
      <p></p>
    </div>
  );
};

export default Login;
