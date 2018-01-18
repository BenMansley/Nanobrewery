const headers = new Headers({'Content-Type': 'application/json'});

/**
 * Sends an asynchronous JSON request to the server, dispatching actions on Send, Success and Failure
 * @param {string} url 
 * @param {Object} reqInfo 
 * @param {function} onSend 
 * @param {function} onSuccess 
 * @param {function} onFailure 
 * @param {number} errCode 
 */
const asyncAction = (url, reqInfo, onSend, onSuccess, onFailure, errCode) => {
  return dispatch => {
    dispatch(onSend());

    fetch(url, {...reqInfo, headers})
      .then(res => {
        res.json().then(data => {
          if (res.status === 400) {
            dispatch(onFailure(data));
          } else if (res.status === 200) {
            dispatch(onSuccess(data));
          }
        })
        .catch(error => {
          dispatch(onFailure("Error parsing data from server"))
        });
      })
      .catch(error => {
        dispatch(onFailure("Error retrieving data from server"));
      });
  }
}

export default asyncAction;