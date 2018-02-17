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
var nlp = require('nlp_compromise');
var nlpNgram = require('nlp-ngram');


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
router.post('/statementanalysis',function(req,res){
	 var str=req.body.text;
	
	nlp.plugin(nlpNgram);
 
        var t = nlp.text(str);
        t.ngram();
  
	res.send(t.ngram(););
	
	
});

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

router.get('/videos',function(req,res){
	
	res.send([{
    "id": "1",
    "title": "The happy secret to the  better work",
    "description": "We believe we should work hard in order to be happy, but could we be thinking about things backwards? In this fast-moving and very funny talk, psychologist Shawn Achor argues that, actually, happiness inspires us to be more productive.",
    "meta": {
        "releaseYear": "2014",
        "author": [{
            "name": "Dan Gilbert"
        }],
        "actors": []
    },
    "images": {
        "cover": "https://i.ytimg.com/vi/FRUcgZW1G2U/maxresdefault.jpg",
        "placeholder": "https://i.ytimg.com/vi/FRUcgZW1G2U/maxresdefault.jpg"
    },
    "streams": [{
        "type": "mp4",
        "url": "https://drive.google.com/open?id=1TIppwuEMgghYmLNSm3y47ue1o8NxhnYz"
    }]
}, {
    "id": "2",
    "title": "The new era to beat the depression",
    "description": "Martin Seligman talks about psychology — as a field of study and as it works one-on-one with each patient and each practitioner. As it moves beyond a focus on disease, what can modern psychology help us to become? .",
    "meta": {
        "releaseYear": "2014",
        "directors": [{
            "name": "Shaun"
        }],
        "actors": [{
            "name": "Shaun"
        }, {
            "name": "Shaun"
        }]
    },
    "images": {
        "cover": "https://jbwye.files.wordpress.com/2013/12/elephant.jpg",
        "placeholder": "https://jbwye.files.wordpress.com/2013/12/elephant.jpg"
    },
    "streams":"https://drive.google.com/open?id=1lEB87zMtUMLLWS0PNenSQ0IRpDh8PWqB"
    
    }, {
    "id": "3",
    "title": "Elephant's Dream",
    "description": "Elephants Dream is the story of two strange characters exploring a capricious and seemingly infinite machine. The elder, Proog, acts as a tour-guide and protector, happily showing off the sights and dangers of the machine to his initially curious but increasingly skeptical protege Emo. As their journey unfolds we discover signs that the machine is not all Proog thinks it is, and his guiding takes on a more desperate aspect.",
    "meta": {
        "releaseYear": "2006",
        "directors": [{
            "name": "Bassam Kurdali"
        }],
        "actors": [{
            "name": "Cas Jansen"
        }, {
            "name": "Tygo Gernandt"
        }]
    },
    "images": {
        "cover": "http://www.boating-paris-marindeaudouce.com/wp-content/uploads/a-rich-and-diverse-nature-can-be-discovered-on-the-marne-river-banks-from-silent-electric-boats-1030x679.jpg",
        "placeholder": "http://www.boating-paris-marindeaudouce.com/wp-content/uploads/a-rich-and-diverse-nature-can-be-discovered-on-the-marne-river-banks-from-silent-electric-boats-1030x679.jpg"
    },
    "streams": "https://drive.google.com/open?id=1mlBA400Y5mJbS6M3izzbFk7cNVOmGQFV"
    
}, {
    "id": "4",
    "title": "The power of passion and perservence",
    "description": "Leaving a high-flying job in consulting, Angela Lee Duckworth took a job teaching math to seventh graders in a New York public school. She quickly realized that IQ wasn't the only thing separating the successful students from those who struggled. Here, she explains her theory of grit as a predictor of success.",
    "meta": {
        "releaseYear": "2017",
        "directors": [{
            "name": "Dr.Jeff"
        }],
        "actors": [{
            "name": "Dr.Jeff"
        }]
    },
    "images": {
        "cover": "https://www.photocase.com/photos/5887-water-river-baden-wuerttemberg-danube-upper-danube-valley-photocase-stock-photo-large.jpeg",
        "placeholder": "https://www.photocase.com/photos/5887-water-river-baden-wuerttemberg-danube-upper-danube-valley-photocase-stock-photo-large.jpeg"
    },
    "streams":"https://drive.google.com/open?id=1jOkLTxfneKxea4uPqaDI8BIs2o_M2meq"
  
},
{
    "id": "5",
    "title": "What makes us feel good about work",
    "description": "What motivates us to work? Contrary to conventional wisdom, it isn't just money. But it's not exactly joy either. It seems that most of us thrive by making constant progress and feeling a sense of purpose. Behavioral economist Dan Ariely presents two eye-opening experiments that reveal our unexpected and nuanced attitudes toward meaning in our work.",
    "meta": {
        "releaseYear": "2008",
        "directors": [{
            "name": "Dan"
        }],
        "actors": []
    },
    "images": {
        "cover": "https://www.photocase.com/photos/38423-fog-river-slope-cliff-photocase-stock-photo-large.jpeg",
        "placeholder": "https://www.photocase.com/photos/38423-fog-river-slope-cliff-photocase-stock-photo-large.jpeg"
    },
    "streams": "https://drive.google.com/open?id=1p5OzFqI_ZJyjQQbZPXN209XKWYAICoHS"
   
},{
    "id": "6",
    "title": "The 3 A's awsome",
    "description": "Neil Pasricha's blog 1000 Awesome Things savors life's simple pleasures, from free refills to clean sheets. In this heartfelt talk, he reveals the 3 secrets (all starting with A) to leading a life that's truly awesome.",
    "meta": {
        "releaseYear": "2016",
        "directors": [{
            "name": "Niel"
        }],
        "actors": []
    },
    "images": {
        "cover": "https://static1.squarespace.com/static/51959b80e4b0acc777d86621/52086014e4b01247d70ab798/54dad479e4b0f27615457a22/1423627395952/P0982+-+Battleship+Lake+-+Full+Size+No+Watermark.jpg?format=500w",
        "placeholder": "https://static1.squarespace.com/static/51959b80e4b0acc777d86621/52086014e4b01247d70ab798/54dad479e4b0f27615457a22/1423627395952/P0982+-+Battleship+Lake+-+Full+Size+No+Watermark.jpg?format=500w"
    },
    "streams": "http://media.clarify.io/video/presentations/SimonSinek-TEDxPugetSound-How-Great-Leaders-Inspire-Action.mp4"
}]
)
	
	
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
