var express = require('express');
var router = express.Router();
// var $ = require('jquery'); 
// const jsdom = require("jsdom");
// const { JSDOM } = jsdom;
var weather = require("../weather.json");
// const fetch = require("node-fetch");


router.get('/', function(req, res, next) {
  res.render('weather',{w_data:weather});
  console.log(typeof weather);
});


module.exports = router;