/**
 * Author: Kazeem Olanipekun
 * Date: 09/12/2018
 * Page: Comment Service List
 * @type {Array}
 */


var parentPath = 'news/';
var commentPath = 'comments';
var url = '';
var commentService = function () {
    return {
        getComments: function (newsId, callback) {
            url = getChildUrl(parentPath, commentPath, newsId);
            ApiHandlerService.get(url, callback);
        },
        createOrUpdateComment: function (newsId, data, callback) {
            url = getChildUrl(parentPath, commentPath, newsId, data.id);
            (data.id) ? ApiHandlerService.put(url, data, callback) : ApiHandlerService.post(url, data, callback);
        },
        getCommentById: function (newsId, id, callback) {
            url = getChildUrl(parentPath, commentPath, newsId, id);
            ApiHandlerService.get(url, callback)
        },
        deleteComment: function (newsId, id, callback) {
            url = getChildUrl(parentPath, commentPath, newsId, id);
            ApiHandlerService.delete(url, callback)
        }
    }
}();