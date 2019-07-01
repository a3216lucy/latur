var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('rail', { title: 'Express' });
  });

module.exports = router;