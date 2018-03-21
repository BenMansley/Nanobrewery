const headers = new Headers({'Content-Type': 'application/json'});

/**
 * Sends an asynchronous JSON request to the server, dispatching actions on Send, Success and Failure
 * @param {string}   url       API URL to be called
 * @param {Object}   reqInfo   Additional info to be added to the request
 * @param {function} onSend    Callback function on request send
 * @param {function} onSuccess Callback function on success
 * @param {function} onFailure Callback function on failure
 */
const asyncAction = (url, reqInfo, onSend, onSuccess, onFailure) => {
  return dispatch => {
    dispatch(onSend());

    fetch(url, {...reqInfo, headers})
      .then(res => {
        res.json().then(data => {
          if (res.status === 400) {
            dispatch(onFailure(data));
          } else if (res.status === 200) {
            console.log(data);
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