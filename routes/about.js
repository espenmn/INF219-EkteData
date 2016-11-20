/**
 * Created by vegar on 20/11/16.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('about', {title: 'Info'});
});

module.exports = router;