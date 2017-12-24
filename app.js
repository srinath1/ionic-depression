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
        "cover": "cover-bigbuckbunny.png",
        "placeholder": "placeholder-bigbuckbunny-1080p.png"
    },
    "streams": [{
        "type": "mp4",
        "url": "http://media.clarify.io/video/presentations/DanGilbert-TED2004-The-Surprising-Science-of-Happiness.mp4"
    }, {
        "type": "ogv",
        "url": "http://media.clarify.io/video/presentations/DanGilbert-TED2004-The-Surprising-Science-of-Happiness.mp4"
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
        "cover": "cover-sintel.png",
        "placeholder": "placeholder-sintel-1080p.png"
    },
    "streams":"http://media.clarify.io/video/presentations/ShawnAchor-TEDxBloomington-The-Happy-Secret-to-Better-Work.mp4"
    
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
        "cover": "cover-elephantsdream.png",
        "placeholder": "placeholder-elephantsdream-1080p.png"
    },
    "streams": "http://lachy.id.au/lib/media/elephantsdream/Elephants_Dream-360p-Stereo.webm"
    
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
        "cover": "cover-sita.png",
        "placeholder": "placeholder-sitasingstheblues-1080p.png"
    },
    "streams":"http://media.clarify.io/video/presentations/Midwest.io-Jeff-Norris-Mission-Critical-Innovation.mp4"
  
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
        "cover": "cover-bigbuckbunny.png",
        "placeholder": "placeholder-bigbuckbunny-1080p.png"
    },
    "streams": "http://media.clarify.io/video/presentations/Midwest.io-Keith-Casey-On-the-Edge-of-Hypermedia.mp4http://media.w3.org/2010/05/bunny/movie.mp4"
   
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
        "cover": "cover-elephantsdream.png",
        "placeholder": "placeholder-elephantsdream-1080p.png"
    },
    "streams": "http://media.clarify.io/video/presentations/SimonSinek-TEDxPugetSound-How-Great-Leaders-Inspire-Action.mp4"
}]
);
	
	
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
