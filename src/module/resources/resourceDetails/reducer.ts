import { RESOURCE_LOADING, RESOURCE_SUCCESS, RESOURCE_FAIL } from './types';

export interface DefaultState {
  resourceLoading: boolean;
  resource: any;
  error: string;
}

const defaultState: DefaultState = {
  resourceLoading: false,
  resource: {},
  error: ''
};

interface actionType {
  type: string;
  payload: any;
}

export const resource = (state: DefaultState = defaultState, action: actionType): DefaultState => {
  switch (action.type) {
    case RESOURCE_LOADING:
      return {
        ...state,
        resourceLoading: true
      };
    case RESOURCE_SUCCESS:
      return {
        ...state,
        resourceLoading: false,
        resource: action.payload,
        error: ''
      };
    case RESOURCE_FAIL:
      return {
        ...state,
        resourceLoading: false,
        error: action.payload
      };
    default:
      return state;
  }
};
