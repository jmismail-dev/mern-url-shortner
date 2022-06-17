
const { customAlphabet } = require('nanoid');

// DB 
const connection = require('../lib/db');

// Helpers 
const { currentDate } = require('../helpers/date')

const generateURL = (req, res) => {
    const { url } = req.body;
    const nanoid = customAlphabet('1234567890abcdef', 10)

    const gen_id = nanoid(6);




    connection.connect(() => {

        // Check for existsing record
        const checkUrl = `SELECT * FROM urls WHERE url = ?`;
        connection.query(checkUrl, [url], (urlErr, urls) => {
            if (urlErr) throw new Error(urlErr);

            if (urls && urls.length > 0) {
                // URL Already exists!
                return res.status(200).send({ url: 'ALREADY_GENERATED', nanoid: urls[0].shortId })
            }
            else {
                // Create new URL
                const sql = 'INSERT INTO urls(url, shortId, timestamp, clicks) VALUES(?,?,?,?) ';
                connection.query(sql, [url, gen_id, currentDate, 0], (err, results) => {
                    if (err) {
                        return res.status(500).send({ message: 'Internal error', err: err.toString() })
                    };
                    return res.status(200).send({ url: 'NEW_URL_GENERATION', nanoid: gen_id })
                })
            }

        });

    });
}

const redirectURL = (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM urls WHERE shortId=?';

    connection.connect(() => {
        connection.query(sql, [id], (err, results) => {
            if (err) {
                return res.status(500).send({ message: 'Internal error', err: err.toString() })
            };

            if (results && results.length > 0) {
                connection.query('UPDATE urls SET clicks = clicks + 1 WHERE shortid = ?', [id], (er) => {
                    if (er) return res.status(500).send({ message: 'Internal error', err: er.toString() })
                    return res.status(200).send({ message: 'Successfully fetched', code: 'FETCHED_OK', ...results[0] })
                })

            }
            else {
                return res.status(200).send({ message: 'Invalid Id', code: 'NOT_FOUND' })
            }
        })
    });
}



module.exports = {
    generateURL,
    redirectURL
}