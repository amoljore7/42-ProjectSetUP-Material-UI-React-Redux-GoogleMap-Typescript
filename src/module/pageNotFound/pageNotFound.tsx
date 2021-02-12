import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
  MuiThemeProvider,
  createMuiTheme,
  Container,
  Button,
  CssBaseline,
  Card,
  CardContent,
  Typography,
  makeStyles
} from '@material-ui/core';
import logo from '../../assets/img/404.svg';

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
    marginBottom: '20px',
    color: '#4491E0',
    textAlign: 'center'
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  typo: {
    color: '#707070',
    textAlign: 'center',
    font: 'normal normal bold 30px/40px Futura'
  },
  submitBtn: {
    margin: theme.spacing(3, 0, 2)
  },
  headings: {
    color: '#707070',
    textAlign: 'center'
    // font: 'normal normal medium 30px/40px Futura'
  }
}));
const themeDark = createMuiTheme({
  palette: {
    background: {
      default: '#F5F5FA'
    }
  }
});

type Props = RouteComponentProps;

const PageNotFound: React.FC<Props> = (props: Props) => {
  const classes = useStyles();

  const clickHandler = () => {
    props.history.push('/login');
  };

  return (
    <MuiThemeProvider theme={themeDark}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Card className={classes.card} variant="outlined">
          <CardContent>
            <div className={classes.title}>
              <img src={logo} alt="React Logo" />
            </div>
            <Typography component="h2" variant="h5" className={classes.typo}>
              Sorry!
            </Typography>
            <Typography className={classes.headings}>We could not find this page</Typography>
            <form className={classes.form} noValidate>
              <Button
                className={classes.submitBtn}
                type="submit"
                fullWidth
                variant="contained"
                style={{ backgroundColor: '#4491E0', color: '#FFFFFF' }}
                onClick={clickHandler}>
                GO TO LOGIN
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>
    </MuiThemeProvider>
  );
};

export default PageNotFound;
