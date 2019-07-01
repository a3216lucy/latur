var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('rail2', { title: 'Express' });
  });

module.exports = router;