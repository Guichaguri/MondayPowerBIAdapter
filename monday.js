const https = require('https');
const mondayBase = 'https://api.monday.com/v2';

function runQuery(key, query) {
    const data = JSON.stringify({query: query});

    return new Promise((resolve, reject) => {

        const req = https.request(mondayBase, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length,
                'Authorization': 'Bearer ' + key,
            }
        }, (res) => {

            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.once('end', () => {
                try {
                    resolve(JSON.parse(body));
                } catch(e) {
                    reject(e);
                }
            });

        });

        req.once('error', (err) => reject(err));
        req.end(data);

    });
};

module.exports.retrieveItems = function(key, board) {
    const query = 'query { boards(ids: ' + parseInt(board) + ') { columns { id, title, type }, ' +
        'items { name, updated_at, group { title }, column_values { text, type, value } } } }';

    return runQuery(key, query);
};

module.exports.boardExists = async function(key, board) {
    const query = 'query { boards(ids: ' + parseInt(board) + ') { name } }';

    try {
        const data = await runQuery(key, query);

        return data && data['data'] && data['data']['boards'].length > 0;
    } catch(err) {
        return false;
    }
};