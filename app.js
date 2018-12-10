var currentPage = PAGE;

/**
 * This is used to get all news in a paginated format
 * @param page
 */
function getNews(page) {
    hideAndShow('loader');
    if (page) {
        currentPage += page;
        if (currentPage < 1) currentPage = PAGE;
    }
    newsService.getNews(currentPage, function (status, res) {
        hideAndShow('loader');
        if (status !== 200) {
            adjustCurrent(page);
            return;
        }
        if (res.length === 0) {
            adjustCurrent(page);
            alert("New news was not found..");
            return;
        }
        buildNewsPaginate(res);

        console.log('Result=', status, res);
    });
}

/**
 * This is used to adjust current paging if no more page exist
 * @param page
 */
function adjustCurrent(page) {
    currentPage += (page * -1);
    if (currentPage < 1) currentPage = PAGE;
}

/**
 * This is used to build news content for pageable
 * @param res
 */
function buildNewsPaginate(res) {
    var appRoot = document.getElementById('appRoot');
    appRoot.innerHTML = '';
    res.forEach(function (data) {
        var grid = document.createElement('div');
        var newsCard = document.createElement('div');
        var img = document.createElement('img');
        var newsOverlay = document.createElement('div');
        var titleInfo = document.createElement('div');

        // setters
        img.setAttribute('src', data.avatar);
        img.setAttribute('onError', 'this.onerror=null; this.src="../../images/background-1.jpg";');
        newsCard.setAttribute('class', 'news-card');
        newsCard.setAttribute('onClick', 'openNews(' + JSON.stringify(data) + ')');
        newsOverlay.setAttribute('class', 'news-overlay');
        titleInfo.setAttribute('class', 'title-info');
        grid.setAttribute('class', 'grid-4 cursor-pointer');

        titleInfo.innerHTML = "<b>Title:</b> " + data.title + "<br>"
            + "<b>Author:</b> " + data.author + "<br>" +
            "<b>Date:</b> " + new Date(data.createdAt).toDateString();

        //appending
        newsCard.appendChild(img);
        newsOverlay.appendChild(titleInfo);
        newsCard.appendChild(newsOverlay);
        grid.appendChild(newsCard);

        appRoot.appendChild(grid);


    });
}

/**
 * This is used to cache current news and open for viewing
 * @param data
 */
function openNews(data) {
    CacheUtil.set(CURRENT_NEWS, data);
    window.open('pages/news', '_self');
}