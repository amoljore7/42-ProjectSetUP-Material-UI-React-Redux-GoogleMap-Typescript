import {
  call,
  CallEffectDescriptor,
  ForkEffect,
  put,
  PutEffect,
  SimpleEffect,
  takeLatest
} from 'redux-saga/effects';
import {
  ADD_RESOURCE_SUCCESS,
  ADD_RESOURCE_FAIL,
  GET_RESOURCE_FIELDS_SUCCESS,
  GET_RESOURCE_FIELDS_FAIL,
  GET_RESOURCE_FIELDS_LOADING
} from './types';
import { AppConfig } from '../../../config/app-config';
import Axios from '../../../config/axios';
import { history } from '../../../App';
import { notification } from 'antd';
import 'antd/dist/antd.css';
import { AxiosResponse } from 'axios';

interface addResourceResponse {
  id: string;
  message: string;
  status: string;
  statusCode: string;
}

export function* addResource({
  payload
}: {
  type: string;
  payload: any;
}): Generator<
  | SimpleEffect<'CALL', CallEffectDescriptor<unknown>>
  | PutEffect<{
      type: string;
    }>
  | Promise<addResourceResponse>
> {
  try {
    yield call(Axios.post, `${AppConfig.serverUrl}/resources`, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    yield put({ type: ADD_RESOURCE_SUCCESS });
    notification.open({
      message: 'Resource Created Successfully',
      duration: 3,
      type: 'success'
    });
    history.goBack();
  } catch (error) {
    yield put({ type: ADD_RESOURCE_FAIL, payload: error.message });
    history.goBack();
    notification.open({
      message: 'Resource could not be created successfully',
      duration: 4,
      type: 'error'
    });
  }
}

export interface locationAndSitesItemType {
  locationName: string;
  sites: string[];
}

interface getResourceFieldsResponseType {
  fields: string[];
  locationAndSites: locationAndSitesItemType[];
  resource: string;
  spId: number;
  uiFields: string[];
}

export function* getResourceFields({
  payload
}: {
  type: string;
  payload: string;
}): Generator<
  | SimpleEffect<'CALL', CallEffectDescriptor<unknown>>
  | PutEffect<{
      type: string;
    }>
  | Promise<getResourceFieldsResponseType>
> {
  yield put({ type: GET_RESOURCE_FIELDS_LOADING });
  try {
    const response = (yield call(
      Axios.get,
      `${AppConfig.serverUrl}/resourceFieldMap/getByResourceName?resourceName=${payload}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      }
    )) as AxiosResponse<getResourceFieldsResponseType>;
    const responseData: getResourceFieldsResponseType = response.data;
    const payload_1: {
      fields: string[];
      locationAndSites: locationAndSitesItemType[];
    } = { fields: [], locationAndSites: [] };
    payload_1.locationAndSites = responseData.locationAndSites;
    payload_1.fields = responseData.fields;
    yield put({ type: GET_RESOURCE_FIELDS_SUCCESS, payload: { ...payload_1 } });
  } catch (error) {
    yield put({ type: GET_RESOURCE_FIELDS_FAIL, payload: { resourceFieldsError: error.message } });
  }
}

export function* watchAddResource(): Generator<ForkEffect<never> | string> {
  yield takeLatest('ADD_RESOURCE', addResource);
}
export function* watchResourceFields(): Generator<ForkEffect<never> | string> {
  yield takeLatest('RESOURCE_FIELDS', getResourceFields);
}
