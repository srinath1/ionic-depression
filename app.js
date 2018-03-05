var http = require('http');
var bodyParser = require("body-parser");
var express = require('express');
var vision = require('@google-cloud/vision');
var fs = require('fs');
const darktriad = require('darktriad');
const affectimo = require('affectimo');
const pa = require('predictage');
const pg = require('predictgender')
var readingTime = require('reading-time');
var WikiFakt = require('wikifakt');
var analytics = require('uclassify');
	
var formidable = require('formidable');
var moment = require('moment');
var Twit = require('twit');


var T = new Twit({
  consumer_key:         'f7vT9Ov7yZP8evoZw4klew',
  consumer_secret:      'x5TSwqQFGMH1XrB6rYHScdkGtAdgz23e2jFCjGn0',
  access_token:         '121973559-JHz96ixpLML2Te5vL75JLk6d9sTCFsjLO8WkOz9x',
  access_token_secret:  'XWeLsKXssdzU9VwSuWuQveJOijdzrbrh3tzmQkFP05XrI'
  
})





var router = express();

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

router.get('/randomfacts',function(req,res){
	
	// Get a fact 
WikiFakt.getRandomFact().then(function(fact) {
	res.send(fact)
  console.log(fact);
});
 


	
})
router.post('/wordsperminute',function(req,res){
	 var str=req.body.text;
	var stats = readingTime(str);
  console.log(stats)
	res.send(stats);
	
	
});

router.post('/readsperminute',function(req,res){
	 var str=req.body.text;
	var stats = readingTime(str);
  console.log(stats)
	res.send(stats);
	
	
});
router.get('/tweets',function(req,res){
var stream = T.stream('statuses/filter', { track: 'depression' })

stream.on('tweet', function (tweet) {
  res.send(tweet)
})
});
router.get('/mytweets',function(req,res){
	
 
	
T.get('search/tweets', { q: 'depression since:2018-03-05', count: 25 }, function(err, data, response) {
  res.send(data)
})


})


router.post('/attitude',function(req,res){
	 var str=req.body.text;
	 var analysis = new analytics("QoOoVVLxADwp","BVNoqNMReQ0X");// The read and write api key can be obtained by creating an uclassify account in the https://www.uclassify.com for free..
//they provide 500 request for free daily..
 
//Ex: Here shown is a short news data that is being passed on and the response is as shown..
analysis.attitude_analysis({"data":[str]},function(err,data){
    if(err){console.log(err);
    }
    else{
       res.send(data);
    }
});

	
});
router.post('/predictingage',function(req,res){
	 var str=req.body.text;
	 var analysis = new analytics("QoOoVVLxADwp","BVNoqNMReQ0X");// The read and write api key can be obtained by creating an uclassify account in the https://www.uclassify.com for free..
//they provide 500 request for free daily..
 
//Ex: Here shown is a short news data that is being passed on and the response is as shown..
analysis.age_analysis({"data":[str]},function(err,data){
    if(err){console.log(err);
    }
    else{
       res.send(data);
    }
});

	
});

router.post('/moodanalysis',function(req,res){
	 var str=req.body.text;
	 var analysis = new analytics("QoOoVVLxADwp","BVNoqNMReQ0X");// The read and write api key can be obtained by creating an uclassify account in the https://www.uclassify.com for free..
//they provide 500 request for free daily..
 
//Ex: Here shown is a short news data that is being passed on and the response is as shown..
analysis.mood_analysis({"data":[str]},function(err,data){
    if(err){console.log(err);
    }
    else{
       res.send(data);
    }
});

	
});
router.post('/gender', function(req, res) {    
	 const opts = {  // These are the default options:
  'encoding': 'freq',
  'max': Number.POSITIVE_INFINITY,
  'min': Number.NEGATIVE_INFINITY,
  'nGrams': 'true',
  'output': 'age',
  'places': 9,
  'sortBy': 'lex',
  'wcGrams': 'false',
};
	 
const text = req.body.text;
const gender = pg(text, opts)
console.log(gender)
	res.send(gender)
	
	})


	

	
	
})
router.post('/age', function(req, res) {    
	 var str=req.body.text;
	const opts1 = {
  'encoding': 'freq',
  'max': Number.POSITIVE_INFINITY,
  'min': Number.NEGATIVE_INFINITY,
  'nGrams': 'true',
  'output': 'age',
  'places': 9,
  'sortBy': 'lex',
  'wcGrams': 'false',
}

 
const age = pa(str, opts1);
console.log(age);
	res.send(age);
	
 });


 router.post('/darktriad', function(req, res) {    
	 var str=req.body.text;
	const opts1 = {
  'encoding': 'freq',
  'max': Number.POSITIVE_INFINITY,
  'min': Number.NEGATIVE_INFINITY,
  'nGrams': 'true',
  'output': 'lex',
  'places': 9,
  'sortBy': 'lex',
  'wcGrams': 'false',
}

const triad = darktriad(str, opts1);
	 res.send(triad);
console.log(triad)
	
 })
router.post('/optimism', function(req, res) {    
	 var str=req.body.text;
	const opts2 = {
  'encoding': 'binary',
  'max': Number.POSITIVE_INFINITY,
  'min': Number.NEGATIVE_INFINITY,
  'nGrams': 'true',
  'output': 'lex',
  'places': 9,
  'sortBy': 'freq',
  'wcGrams': 'false',
};
	
const affect = affectimo(str, opts2);
console.log(affect);


	 res.send(affect);

	
 })


router.post('/info', function(req, res) {
    var text = req.body.text;
    console.log(text)
    var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');

    var tone_analyzer = new ToneAnalyzerV3({
    username: 'ea5a0727-769c-4c8c-aa8b-5521c378aa73',
    password: '7PA6sYyClY5J',
    version_date: '2016-05-19'
     });

    tone_analyzer.tone({
        text: text
    }, function(err, tone) {
    if (err) console.log(err);
    else res.send((JSON.stringify(tone, null, 2)));
    })
})



var port = process.env.PORT || process.env.VCAP_APP_PORT || 3000;

router.listen(port, function() {
  console.log('Server running on port: %d', port);
});
