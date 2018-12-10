function getImage() {
    var defaultUrl = 'http://lorempixel.com/640/480/';
    var imagesType = ['nature', 'city', 'sports'];
    var randomType = Math.floor(Math.random() * imagesType.length);
    var randomNumber = Math.floor(Math.random() * 10 + 1);

    return defaultUrl + imagesType[randomType] + '/' + randomNumber;
}

function imgError(image) {
    alert('failed');
    image.onerror = "";
    image.src = url;
    return true;
}