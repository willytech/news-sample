/**
 * Author: Kazeem Olanipekun
 * Date: 08/12/2018
 * Page: News View page
 */

var imageList = [];
var commentList = [];
var newsRoot = null;
var sliderDiv = null;


/**
 * This is used to get comment by its ID with the current news Id
 * @param newsId
 * @param id
 */
function getCommentById(newsId, id) {
    commentService.getCommentById(newsId, id, function (status, res) {
        if (status !== 200) return;
        // start comment rendering;
    })
}


/**
 * This is used to list all comments in a news by news ID
 * @param newsId
 */
function getComments(newsId) {
    commentService.getComments(newsId, function (status, res) {
        console.log("commentsByNewsID=", res);
        hideAndShow('loader');
        if (status !== 200) return;
        commentList = res;
        buildComments(true);
        buildCommentForm(true);
    })
}


/**
 * This is used to pre-populate comment information for editing
 * @param comment
 */
function openEditComment(comment) {
    console.log("comment=", comment);
    window.scrollBy(0, 10000);
    document.getElementById('id-hidden').value = comment.id;
    document.getElementById('commentAddId').innerHTML = 'Edit Comment';
    document.getElementById('comment').value = comment.comment;
    document.getElementById('name').value = comment.name;
}


/**
 * This is used to open add news or open and pre-populate news information for editing
 */
function addOrEdit(bool) {
    if (bool) {
        var currentNews = CacheUtil.get(CURRENT_NEWS);
        document.getElementById('id-news').value = currentNews.id;
        document.getElementById('newsAdd').innerHTML = 'Edit News';
        document.getElementById('title-news').innerHTML = 'Edit News';
        document.getElementById('author').value = currentNews.author;
        document.getElementById('title').value = currentNews.title;
    } else {
        document.getElementById('newsAdd').innerHTML = 'Add News';
        document.getElementById('title-news').innerHTML = 'Create News';
    }
    hideAndShow('add-news');
}


/**
 * This is used to either run a create or update of comment
 */
function createOrUpdateComment() {
    hideAndShow('loader');
    var currentNews = CacheUtil.get(CURRENT_NEWS);
    var data = buildFormValues('commentForm');
    data.avatar = getImage();
    data.newsId = currentNews.id;
    console.log("createComment=", data);
    commentService.createOrUpdateComment(currentNews.id, data, function (status, res) {
        console.log('createUpda=', res);
        hideAndShow('loader');
        if (status >= 400) {
            alert(res);
            return;
        }
        if (data.id) {
            commentList.forEach(function (comment, i) {
                if (+comment.id === +data.id) {
                    commentList[i] = res;
                }
            })
        } else {
            document.getElementById('commentAddId').innerHTML = 'Add Comment';
            commentList.push(res);
        }
        buildComments(false);

        // start comment rendering;
    })
}


/**
 * This is used to delete a comment by its ID
 * @param commentId
 */
function deleteComment(commentId) {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    var currentNews = CacheUtil.get(CURRENT_NEWS);
    commentService.deleteComment(currentNews.id, commentId, function (status, res) {
        if (status !== 200) {
            alert(res);
            return;
        }
        commentList = commentList.filter(function (comment) {
            return +comment.id !== +commentId;
        });
        buildComments(false);
    })
}


/***
 * This is the init page that is loaded once this page is opened
 */
function processCurrentNews() {
    newsRoot = document.getElementById('newsRoot');
    hideAndShow('loader');
    var currentNews = CacheUtil.get(CURRENT_NEWS);
    // build news and then load comments
    getImages(currentNews.id); // load comments for news..
}


/***
 * This is used to run a create or update for news
 */
function createOrUpdateNews() {
    var data = buildFormValues('news-form-div');
    newsService.createOrUpdateNews(data, function (status, res) {
        hideAndShow('add-news');
        document.getElementById('news-form-div').reset();
        if (status >= 400) {
            alert(res);
            return;
        }
        if (data.id) {
            CacheUtil.set(CURRENT_NEWS, res);
            updateNewsView(res);
        } else {
            alert("News created successfully")
        }
    })
}


/**
 * This is used to update news in view page for changes
 * @param data
 */
function updateNewsView(data) {
    document.getElementById('slider-title-info').innerHTML =
        "<b>Title:</b> " + data.title + "<br>"
        + "<b>Author:</b> " + data.author + "<br>" +
        "<b>Date:</b> " + new Date(data.createdAt).toDateString();
}


/**
 * This is used to get all images in a news to enable page slider
 * @param newsId
 */
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


/**
 * This is used to auto generate news Image URL for upload
 */
