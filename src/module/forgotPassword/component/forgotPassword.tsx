import React, { useState, useEffect, FormEvent } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  MuiThemeProvider,
  createMuiTheme,
  Container,
  Button,
  CssBaseline,
  TextField,
  Card,
  CardContent,
  Typography,
  makeStyles,
  CircularProgress,
  Box
} from '@material-ui/core';
import { forgotPassword, userData, userPasswordReturnType } from '../action';
import { DefaultState } from '../../forgotPassword/reducer';
import rootReducer from '../../../root-reducer';
import ErrorString from '../../../utils/error-string';

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
  headings: {
    font: 'normal normal medium 20px/27px Futura',
    color: '#707070'
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

interface StoreProps {
  forgotPasswordReducer: DefaultState;
}

interface DispatchProps {
  forgotPassword: (user: userData) => userPasswordReturnType;
}

type Props = StoreProps & DispatchProps & RouteComponentProps;

export const ForgotPassword: React.FC<Props> = (props: Props) => {
  const classes = useStyles();
  const [submitbtnDisabled, setSubmitBtnDisabled] = useState(false);
  const [formData, setFormData] = useState({
    email: ''
  });

  useEffect(() => {
    setSubmitBtnDisabled(true);
  }, []);

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((formData) => ({ ...formData, [name]: value }));
    if (!name.trim() || !value.trim()) {
      setSubmitBtnDisabled(true);
    } else {
      setSubmitBtnDisabled(false);
    }
  };
  const formSubmitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    props.forgotPassword(formData);
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
              Forgot Password
            </Typography>
            <form
              data-testid="formWrapper"
              className={classes.form}
              noValidate
              onSubmit={formSubmitHandler}>
              <h5 className={classes.headings}>
                A Verification link will be sent to your registered email address
              </h5>
              <TextField
                // className={classes.root}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                type="text"
                id="email"
                label="E-mail"
                name="email"
                onChange={inputChangeHandler}
                inputProps={{
                  'data-testid': 'emailInput'
                }}
              />
              <Box>
                <Typography className={classes.errorMessage}>
                  {ErrorString(props.forgotPasswordReducer.error || '') ||
                    props.forgotPasswordReducer.error}
                </Typography>
              </Box>
              <Button
                data-testid="forgotPasswordButton"
                className={classes.submitBtn}
                type="submit"
                // fullWidth
                variant="contained"
                style={{ backgroundColor: '#4491E0', color: '#FFFFFF' }}
                disabled={submitbtnDisabled}>
                {props.forgotPasswordReducer.loading ? (
                  <CircularProgress
                    data-testid="forgotPasswordButtonLoader"
                    className={classes.circularProgress}
                    size={30}
                  />
                ) : (
                  'SEND VERIFICATION EMAIL'
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
  forgotPasswordReducer: state.forgotPasswordReducer
});

export default connect(mapStateToProps, { forgotPassword })(withRouter(ForgotPassword));
