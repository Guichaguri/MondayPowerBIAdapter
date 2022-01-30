const mondayUrlRegex = /monday\.com\/boards\/([0-9]+)/;
const apiUrlBase = location.protocol + '//' + location.host + '/1/items';

const statusEl = document.getElementById('status');
const textEl = document.getElementById('text');
const urlEl = document.getElementById('url');

function setError(error) {
    statusEl.style.display = 'block';
    textEl.innerText = error;
    urlEl.innerText = '';
}

function setUrl(url) {
    statusEl.style.display = 'block';
    textEl.innerText = 'Import the URL below as a "Web Data Source" in Power BI';
    urlEl.innerText = url;
}

function setBasicUrl(key, board, dismember, subitems) {
    let url = apiUrlBase + '?key=' + encodeURIComponent(key) + '&board=' + encodeURIComponent(board);

    if (dismember)
        url += '&dismember';

    if (subitems)
        url += '&subitems';

    setUrl(url);
}

function setTokenUrl(token, dismember, subitems) {
    let url = apiUrlBase + '?token=' + encodeURIComponent(token);

    if (dismember)
        url += '&dismember';

    if (subitems)
        url += '&subitems';

    setUrl(url);
}

function getBoardId(str) {
    const match = mondayUrlRegex.exec(str);

    return match ? match[1] : str;
}

function createSafeUrl(key, board) {
    statusEl.style.display = 'block';
    textEl.innerText = 'Working on it...';
    urlEl.innerText = '';

    return fetch('/token', {
        method: 'POST',
        body: JSON.stringify({ key, board }),
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(r => r.ok ? r.text() : Promise.reject(r.statusText));
}

document.getElementById('create-url').addEventListener('submit', function(e) {
    const data = new FormData(e.target);
    const key = data.get('key').trim();
    const board = data.get('board').trim();
    const hideCredentials = data.get('safe');
    const shouldDismember = data.get('dismember');
    const includeSubitems = data.get('subitems');

    e.preventDefault();

    if (key.length === 0 || board.length === 0)
        return setError('Please, fill the API token and Board ID.');

    if (key.length < 100) {
        if (key.length === 32)
            return setError('The API token must be the one from API v2');
        else
            return setError('The API token is invalid. It needs to be the personal API token from API v2.');
    }

    const boardId = getBoardId(board);

    if (hideCredentials) {
        createSafeUrl(key, boardId).then(
            (token) => setTokenUrl(token, shouldDismember, includeSubitems),
            error => {
                console.error(error);
                setBasicUrl(key, boardId, shouldDismember, includeSubitems);
            },
        );
        return;
    }

    setBasicUrl(key, boardId, shouldDismember, includeSubitems);
});

urlEl.addEventListener('click', function (e) {
    window.getSelection().selectAllChildren(urlEl);

    navigator.clipboard.writeText(urlEl.innerText)
        .then(() => console.log('copied to clipboard'));
});
