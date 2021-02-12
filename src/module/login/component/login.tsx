import React, { useState, useEffect, FormEvent } from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import {
  Container,
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Card,
  CardContent,
  Typography,
  makeStyles,
  CircularProgress,
  InputAdornment,
  IconButton,
  Box
} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import ErrorString from '../../../utils/error-string';

import { userLoginReturnType, userData } from '../action';
import { DefaultState } from '../reducer';
import rootReducer from '../../../root-reducer';
import { userLogin } from '../action';
import { getCurrentUser } from '../../../utils/local-storage';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
      borderColor: '#4491E0'
    }
  },
  card: {
    marginTop: theme.spacing(8),
    minWidth: 275,
    padding: '20px'
  },
  title: {
    font: 'normal normal bold 24px/24px Futura',
    marginBottom: '20px',
    color: '#4491E0'
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  signIn: {
    color: '#707070',
    font: 'normal normal bold 26px/35px Futura'
  },
  submitBtn: {
    margin: theme.spacing(3, 0, 2),
    font: 'normal normal medium 14px/16px Roboto'
  },
  circularProgress: {
    marginLeft: 0,
    color: 'white',
    marginRight: '20px'
  },
  forgotPassword: {
    color: '#4491E0'
  },
  errorMessage: {
    color: 'red'
  }
}));
const themeDark = createMuiTheme({
  palette: {
    background: {
      default: '#F5F5FA'
    }
  }
});

interface storeProps {
  loginReducer: DefaultState;
}

interface DispatchProps {
  userLogin: (user: userData) => userLoginReturnType;
}

type Props = storeProps & RouteComponentProps & DispatchProps;

export const LoginPage: React.FC<Props> = (props: Props) => {
  const classes = useStyles();
  const [submitbtnDisabled, setSubmitBtnDisabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const clickHandlerEmail = () => {
    props.history.push('/forgot-password');
  };

  useEffect(() => {
    if (getCurrentUser()) {
      props.history.push('user');
    }
  }, [props.loginReducer]);
  useEffect(() => {
    setSubmitBtnDisabled(true);
  }, []);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((formData) => ({ ...formData, [name]: value }));
    if (!formData.username.trim() || !formData.password.trim() || !value.trim()) {
      setSubmitBtnDisabled(true);
    } else {
      setSubmitBtnDisabled(false);
    }
  };
  const formSubmitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    props.userLogin(formData);
  };

  return (
    <MuiThemeProvider theme={themeDark}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Card className={classes.card} variant="outlined">
          <CardContent>
            <Typography component="h1" variant="h5" className={classes.title}>
              TeleNavigation 2.0
            </Typography>
            <Typography component="h2" variant="h5" className={classes.signIn}>
              Sign In
            </Typography>
            <form
              data-testid="formWrapper"
              className={classes.form}
              noValidate
              onSubmit={formSubmitHandler}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                onChange={inputChangeHandler}
                inputProps={{
                  'data-testid': 'username'
                }}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                onChange={inputChangeHandler}
                inputProps={{
                  'data-testid': 'password'
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <Box>
                <Typography className={classes.errorMessage}>
                  {ErrorString(props.loginReducer.error) || props.loginReducer.error}
                </Typography>
              </Box>
              <Button
                data-testid="loginButton"
                className={classes.submitBtn}
                type="submit"
                // fullWidth
                variant="contained"
                style={{ backgroundColor: '#4491E0', color: '#FFFFFF' }}
                disabled={submitbtnDisabled}>
                {props.loginReducer.loading ? (
                  <CircularProgress
                    data-testid="loginLoader"
                    className={classes.circularProgress}
                    size={30}
                  />
                ) : (
                  'LOGIN'
                )}
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link
                    onClick={clickHandlerEmail}
                    variant="body2"
                    className={classes.forgotPassword}>
                    Forgot password?
                  </Link>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Container>
    </MuiThemeProvider>
  );
};

const mapStateToProps = (state: ReturnType<typeof rootReducer>) => ({
  loginReducer: state.loginReducer
});

export default connect(mapStateToProps, { userLogin })(withRouter(LoginPage));
