const databaseUtils = require('./database.js');
const mondayUtils = require('./monday.js');

module.exports = async function(db, req, res) {

    const key = req.body.key;
    const board = req.body.board;

    try {
        if (key && board && await mondayUtils.boardExists(key, board)) {
            const token = await databaseUtils.generateToken(db, key, board);
            res.end(token);
        } else {
            res.statusCode = 401;
            res.end();
        }
    } catch(err) {
        res.statusCode = 500;
        res.end(err);
    }
};