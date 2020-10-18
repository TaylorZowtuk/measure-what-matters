import React from 'react';
// import clsx from 'clsx';
import { Link } from "react-router-dom";
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
// import InputAdornment from '@material-ui/core/InputAdornment';
// import IconButton from '@material-ui/core/IconButton';
// import Visibility from '@material-ui/icons/Visibility';
// import VisibilityOff from '@material-ui/icons/VisibilityOff';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'block',
            flexWrap: 'wrap',
            backgroundColor: 'white',
            borderRadius: 5,
            padding: "20px 10px",
            margin: "20px 10px"
        },
        textField: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
            width: '15ch',
            marginBottom: 10
        },
        input: {
            backgroundColor: 'white',
            borderRadius: 5
        },
        button: {
            marginTop: 10
        }
    }),
);

interface State {
    email: string,
    password: string;
    showPassword: boolean;
}

const Login = () => {
    const classes = useStyles();

    const [values, setValues] = React.useState<State>({
        email: '',
        password: '',
        showPassword: false,
    });

    const handleChange = (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    // const handleClickShowPassword = () => {
    //     setValues({ ...values, showPassword: !values.showPassword });
    // };

    // const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    //     event.preventDefault();
    // };

    const handleOnClick = () => {
        // TODO: call to backend
    }

    return (
        <div className='login'>
            <h1>Login Interface</h1>
            <p>Here is the login page</p>
            
            <div className={classes.root}>
                <TextField
                    label="E-mail Address"
                    id="outlined-margin-dense"
                    className={classes.textField}
                    margin="dense"
                    variant="outlined"
                    color='secondary'
                    onChange={handleChange('email')}
                />
                <br/>
                <FormControl 
                    variant="outlined"
                    className={classes.textField}
                >
                    <InputLabel htmlFor="outlined-adornment-password" color='secondary'>Password</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        type={values.showPassword ? 'text' : 'password'}
                        value={values.password}
                        onChange={handleChange('password')}
                        margin="dense"
                        color='secondary'
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
                <Button variant="contained" className={classes.button} onClick={handleOnClick}>Log in</Button>

            </div>
            <p></p>

            <Link to="/">
                <Button variant="contained">Dashboard</Button>
            </Link>
        </div>
    );
}

export default Login;