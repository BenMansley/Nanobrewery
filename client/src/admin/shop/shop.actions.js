export const actionTypes = {
  ADDED_TO_BASKET: 'ADDED_TO_BASKET',
}

export const addToBasket = (items) => {
  return { type: actionTypes.ADDED_TO_BASKET, items }
}