import asyncAction from "../../utils/async-action";

export const actionTypes = {
  ADDED_TO_BASKET: 'ADDED_TO_BASKET',
  SEND_GET_PRODUCTS_REQUEST: 'SEND_GET_PRODUCTS_REQUEST',
  GET_PRODUCTS_SUCCESS: 'GET_PRODUCTS_SUCCESS',
  GET_PRODUCTS_FAILURE: 'GET_PRODUCTS_FAILURE'
}

export const addToBasket = (items) => {
  return { type: actionTypes.ADDED_TO_BASKET, items }
}

const sendGetProductsRequest = _ => {
  return { type: actionTypes.SEND_GET_PRODUCTS_REQUEST }
}

const getProductsSuccess = products => {
  return { type: actionTypes.GET_PRODUCTS_SUCCESS, products }
}

const getProductsFailure = error => {
  return { type: actionTypes.GET_PRODUCTS_FAILURE, error }
}

export const getProductsByCategory = category => {
  return asyncAction(`/api/shop/products/category/${category}`, { method: "GET" },
    sendGetProductsRequest, getProductsSuccess, getProductsFailure);
}