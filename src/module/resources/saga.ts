import {
  call,
  CallEffectDescriptor,
  ForkEffect,
  put,
  PutEffect,
  SimpleEffect,
  takeLatest
} from 'redux-saga/effects';
import Axios from '../../config/axios';
import {
  SITES_AND_CATEGORIES,
  SITES_AND_CATEGORIES_LOADING,
  SITES_AND_CATEGORIES_SUCCESS,
  SITES_AND_CATEGORIES_FAIL,
  ADDRESS_SUGGESTION,
  ADDRESS_SUGGESTION_LOADING,
  ADDRESS_SUGGESTION_SUCCESS,
  ADDRESS_SUGGESTION_FAIL,
  NEAR_BY_RESOURCES,
  NEAR_BY_RESOURCES_LOADING,
  NEAR_BY_RESOURCES_SUCCESS,
  SAVE_SITE_AND_RESOURCE_CATEGORY,
  NEAR_BY_RESOURCES_FAIL,
  DELETE_RESOURCE,
  DELETE_RESOURCE_SUCCESS,
  DELETE_RESOURCE_FAIL
} from './types';
import { AppConfig } from '../../config/app-config';
import { nearByResourcesPayload } from './component/resources';
import { notification } from 'antd';
import { AxiosResponse } from 'axios';
import { catergoryItem, sitesItem } from './reducers/sitesAndCategoriesReducer';

export type nearByResource = {
  address: string;
  addrsId: number;
  distance: number;
  lat: number;
  lng: number;
  name: string;
  nearbyId: number;
  resourceId: number;
  resourceType: string;
  status: string;
};

export type latLngForPatientAddress = { address: string; lat: string; lng: string };

interface sitesAndCategoriesResponse {
  categoryList: catergoryItem[];
  sitesList: sitesItem[];
}

export function* sitesAndCategories(): Generator<
  | SimpleEffect<'CALL', CallEffectDescriptor<unknown>>
  | PutEffect<{
      type: string;
    }>
  | Promise<sitesAndCategoriesResponse>,
  void,
  unknown
> {
  yield put({ type: SITES_AND_CATEGORIES_LOADING });
  const responsePayload: {
    sitesList: sitesItem[];
    categoryList: catergoryItem[];
    error: string;
  } = { sitesList: [], categoryList: [], error: '' };
  try {
    const response = (yield call(Axios.get, `${AppConfig.serverUrl}/getAllSitesAndCategories`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    })) as AxiosResponse<sitesAndCategoriesResponse>;
    const responseData = response.data;
    responsePayload.sitesList = responseData.sitesList;
    responsePayload.categoryList = responseData.categoryList;

    yield put({ type: SITES_AND_CATEGORIES_SUCCESS, payload: responsePayload });
  } catch (error) {
    yield put({
      type: SITES_AND_CATEGORIES_FAIL,
      payload: { ...responsePayload, error: error.message }
    });
  }
}

export type nearByResourcesResponse = {
  latLngForPatientAddress: latLngForPatientAddress;
  nearByResources: nearByResource[];
  resources_fields: string[];
};

export function* nearByResources({
  payload
}: {
  type: string;
  payload: nearByResourcesPayload;
}): Generator<
  | SimpleEffect<'CALL', CallEffectDescriptor<unknown>>
  | PutEffect<{
      type: string;
    }>
  | Promise<nearByResourcesResponse>
> {
  const filteredPayload = {
    address: payload.address,
    resourceType: payload.resourceType.split(',')[1]
  };
  yield put({ type: NEAR_BY_RESOURCES_LOADING });
  const responsePayload = {
    nearByResources: [],
    latLngForPatientAddress: {
      address: '',
      lat: '',
      lng: ''
    },
    resources_fields: [],
    error: ''
  };
  try {
    const response = (yield call(
      Axios.post,
      `${AppConfig.serverUrl}/getNearByResources`,
      filteredPayload,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      }
    )) as AxiosResponse<nearByResourcesResponse>;
    const responseData: nearByResourcesResponse = response.data;
    yield put({
      type: NEAR_BY_RESOURCES_SUCCESS,
      payload: { ...responsePayload, ...responseData }
    });
    const message =
      responseData.nearByResources === null || responseData.nearByResources.length === 0
        ? 'No Resources Found'
        : 'Resources fetched Successfully';
    notification.open({
      message: message,
      duration: 3,
      type: 'success'
    });
    yield put({
      type: SAVE_SITE_AND_RESOURCE_CATEGORY,
      payload: {
        ...responsePayload,
        ...responseData,
        resource: payload.resourceType,
        address: payload.address
      }
    });
  } catch (error) {
    yield put({
      type: NEAR_BY_RESOURCES_FAIL,
      payload: { ...responsePayload, error: error.message }
    });
    notification.open({
      message: 'Resources could not be fetched Successfully !',
      duration: 5,
      type: 'error'
    });
  }
}

interface deleteResourceResponse {
  id: string;
  message: string;
  status: string;
  statusCode: string;
}

export function* deleteResource({
  payload
}: {
  type: string;
  payload: { id: number };
}): Generator<
  | SimpleEffect<'CALL', CallEffectDescriptor<unknown>>
  | PutEffect<{
      type: string;
    }>
  | Promise<deleteResourceResponse>
> {
  try {
    yield call(Axios.delete, `${AppConfig.serverUrl}/resources/${payload.id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    yield put({
      type: DELETE_RESOURCE_SUCCESS,
      payload: { resourceIdToBeDeleted: payload.id, deletionError: '' }
    });
    notification.success({
      message: 'Resource deleted Successfully',
      duration: 3,
      type: 'success'
    });
  } catch (error) {
    yield put({
      type: DELETE_RESOURCE_FAIL,
      payload: { resourceIdToBeDeleted: '', deletionError: error.message }
    });
    notification.error({
      message: error.message,
      description: 'Resource could not be deleted Successfully',
      duration: 5,
      type: 'error'
    });
  }
}

export function* watchSitesAndCategories(): Generator<ForkEffect<never> | string> {
  yield takeLatest(SITES_AND_CATEGORIES, sitesAndCategories);
}
export function* watchDeleteResource(): Generator<ForkEffect<never> | string> {
  yield takeLatest(DELETE_RESOURCE, deleteResource);
}
export function* watchNearByResources(): Generator<ForkEffect<never> | string> {
  yield takeLatest(NEAR_BY_RESOURCES, nearByResources);
}
