export const SITES_AND_CATEGORIES = 'SITES_AND_CATEGORIES';
export const SITES_AND_CATEGORIES_LOADING = 'SITES_AND_CATEGORIES_LOADING';
export const SITES_AND_CATEGORIES_SUCCESS = 'SITES_AND_CATEGORIES_SUCCESS';
export const SITES_AND_CATEGORIES_FAIL = 'SITES_AND_CATEGORIES_FAIL';
export const ADDRESS_SUGGESTION = 'ADDRESS_SUGGESTION';
export const ADDRESS_SUGGESTION_LOADING = 'ADDRESS_SUGGESTION_LOADING';
export const ADDRESS_SUGGESTION_SUCCESS = 'ADDRESS_SUGGESTION_SUCCESS';
export const ADDRESS_SUGGESTION_FAIL = 'ADDRESS_SUGGESTION_FAIL';
export const NEAR_BY_RESOURCES = 'NEAR_BY_RESOURCES';
export const NEAR_BY_RESOURCES_LOADING = 'NEAR_BY_RESOURCES_LOADING';
export const NEAR_BY_RESOURCES_SUCCESS = 'NEAR_BY_RESOURCES_SUCCESS';
export const NEAR_BY_RESOURCES_FAIL = 'NEAR_BY_RESOURCES_FAIL';
export const DELETE_RESOURCE = 'DELETE_RESOURCE';
export const DELETE_RESOURCE_SUCCESS = 'DELETE_RESOURCE_SUCCESS';
export const DELETE_RESOURCE_FAIL = 'DELETE_RESOURCE_FAIL';
export const SAVE_SITE_AND_RESOURCE_CATEGORY = 'SAVE_SITE_AND_RESOURCE_CATEGORY';

export interface SitesAndCategoriesLoading {
  type: typeof SITES_AND_CATEGORIES_LOADING;
}

export interface SitesAndCategoriesSuccess {
  type: typeof SITES_AND_CATEGORIES_SUCCESS;
  payload: SitesAndCategoriesSuccessPayloadType;
}

export type SitesAndCategoriesSuccessPayloadType = {
  userName: string;
  password: string;
};

export interface SitesAndCategoriesFail {
  type: typeof SITES_AND_CATEGORIES_FAIL;
  payload: string;
}

export type SitesAndCategoriesDispatch =
  | SitesAndCategoriesLoading
  | SitesAndCategoriesSuccess
  | SitesAndCategoriesFail;
