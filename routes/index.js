var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Expres' });
});

router.get('/monitoring', async function(req, res, next) {
  var result = await require('../controller/monitoringController')();
  res.send(result);
});

module.exports = router;
