import React, { useState, useEffect, FormEvent } from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { notification } from 'antd';
import {
  Container,
  Button,
  CssBaseline,
  TextField,
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
import Alert from '@material-ui/lab/Alert';

import { resetPassword, userData, userPasswordReturnType } from '../action';
import rootReducer from '../../../root-reducer';
import { DefaultState } from '../../resetPassword/reducer';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
      borderColor: '#4491E0'
    }
  },
  alert: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2)
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
    margin: theme.spacing(3, 0, 2)
  },
  circularProgress: {
    marginLeft: 0,
    color: 'white',
    marginRight: '20px'
  }
}));
const themeDark = createMuiTheme({
  palette: {
    background: {
      default: '#F5F5FA'
    }
  }
});

interface StoreProps {
  resetPasswordReducer: DefaultState;
}

interface DispatchProps {
  resetPassword: (user: userData) => userPasswordReturnType;
}

type Props = StoreProps & DispatchProps & RouteComponentProps;

export const ResetPassword: React.FC<Props> = (props: Props) => {
  const classes = useStyles();
  const [submitbtnDisabled, setSubmitBtnDisabled] = useState(false);
  const [showPassword_0, setShowPassword_0] = useState(false);
  const [showPassword_1, setShowPassword_1] = useState(false);
  const [formData, setFormData] = useState({
    firstReset: true,
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    setSubmitBtnDisabled(true);
  }, []);
  const handleClickShowPassword_1 = () => {
    setShowPassword_1(!showPassword_1);
  };
  const handleClickShowPassword = () => {
    setShowPassword_0(!showPassword_0);
  };

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((formData) => ({ ...formData, [name]: value }));
    if (!formData.password.trim() || !formData.confirmPassword.trim()) {
      setSubmitBtnDisabled(true);
    } else {
      setSubmitBtnDisabled(false);
    }
  };
  const formSubmitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,16}$/;
    if (formData.password !== formData.confirmPassword) {
      // alert('Password Not Matching!');
      notification.open({
        message: 'Password Not Matching!',
        duration: 5,
        type: 'error'
      });
      return false;
    } else {
      if (RE.test(formData.password)) {
        props.resetPassword(formData);
      } else {
        notification.open({
          message:
            'Enter Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character',
          duration: 5,
          type: 'error'
        });
      }
    }
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
              Reset Password
            </Typography>
            <form
              data-testid="formWrapper"
              className={classes.form}
              noValidate
              onSubmit={formSubmitHandler}>
              <TextField
                // className={classes.root}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                type={showPassword_1 ? 'text' : 'password'}
                id="password"
                label="New Password"
                name="password"
                autoComplete="username"
                onChange={inputChangeHandler}
                inputProps={{
                  'data-testid': 'newPassword'
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword_1}>
                        {showPassword_1 ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <TextField
                // className={classes.root}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type={showPassword_0 ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                onChange={inputChangeHandler}
                inputProps={{
                  'data-testid': 'confirmPassword'
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}>
                        {showPassword_0 ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              <Button
                data-testid="resetPasswordButton"
                className={classes.submitBtn}
                type="submit"
                // fullWidth
                variant="contained"
                style={{ backgroundColor: '#4491E0', color: '#FFFFFF' }}
                disabled={submitbtnDisabled}>
                {props.resetPasswordReducer.loading ? (
                  <CircularProgress
                    data-testid="resetPasswordButtonLoader"
                    className={classes.circularProgress}
                    size={30}
                  />
                ) : (
                  'RESET PASSWORD'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>
    </MuiThemeProvider>
  );
};

const mapStateToProps = (state: ReturnType<typeof rootReducer>) => ({
  resetPasswordReducer: state.resetPasswordReducer
});

export default connect(mapStateToProps, { resetPassword })(withRouter(ResetPassword));
