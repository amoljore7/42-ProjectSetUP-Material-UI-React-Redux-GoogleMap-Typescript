import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import resourceForm from './component/resourceForm';
import { rootReducerType } from '../../../root-reducer';

const mapStateToProps = (state: rootReducerType) => {
  const {
    error,
    status,
    resourceFields,
    resourceFieldsLoading,
    locationAndSites
  } = state.createResourceReducer;
  return {
    resourceFields: resourceFields,
    locationAndSites: locationAndSites,
    error: error,
    status: status,
    resourceFieldsLoading: resourceFieldsLoading
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    getResourceFields: (categoryName: string) =>
      dispatch({ type: 'RESOURCE_FIELDS', payload: categoryName }),
    addResource: (resourceDetails: any) =>
      dispatch({ type: 'ADD_RESOURCE', payload: resourceDetails })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(resourceForm);
