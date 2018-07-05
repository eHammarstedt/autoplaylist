const HttpNetworkingMiddleware = store => next => action => {
    return next(action);
};

export default HttpNetworkingMiddleware
