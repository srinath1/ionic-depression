var http = require('http');
var bodyParser = require("body-parser");
var express = require('express');
var vision = require('@google-cloud/vision');
var fs = require('fs');
const darktriad = require('darktriad');
const affectimo = require('affectimo');
const pa = require('predictage');
var readingTime = require('reading-time');

	
var formidable = require('formidable');

var router = express();

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());
router.post('/wordsperminute',function(req,res){
	 var str=req.body.text;
	var stats = readingTime(str);
  console.log(stats)
	res.send(stats);
	
	
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
