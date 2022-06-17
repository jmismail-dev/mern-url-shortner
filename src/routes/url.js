const router = require('express').Router();

// Controllers 
const { generateURL, redirectURL } = require('../controllers/url')

router.get(`/:id`, redirectURL);
router.post(`/`, generateURL);

module.exports = router;