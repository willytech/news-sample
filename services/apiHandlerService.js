var retry = networkErrorRetryTime;
var processCall = function (method, url, callback, payload) {
    var request = new XMLHttpRequest();
    request.open(method.toUpperCase(), API_BASE_URL + url, true);
    request.onload = function () {
        console.log('response=', this.response, request.status);
        var data = JSON.parse(this.response);
        if (request.status >= 400) {
            if (retry > 0) { // retry base on number of times configured in an interval of 2 seconds
                retry--;
                setTimeout(function () {
                    processCall(method, url, callback, payload);
                }, 2000);
                return;
            }
        }
        callback(request.status, data)
    };
    request.send(payload ? JSON.stringify(payload) : null);
};

var ApiHandlerService = function () {
    return {
        post: function (url, data, callback) {
            retry = networkErrorRetryTime;
            processCall('POST', url, callback, data);
        },

        put: function (url, data, callback) {
            retry = networkErrorRetryTime;
            processCall('PUT', url, callback, data);
        },

        get: function (url, callback) {
            retry = networkErrorRetryTime;
            processCall('GET', url, callback);
        },

        delete: function (url, callback) {
            retry = networkErrorRetryTime;
            processCall('DELETE', url, callback);
        }

    };
}();