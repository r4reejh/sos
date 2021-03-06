var express = require('express');
const admin = require('firebase-admin');
var promise = require('bluebird');
var coreController = require('../controllers/coreController');
var router = express.Router();

router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.send('api');
});

router.get('/SOS/:lat/:long',(req,res)=>{
	console.log(req.params.lat+" "+req.params.long);
	coreController.SOS(req.params.lat,req.params.long)
	.then((hit)=>{
		res.status(200);
		res.send({'hit':hit[0],'relief':hit[1],'status':'hello'});
	})
	.catch((e)=>{
		console.log(e);
	});
});

router.post('/SOS',(req,res)=>{
	console.log(req.body);
	coreController.SOS(req.body.lat,req.body.long)
	.then((hit)=>{
		res.status(200);
		res.send({'hit':hit[0],'relief':hit[1]});
	})
	.catch((e)=>{
		console.log(e);
	});
});

module.exports = router;
