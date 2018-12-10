/************* Comments API Consumption ****************/
var imageList = [];
var commentList = [];
var newsRoot = null;
var sliderDiv = null;

function getCommentById(newsId, id) {
    commentService.getCommentById(newsId, id, function (status, res) {
        if (status !== 200) return;
        // start comment rendering;
    })
}

function getComments(newsId) {
    commentService.getComments(newsId, function (status, res) {
        console.log("commentsByNewsID=", res);
        hideAndShow('loader');
        if (status !== 200) return;
        commentList = res;
        buildComments();
        buildCommentForm();
    })
}

function createOrUpdateComment() {
    var currentNews = CacheUtil.get(CURRENT_NEWS);
    var data = buildFormValues('commentForm');
    data.avatar = getImage();
    data.newsId = currentNews.id;
    console.log("createComment=", data);
    commentService.createOrUpdateComment(currentNews.id, data, function (status, res) {
        console.log('createUpda=', res);
        if (status !== 200) return;
        // start comment rendering;
    })
}


function deleteComment(commentId) {
    var currentNews = CacheUtil.get(CURRENT_NEWS);
    commentService.deleteComment(currentNews.id, commentId, function (status, res) {
        if (status !== 200) return;
        // start comment rendering;
    })
}


/************* News API Consumption****************/
function getNewsById() {
    var currentNews = CacheUtil.get(CURRENT_NEWS);
    newsService.getNewsById(currentNews.id, function (status, res) {
        console.log("newsByID=", res);
        if (status !== 200) return;
        // start news rendering;
    })
}

function processCurrentNews() {
    newsRoot = document.getElementById('newsRoot');
    hideAndShow('loader');
    var currentNews = CacheUtil.get(CURRENT_NEWS);
    // build news and then load comments
    getImages(currentNews.id); // load comments for news..
}


function createOrUpdateNews() {
    var data = null;
    newsService.createOrUpdateNews(data, function (status, res) {
        if (status !== 200) return;
        // start comment rendering;
    })
}


function deleteNews() {
    var currentNews = CacheUtil.get(CURRENT_NEWS);
    newsService.deleteNews(currentNews.id, function (status, res) {
        if (status !== 200) return;
        // start comment rendering;
    })
}

/*********************Images API consumption*****************************/

function getImageById(newsId, id) {
    imageService.getImageById(newsId, id, function (status, res) {
        if (status !== 200) return;
        // start comment rendering;
    })
}

function getImages(newsId) {
    imageService.getImages(newsId, function (status, res) {
        console.log("imagesByNewsID=", res);
        if (status !== 200) return;
        imageList = res;
        buildImageSliderForm();
        getComments(newsId); // load comments for news..
        // start comment rendering;
    })
}

function createOrUpdateImage() {
    var currentNews = CacheUtil.get(CURRENT_NEWS);
    var data = {
        newsId: currentNews.id,
        image: getImage()
    };
    imageService.createOrUpdateImage(currentNews.id, data, function (status, res) {
        if (status !== 200) {
            alert(res);
            return;
        }
        imageList.push(res);
        buildSliderImage(imageList.length - 1, false);
        showSliders(10);
        alert(res.image + 'has been added Successfully');
        // start comment rendering;
    })
}


function deleteImage(commentId) {
    var currentNews = CacheUtil.get(CURRENT_NEWS);
    imageService.deleteImage(currentNews.id, commentId, function (status, res) {
        if (status !== 200) return;
        // start comment rendering;
    })
}

function buildImageSliderForm() {
    var currentNews = CacheUtil.get(CURRENT_NEWS);
    var grid = document.createElement('div');
    grid.setAttribute('class', 'grid-12');
    var len = imageList.length;
    for (var i = 0; i < len; i++) {
        buildSliderImage(i, true);
    }

    var newsOverlay = document.createElement('div');
    var titleInfo = document.createElement('div');
    var closeTop = document.createElement('div');
    var button = document.createElement('button');
    var link1 = document.createElement('a');
    var link2 = document.createElement('a');
    newsOverlay.setAttribute('class', 'news-overlay ov-ad');
    titleInfo.setAttribute('class', 'title-info new-flag');
    closeTop.setAttribute('class', 'close-top');
    link1.setAttribute('class', 'prev');
    link2.setAttribute('class', 'next');
    link1.setAttribute('onclick', 'plusSlides(' + (-1) + ')');
    link2.setAttribute('onclick', 'plusSlides(' + 1 + ')');
    button.setAttribute('class', 'button-s btn-primary');
    button.setAttribute('href', 'javascript: void(' + 0 + ')');
    button.setAttribute('onclick', 'createOrUpdateImage()');
    button.innerHTML = "Add Image";
    link1.innerHTML = '&#10094;';
    link2.innerHTML = '&#10095;';
    titleInfo.innerHTML = "<b>Title:</b> " + currentNews.title + "<br>"
        + "<b>Author:</b> " + currentNews.author + "<br>" +
        "<b>Date:</b> " + new Date(currentNews.createdAt).toDateString();
    closeTop.appendChild(button);
    newsOverlay.appendChild(titleInfo);
    newsOverlay.appendChild(closeTop);
    sliderDiv.appendChild(newsOverlay);
    sliderDiv.appendChild(link1);
    sliderDiv.appendChild(link2);
    grid.appendChild(sliderDiv);
    newsRoot.appendChild(grid);
    showSliders(10);
}

