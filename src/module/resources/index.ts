import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import resources from './component/resources';
import { nearByResourcesPayload } from './component/resources';
import { rootReducerType } from '../../root-reducer';
import {
  DELETE_RESOURCE,
  ADDRESS_SUGGESTION,
  SITES_AND_CATEGORIES,
  NEAR_BY_RESOURCES
} from './types';

const mapStateToProps = (state: rootReducerType) => {
  const {
    categories,
    error: sitesAndCategoriesError,
    sites,
    sitesAndCategoriesLoading
  } = state.sitesAndCategoriesReducer;
  const {
    addressesLoading,
    addresses,
    error: addressSuggestionError
  } = state.addressSuggestionReducer;
  const {
    nearByResourcesLoading,
    nearByResources,
    latLngForPatientAddress,
    resourceInput,
    siteInput,
    addressInput,
    nearByResourcesError
  } = state.nearByResourcesReducer;
  return {
    sitesAndCategoriesLoading: sitesAndCategoriesLoading,
    sites: sites,
    categories: categories,
    sitesAndCategoriesError: sitesAndCategoriesError,
    addressesLoading: addressesLoading,
    addresses: addresses,
    addressSuggestionError: addressSuggestionError,
    nearByResourcesLoading: nearByResourcesLoading,
    nearByResources: nearByResources,
    latLngForPatientAddress: latLngForPatientAddress,
    nearByResourcesError: nearByResourcesError,
    resourceInput: resourceInput,
    siteInput: siteInput,
    addressInput: addressInput
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    getAllSitesAndCategories: () => dispatch({ type: SITES_AND_CATEGORIES }),
    addressSuggestion: (value: string) =>
      dispatch({ type: ADDRESS_SUGGESTION, payload: { address: value } }),
    findNearByResources: (nearByResourcesPayload: nearByResourcesPayload) => {
      dispatch({ type: NEAR_BY_RESOURCES, payload: nearByResourcesPayload });
    },
    deleteResource: (id: number) => {
      dispatch({ type: DELETE_RESOURCE, payload: { id: id } });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(resources);
