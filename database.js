const tokenChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function createToken() {
    let token = '';
    for (let i = 0; i < 64; i++) {
        token += tokenChars[Math.floor(Math.random() * tokenChars.length)];
    }
    return token;
}

module.exports.generateToken = async function(db, key, board) {
    let token, res;

    res = await db.query('SELECT token FROM monday_tokens WHERE monday_key = $1 AND monday_board = $2', [key, board]);
    
    if (res.rows.length > 0) {
        return res.rows[0]['token'];
    }

    do {
        token = createToken();
        res = await db.query('SELECT token FROM monday_tokens WHERE token = $1', [token]);
    } while (res.rows.length > 0);

    await db.query('INSERT INTO monday_tokens (token, monday_key, monday_board) VALUES ($1, $2, $3)',
        [token, key, board]);

    return token;
};

module.exports.fromToken = async function(db, token) {
    const res = await db.query('SELECT monday_key, monday_board FROM monday_tokens WHERE token = $1', [token]);
    if (res.rows.length === 0) return null;

    const row = res.rows[0];

    return {
        key: row['monday_key'],
        board: row['monday_board']
    }
};

module.exports.setupDatabase = async function(db) {
    await db.query('CREATE TABLE IF NOT EXISTS monday_tokens ( ' +
        'token character varying(64) COLLATE pg_catalog."default" NOT NULL, ' +
        'monday_key character varying(200) COLLATE pg_catalog."default" NOT NULL, ' +
        'monday_board numeric(10,0) NOT NULL, ' +
        'CONSTRAINT monday_tokens_pkey PRIMARY KEY (token) ' +
        ')');
};