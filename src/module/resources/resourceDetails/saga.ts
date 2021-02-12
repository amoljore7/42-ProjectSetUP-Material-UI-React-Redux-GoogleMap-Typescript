import {
  call,
  CallEffectDescriptor,
  ForkEffect,
  put,
  PutEffect,
  SimpleEffect,
  takeLatest
} from 'redux-saga/effects';
import { RESOURCE_LOADING, RESOURCE_SUCCESS, RESOURCE_FAIL } from './types';
import { AppConfig } from '../../../config/app-config';
import Axios from '../../../config/axios';
import { notification } from 'antd';
/* eslint-disable  @typescript-eslint/no-explicit-any */

export function* resourceDetails({
  payload
}: {
  type: string;
  payload: { id: string | undefined };
}): Generator<
  | SimpleEffect<'CALL', CallEffectDescriptor<unknown>>
  | PutEffect<{
      type: string;
    }>
  | Promise<any>,
  void,
  unknown
> {
  yield put({ type: RESOURCE_LOADING });
  try {
    const response: any = yield call(Axios.get, `${AppConfig.serverUrl}/resources/${payload.id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    const responseData: any = response.data;
    delete responseData['spId'];
    delete responseData['siteId'];
    delete responseData['resourceId'];
    delete responseData['status'];
    delete responseData['lat'];
    delete responseData['lng'];

    yield put({ type: RESOURCE_SUCCESS, payload: responseData });
  } catch (error) {
    yield put({ type: RESOURCE_FAIL, payload: error.message });
  }
}

export function* watchResource(): Generator<ForkEffect<never> | string> {
  console.log('resource details watcher');
  yield takeLatest('RESOURCE_DETAILS', resourceDetails);
}

export function* saveResourceDetails({
  payload
}: {
  type: string;
  payload: { id: string | undefined; resourceDetails: any };
}): Generator<
  | SimpleEffect<'CALL', CallEffectDescriptor<unknown>>
  | PutEffect<{
      type: string;
    }>
  | Promise<any>,
  void,
  unknown
> {
  // yield put({ type: SAVE_RESOURCE_DETAILS_LOADING });
  try {
    const response: any = yield call(
      Axios.put,
      `${AppConfig.serverUrl}/resources/${payload.id}`,
      payload.resourceDetails,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      }
    );
    const responseData: any = response.data;
    notification.open({
      message: 'Resource edited Successfully',
      duration: 3
    });

    // yield put({ type: SAVE_RESOURCE_DETAILS_SUCCESS, payload: responseData });
  } catch (error) {
    notification.open({
      message: error.message,
      description: 'Resource could not edited Successfully',
      duration: 3
    });
    // yield put({ type: SAVE_RESOURCE_DETAILS_FAIL, payload: error.message });
  }
}

export function* watchSaveResourceDetails(): Generator<ForkEffect<never> | string> {
  yield takeLatest('SAVE_RESOURCE_DETAILS', saveResourceDetails);
}