function buildComments() {
    var div = document.createElement('div');
    commentList.forEach(function (comment) {
        var clear = document.createElement('div');
        var grid1 = document.createElement('div');
        var grid2 = document.createElement('div');
        var divM = document.createElement('div');
        var divM1 = document.createElement('div');
        var divM2 = document.createElement('div');
        var link = document.createElement('a');
        var h3 = document.createElement('h3');
        var image = document.createElement('img');
        h3.setAttribute('class', 'mt-0');
        h3.innerHTML = comment.name
        divM.innerHTML = comment.comment + '<br><br>';


        clear.setAttribute('class', 'clear comment-card');
        divM1.setAttribute('class', 'date-bottom');
        divM1.innerHTML = new Date(comment.createdAt).toDateString();
        divM2.setAttribute('class', 'close-top');
        link.setAttribute('onclick', 'deleteNews(' + comment.id + ')');
        link.setAttribute('href', 'javascript: void(' + 0 + ')');
        link.innerHTML = '&times';
        divM2.appendChild(link);
        grid1.setAttribute('class', 'grid-2 no-grid');
        grid2.setAttribute('class', 'grid-9');
        image.setAttribute('class', 'img-circle img-100');
        image.setAttribute('src', comment.avatar);
        image.setAttribute('onError', 'this.onerror=null; this.src="../../images/background-2.jpg";');

        grid1.appendChild(image);
        grid2.appendChild(h3);
        grid2.appendChild(divM);
        grid2.appendChild(divM1);
        grid2.appendChild(divM2);

        clear.appendChild(grid1);
        clear.appendChild(grid2);

        div.appendChild(clear);
    });

    newsRoot.appendChild(div);
}

function buildCommentForm() {
    var commentForm = document.createElement('div');
    var gridName1 = document.createElement('div');
    var gridName2 = document.createElement('div');
    var button = document.createElement('button');

    var gridInput1 = document.createElement('div');
    var gridInput2 = document.createElement('div');

    var clear1 = document.createElement('div');
    var clear2 = document.createElement('div');
    var clear3 = document.createElement('div');

    var formBuild = document.createElement('form');
    var input1 = document.createElement('input');
    var input2 = document.createElement('input');
    var textInput = document.createElement('textarea');

    var label1 = document.createElement('label');
    var label2 = document.createElement('label');

    label1.innerHTML = 'Name';
    label2.innerHTML = 'Comment';

    gridName1.setAttribute('class', 'grid-1 pt-20');
    gridName2.setAttribute('class', 'grid-1 pt-20');

    gridInput1.setAttribute('class', 'grid-8');
    gridInput2.setAttribute('class', 'grid-8');

    clear1.setAttribute('class', 'clear');
    clear2.setAttribute('class', 'clear');
    clear3.setAttribute('class', 'clear offset-1');

    gridName1.appendChild(label1);
    gridName2.appendChild(label2);

    input1.setAttribute('type', 'hidden');
    input1.setAttribute('name', 'id');
    input1.setAttribute('id', 'id-hidden');

    input2.setAttribute('type', 'text');
    input2.setAttribute('name', 'name');
    input2.setAttribute('placeholder', 'Enter your name');
    input2.setAttribute('class', 'input-form');

    textInput.setAttribute('type', 'text');
    textInput.setAttribute('name', 'comment');
    textInput.setAttribute('placeholder', 'Enter your comment');
    textInput.setAttribute('class', 'input-form');
    textInput.setAttribute('rows', '6');

    button.setAttribute('class', 'button-s btn-primary');
    button.setAttribute('href', 'javascript: void(' + 0 + ')');
    button.setAttribute('onclick', 'createOrUpdateComment()');
    button.innerHTML = "Add Comment";

    gridName1.appendChild(label1);
    gridName2.appendChild(label2);

    gridInput1.appendChild(input2);
    gridInput2.appendChild(textInput);

    clear1.appendChild(gridName1);
    clear1.appendChild(gridInput1);

    clear2.appendChild(gridName2);
    clear2.appendChild(gridInput2);
    clear3.appendChild(button);

    commentForm.setAttribute('class', 'pad-5');
    formBuild.setAttribute('id', 'commentForm');

    formBuild.appendChild(input1);
    formBuild.appendChild(clear1);
    formBuild.appendChild(clear2);
    formBuild.appendChild(clear3);

    commentForm.appendChild(formBuild);

    newsRoot.appendChild(commentForm);

}


function buildSliderImage(index, newBuild) {
    if (newBuild && index === 0) {
        sliderDiv = document.createElement('div');
        sliderDiv.setAttribute('class', 'slideshow-container');
    } else if (!newBuild) sliderDiv = document.getElementById('slideshow-container');
    var imageDiv = document.createElement('div');
    var image = document.createElement('img');
    image.setAttribute('class', 'img-p100');
    image.setAttribute('src', imageList[index].image);
    image.setAttribute('onError', 'this.onerror=null; this.src="../../images/background-1.jpg";');
    imageDiv.setAttribute('class', 'slider fade');

    imageDiv.appendChild(image);

    sliderDiv.appendChild(imageDiv);


}

