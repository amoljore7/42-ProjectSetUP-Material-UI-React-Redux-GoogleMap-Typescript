import React from 'react';
import { Box, Grid, Typography, TextField, Card, Button, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { ValidatorForm } from 'react-material-ui-form-validator';
import CircularProgressOverlay from '../../../../components/circular-progress-overlay';
import { RouteComponentProps } from 'react-router-dom';
import { notification } from 'antd';
import { locationAndSitesItemType } from '../saga';

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
    marginRight: '12rem',
    height: '2rem',
    width: '25rem',
    background: '#FFF'
  },
  categoryNameStyle: {
    marginRight: '12rem',
    height: '2rem',
    width: '25rem',
    fontSize: '1rem',
    fontWeight: 600
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
  headerStyle: {
    color: '#707070',
    fontSize: '2rem',
    fontWeight: 600
  },
  dropDownHeight: {
    maxHeight: 30
  }
}));

interface StoreProps {
  resourceFields: string[];
  locationAndSites: locationAndSitesItemType[];
  status: string;
  error: string;
  resourceFieldsLoading: boolean;
}

interface DispatchProps {
  addResource: (resourceDetails: any) => void;
  getResourceFields: (categoryName: string) => void;
}

interface locationProps {
  location: {
    pathname: string;
    state: { address: string; category: string };
  };
}

type Props = StoreProps & DispatchProps & RouteComponentProps & locationProps;

const ResourceForm: React.FC<Props> = (props: Props) => {
  const spId = props.location.state.category.split(',')[0];
  const categoryName = props.location.state.category.split(',')[1] || '';

  const classes = useStyles();
  const [resourceDetails, setResourceDetails] = React.useState({
    siteName: '',
    spId: spId,
    status: 'active',
    location: ''
  }) as any;

  React.useEffect(() => {
    props.getResourceFields(categoryName);
  }, [props.location.state]);
  const inputChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setResourceDetails({ ...resourceDetails, [name]: value });
  };

  const addResourceHandler = () => {
    const mobileNum = /^[0]?[789]\d{9}$/;
    // if (!mobileNum.test(resourceDetails.phoneNo)) {
    if (resourceDetails.phoneNo) {
      notification.open({
        message: 'Please enter valid mobile number...!',
        duration: 5,
        type: 'error'
      });
      return;
    }
    props.addResource(resourceDetails);
  };

  const resetHandler = () => {
    props.resourceFields.map((resource: string) => {
      setResourceDetails({
        [resource]: '',
        siteName: '',
        spId: spId,
        status: 'active',
        location: ''
      });
    });
  };
  const cancelHandler = () => {
    props.history.goBack();
  };

  if (props.resourceFieldsLoading) {
    return (
      <div>
        <CircularProgressOverlay />
      </div>
    );
  } else {
    return (
      <Grid container spacing={0}>
        <Box className={classes.headingWrapper}>
          <Typography className={classes.headerStyle} variant="h6">
            Add New Resource
          </Typography>
        </Box>
        {props.resourceFields && props.resourceFields.length && (
          <Grid className={classes.formWrapper} item xs={12} sm={12} md={12} lg={12}>
            <ValidatorForm key="form" onSubmit={addResourceHandler}>
              <div className={classes.fieldStyle}>
                <span>Category</span>
                <span className={classes.categoryNameStyle}>{categoryName}</span>
              </div>
              <div className={classes.fieldStyle}>
                <label>{'Location'}</label>
                <TextField
                  className={classes.textFieldStyle}
                  name="location"
                  variant="outlined"
                  placeholder="Select Resource Type"
                  select
                  SelectProps={{
                    native: true,
                    MenuProps: { classes: { paper: classes.dropDownHeight } }
                  }}
                  value={resourceDetails.location || ''}
                  InputProps={{
                    className: classes.input
                  }}
                  onChange={inputChangeHandler}>
                  <option value="" disabled>
                    Select Location
                  </option>
                  {props.locationAndSites &&
                    props.locationAndSites.length &&
                    props.locationAndSites.map(
                      (locationAndSitesItem: locationAndSitesItemType, index: number) => (
                        <option
                          key={index}
                          value={[index.toString(), locationAndSitesItem.locationName]}>
                          {locationAndSitesItem.locationName}
                        </option>
                      )
                    )}
                </TextField>
              </div>
              <div className={classes.fieldStyle}>
                <label>{'Site'}</label>
                <TextField
                  className={classes.textFieldStyle}
                  name="siteName"
                  variant="outlined"
                  margin="normal"
                  required
                  select
                  id={''}
                  InputProps={{
                    className: classes.input
                  }}
                  onChange={inputChangeHandler}>
                  {props.resourceFields &&
                    resourceDetails.location != '' &&
                    props.locationAndSites.length &&
                    props.locationAndSites[resourceDetails.location.split(',')[0] || 0].sites.map(
                      (site: string, index: number) => (
                        <MenuItem key={index} value={site}>
                          {site}
                        </MenuItem>
                      )
                    )}
                </TextField>
              </div>
              {props.resourceFields &&
                props.resourceFields.length &&
                props.resourceFields.map((resource: string) => {
                  return (
                    <div className={classes.fieldStyle} key={resource}>
                      <label htmlFor={resource}>
                        {(resource.charAt(0).toUpperCase() + resource.slice(1))
                          .replace(/([A-Z])/g, ' $1')
                          .trim()}
                      </label>
                      <TextField
                        className={classes.textFieldStyle}
                        variant="outlined"
                        margin="normal"
                        required
                        id={resource}
                        name={resource}
                        value={resourceDetails[resource] || ''}
                        InputProps={{
                          className: classes.input
                        }}
                        onChange={inputChangeHandler}
                      />
                    </div>
                  );
                })}
              <Card elevation={3} className={classes.buttonsWrapper}>
                <Button
                  onClick={cancelHandler}
                  className={classes.buttonStyle}
                  variant="contained"
                  color="primary">
                  Cancel
                </Button>
                <Button
                  onClick={resetHandler}
                  className={classes.buttonStyle}
                  variant="contained"
                  color="primary">
                  Reset
                </Button>
                <Button
                  className={classes.buttonStyle}
                  variant="contained"
                  type="submit"
                  color="primary">
                  Save
                </Button>
              </Card>
            </ValidatorForm>
          </Grid>
        )}
      </Grid>
    );
  }
};

export default ResourceForm;