function addNewImage() {
    hideAndShow('loader');
    var currentNews = CacheUtil.get(CURRENT_NEWS);
    var data = {
        newsId: currentNews.id,
        image: getImage()
    };
    imageService.createOrUpdateImage(currentNews.id, data, function (status, res) {
        hideAndShow('loader');
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


/**
 * This is used to build the html tags and slider div for viewing
 */
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
    var closeTop1 = document.createElement('div');
    var closeTop2 = document.createElement('div');
    var button = document.createElement('button');
    var button1 = document.createElement('button');
    var button2 = document.createElement('button');
    var link1 = document.createElement('a');
    var link2 = document.createElement('a');
    newsOverlay.setAttribute('class', 'news-overlay ov-ad');
    titleInfo.setAttribute('class', 'title-info new-flag');
    titleInfo.setAttribute('id', 'slider-title-info');
    closeTop.setAttribute('class', 'close-top');
    closeTop1.setAttribute('class', 'close-top1');
    closeTop2.setAttribute('class', 'close-top2');
    link1.setAttribute('class', 'prev');
    link2.setAttribute('class', 'next');
    link1.setAttribute('onclick', 'plusSlides(' + (-1) + ')');
    link2.setAttribute('onclick', 'plusSlides(' + 1 + ')');
    button.setAttribute('class', 'button-s btn-primary');
    button.setAttribute('type', 'button');
    button.setAttribute('href', 'javascript: void(' + 0 + ')');
    button.setAttribute('onclick', 'addNewImage()');
    button.innerHTML = "Add Image";
    link1.innerHTML = '&#10094;';
    link2.innerHTML = '&#10095;';
    titleInfo.innerHTML = "<b>Title:</b> " + currentNews.title + "<br>"
        + "<b>Author:</b> " + currentNews.author + "<br>" +
        "<b>Date:</b> " + new Date(currentNews.createdAt).toDateString();
    closeTop.appendChild(button);

    button1.setAttribute('class', 'button-s btn-success');
    button1.setAttribute('type', 'button');
    button1.setAttribute('onClick', 'addOrEdit(' + false + ')');
    button1.innerHTML = "Add News";

    closeTop1.appendChild(button1);

    button2.setAttribute('class', 'button-s btn-warning');
    button2.setAttribute('type', 'button');
    button2.setAttribute('onClick', 'addOrEdit(' + true + ')');
    button2.innerHTML = "Edit News";


    closeTop2.appendChild(button2);

    newsOverlay.appendChild(titleInfo);
    newsOverlay.appendChild(closeTop);
    newsOverlay.appendChild(closeTop1);
    newsOverlay.appendChild(closeTop2);
    sliderDiv.appendChild(newsOverlay);
    sliderDiv.appendChild(link1);
    sliderDiv.appendChild(link2);
    grid.appendChild(sliderDiv);
    newsRoot.appendChild(grid);
    showSliders(10);
}


/**
 * This is used to build comments listing for news for view purpose
 * @param newBuild
 */
function buildComments(newBuild) {
    var div = null;
    if (newBuild) {
        div = document.createElement('div');
        div.setAttribute('id', 'comments-id');
    } else {
        div = document.getElementById('comments-id');
        div.innerHTML = '';
    }
    commentList.forEach(function (comment) {
        var clear = document.createElement('div');
        var grid1 = document.createElement('div');
        var grid2 = document.createElement('div');
        var divM = document.createElement('div');
        var divM1 = document.createElement('div');
        var divM2 = document.createElement('div');
        var link = document.createElement('a');
        var link1 = document.createElement('a');
        var h3 = document.createElement('h3');
        var image = document.createElement('img');
        h3.setAttribute('class', 'mt-0');
        h3.innerHTML = comment.name
        divM.innerHTML = comment.comment + '<br><br>';


        clear.setAttribute('class', 'clear comment-card');
        divM1.setAttribute('class', 'date-bottom');
        divM1.innerHTML = new Date(comment.createdAt).toDateString();
        divM2.setAttribute('class', 'close-top');
        link.setAttribute('onclick', 'deleteComment(' + comment.id + ')');
        link.setAttribute('href', 'javascript: void(' + 0 + ')');
        link1.setAttribute('onclick', 'openEditComment(' + JSON.stringify(comment) + ')');
        link1.setAttribute('href', 'javascript: void(' + 0 + ')');
        link1.setAttribute('style', 'padding-right: 20px; font-size: 12px');
        link.innerHTML = '&times';
        link1.innerHTML = 'edit';

        divM2.appendChild(link1);
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
    if (!newBuild) buildCommentForm(false);
}


/**
 * This is used to build the comment form input
 * @param newBuild
 */
function buildCommentForm(newBuild) {
    var commentForm = null;
    if (newBuild) {
        commentForm = document.createElement('div');
        commentForm.setAttribute('class', 'pad-5');
        commentForm.setAttribute('id', 'comment-form-div');
    } else {
        commentForm = document.getElementById('comment-form-div');
        commentForm.innerHTML = '';
    }
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

    gridInput1.setAttribute('class', 'grid-10');
    gridInput2.setAttribute('class', 'grid-10');

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
    input2.setAttribute('id', 'name');

    textInput.setAttribute('type', 'text');
    textInput.setAttribute('name', 'comment');
    textInput.setAttribute('placeholder', 'Enter your comment');
    textInput.setAttribute('class', 'input-form');
    textInput.setAttribute('id', 'comment');
    textInput.setAttribute('rows', '6');

    button.setAttribute('class', 'button-s btn-primary');
    button.setAttribute('type', 'button');
    button.setAttribute('id', 'commentAddId');
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


    formBuild.setAttribute('id', 'commentForm');

    formBuild.appendChild(input1);
    formBuild.appendChild(clear1);
    formBuild.appendChild(clear2);
    formBuild.appendChild(clear3);

    commentForm.appendChild(formBuild);

    newsRoot.appendChild(commentForm);

}


/**
 * This is used to build image slider.
 * @param index
 * @param newBuild
 */
function buildSliderImage(index, newBuild) {
    if (newBuild && index === 0) {
        sliderDiv = document.createElement('div');
        sliderDiv.setAttribute('class', 'slideshow-container');
    } else if (!newBuild) sliderDiv = document.getElementById('slideshow-container');
    var imageDiv = document.createElement('div');
    var image = document.createElement('img');
    image.setAttribute('class', 'img-p100');
    image.setAttribute('style', 'height: 400px !important');
    image.setAttribute('src', imageList[index].image);
    image.setAttribute('onError', 'this.onerror=null; this.src="../../images/background-1.jpg";');
    imageDiv.setAttribute('class', 'slider fade');

    imageDiv.appendChild(image);

    sliderDiv.appendChild(imageDiv);


}

