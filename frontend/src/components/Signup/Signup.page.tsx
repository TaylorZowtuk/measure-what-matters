import React from "react";
// import clsx from 'clsx';
import Button from "@material-ui/core/Button";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
// import InputAdornment from '@material-ui/core/InputAdornment';
// import IconButton from '@material-ui/core/IconButton';
// import Visibility from '@material-ui/icons/Visibility';
// import VisibilityOff from '@material-ui/icons/VisibilityOff';
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

}

const Signup = () => {
  const classes = useStyles();

  const [currentState, setCurrentState] = React.useState<SignupState>({
    name: "",
    username: "",
    password1: "",
    password2: "",
    showPassword: false,
  });

  const handleChange = (prop: keyof SignupState) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCurrentState({ ...currentState, [prop]: event.target.value });
  };

  // const handleClickShowPassword = () => {
  //     setValues({ ...values, showPassword: !values.showPassword });
  // };

  // const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
  //     event.preventDefault();
  // };

  const history = useHistory();

  const handleLogin = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    // TODO: call to backend
    // if(this.state.username && this.state.password){
    //     const user = {
    //         username: this.state.email,
    //         password: this.state.password
    //     }

    //     event.preventDefault();
    //     fetch('/auth/login', {
    //         method: 'POST',
    //         body: JSON.stringify(user),
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },})
    //         .then(r => r.json())
    //         .then(token => {

    //         });
    // }

    event.preventDefault();
    if (currentState.name && currentState.username && currentState.password2 && currentState.password1) {
      AuthService.login(currentState.username, currentState.password1).then(
        () => {
          history.push("/dashboard");
        },
        (error) => {
          // const resMessage =
          //     (error.response &&
          //     error.response.data &&
          //     error.response.data.message) ||
          //     error.message ||
          //     error.toString();
          console.log("invalid credential");
        }
      );
    }
  };

  return (
    <div className="login">
      <h1>Sign Up</h1>
      <div className={classes.root}>
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
            // endAdornment={
            //     <InputAdornment position="end">
            //         <IconButton
            //             aria-label="toggle password visibility"
            //             onClick={handleClickShowPassword}
            //             onMouseDown={handleMouseDownPassword}
            //             edge="end"
            //         >
            //         </IconButton>
            //     </InputAdornment>
            // }
            labelWidth={70}
          />
        </FormControl>

        <br></br>
        <Button
          variant="contained"
          className={classes.button}
          onClick={handleLogin}
        >
          Sign up
        </Button>
      </div>
      <p></p>
    </div>
  );
};

export default Signup;
