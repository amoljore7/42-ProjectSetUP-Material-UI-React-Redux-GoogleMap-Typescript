import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  InputAdornment,
  TextField,
  Card,
  GridList,
  GridListTile,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography
} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { RouteComponentProps } from 'react-router-dom';
import { Skeleton } from '@material-ui/lab';
import debounce from 'lodash.debounce';
import CategoryIcon from '../../../assets/svg/category.svg';
import SearchIcon from '../../../assets/svg/search.svg';
import DistanceIcon from '../../../assets/svg/distance.svg';
import { noErrorMessage } from '../reducers/nearByResourcesReducer';
import CircularProgressOverlay from '../../../components/circular-progress-overlay';
import { latLngForPatientAddress, nearByResource } from '../saga';
import { catergoryItem, sitesItem } from '../reducers/sitesAndCategoriesReducer';
// @ts-ignore
import MUIPlacesAutocomplete from 'mui-places-autocomplete';
const useStyles = makeStyles(() => ({
  textFieldStyle: {
    width: '15rem',
    backgroundColor: '#FFF',
    marginBottom: '2rem',
    marginTop: '2rem'
  },
  outLinedInput: {
    padding: '10px 10px'
  },
  userInputWrapper: {
    marginLeft: '3rem',
    marginTop: '4rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flexStart'
  },
  muiPlacesAutocompleteWrapper: {
    position: 'relative',
    zIndex: 2,
    width: '15rem'
  },
  newResourceButtonStyle: {
    fontSize: '0.675rem',
    width: '10rem',
    marginRight: '1rem',
    marginBottom: '0.5rem',
    backgroundColor: '#4491E0',
    color: '#FFF'
  },
  cardStyle: {
    margin: '3rem 3rem 3rem 3rem',
    padding: '1rem'
  },
  resourceCardStyle: {
    position: 'absolute',
    padding: '0.5rem',
    height: '98%',
    width: '98%'
  },
  gridListWrapper: {
    display: 'flex',
    height: '10rem',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  gridList: {
    overflow: 'hidden',
    flexWrap: 'nowrap',
    height: '10rem',
    width: '70rem',
    alignItems: 'center'
  },
  gridListItem: {
    height: '8rem'
  },
  tileStyling: {
    display: 'flex',
    justifyContent: 'center'
  },
  cardNavigationButton: {
    height: '8rem',
    width: '3rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '1rem',
    marginRight: '1rem'
  },
  cardButtonsWrapper: {
    position: 'absolute',
    bottom: '0.5rem',
    right: '0.5rem',
    display: 'flex',
    justifyContent: 'flex-end'
  },
  resourceCardButtonRemove: {
    height: '1.7rem',
    float: 'right',
    marginRight: '0.5rem',
    borderRadius: '4px',
    color: '#FFFFFF'
  },
  resourceCardButtonDetails: {
    height: '1.7rem',
    float: 'right',
    marginRight: '0.5rem',
    borderRadius: '4px',
    color: '#FFFFFF',
    backgroundColor: '#4491E0'
  },
  dialogStyle: {
    height: '15rem',
    width: '20rem'
  },
  buttonsWrapper: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  IconStyle: {
    width: '1rem',
    height: '1rem'
  },
  mapWrapper: {
    width: '100%'
  },
  categoryHeadingStyle: {
    marginLeft: '1rem',
    color: '#707070',
    opacity: 1,
    fontSize: '1.3rem',
    fontWeight: 600
  },
  resourceHeading: {
    fontSize: '1rem',
    color: '#707070',
    opacity: 1
  },
  resourceAddress: {
    display: 'block',
    fontSize: '0.8rem',
    color: '#00000066',
    opacity: 1
  },
  autocompleteStyle: {
    '&&[class*="MuiOutlinedInput-root"]': {
      padding: '0 0 0 14px'
    }
  },
  dropDownHeight: {
    maxHeight: 30
  },
  resourcePageHeader: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '1.5rem',
    color: '#707070',
    fontSize: '2rem',
    fontWeight: 600
  },
  distanceIconStyle: {
    display: 'inline',
    marginTop: '0.4rem',
    marginRight: '0.6rem '
  },
  distanceStyle: {
    fontSize: '0.6rem'
  },
  circularProgress: {
    marginLeft: 0,
    color: 'white',
    marginRight: '20px'
  },
  submitBtn: {
    font: 'normal normal medium 14px/16px Roboto',
    width: '10rem',
    fontSize: '0.675rem',
    marginBottom: '1rem'
  }
}));

