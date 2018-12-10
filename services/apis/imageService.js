/**
 * Author: Kazeem Olanipekun
 * Date: 09/12/2018
 * Page: Image Service list
 */


var parentPath = 'news/';
var imagePath = 'images';
var url = '';
var imageService = function () {
    return {
        getImages: function (newsId, callback) {
            url = getChildUrl(parentPath, imagePath, newsId);
            ApiHandlerService.get(url, callback);
        },
        createOrUpdateImage: function (newsId, data, callback) {
            url = getChildUrl(parentPath, imagePath, newsId, data.id);
            (data.id) ? ApiHandlerService.put(url, data, callback) : ApiHandlerService.post(url, data, callback);
        },
        getImageById: function (newsId, id, callback) {
            url = getChildUrl(parentPath, imagePath, newsId, id);
            ApiHandlerService.get(url + '/' + id, callback);
        },
        deleteImage: function (newsId, id, callback) {
            url = getChildUrl(parentPath, imagePath, newsId, id);
            ApiHandlerService.delete(url, callback)
        }
    }
}();