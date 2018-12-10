/**
 * Author: Kazeem Olanipekun
 * Date: 09/12/2018
 * Page: App general Utilities
 */


var hideAndShow = function (id) {
    var content = document.getElementById(id);
    if (content.classList.contains('show')) {
        content.classList.remove('show');
        content.classList.add('hide');
    } else {
        content.classList.remove('hide');
        content.classList.add('show');
    }
};


/**
 * This is used to get api url
 * @param parentPath
 * @param path
 * @param id
 * @param contentId
 * @returns {string}
 */
var getChildUrl = function (parentPath, path, id, contentId) {
    return parentPath + id + '/' + path + ((contentId) ? '/' + contentId : '');
}



/**
 * This is used to build form object and do basic validation
 * @param formId
 * @returns {{}}
 */
var buildFormValues = function (formId) {
    var elements = document.getElementById(formId).elements;
    // console.log({elements});
    var obj = {};
    for (var i = 0; i < elements.length; i++) {
        var element = elements.item(i);
        if (!element.value && element.name !== 'id' && element.type !== 'button') {
            alert(element.name + ' field is required');
            throw element.name + ' field is required';
        }
        if (element.type === 'button' || (element.name === 'id' && !element.value)) continue;
        obj[element.name] = element.value;
    }
    return obj;
};


