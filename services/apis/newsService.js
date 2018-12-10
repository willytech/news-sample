/**
 * Author: Kazeem Olanipekun
 * Date: 09/12/2018
 * Page: News Service List
 */

var path = 'news';
var newsService = function () {
    return {
        getNews: function (page, callback) {
            var url = path + '?page=' + ((page && page > -1) ? page : PAGE) + '&limit=' + LIMIT;
            ApiHandlerService.get(url, callback);
        },
        createOrUpdateNews: function (data, callback) {
            (data.id) ? ApiHandlerService.put(path + '/' + data.id, data, callback) : ApiHandlerService.post(path, data, callback);
        },
        getNewsById: function (id, callback) {
            ApiHandlerService.get(path + '/' + id, callback)
        },
        deleteNews: function (id, callback) {
            ApiHandlerService.delete(path + '/' + id, callback)
        }
    }
}();