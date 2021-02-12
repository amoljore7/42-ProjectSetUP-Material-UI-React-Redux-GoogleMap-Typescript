import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import resource from './component/resourceDetails';
import { rootReducerType } from '../../../root-reducer';

const mapStateToProps = (state: rootReducerType) => {
  const { resourceLoading, resource, error } = state.resourceDetailsReducer;
  const { nearByResources, resourceInput } = state.nearByResourcesReducer;
  return {
    resourceLoading: resourceLoading,
    resource: resource,
    resourceInput: resourceInput,
    nearByResources: nearByResources,
    error: error
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    getResourceDetails: (id: string | undefined) =>
      dispatch({ type: 'RESOURCE_DETAILS', payload: { id: id } }),
    saveResourceDetails: (id: string | undefined, resourceDetails: any) =>
      dispatch({
        type: 'SAVE_RESOURCE_DETAILS',
        payload: { id: id, resourceDetails: resourceDetails }
      })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(resource);