const containerStyle = {
  width: '100%',
  height: '400px'
};

const getLinkCenter = (sts: string, spin: number, clr: string) => {
  const imgLink = {
    url: `https://chart.googleapis.com/chart?chst=d_map_spin&chld=1.1|${0}|${clr}|16|b|${sts}`
  };
  return imgLink.url;
};
const getLink = (sts: string, cnt: number, spin: number, clr: string) => {
  const imgLink = {
    url: `https://chart.googleapis.com/chart?chst=d_map_spin&chld=1.1|${0}|${clr}|16|b|${
      sts + (cnt > 1 ? cnt : '')
    }`
  };
  return imgLink.url;
};

interface GoogleMapsComponentProps {
  nearByResources: nearByResource[];
  latLngForPatientAddress: latLngForPatientAddress;
}

const GoogleMapsComponent = (props: GoogleMapsComponentProps) => {
  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={{
        lat: +props.latLngForPatientAddress.lat || 28.7041,
        lng: +props.latLngForPatientAddress.lng || 77.1025
      }}
      zoom={10}>
      {props.latLngForPatientAddress != null && (
        <Marker
          icon={getLinkCenter('C', 90, 'bada55')}
          animation={1}
          position={{
            lat: +props.latLngForPatientAddress.lat,
            lng: +props.latLngForPatientAddress.lng
          }}
          title={props.latLngForPatientAddress ? props.latLngForPatientAddress.address : ''}
        />
      )}

      {props.nearByResources &&
        props.nearByResources != null &&
        props.nearByResources.length &&
        props.nearByResources.map((resource: nearByResource) => (
          <Marker
            key={resource.lat + resource.lng}
            icon={getLink('L', 0, 90, 'FF7F50')}
            animation={google.maps.Animation.DROP}
            position={{ lat: +resource.lat, lng: +resource.lng }}
            title={resource.name || ''}
          />
        ))}
    </GoogleMap>
  );
};

interface StoreProps {
  sitesAndCategoriesLoading: boolean;
  addressesLoading: boolean;
  nearByResourcesLoading: boolean;
  nearByResources: nearByResource[];
  latLngForPatientAddress: latLngForPatientAddress;
  sites: sitesItem[];
  categories: catergoryItem[];
  addresses: string[];
  error: string;
  nearByResourcesError: string;
  addressInput: string;
  resourceInput: string;
}

export interface nearByResourcesPayload {
  address: string;
  resourceType: string;
}

interface DispatchProps {
  getAllSitesAndCategories: () => void;
  addressSuggestion: (value: string) => void;
  findNearByResources: (nearByResourcesPayload: nearByResourcesPayload) => void;
  deleteResource: (id: number) => void;
}

type Props = StoreProps & DispatchProps & RouteComponentProps;

interface formDataType {
  address: string;
  category: string;
}

