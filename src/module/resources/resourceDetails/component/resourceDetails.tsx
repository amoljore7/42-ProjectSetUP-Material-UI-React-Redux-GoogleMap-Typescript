import React from 'react';
import { Grid, Typography, TextField, Card, Button, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import camelize from '../../../../utils/camel-case';
import { RouteComponentProps } from 'react-router-dom';
import Skeleton from '@material-ui/lab/Skeleton';
import CircularProgressOverlay from '../../../../components/circular-progress-overlay';
import { nearByResource } from '../../saga';

const useStyles = makeStyles(() => ({
  formWrapper: {
    margin: '2rem 2rem 5rem 2rem'
  },
  headingWrapper: {
    margin: '2rem auto 1rem 2rem',
    width: '100%',
    display: 'flex',
    justifyContent: 'center'
  },
  fieldStyle: {
    width: '55rem',
    margin: 'auto',
    display: 'flex',
    justifyContent: 'space-between',
    height: '3rem',
    alignItems: 'center'
  },
  fieldLabel: {
    marginLeft: '3rem'
  },
  textFieldStyle: {
    marginRight: '6rem',
    height: '2rem',
    width: '25rem',
    background: '#FFF'
  },
  textFieldDisabled: {
    backgroundColor: '#F0F0F7',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  fieldWrapper: {
    display: 'flex',
    justifyContent: 'center'
  },
  input: {
    height: '2rem'
  },
  buttonsWrapper: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    paddingLeft: '24px',
    paddingRight: '24px',
    height: '4rem',
    marginTop: '1rem',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  buttonStyle: {
    marginRight: '0.5rem'
  },
  lineStyling: {
    marginTop: '1rem',
    width: '100%'
  },
  resourceTypeCardWrapper: {
    width: '55rem',
    display: 'flex',
    justifyContent: 'space-between',
    margin: 'auto',
    height: '4rem'
  },
  resourceTypeWrapper: {
    marginLeft: '3rem',
    marginTop: 'auto',
    marginBottom: 'auto'
  },
  resourceTypeTextField: {
    marginRight: '6rem',
    marginTop: '2.5px',
    width: '25rem'
  }
}));

interface StoreProps {
  resourceLoading: boolean;
  resource: Record<string, string>;
  resourceInput: string;
  nearByResources: nearByResource[];
  error: string;
}

interface DispatchProps {
  saveResourceDetails: (id: string | undefined, resourceDetails: any) => void;
  getResourceDetails: (id: string | undefined) => void;
}
interface MatchParams {
  id: string | undefined;
}

interface locationProps {
  location: {
    pathname: string;
    state: {
      formData: {
        address: string;
        category: string;
      };
      resourceName: string;
    };
  };
}

type Props = StoreProps & DispatchProps & RouteComponentProps<MatchParams> & locationProps;

const ResourceDetails: React.FC<Props> = (props: Props) => {
  const classes = useStyles();
  const categoryName = props.location.state.formData.category;
  const resourceName = props.location.state.resourceName;
  const [resourceDetails, setResourceDetails] = React.useState({}) as any;

  React.useEffect(() => {
    setResourceDetails(props.resource);
  }, [props.resource]);

  React.useEffect(() => {
    props.getResourceDetails(props.match.params.id);
  }, []);

  const inputChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setResourceDetails({ ...resourceDetails, [name]: value });
  };

  const saveResourceDetailsHandler = () => {
    setTextFieldDisabled(true);
    props.saveResourceDetails(props.match.params.id, resourceDetails);
  };

  const [isTextFieldDisabled, setTextFieldDisabled] = React.useState(true);
  const editHandler = () => {
    setTextFieldDisabled(false);
  };

  const discardChangesHandler = () => {
    setResourceDetails(props.resource);
    setTextFieldDisabled(true);
  };

  const backHandler = () => {
    props.history.goBack();
  };
  if (props.resourceLoading) {
    return (
      <div>
        <CircularProgressOverlay />
      </div>
    );
  } else {
    return (
      <Grid container spacing={0}>
        <div className={classes.headingWrapper}>
          <Typography variant="h5">Resource Details</Typography>
        </div>
        <Card className={classes.resourceTypeCardWrapper} elevation={3}>
          <Typography className={classes.resourceTypeWrapper} variant="subtitle1">
            {categoryName.split(',')[1]}
          </Typography>
          <TextField
            className={classes.resourceTypeTextField}
            id="outlined-read-only-input"
            defaultValue={resourceName || ''}
            InputProps={{
              readOnly: true
            }}
            variant="outlined"
          />
        </Card>
        <hr color="#3366ff" className={classes.lineStyling} />
        <Grid className={classes.formWrapper} item xs={12} sm={12} md={12} lg={12}>
          {props.resource == {} ? (
            <Skeleton />
          ) : (
            Object.entries(props.resource).map((prop: string[]) => {
              const name = camelize(prop[0]);
              return (
                <div className={classes.fieldStyle} key={prop[0]}>
                  <label className={classes.fieldLabel} htmlFor={name}>
                    {(prop[0].charAt(0).toUpperCase() + prop[0].slice(1))
                      .replace(/([A-Z])/g, ' $1')
                      .trim()}
                  </label>
                  <Tooltip
                    title={
                      <h2 style={{ color: '#fff' }}>{resourceDetails[prop[0]] || 'No Data'}</h2>
                    }
                    placement="top"
                    arrow
                    enterDelay={500}
                    leaveDelay={200}>
                    <TextField
                      className={classes.textFieldStyle}
                      disabled={isTextFieldDisabled}
                      variant="outlined"
                      margin="normal"
                      required
                      id={prop[0]}
                      name={prop[0]}
                      defaultValue={prop[1]}
                      value={resourceDetails[prop[0]]}
                      InputProps={{
                        className: classes.input,
                        classes: { disabled: classes.textFieldDisabled }
                      }}
                      onChange={inputChangeHandler}
                    />
                  </Tooltip>
                </div>
              );
            })
          )}
          <Card elevation={3} className={classes.buttonsWrapper}>
            <Button
              className={classes.buttonStyle}
              onClick={backHandler}
              variant="contained"
              color="primary">
              Back
            </Button>
            {isTextFieldDisabled ? (
              <Button
                className={classes.buttonStyle}
                onClick={editHandler}
                variant="contained"
                color="primary">
                Edit
              </Button>
            ) : (
              <>
                <Button
                  className={classes.buttonStyle}
                  onClick={discardChangesHandler}
                  variant="contained"
                  color="primary">
                  Discard Changes
                </Button>
                <Button
                  onClick={saveResourceDetailsHandler}
                  className={classes.buttonStyle}
                  variant="contained"
                  color="primary">
                  Save
                </Button>
              </>
            )}
          </Card>
        </Grid>
      </Grid>
    );
  }
};

export default ResourceDetails;
