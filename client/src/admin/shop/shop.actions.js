import asyncAction from "../../utils/async-action";

export const actionTypes = {
  ADD_TO_BASKET_REQUEST: "GET_ADD_TO_BASKET_REQUEST",
  ADD_TO_BASKET_SUCCESS: "ADD_TO_BASKET_SUCCESS",
  ADD_TO_BASKET_FAILURE: "ADD_TO_BASKET_SUCCESS",
  GET_PRODUCTS_REQUEST: "GET_PRODUCTS_REQUEST",
  GET_PRODUCTS_SUCCESS: "GET_PRODUCTS_SUCCESS",
  GET_PRODUCTS_FAILURE: "GET_PRODUCTS_FAILURE",
  GET_BASKET_SIZE_REQUEST: "GET_BASKET_SIZE_REQUEST",
  GET_BASKET_SIZE_SUCCESS: "GET_BASKET_SIZE_SUCCESS",
  GET_BASKET_SIZE_FAILURE: "GET_BASKET_SIZE_FAILURE",
  GET_BASKET_ITEMS_REQUEST: "GET_BASKET_ITEMS_REQUEST",
  GET_BASKET_ITEMS_SUCCESS: "GET_BASKET_ITEMS_SUCCESS",
  GET_BASKET_ITEMS_FAILURE: "GET_BASKET_ITEMS_FAILURE",
  UPDATE_QUANTITY_REQUEST: "UPDATE_QUANTITY_REQUEST",
  UPDATE_QUANTITY_SUCCESS: "UPDATE_QUANTITY_SUCCESS",
  UPDATE_QUANTITY_FAILURE: "GET_BASKET_ITEMS_FAILURE",
};

const addToBasketRequest = _ => {
  return { type: actionTypes.ADD_TO_BASKET_REQUEST };
};

const addToBasketSuccess = basketSize => {
  return { type: actionTypes.ADD_TO_BASKET_SUCCESS, basketSize };
};

const addToBasketFailure = error => {
  return { type: actionTypes.ADD_TO_BASKET_FAILURE, error };
};

export const addProductToBasket = (productId, quantity) => {
  const body = JSON.stringify({ productId, quantity });
  return asyncAction("/api/shop/basket/add", { body, method: "POST", credentials: "same-origin" },
    addToBasketRequest, addToBasketSuccess, addToBasketFailure);
};

const getProductsRequest = _ => {
  return { type: actionTypes.GET_PRODUCTS_REQUEST };
};

const getProductsSuccess = products => {
  return { type: actionTypes.GET_PRODUCTS_SUCCESS, products };
};

const getProductsFailure = error => {
  return { type: actionTypes.GET_PRODUCTS_FAILURE, error };
};

export const getProductsByCategory = category => {
  return asyncAction(`/api/shop/products/category/${category}`, { method: "GET" },
    getProductsRequest, getProductsSuccess, getProductsFailure);
};

const getBasketSizeRequest = _ => {
  return { type: actionTypes.GET_BASKET_SIZE_REQUEST };
};

const getBasketSizeSuccess = basketSize => {
  return { type:actionTypes.GET_BASKET_SIZE_SUCCESS, basketSize };
};

const getBasketSizeFailure = error => {
  return { type: actionTypes.GET_BASKET_SIZE_FAILURE, error };
};

export const getBasketSize = _ => {
  return asyncAction("/api/shop/basket/size", { method: "GET", credentials: "same-origin" },
    getBasketSizeRequest, getBasketSizeSuccess, getBasketSizeFailure);
};

const getBasketItemsRequest = _ => {
  return { type: actionTypes.GET_BASKET_ITEMS_REQUEST };
};

const getBasketItemsSuccess = items => {
  return { type:actionTypes.GET_BASKET_ITEMS_SUCCESS, items };
};

const getBasketItemsFailure = error => {
  return { type: actionTypes.GET_BASKET_ITEMS_FAILURE, error };
};

export const getBasketItems = _ => {
  return asyncAction("/api/shop/basket/get", { method: "GET", credentials: "same-origin" },
    getBasketItemsRequest, getBasketItemsSuccess, getBasketItemsFailure);
};

const updateQuantityRequest = _ => {
  return { type: actionTypes.UPDATE_QUANTITY_REQUEST };
};

const updateQuantitySuccess = items => {
  return { type:actionTypes.UPDATE_QUANTITY_SUCCESS, items };
};

const updateQuantityFailure = error => {
  return { type: actionTypes.UPDATE_QUANTITY_FAILURE, error };
};

export const updateQuantity = (quantity, productId) => {
  const body = JSON.stringify({ quantity, productId });
  return asyncAction("/api/shop/basket/update", { body, method: "PUT", credentials: "same-origin" },
    updateQuantityRequest, updateQuantitySuccess, updateQuantityFailure);
};