const Resources: React.FC<Props> = (props: Props) => {
  const classes = useStyles();
  const gridListEl = React.useRef() as React.MutableRefObject<HTMLUListElement>;
  const [isNearByResourcesFetched, setNearByResourcesFetched] = React.useState(false);
  const [formData, setFormData] = React.useState({
    address: '',
    category: ''
  });
  const [nearByResourcesError, setNearByResourcesError] = React.useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const gridListTile = document.getElementById('gridList')?.firstElementChild as HTMLElement;
  const initialRender = React.useRef<boolean>(true);

  React.useEffect(() => {
    if (props.addressInput !== '' && props.resourceInput !== '') {
      setFormData({
        address: props.addressInput,
        category: props.resourceInput
      });
      if (initialRender.current) {
        props.findNearByResources({
          address: props.addressInput,
          resourceType: props.resourceInput
        });
      }
    }
    if (initialRender.current) {
      initialRender.current = false;
    }
  }, [props.addressInput, props.resourceInput]);

  React.useEffect(() => {
    props.getAllSitesAndCategories();
  }, []);

  React.useEffect(() => {
    if (
      props.nearByResources != null &&
      props.nearByResources != [] &&
      props.nearByResources.length != 0
    ) {
      setNearByResourcesFetched(true);
    } else {
      setNearByResourcesFetched(false);
    }
  }, [props.nearByResources]);

  React.useEffect(() => {
    if (props.nearByResourcesError !== noErrorMessage) {
      setNearByResourcesError(true);
    }
  }, [props.nearByResourcesError]);

  const resourceDetailsHandler = (id: number, resourceName: string) => {
    props.history.push({ pathname: `${props.match.url}/${id}`, state: { formData, resourceName } });
  };

  const addNewResourseHandler = (formData: formDataType) => {
    props.history.push({ pathname: `${props.match.url}/new`, state: formData });
  };

  const navigationHandler = (value: string) => {
    const widthListItem = gridListTile.offsetWidth;
    if (value === 'previous' && gridListEl.current !== null) {
      gridListEl.current ? (gridListEl.current.scrollLeft -= widthListItem) : null;
    } else {
      gridListEl.current ? (gridListEl.current.scrollLeft += widthListItem) : null;
    }
  };

  const selectChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((formData) => ({ ...formData, [name]: value }));
  };

  const findResourcesHandler = () => {
    props.findNearByResources({
      address: formData.address,
      resourceType: formData.category
    });
  };

  const [selectedResourceId, setSelectedResourceId] = React.useState(-1);

  const openDeleteModal = (id: number) => {
    setDeleteModalOpen(true);
    setSelectedResourceId(id);
  };
  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedResourceId(-1);
  };

  const deleteResource = () => {
    props.deleteResource(selectedResourceId);
    setDeleteModalOpen(false);
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
  };

  const delayedQuery = React.useRef(
    debounce((addressInput: string) => {
      props.addressSuggestion(addressInput);
    }, 500)
  ).current;

  const [addressInput, setAddressInput] = React.useState('');
  React.useEffect(() => {
    delayedQuery(addressInput);
  }, [addressInput]);

  const searchInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddressInput(e.target.value);
    setFormData({ ...formData, address: e.target.value });
  };

  if (props.nearByResourcesLoading) {
    return (
      <div>
        <CircularProgressOverlay />
      </div>
    );
  } else {
    return (
      <div>
        <div className={classes.resourcePageHeader}>Resources</div>
        <div className={classes.userInputWrapper}>
          <div className={classes.muiPlacesAutocompleteWrapper}>
            <MUIPlacesAutocomplete
              onSuggestionSelected={(result: { description: string }) => {
                const { description } = result;
                setFormData((formData) => ({ ...formData, address: description }));
              }}
              textFieldProps={{
                className: classes.textFieldStyle,
                // added inline styling because there can be many textfields and we require
                // below style for this textfield only
                style: { marginBottom: '0px', marginTop: '0px' },
                label: "Patient's Address",
                variant: 'outlined',
                required: true,
                placeholder: 'Search Address',
                onChange: searchInputHandler,
                value: formData.address,
                InputProps: {
                  classes: { input: classes.outLinedInput },
                  startAdornment: (
                    <InputAdornment position="start">
                      <img className={classes.IconStyle} src={SearchIcon} alt="Search Icon" />
                    </InputAdornment>
                  )
                }
              }}
              renderTarget={() => <div />}
            />
          </div>
          <TextField
            className={classes.textFieldStyle}
            name="category"
            label="Category"
            variant="outlined"
            placeholder="Select Resource Type"
            select
            SelectProps={{
              native: true,
              MenuProps: { classes: { paper: classes.dropDownHeight } }
            }}
            value={formData.category}
            onChange={selectChangeHandler}
            InputProps={{
              classes: { input: classes.outLinedInput },
              startAdornment: (
                <InputAdornment position="start">
                  <img className={classes.IconStyle} src={CategoryIcon} alt="Category Icon" />
                </InputAdornment>
              )
            }}>
            {props.categories == [] ? (
              <option>
                <CircularProgress />
              </option>
            ) : (
              <>
                <option value="" disabled>
                  Select Category
                </option>
                {props.categories.map((category) => (
                  <option key={category.id} value={[category.id.toString(), category.specialties]}>
                    {category.specialties}
                  </option>
                ))}
              </>
            )}
          </TextField>
          <Button
            className={classes.submitBtn}
            onClick={findResourcesHandler}
            type="submit"
            variant="contained"
            style={{ backgroundColor: '#4491E0', color: '#FFFFFF' }}>
            Find Resources
          </Button>
        </div>
        <hr color="#3366ff" />
        <Card className={classes.cardStyle}>
          <div className={classes.buttonsWrapper}>
            <Typography className={classes.categoryHeadingStyle}>
              {formData.category.split(',')[1]}
            </Typography>
            <Button
              className={classes.newResourceButtonStyle}
              variant="contained"
              disabled={formData.category ? false : true}
              onClick={() => addNewResourseHandler(formData)}>
              Add New Resource
            </Button>
          </div>
          <GoogleMapsComponent
            nearByResources={props.nearByResources}
            latLngForPatientAddress={props.latLngForPatientAddress}
          />

          {isNearByResourcesFetched ? (
            <>
              <div className={classes.gridListWrapper}>
                <Card
                  elevation={4}
                  className={classes.cardNavigationButton}
                  onClick={() => navigationHandler('previous')}>
                  <NavigateBeforeIcon />
                </Card>
                <GridList id="gridList" ref={gridListEl} className={classes.gridList} cols={3}>
                  {props.nearByResources == [] || props.nearByResources === null ? (
                    <Skeleton />
                  ) : (
                    props.nearByResources != [] &&
                    props.nearByResources != null &&
                    props.nearByResources.map((resource) => {
                      const resourceId = resource.resourceId;
                      return (
                        <GridListTile
                          style={{ height: '8rem' }}
                          className={classes.gridListItem}
                          classes={{ tile: classes.tileStyling }}
                          key={resource.resourceId}>
                          <Card className={classes.resourceCardStyle} elevation={4}>
                            <Typography className={classes.resourceHeading}>
                              {resource.name}
                            </Typography>
                            <span className={classes.resourceAddress}>{resource.address}</span>
                            <img
                              className={classes.distanceIconStyle}
                              src={DistanceIcon}
                              alt="distance"></img>
                            <span className={classes.distanceStyle}>
                              {resource.distance || '0'} miles
                            </span>
                            <div className={classes.cardButtonsWrapper}>
                              <Button
                                className={classes.resourceCardButtonRemove}
                                onClick={() => openDeleteModal(resource.resourceId)}
                                size="small"
                                variant="contained"
                                color="secondary">
                                Remove
                              </Button>
                              <Button
                                className={classes.resourceCardButtonDetails}
                                onClick={() =>
                                  resourceDetailsHandler(resource.resourceId, resource.name)
                                }
                                size="small"
                                variant="contained">
                                Details
                              </Button>
                            </div>
                          </Card>
                        </GridListTile>
                      );
                    })
                  )}
                </GridList>
                <Dialog
                  open={isDeleteModalOpen}
                  onClose={closeDeleteModal}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description">
                  <>
                    <DialogTitle id="alert-dialog-title">
                      {'Are You Sure you want to delete this resource ?'}
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                        This Action will permanently delete the resource.
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button color="primary" onClick={cancelDelete}>
                        Cancel
                      </Button>
                      <Button color="secondary" onClick={deleteResource}>
                        Delete
                      </Button>
                    </DialogActions>
                  </>
                </Dialog>

                <Card
                  elevation={4}
                  className={classes.cardNavigationButton}
                  onClick={() => navigationHandler('next')}>
                  <NavigateNextIcon />
                </Card>
              </div>
            </>
          ) : null}
        </Card>
      </div>
    );
  }
};

export default Resources;
