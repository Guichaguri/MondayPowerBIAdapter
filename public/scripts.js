const mondayUrlRegex = /monday\.com\/boards\/([0-9]+)/;
const apiUrlBase = location.protocol + '//' + location.host + '/1/items';

function setError(error) {
    document.getElementById('status').style.display = 'block';
    document.getElementById('text').innerText = error;
    document.getElementById('url').innerText = '';
}

function setUrl(url) {
    document.getElementById('status').style.display = 'block';
    document.getElementById('text').innerText = 'Import the URL below as a "Web Data Source" in Power BI';
    document.getElementById('url').innerText = url;
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
    document.getElementById('status').style.display = 'block';
    document.getElementById('text').innerText = 'Working on it...';
    document.getElementById('url').innerText = '';

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
                setBasicUrl(key, board, shouldDismember, includeSubitems);
            },
        );
        return;
    }

    setBasicUrl(key, board, shouldDismember, includeSubitems);
});
