var processCall = function(method, url, callback, payload) {
    var request = new XMLHttpRequest();
    request.open(method.toUpperCase(), API_BASE_URL + url, true);
    request.onload = function () {
        console.log('response=', this.response);
        var data = JSON.parse(this.response);
        if (request.status !== 200) {
            callback(request.status, data);
            return;
        }
        callback(request.status, data)
    };
    request.send(payload ? JSON.stringify(payload) : null);
};

var ApiHandlerService = function () {
    return {
        post: function (url, data, callback) {
            processCall('POST', url, callback, data);
        },

        put: function (url, data, callback) {
            processCall('PUT', url, callback, data);
        },

        get: function (url, callback) {
            processCall('GET', url, callback);
        },

        delete: function (url, callback) {
            processCall('DELETE', url, callback);
        }

    };
}();