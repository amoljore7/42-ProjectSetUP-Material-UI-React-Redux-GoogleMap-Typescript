import { all, AllEffect, fork, ForkEffect } from 'redux-saga/effects';

import { watchLogin } from './module/login/saga';
import { watchForgotPassword } from './module/forgotPassword/saga';
import { watchResetPassword } from './module/resetPassword/saga';
import { watchResource, watchSaveResourceDetails } from './module/resources/resourceDetails/saga';
import { watchAddResource, watchResourceFields } from './module/resources/createResource/saga';
import {
  watchSitesAndCategories,
  watchNearByResources,
  watchDeleteResource
} from './module/resources/saga';

export default function* rootSaga(): Generator<AllEffect<Generator<string | ForkEffect<never>>>> {
  yield all([
    watchLogin(),
    watchForgotPassword(),
    watchResetPassword(),
    watchSitesAndCategories(),
    watchNearByResources(),
    watchResource(),
    watchSaveResourceDetails(),
    watchAddResource(),
    watchResourceFields(),
    watchDeleteResource()
  ]);
}
