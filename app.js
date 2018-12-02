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
//services
angular.module('starter.services', ['ngResource'])
/**
 * A simple example service that returns some data.
 */
.factory('DataLoader', function( $http, $log ) {

  return {
    get: function(url) {

      // Simple index lookup
      return $http.get( url );
    }
  }

})
//bookmark
.value('nutritionixConst', {
  'appId' :'8abbcd8e',
  'appKey' : '36e8d264537037ee7e832a41902ffe57'
})

.factory('Bookmark', function( CacheFactory ) {

  if ( ! CacheFactory.get('bookmarkCache') ) {
    CacheFactory.createCache('bookmarkCache');
  }

  var bookmarkCache = CacheFactory.get( 'bookmarkCache' );

  return {
    set: function(id) {
      bookmarkCache.put( id, 'bookmarked' );
    },
    get: function(id) {
      bookmarkCache.get( id );
      console.log( id );
    },
    check: function(id) {
      var keys = bookmarkCache.keys();
      var index = keys.indexOf(id);
      if(index >= 0) {
        return true;
      } else {
        return false;
      }
    },
    remove: function(id) {
      bookmarkCache.remove(id);
    }
  }

})
//localstorage
.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}])

//news feed


//newtindercards
.factory('tindernewService',function($q){
var items=[
{
title:'photo 1',
image:'img/ocean1.jpg'
},
{
title:'photo 2',
image:'img/ocean2.jpg'
},
{
title:'photo 3',
image:'img/ocean3.jpg'
},
{
title:'photo 4',
image:'img/ocean4.jpg'
},
{
title:'photo 5',
image:'img/ocean5.jpg'
}
];
		var service = {
			getItems: getItems
		};
		return service;

		function getItems() {
			return $q.when(angular.copy(items));
		}
	})
	
//search data factory
.factory('dataFactory', function($http) {
var server ='http://eurestkantine.com/eurest/wp-json/wp/v2/';
	var myService = {
		httpRequest: function(url,method,params,dataPost,upload) {
			var passParameters = {};
			passParameters.url = server + url;

			if (typeof method == 'undefined'){
				passParameters.method = 'GET';
			}else{
				passParameters.method = method;
			}

			if (typeof params != 'undefined'){
				passParameters.params = params;
			}

			if (typeof dataPost != 'undefined'){
				passParameters.data = dataPost;
			}

			if (typeof upload != 'undefined'){
				passParameters.upload = upload;
			}

			var promise = $http(passParameters).then(function (response) {
				if(typeof response.data == 'string' && response.data != 1){
					//Give Notification
					return false;
				}
				return response.data;
			},function (response) {
				if ( response.status == 401 ){
					//Give Notification
				} else{
					//Give Notification
				}
			});
			return promise;
		}
	};
	return myService;
})
.factory('Products', ['$http', 'Config', function($http, Config) {
	var data = {};
	data.getPosts = function () {
		return $http(
			{
				method: 'GET', url:Config.ProductUrl
			}
		);
	}
  	return data;
}])
//BACK
.factory('backcallFactory', ['$state','$ionicPlatform','$ionicHistory','$timeout',function($state,$ionicPlatform,$ionicHistory,$timeout){

var obj={}
    obj.backcallfun=function(){
  
       $ionicPlatform.registerBackButtonAction(function () {
          if ($state.current.name == "app.posts") {
            var action= confirm("Do you want to Exit?");
             if(action){
                navigator.app.exitApp();
              }//no else here just if
      
      }else{
            $ionicHistory.nextViewOptions({
                 disableBack: true
                });
        $state.go('app.posts');
        //go to home page
     }
        }, 100);//registerBackButton
}//backcallfun
return obj;
}])
//photo
.factory('Photos',['$http', 'Config', function($http, Config) {
	var data = {};
	data.getPosts = function () {
		return $http(
			{
				method: 'GET', url:Config.PhotoUrl
			}
		);
	}
  	return data;
}])

//flickr
.value('Flickr_data',{
  key: '3be0b85707dbfae9843bcc9db4934bb6',
  endpoint: 'https://api.flickr.com/services/rest/',
  user_id : '141185596@N08'
})

.factory('Flickr', function($http,$q,Flickr_data){
	var result = {};

	// Getting List of Photoset in a user account.
	result.getPhotoSets = function() {
		var url = Flickr_data.endpoint + 
				  '?method=flickr.photosets.getList&api_key=' + Flickr_data.key +
				  '&user_id=' + Flickr_data.user_id +
				  '&format=json&nojsoncallback=1';

		console.log(url);
		return $http.get(url);
	};


	// Getting Photos of a photo set
	result.getPhotos = function(photoset_id) {
		var defer = $q.defer();

		var url = Flickr_data.endpoint + 
				  '?method=flickr.photosets.getPhotos&api_key=' + Flickr_data.key +
				  '&user_id=' + Flickr_data.user_id +
				  '&photoset_id=' + photoset_id +
				  '&format=json&nojsoncallback=1';

		
		// Getting the Photos from a photoset
		return $http.get(url)
	};

	result.getInfo = function(id, secret) {
		sizes =  Flickr_data.endpoint +
						   '?method=flickr.photos.getSizes&api_key=' + Flickr_data.key +
						   '&photo_id=' + id + '&format=json&nojsoncallback=1';

		info = Flickr_data.endpoint + 
						   '?method=flickr.photos.getInfo&api_key=' + Flickr_data.key +
						   '&photo_id=' + id + '&secret=' + secret +
						   '&format=json&nojsoncallback=1';
		return $q.all([
			$http.get(sizes),
			$http.get(info)
		]);	
	};

	return result;
})
//lundbeck   flickr images

.value('Flickr_data1',{
  key: 'f91c2992d774c50011292f926809f183',
  endpoint: 'https://api.flickr.com/services/rest/',
  user_id : '146459709@N02'
})

.factory('Flickrlundbeckdata', function($http,$q,Flickr_data1){
	var result = {};

	// Getting List of Photoset in a user account.
	result.getPhotoSets = function() {
		var url = Flickr_data1.endpoint + 
				  '?method=flickr.photosets.getList&api_key=' + Flickr_data1.key +
				  '&user_id=' + Flickr_data1.user_id +
				  '&format=json&nojsoncallback=1';

		console.log(url);
		return $http.get(url);
	};


	// Getting Photos of a photo set
	result.getPhotos = function(photoset_id) {
		var defer = $q.defer();

		var url = Flickr_data1.endpoint + 
				  '?method=flickr.photosets.getPhotos&api_key=' + Flickr_data1.key +
				  '&user_id=' + Flickr_data1.user_id +
				  '&photoset_id=' + photoset_id +
				  '&format=json&nojsoncallback=1';

		
		// Getting the Photos from a photoset
		return $http.get(url)
	};

	result.getInfo = function(id, secret) {
		sizes =  Flickr_data1.endpoint +
						   '?method=flickr.photos.getSizes&api_key=' + Flickr_data1.key +
						   '&photo_id=' + id + '&format=json&nojsoncallback=1';

		info = Flickr_data1.endpoint + 
						   '?method=flickr.photos.getInfo&api_key=' + Flickr_data1.key +
						   '&photo_id=' + id + '&secret=' + secret +
						   '&format=json&nojsoncallback=1';
		return $q.all([
			$http.get(sizes),
			$http.get(info)
		]);	
	};

	return result;
})
.factory('otherFeatures', function(){
    var data = {};
    
    data.items = [
	 { 
            title: 'Lundbeck News',
            icon: 'ion-android-checkbox-blank',
            url: '#/app/lindbecknews'
        },
		{ 
            title: 'Notice Board',
            icon: 'ion-calendar',
            url: '#/app/page'
        },
		{ 
            title: ' Calender',
            icon: 'ion-ios-calendar-outline',
            url: '#/app/calendar'
        },
		{ 
            title: ' Store',
            icon: 'ion-ios-cart-outline',
            url: '#/app/lundbeckstore'
        },
		{ 
            title: ' Lundbeck Conference',
            icon: 'ion-person-stalker',
            url: '#/app/calendar'
        },
		{ 
            title: ' Lundbeck Images',
            icon: 'ion-images',
            url: '#/app/flickrlundbeck'
        },
		{ 
            title: 'Images',
            icon: 'ion-paintbrush',
            url: '#/app/lundbeckimages'
        },
		{ 
            title: 'Share',
            icon: 'ion-ios-pulse-strong',
            url: '#/app/my-stocks'
        },
		 { 
            title: 'Opinion',
            icon: 'ion-loop',
            url: '#/app/lundbeckopinion'
        },
		
		{ 
            title: 'Rethink Depression',
            icon: 'ion-clipboard',
            url: '#/app/rethinkdepression'
        }
		 
		
		
		 
       
    ]; 
    
    return data;
})

//rethink depression
.factory('rethinkdepression', function(){
    var data = {};
    
    data.items = [
	 { 
            title: 'Depression News',
            icon: 'ion-ios-personadd',
            url: '#/app/depression'
        },
		{ 
            title: 'Depression Instagram Images',
            icon: 'ion-android-image',
            url: '#/app/rethinkinsta'
        },
		{ 
            title: ' Depression Flickr Images',
            icon: 'ion-android-folder',
            url: '#/app/depflickr'
        },
		{ 
            title: ' Store',
            icon: 'ion-ios-cart-outline',
            url: '#/app/lundbeckstore'
        },
		{ 
            title: 'Depression Videos',
            icon: 'ion-social-youtube',
            url: '#/app/depnewyoutube'
        },
		 
       
    ]; 
    
    return data;
})

//feautres
.factory('Features', function(){
    var data = {};
    
    data.items = [
	{ 
            title: 'My Task',
            icon: 'ion-ios-list-outline',
            url: '#/app/todoapp'
        },
		
		{ 
            title: 'Are You Better Than 7 Th A Grade',
            icon: 'ion-arrow-move',
            url: '#/app/quiz'
        },
		{ 
            title: 'Wikisearch',
            icon: 'ion-search',
            url: '#/app/wikisearch'
        },
		{ 
            title: 'Weather',
            icon: 'ion-ios-partlysunny',
            url: '#/app/weather'
        },
		{ 
            title: 'Check Calories',
            icon: 'ion-ios-nutrition',
            url: '#/app/nutrisearch'
        },
		{ 
            title: 'Random Quote',
            icon: 'ion-quote',
            url: '#/app/randomquote'
        },
		
		
		
		 { 
            title: 'Youtube',
            icon: 'ion-social-youtube',
            url: '#/app/youtubevideos'
        },
		
		{ 
            title: 'Quotes',
            icon: 'ion-quote',
            url: '#/app/quotes'
        },
		{ 
            title: 'History',
            icon: 'ion-cube',
            url: '#/app/facts'
        },
	 
		{ 
            title: 'Astro',
            icon: 'ion-android-hand',
            url: '#/app/astro'
        },
		{ 
            title: 'Our Images',
            icon: 'ion-android-hand',
            url: '#/app/newtindercards'
        },
		  
		 

		  
       
		{ 
            title: 'Other Features',
            icon: 'ion-clipboard',
            url: '#/app/otherfeatures'
        }
        
        
		
       
    ]; 
    
    return data;
})
.service('MonthsEvents',function($rootScope){
  var events=[]

  return {
    loadEvents:function(){
      events=[{
        title:'Danish Food',
        start:'2016-11-15'
      },{
        title:'Tomato Soup',
        start:'2016-11-215'
      },{
        title:'Salat',
        start:'2016-12-16'
      },{
        title:'Butter Chicken',
        start:'2016-11-217'
      },{
        title:'FishCurry',
        start:'2016-11-25'
      },{
        title:'Danish Cold Pasteries',
        start:'2016-11-26'
      },{
        title:'Hot Onion Soup',
        start:'2016-11-227'
      },{
        title:'Apples&Oranges',
        start:'2016-05-25'
      },{
        title:'Mushroom Soup',
        start:'2016-05-26'
      },{
        title:'Beef Roast',
        start:'2016-05-26'
      },{
        title:'Pasta',
        start:'2016-05-27'
      },
	  {
        title:'Sambar Rice',
        start:'2016-11-28'
      },
	  {
        title:'Fried Rice',
        start:'2016-11-29'
      },
	  {
        title:'Hyderabad Biryani',
        start:'2016-12-03'
      },
	  {
        title:'Chilli Chicken',
        start:'2016-12-04'
      },
	  {
        title:'Chicken 65',
        start:'2016-12-04'
      },
	  {
        title:'Lamb Rice',
        start:'2016-12-05'
      }]

      $rootScope.$broadcast('events_get')
    },

    getAllEvents:function(){
      return events
    },

    getEventsByDate:function(date){
      return events.filter(function(e){
        return e.start===date
      })
    }
  }
})
.service('MonthsEvents',function($rootScope){
  var events=[]

  return {
    loadEvents:function(){
      events=[{
        title:'Eurest day',
        start:'2016-11-15'
      },{
        title:'International day',
        start:'2016-11-215'
      },{
        title:'World Day',
        start:'2016-12-16'
      },{
        title:'Vegetarian day',
        start:'2016-11-217'
      },{
        title:'French day',
        start:'2016-11-25'
      },{
        title:'Denmark day',
        start:'2016-11-26'
      },{
        title:'Scanidavian day',
        start:'2016-11-227'
      },{
        title:'European day',
        start:'2016-05-25'
     },
	  {
        title:'Christmas day',
        start:'2016-12-25'
      }]

      $rootScope.$broadcast('events_get')
    },

    getAllEvents:function(){
      return events
    },

    getEventsByDate:function(date){
      return events.filter(function(e){
        return e.start===date
      })
    }
  }
})

//connectivity monitor
 .factory('ConnectivityMonitor', function ($rootScope, $cordovaNetwork, $state) {

            return {
                //Check network connection is online
                isOnline: function () {
                    if (ionic.Platform.isWebView()) {
                        return $cordovaNetwork.isOnline();
                    } else {
                        return navigator.onLine;
                    }
                },
                //Check network connection is offline
                ifOffline: function () {
                    if (ionic.Platform.isWebView()) {
                        return !$cordovaNetwork.isOnline();
                    } else {
                        return !navigator.onLine;
                    }
                },
                //Check the network connection status
                startWatching: function () {

                    if (ionic.Platform.isWebView()) {

                        $rootScope.$on('$cordovaNetwork:online', function (event, networkState) {
                            $state.go('app.home');
                        });

                        $rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {
                            $state.go('offline');
                        });

                    } else {

                        window.addEventListener("online", function (e) {
                            $state.go('app.home');
                        }, false);

                        window.addEventListener("offline", function (e) {
                            $state.go('offline');
                        }, false);
                    }
                }
            };
        })


         
       
       
//wikipidea
.factory("searchResults", function($http) {
    var config = {
        params: {
            format: "json",
            action: "query",
            prop: "extracts",
            exchars: "140",
            exlimit: "10",
            exintro: "",
            explaintext: "",
            rawcontinue: "",
            generator: "search",
            gsrlimit: "10",
            callback: "JSON_CALLBACK"
        }
    };
    var url = "https://en.wikipedia.org/w/api.php?";
    
    var results = {
        get: function(data) {
            config.params.gsrsearch = data;
            return $http.jsonp(url,config).then(function(rq){
                console.log(rq);
                return rq;
            });
        }
    };

    return results;
})
.filter('orderObjectBy', function() {
  return function(items, field, reverse) {
    var filtered = [];
    angular.forEach(items, function(item) {
      filtered.push(item);
    });
    filtered.sort(function (a, b) {
      return (a[field] > b[field] ? 1 : -1);
    });
    if(reverse) filtered.reverse();
    return filtered;
  };
})
//random quotes
.service('QuoteService', ['$http', function($http) {
  this.getRandomQuote = function() {
    return $http.jsonp("http://api.forismatic.com/api/1.0/?method=getQuote&format=jsonp&lang=en&jsonp=JSON_CALLBACK");
  };
}])
//nutriservices
 .factory('nutriDataService', function( $resource, nutritionixConst){
  var aSearchObject = $resource('https://api.nutritionix.com/v1_1/search/:term',{term: '@term'},{
    getAll : {
      method : 'get',
      //isArray : true,
      params : {
        results  : ':results',
		appId : nutritionixConst.appId,
        appKey  :nutritionixConst.appKey,
        
        // brand_id:'513fbc1283aa2dc80c00001f',
        fields : ':fields',
      }
    }
  });
  return {
    /**
    * we can specify the params, the query string and the default fields
    * to turn in the query along with the result size
    */
    getAll : function(_params) {
      var defaultFields = 'brand_id,item_name,item_id,brand_name,nf_calories,nf_total_fat';

      if (!_params.fields) {
        _params.fields = defaultFields;
      }
      return aSearchObject.getAll(_params);             
    }
  }

})
/**
*
*/
  .factory('nutriDataServiceHTTP', function( $http, nutritionixConst){
  return {
    getAll : function(_key) {

      return $http.get('https://api.nutritionix.com/v1_1/search/' + _key,{
        'params' : {
          results  : '0:50',
		  appId : nutritionixConst.appId,
        appKey  :nutritionixConst.appKey,
        
          // brand_id:'513fbc1283aa2dc80c00001f',
          fields : 'brand_id,item_name,item_id,brand_name,nf_calories,nf_total_fat'
        }
      });
    }
  }
})

 
//controllers
angular.module('starter.controllers', ['youtube-embed','ionic.contrib.ui.tinderCards','ngCordova','ngResource'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $sce, DataLoader,  $log ) {
  
  // Enter your site url here. You must have the WP-API v2 installed on this site. Leave /wp-json/wp/v2/ at the end.
  var root1 = 'http://eurestcanteen.in/eurest/wp-json/wp/v2/';

  // $rootScope.callback = '_jsonp=JSON_CALLBACK';

})

.controller('SettingsCtrl', function($scope, Settings) {
  $scope.settings = Settings.getSettings();

  // Watch deeply for settings changes, and save them
  // if necessary
  $scope.$watch('settings', function(v) {
    Settings.save();
  }, true);

  $scope.closeSettings = function() {
    $scope.modal.hide();
  };

})


.controller('PostCtrl', function($scope,$cordovaSocialSharing, $stateParams, DataLoader, $ionicLoading,  $sce, CacheFactory, $log, Bookmark, $timeout ) {
	var root1 = 'http://eurestcanteen.in/eurest/wp-json/wp/v2/';
	

  if ( ! CacheFactory.get('postCache') ) {
    CacheFactory.createCache('postCache');
  }

  var postCache = CacheFactory.get( 'postCache' );

  $scope.itemID = $stateParams.postId;

  var singlePostApi = root1 + 'posts/' + $scope.itemID;

  $scope.loadPost = function() {

    // Fetch remote post

    $ionicLoading.show({
      noBackdrop: true
    });

    DataLoader.get( singlePostApi ).then(function(response) {

      $scope.post = response.data;

      $log.debug($scope.post);

      // Don't strip post html
      $scope.content = $sce.trustAsHtml(response.data.content.rendered);

      // $scope.comments = $scope.post._embedded['replies'][0];

      // add post to our cache
      postCache.put( response.data.id, response.data );

      $ionicLoading.hide();
    }, function(response) {
      $log.error('error', response);
      $ionicLoading.hide();
    });

  }

  if( !postCache.get( $scope.itemID ) ) {

    // Item is not in cache, go get it
    $scope.loadPost();

  } else {
    // Item exists, use cached item
    $scope.post = postCache.get( $scope.itemID );
    $scope.content = $sce.trustAsHtml( $scope.post.content.rendered );
    // $scope.comments = $scope.post._embedded['replies'][0];
  }

  // Bookmarking
  $scope.bookmarked = Bookmark.check( $scope.itemID );

  $scope.bookmarkItem = function( id ) {
    
    if( $scope.bookmarked ) {
      Bookmark.remove( id );
      $scope.bookmarked = false;
    } else {
      Bookmark.set( id );
      $scope.bookmarked = true;
    }
  }

  // Pull to refresh
  $scope.doRefresh = function() {
  
    $timeout( function() {

      $scope.loadPost();

      //Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    
    }, 1000);
      
  }
  //sharing
   $scope.shareAnywhere = function(title,url) {
        $cordovaSocialSharing.share('pls find the interesting article', title, null, url);
    };

})
 .controller('TabsCtrl', function($scope) {

  // Tabs stuff here

})

.controller('PostsCtrl', function( $scope, $http, $cordovaSocialSharing, DataLoader, $timeout, $ionicSlideBoxDelegate, $rootScope, $log ,$ionicLoading,backcallFactory) {
backcallFactory.backcallfun();
var root1 = 'http://eurestcanteen.in/eurest/wp-json/wp/v2/';

$ionicLoading.show({
                template: 'Loading .....',
				duration: 3000
            });
  var postsApi = root1 + 'posts';

  $scope.moreItems = false;

  $scope.loadPosts = function() {
 

    // Get all of our posts
    DataLoader.get( postsApi ).then(function(response) {

      $scope.posts = response.data;

      $scope.moreItems = true;

      $log.log(postsApi, response.data);

    }, function(response) {
      $log.log(postsApi, response.data);
    });

  }

  // Load posts on  load
  $scope.loadPosts();

  paged = 2;

  // Load more (infinite scroll)
  $scope.loadMore = function() {

    if( !$scope.moreItems ) {
      return;
    }

    var pg = paged++;

    $log.log('loadMore ' + pg );

    $timeout(function() {

      DataLoader.get( postsApi + '?page=' + pg ).then(function(response) {

        angular.forEach( response.data, function( value, key ) {
          $scope.posts.push(value);
		   $scope.$broadcast("scroll.infiniteScrollComplete");
        });

        if( response.data.length <= 0 ) {
          $scope.moreItems = false;
		   $scope.$broadcast("scroll.infiniteScrollComplete");
        }
      }, function(response) {
        $scope.moreItems = false;
        $log.error(response);
      });

      $scope.$broadcast('scroll.infiniteScrollComplete');
      $scope.$broadcast('scroll.resize');

    }, 1000);

  }

  $scope.moreDataExists = function() {
    return $scope.moreItems;
  }

  // Pull to refresh
  $scope.doRefresh = function() {
  
    $timeout( function() {

      $scope.loadPosts();

      //Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    
    }, 1000);
      
  };
   $scope.shareAnywhere = function(title,url) {
        $cordovaSocialSharing.share('pls find the interesting article', title, null, url);
    };
    
})

.controller('BookmarksCtrl', function( $scope, $http, DataLoader, $timeout, $rootScope, $log, Bookmark, CacheFactory ) {

  $scope.$on('$ionicView.enter', function(e) {

    if ( ! CacheFactory.get('postCache') ) {
      CacheFactory.createCache('postCache');
    }

    var postCache = CacheFactory.get( 'postCache' );

    if ( ! CacheFactory.get('bookmarkCache') ) {
      CacheFactory.createCache('bookmarkCache');
    }

    var bookmarkCacheKeys = CacheFactory.get( 'bookmarkCache' ).keys();

    $scope.posts = [];
  
    angular.forEach( bookmarkCacheKeys, function( value, key ) {
      var newPost = postCache.get( value );
      $scope.posts.push( newPost );
    });

  });
    
})



.controller('ListaCtrl',function($scope,$http,$state,$ionicHistory){
$ionicHistory.nextViewOptions({
  disableAnimate: true,
  disableBack: true
  });
	$http.get('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=PL5PkFRWjgu7pKct6RaLfX4l6GnlkyUz-R&maxResults=40&key=AIzaSyA__rddrUDI_xZZ0Xo4lr57RRPVxWAb8Oo').then(function(resp) {
    console.log('Success', resp);
 	$scope.items = resp.data.items;
           
    $scope.playvideo = function(id,title){
        $state.go('app.now-playing',{id:id,title:title});
       //SocialShare function
        
    }
   // console.log("VideoID: " + id);
    
        // For JSON responses, resp.data contains the result
  }, function(err) {
    console.error('ERR', err);
    // err.status will contain the status code
        //PLueTNPnrNvSHjlZcJb4-Yt6LXUwa53M_p - Sami Yusuf
        //PL97C2D4AAC980FDD7 Ilahi
  })
})
//newyoutube-my channel
.controller('newyoutube', function($scope, $ionicModal,$http,$ionicLoading,$ionicHistory){
 $ionicLoading.show({
                template: 'Loading ......',
				duration: 3000
            });
$ionicHistory.nextViewOptions({
  disableAnimate: true,
  disableBack: true
  });
$scope.playerVars = {
      rel: 0,
      showinfo: 0,
      modestbranding: 0,
    };
    $scope.videos = [];
	

   
$http.get('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=PL5PkFRWjgu7pKct6RaLfX4l6GnlkyUz-R&maxResults=40&key=AIzaSyA__rddrUDI_xZZ0Xo4lr57RRPVxWAb8Oo').then(function(resp) {
    console.log('Success', resp);
	
	$scope.videos=resp.data.items;
	console.log($scope.videos);
	});
	 $scope.playvideo = function(id,title){
        $state.go('now-playing',{id:id,title:title});
       //SocialShare function
        
    }
	$scope.doRefresh = function () {
	$http.get('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=PL5PkFRWjgu7pKct6RaLfX4l6GnlkyUz-R&maxResults=40&key=AIzaSyA__rddrUDI_xZZ0Xo4lr57RRPVxWAb8Oo').then(function(resp) {
    console.log('Success', resp);
	
	$scope.videos=resp.data.items;
		
			
		});
	}
	
	$scope.$broadcast('scroll.refreshComplete');
	})
	
	
	//
	.controller('nowPlayingCtrl',function ($scope, $http, $stateParams){
    $scope.videoId = $stateParams.id;
    $scope.videoTitle = $stateParams.title;
    console.log('videoID: '+ $scope.videoId);
    
    document.getElementById("video-player").innerHTML = '<iframe src="http://www.youtube.com/embed/' + $scope.videoId + '" frameborder="0" allowfullscreen class="yt-playeri"></iframe>';
    document.getElementById("now-playing").innerHTML = $scope.videoTitle;
    
   
   
   
   }
)
	//youtube search
	
	
	.controller('youtubevideos', function($scope, $http,$ionicLoading,$ionicHistory){
	 $ionicLoading.show({
                template: 'Loading...... ',
				duration: 3000
            });
			$ionicHistory.nextViewOptions({
  disableAnimate: true,
  disableBack: true
  });
  $scope.videos = [ ];
  $scope.searchInput = { };

  $scope.search = function(){
    $scope.videos = [];
    $scope.youtubeParams = {
        key: 'AIzaSyA__rddrUDI_xZZ0Xo4lr57RRPVxWAb8Oo',
        type: 'video',
        maxResults: '10',
        part: 'id,snippet',
        fields:'items/id,items/snippet/title,items/snippet/description,items/snippet/thumbnails/default,items/snippet/channelTitle,nextPageToken',
        q: $scope.searchInput
      }

    $http.get('https://www.googleapis.com/youtube/v3/search', {params:$scope.youtubeParams}).success(function(response){
      angular.forEach(response.items, function(child){
      $scope.videos.push(child);
      });
    });
  }
  $scope.playerVars = {
  rel: 0,
  showinfo: 0,
  modestbranding: 0,
}
})



	
	//team eurest
	.controller("TeamCtrl", function($scope,$sce,$ionicLoading) {
	 $ionicLoading.show({
                template: 'Loading .....',
				duration: 5000
            });
var FIREBASE_URL= 'https://mynewtv.firebaseio.com';
var ref = new Firebase(FIREBASE_URL);
    ref.once("value", function(snapshot){
 var list=[];
 list.Data =snapshot.val();
  $scope.limitsize=100;
console.log(list);
var jokes=[];
//team eurest
$scope.Names=list.Data;
$scope.list2=[];
angular.forEach($scope.Names,function(value,key){

$scope.list2.push(value)
$scope.list2.splice(23);


});


var names1=$scope.Names;
$scope.names2=names1.Month;
//jokes
$scope.mngmt=list.Data;
var jokes=$scope.mngmt;
$scope.names4=jokes.management;
//quotes
$scope.quotes1=list.Data;
var quotes2=$scope.quotes1;
$scope.quotes3=quotes2.quotes;









})
})
//instagram
.controller('ApiCtrl',function($scope, $http, $q, $cordovaSocialSharing) {

  $scope.init = function(){
    $scope.getImages()
    .then(function(res){
      // success
      console.log('Images: ',res)
      $scope.imageList = res.data;
    }, function(status){
      // err
      console.log('Error: ', status)
    })
  }

  $scope.getImages = function(){
    var defer = $q.defer();
    var url = "https://api.instagram.com/v1/users/3194446479/media/recent?access_token=3194446479.1677ed0.923d6de449fe4066832e74275947a1f2&callback=JSON_CALLBACK";
    $http.jsonp(url)
    .success(function(res){
      defer.resolve(res)
    })
    .error(function(status, err){
      defer.reject(status)
    })

    return defer.promise;
  }

  $scope.init();
   $scope.shareAnywhere = function(title,url) {
        $cordovaSocialSharing.share('pls find the image', null, null, null);
    };
})
//example controller
.controller("ExampleController", function($scope, $cordovaSocialSharing) {
 
    $scope.shareAnywhere = function() {
        $cordovaSocialSharing.share(null, null, null, null);
    }
	})

	.controller('todoCtrl', ['$scope', function($scope) {
  // Initialize the todo list array
    //if local storage is null save the todolist to local storage
    if (localStorage.getItem("mytodos") == null)
    {
 		$scope.todoList = [ {todoText:'Create app', done:false} ];
       localStorage.setItem("mytodos", angular.toJson($scope.todoList));

    }else
    {
        //set the todolist from local storage
        $scope.todoList = angular.fromJson(localStorage.getItem("mytodos"));
    }



// Add an item function
    $scope.todoAdd = function() {
      //check to see if text has been entered, if not exit
        if ($scope.todoInput == null || $scope.todoInput == ''){return;}

        //if there is text add it to the array
        $scope.todoList.push({todoText:$scope.todoInput, done:false});

        //clear the textbox
        $scope.todoInput = "";

        //resave the list to localstorage
        localStorage.setItem("mytodos", angular.toJson($scope.todoList));

    };

    $scope.remove = function() {
      //copy list
        var oldList = $scope.todoList;
        //clear list
        $scope.todoList = [];
        //cycle through list
        angular.forEach(oldList, function(x) {
          //add any non-done items to todo list
            if (!x.done) $scope.todoList.push(x);
        });
        //update local storage
         localStorage.setItem("mytodos", angular.toJson($scope.todoList));

    };

    //The Update function
    //This waits 100ms to store the data in local storage
    $scope.update = function() {
    //update local storage 100 ms after the checkbox is clicked to allow it to process
    setTimeout(function(){
        localStorage.setItem("mytodos", angular.toJson($scope.todoList));
    },100)


    }

}])



//tinder cards
.controller('newtinderCtrl',function(tindernewService){

		var vm = angular.extend(this, {
			items: [],
			cardDestroyed: cardDestroyed,
			refresh: refresh
		});

		(function activate() {
			getItems();
		})();

		

		function refresh() {
			cardDestroyed(0);
			getItems();
		}

		function getItems() {
			tindernewService.getItems().then(function (items) {
				vm.items = items;
			});
		}
		
		 function cardSwipedLeft(index) {
        console.log('Left swipe');
    }

		function cardDestroyed(index) {
			vm.items.splice(index, 1);
		}
	})
//feedback
.controller('feedbackCtrl', function ($scope,$cordovaSocialSharing) {
 $scope.shareAnywhere = function(title,url) {
        $cordovaSocialSharing.share('pls find the interesting article', title, null, null);
    };

$scope.model = {
		sounds:[
		
			{
				'Name': 'Soren',
				'image': 'img/denmark.png',
				'Designation': 'CanteenChef',
				'info':'For general services,complaints & feedback',
				'Tel': '12345678'
			},
			{
				'Name': 'Flemming',
				'image': 'img/denmark.png',
				'Designation': 'CantineSouchef',
				'info':'For quality & buffet services,complaints & feedback',
				'Tel': '234567893'
			},
			{
				'Name': 'Srinath',
				'image': 'img/india.png',
				'Designation': 'Opvask',
				'info':'For issues regarding plates/glasses etc',
				'Tel': '91437097'
			}
			
			
		
	
	]
	};
	
})
//sendmail

.controller('SendMailCtrl', function($scope) {
	$scope.sendMail = function(){
		$cordovaEmailComposer.isAvailable(
			function (isAvailable) {
				// alert('Service is not available') unless isAvailable;
				$cordovaEmailComposer.open({
					to:      'srinath.erp@gmail.com',
					cc:      'dk53@@gmail.com',
					// bcc:     ['john@doe.com', 'jane@doe.com'],
					subject: 'Greetings',
					body:    'How are you? Nice greetings from IonFullApp'
				});
			}
		);
	};
})

 
.controller("ExampleController", function($scope, $cordovaSocialSharing) {
 
    $scope.shareAnywhere = function() {
        $cordovaSocialSharing.share(null, null, null, null);
    }
	})
	
//chart
 .controller("ChartCtrl", function($scope) {
 

 
    $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
    $scope.series = ['Series A', 'Series B'];
    $scope.data = [
        [65, 59, 80, 81, 56, 55, 40],
        [28, 48, 40, 19, 86, 27, 90]
    ];
 
})
//search ctrl
  .controller('SearchCtrl', function($scope,dataFactory) {
	   var url1='posts?filter[tag]=';

	$scope.posts = [];
	$scope.page = 1;
	$scope.form = {};

	$scope.search = function(){
		dataFactory.httpRequest(url1 + $scope.form.search).then(function(data) {
			$scope.posts = data;

			
			$scope.page++;
		});
	}
})

//wordpress page 
.controller('Mainpage', function($scope, $http, $stateParams,$ionicHistory,$cordovaSocialSharing) {
$ionicHistory.nextViewOptions({
  disableAnimate: true,
  disableBack: true
  });
    $http.get('http://eurestcanteen.in/eurest/wp-json/wp/v2/pages/?slug=notice-board').success(function(res){
        $scope.pages = res;
    })
	 $scope.shareAnywhere = function(title,url) {
        $cordovaSocialSharing.share('pls find the interesting article', title, null, url);
    }
})
 //device info
  .controller('deviceCtrl', function($scope, $cordovaDevice) {

  document.addEventListener("deviceready", function () {

    $scope.device = $cordovaDevice.getDevice();

     $scope.cordova = $cordovaDevice.getCordova();

     $scope.model = $cordovaDevice.getModel();

     $scope.platform = $cordovaDevice.getPlatform();

     $scope. uuid = $cordovaDevice.getUUID();

     $scope. version = $cordovaDevice.getVersion();

  }, false);
})

//stor
.controller('ProductsController', [
	'$scope', '$state','Products', function(
	$scope, $state, Products) {
		$scope.items = [];
		$scope.times = 0 ;
		$scope.postsCompleted = false;
		// load more content function
		$scope.getPosts = function(){
			Products.getPosts()
			.success(function (posts) {
				$scope.items = $scope.items.concat(posts);
				$scope.$broadcast('scroll.infiniteScrollComplete');
				$scope.times = $scope.times + 1;
				$scope.postsCompleted = true;
			})
			.error(function (error) {
				$scope.items = [];
			});
		}
		// pull to refresh buttons
		$scope.doRefresh = function(){
			$scope.times = 0 ;
			$scope.items = [];
			$scope.postsCompleted = false;
			$scope.getPosts();
			$scope.$broadcast('scroll.refreshComplete');
		}
	}
])
/*   product controller  */
.controller('ProductController', [
	'$scope', '$stateParams', 'Products', function(
	$scope, $stateParams, Products) {	
		var product_id = $stateParams.productId;
		$scope.selected_ = {};
		$scope.items = [];
		$scope.details = true;
		// looping though all data and get particular product
		$scope.selectProduct = function(p){
			p.forEach(function(data) {
			    if(data._id == product_id){
			    	$scope.selected_ = data;

			    }
			});
		}
		// get all posts // try some function to get a single produt from server
		$scope.getPosts = function(){
			Products.getPosts()
			.success(function (posts) {
				$scope.items = $scope.items.concat(posts);
				$scope.selectProduct($scope.items);
			})
			.error(function (error) {
				$scope.items = [];
			});
		}
		$scope.getPosts();
		$scope.changeRev = function(){
			if($scope.details == true){
				$scope.details = false;
			} else {
				$scope.details = true;
			}
		}
	}

])
//flickr
.controller('FlickrCtrl', function($scope,$ionicLoading,$state,Flickr){
	$ionicLoading.show();

	// Getting Photosets Detail from Flickr Service
	Flickr.getPhotoSets().then(function(result){
		$scope.photoList = result.data.photosets.photoset;
		$ionicLoading.hide();
	});

	// Opening Album
	$scope.openAlbum = function(photoset_id) {
    	$state.go('app.album',{id: photoset_id });
    };

})
.controller('AlbumCtrl', function($scope,$ionicLoading,$stateParams,Flickr) {
	$ionicLoading.show();
		$scope.id = $stateParams.id;
		$scope.photoList = [];

		// Getting List of Photos from a Photoset
		Flickr.getPhotos($scope.id).then(function(result){
			$ionicLoading.hide();
			console.log(result);
			$scope.photos = result.data.photoset.photo;
			$scope.title = result.data.photoset.title;

			angular.forEach($scope.photos, function(photo,key) {
				var id = photo.id;
				var secret = photo.secret;
				Flickr.getInfo(id,secret).then(function(result) {
					$scope.photoList.push({sizes: result[0].data, info: result[1].data});
					console.log($scope.photoList);

				});
			});

		});
})

//lundbeck images
.controller('FlickrCtrllundbeck', function($scope,$ionicLoading,$state,Flickrlundbeckdata){
	$ionicLoading.show();

	// Getting Photosets Detail from Flickr Service
	Flickrlundbeckdata.getPhotoSets().then(function(result){
		$scope.photoList = result.data.photosets.photoset;
		$ionicLoading.hide();
	});

	// Opening Album
	$scope.openAlbum = function(photoset_id) {
    	$state.go('app.lundbeckalbum',{id: photoset_id });
    };

})
.controller('AlbumCtrllundbeck', function($scope,$ionicLoading,$stateParams,Flickrlundbeckdata) {
	$ionicLoading.show();
		$scope.id = $stateParams.id;
		$scope.photoList = [];

		// Getting List of Photos from a Photoset
		Flickrlundbeckdata.getPhotos($scope.id).then(function(result){
			$ionicLoading.hide();
			console.log(result);
			$scope.photos = result.data.photoset.photo;
			$scope.title = result.data.photoset.title;

			angular.forEach($scope.photos, function(photo,key) {
				var id = photo.id;
				var secret = photo.secret;
				Flickrlundbeckdata.getInfo(id,secret).then(function(result) {
					$scope.photoList.push({sizes: result[0].data, info: result[1].data});
					console.log($scope.photoList);

				});
			});

		});
})

/* Features Controller */
.controller('FeaturesCtrl', ['$scope', 'Features', function($scope, Features) {
	$scope.items = Features.items;
}])
/* other features controller*/
.controller('otherFeaturesCtrl',['$scope', 'otherFeatures', function($scope, Features) {
	$scope.items = Features.items;
}])
//rethinkdepression
.controller('rethinkdepressionFeaturesCtrl',['$scope', 'rethinkdepression', function($scope, rethinkdepression) {
	$scope.items = rethinkdepression.items;
}])

//months menu controller
.controller('MenuController',function($scope,MonthsEvents){

  MonthsEvents.loadEvents()

  var getToday=function(){
    var today=new Date() 
    var year=today.getFullYear()
    var month=today.getMonth()+1
    var date=today.getDate()
    return month>10? year+'-'+month+'-'+date:year+'-0'+month+'-'+date
  }

  $scope.select_date=getToday()
  
  $scope.events_in_select_date=MonthsEvents.getEventsByDate($scope.select_date)

  $scope.eventSources={
    events:MonthsEvents.getAllEvents().map(function(e){
      var temp={
        title:e.title,
        start:e.start,
		
       
      }
      return temp
    }),
    textColor: 'black',
	color:'blue',
	textSize:'50cm'
	
	
	
  }

  $scope.alertEventOnClick=function(date,jsEvent,view){
    $scope.select_date=date.format()
    $scope.events_in_select_date=MonthsEvents.getEventsByDate($scope.select_date)
  }

  $scope.uiConfig = {
     calendar:{
       height: 600,
       editable: false,
	   aspectRatio: 2,
       header:{
         left: '',
         center: 'title',
         right: 'today prev,next'
       },
       dayClick: $scope.alertEventOnClick,
	   
     }
   }
})


//Eurest Event controller
.controller('EuresteventController',function($scope,MonthsEvents){

  MonthsEvents.loadEvents()

  var getToday=function(){
    var today=new Date() 
    var year=today.getFullYear()
    var month=today.getMonth()+1
    var date=today.getDate()
    return month>10? year+'-'+month+'-'+date:year+'-0'+month+'-'+date
  }

  $scope.select_date=getToday()
  
  $scope.events_in_select_date=MonthsEvents.getEventsByDate($scope.select_date)

  $scope.eventSources={
    events:MonthsEvents.getAllEvents().map(function(e){
      var temp={
        title:e.title,
        start:e.start
       
      }
      return temp
    }),
    textColor: 'black'
  }

  $scope.alertEventOnClick=function(date,jsEvent,view){
    $scope.select_date=date.format()
    $scope.events_in_select_date=MonthsEvents.getEventsByDate($scope.select_date)
  }

  $scope.uiConfig = {
     calendar:{
       height: 500,
       editable: true,
       header:{
         left: '',
         center: 'title',
         right: 'today prev,next'
       },
       dayClick: $scope.alertEventOnClick,
     }
   }
})




	



//
.controller('SettingsCtrl', function($scope, SettingsService) {
  $scope.settings = SettingsService;  
})






.controller('astroPostsCtrl', function( $scope, $http, DataLoader, $timeout, $ionicSlideBoxDelegate,$ionicHistory, $rootScope, $log ,$ionicLoading,backcallFactory) {
backcallFactory.backcallfun();
$ionicLoading.show({
                template: 'Loading ......',
				duration: 3000
            })
$ionicHistory.nextViewOptions({
  disableAnimate: true,
  disableBack: true
  })
var root1 = 'http://eurestcanteen.in/astro/wp-json/wp/v2/';


  var postsApi = root1 + 'posts';

  $scope.moreItems = false;

  $scope.loadPosts = function() {
  

    // Get all of our posts
    DataLoader.get( postsApi ).then(function(response) {

      $scope.posts = response.data;
	 

      $scope.moreItems = true;

      $log.log(postsApi, response.data);

    }, function(response) {
      $log.log(postsApi, response.data);
    });
	
     

  }

  // Load posts on  load
  $scope.loadPosts();

  paged = 2;

  // Load more (infinite scroll)
  $scope.loadMore = function() {
  

    if( !$scope.moreItems ) {
      return;
    }

    var pg = paged++;

    $log.log('loadMore ' + pg );

    $timeout(function() {

      DataLoader.get( postsApi + '?page=' + pg ).then(function(response) {
	  

        angular.forEach( response.data, function( value, key ) {
		
          $scope.posts.push(value);
		  $scope.$broadcast("scroll.infiniteScrollComplete");
		  
        });
		
		

        if( response.data.length <= 0 ) {
          $scope.moreItems = false;
		  $scope.$broadcast("scroll.infiniteScrollComplete");
		
        }
      }, function(response) {
        $scope.moreItems = false;
		
        $log.error(response);
      });

     
      

    }, 1000);
	
	

  }
  //again load more
  
		
	

  $scope.moreDataExists = function() {
   
    return $scope.moreItems;
  }

  // Pull to refresh
  $scope.doRefresh = function() {
  
    $timeout( function() {

      $scope.loadPosts();

      //Stop the ion-refresher from spinning
      
    
    }, 1000);
      
  };
   
})





	//conf
	.controller('CalendarController', ['$scope', '$http', '$state', function($scope, $http, $state) {
  $http.get('js/data.json').success (function (data){
    $scope.calendar = data.calendar;

    $scope.onItemDelete = function (dayIndex, item) {
      $scope.calendar[dayIndex].schedule.splice($scope.calendar[dayIndex].schedule.indexOf(item), 1);
    }

    $scope.toggleStar = function (item) {
      item.star = !item.star;
    }

    $scope.doRefresh = function () {  
        $http.get('js/data.json').success (function (data) {
        $scope.calendar = data.calendar;
        $scope.$broadcast('scroll.refreshComplete');
      });
    }

  });
}])


.controller('ListController', ['$scope', '$http', '$state', function($scope, $http, $state) {
  $http.get('js/data.json').success (function (data){
    $scope.artists = data.artists;
    $scope.whichartist = $state.params.aId;
    $scope.data = {
      showDelete: false,
      showReorder: false
    }

    $scope.onItemDelete = function (item) {
      $scope.artists.splice($scope.artists.indexOf(item), 1);
    }

    $scope.toggleStar = function (item) {
      item.star = !item.star;
    }

    $scope.moveItem = function (item, fromIndex, toIndex) {
      $scope.artists.splice(fromIndex, 1);
      $scope.artists.splice(toIndex, 0, item);
    }

    $scope.doRefresh = function () {  
        $http.get('js/data.json').success (function (data) {
        $scope.artists = data;
        $scope.$broadcast('scroll.refreshComplete');
      });
    }

  });
}])
//quiz


.controller('faqCtrl', function($scope, $timeout) {
  $scope.faqArr = [
    {
    question: 'A milkman has two empty jugs: a three gallon jug and a five gallon jug.  How can he measure exactly one gallon without wasting any milk?',
    answer: 'The milkman filled the three gallon jug, and then emptied the contents into the five gallon jug.  He then filled the three gallon jug again, and continued to fill the five gallon jug until it was full.  The milk remaining in the three gallon jug was precisely one gallon.'
  },
  {
    question: 'You are in the dark, and on the floor there are six shoes of three colors, and a heap of twenty-four socks, black and brown.  How many socks and shoes must you take into the light to be certain that you have a matching pair of socks and a matching pair of shoes?',
    answer: 'Three socks and four shoes would guarantee that you would have a matching pair of each.  Since there are only two colors of socks, it doesnt matter how many are in the heap, as long as you take at least three, you are certain to have two of the same.  As for the shoes, you must pick four, because selecting only three could result in one shoe in each of the three colors! '
  },
  {
    question: 'Assume 9 is twice 5; how will you write 6 times 5 in the same system of notation?',
    answer: 'The answer is 27.  Once you assume that 9 is twice 5, you conclude that 5 = 4.5 (9/2).  Therefore, 6 times 4.5 is 27. '
  },
  {
    question: 'Suppose there are twin brothers; one which always tells the truth and one which always lies.  What single yes/no question could you ask to either brother to figure out which one is which?',
    answer: 'The key to this logic problem, is to find a question that the two brothers would answer differently, and that difference would therefore identify the two from each other.  The lying brother would answer the above question "yes."  The truthful brother would answer the same question "no."  '
  },
  {
    question: 'A king wants his daughter to marry the smartest of 3 extremely intelligent young princes, and so the kings wise men devised an intelligence test.The princes are gathered into a room and seated, facing one another, and are shown 2 black hats and 3 white hats. They are blindfolded, and 1 hat is placed on each of their heads, with the remaining hats hidden in a different room.The king tells them that the first prince to deduce the color of his hat without removing it or looking at it will marry his daughter. A wrong guess will mean death. The blindfolds are then removed.You are one of the princes. You see 2 white hats on the other princes heads. After some time you realize that the other princes are unable to deduce the color of their hat, or are unwilling to guess. What color is your hat?',


    answer: 'The king would not select two white hats and one black hat. This would mean two princes would see one black hat and one white hat. You would be at a disadvantage if you were the only prince wearing a black hat.If you were wearing the black hat, it would not take long for one of the other princes to deduce he was wearing a white hat.If an intelligent prince saw a white hat and a black hat, he would eventually realize that the king would never select two black hats and one white hat. Any prince seeing two black hats would instantly know he was wearing a white hat. Therefore if a prince can see one black hat, he can work out he is wearing white.	Therefore the only fair test is for all three princes to be wearing white hats. After waiting some time just to be sure, you can safely assert you are wearing a white hat. '
  },
  {
    question: 'Five pirates have obtained 100 gold coins and have to divide up the loot. The pirates are all extremely intelligent, treacherous and selfish (especially the captain).The captain always proposes a distribution of the loot. All pirates vote on the proposal, and if half the crew or more go "Aye", the loot is divided as proposed, as no pirate would be willing to take on the captain without superior force on their side.If the captain fails to obtain support of at least half his crew (which includes himself), he faces a mutiny, and all pirates will turn against him and make him walk the plank. The pirates start over again with the next senior pirate as captain.What is the maximum number of coins the captain can keep without risking his life?',
    answer: 'The captain says he will take 98 coins, and will give one coin to the third most senior pirate and another coin to the most junior pirate. He then explains his decision in a manner like this... If there were 2 pirates, pirate 2 being the most senior, he would just vote for himself and that would be 50% of the vote, so he obviously going to keep all the money for himself.If there were 3 pirates, pirate 3 has to convince at least one other person to join in his plan. Pirate 3 would take 99 gold coins and give 1 coin to pirate 1. Pirate 1 knows if he does not vote for pirate 3, then he gets nothing, so obviously is going to vote for this plan.If there were 4 pirates, pirate 4 would give 1 coin to pirate 2, and pirate 2 knows if he does not vote for pirate 4, then he gets nothing, so obviously is going to vote for this plan.As there are 5 pirates, pirates 1 & 3 had obviously better vote for the captain, or they face choosing nothing or risking death. '
  }
  ];
  
  $scope.showOrDont = function(index) {
    if(index !== $scope.show) {
      $scope.show = index;
    } else {
      $scope.show=undefined;
    }
  };
  
})
//depression
.controller('depPostCtrl', function($scope,$cordovaSocialSharing, $stateParams, DataLoader, $ionicLoading,  $sce, CacheFactory, $log, Bookmark, $timeout ) {
	var root1 = 'http://eurestcanteen.in/depression/wp-json/wp/v2/';
	

  if ( ! CacheFactory.get('postCache') ) {
    CacheFactory.createCache('postCache');
  }

  var postCache = CacheFactory.get( 'postCache' );

  $scope.itemID = $stateParams.postId;

  var singlePostApi = root1 + 'posts/' + $scope.itemID;

  $scope.loadPost = function() {

    // Fetch remote post

    $ionicLoading.show({
      noBackdrop: true
    });

    DataLoader.get( singlePostApi ).then(function(response) {

      $scope.post = response.data;

      $log.debug($scope.post);

      // Don't strip post html
      $scope.content = $sce.trustAsHtml(response.data.content.rendered);

      // $scope.comments = $scope.post._embedded['replies'][0];

      // add post to our cache
      postCache.put( response.data.id, response.data );

      $ionicLoading.hide();
    }, function(response) {
      $log.error('error', response);
      $ionicLoading.hide();
    });

  }

  if( !postCache.get( $scope.itemID ) ) {

    // Item is not in cache, go get it
    $scope.loadPost();

  } else {
    // Item exists, use cached item
    $scope.post = postCache.get( $scope.itemID );
    $scope.content = $sce.trustAsHtml( $scope.post.content.rendered );
    // $scope.comments = $scope.post._embedded['replies'][0];
  }

  // Bookmarking
  $scope.bookmarked = Bookmark.check( $scope.itemID );

  $scope.bookmarkItem = function( id ) {
    
    if( $scope.bookmarked ) {
      Bookmark.remove( id );
      $scope.bookmarked = false;
    } else {
      Bookmark.set( id );
      $scope.bookmarked = true;
    }
  }

  // Pull to refresh
  $scope.doRefresh = function() {
  
    $timeout( function() {

      $scope.loadPost();

      //Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    
    }, 1000);
      
  }
  //sharing
   $scope.shareAnywhere = function(title,url) {
        $cordovaSocialSharing.share('pls find the interesting article', title, null, url);
    };

})
 .controller('TabsCtrl', function($scope) {

  // Tabs stuff here

})

.controller('depPostsCtrl', function( $scope, $http, $cordovaSocialSharing, DataLoader, $timeout, $ionicSlideBoxDelegate, $rootScope, $log ,$ionicLoading,backcallFactory) {
backcallFactory.backcallfun();
var root1 = 'http://eurestcanteen.in/depression/wp-json/wp/v2/';

$ionicLoading.show({
                template: 'Loading .....',
				duration: 3000
            });
  var postsApi = root1 + 'posts';

  $scope.moreItems = false;

  $scope.loadPosts = function() {
 

    // Get all of our posts
    DataLoader.get( postsApi ).then(function(response) {

      $scope.posts = response.data;

      $scope.moreItems = true;

      $log.log(postsApi, response.data);

    }, function(response) {
      $log.log(postsApi, response.data);
    });

  }

  // Load posts on  load
  $scope.loadPosts();

  paged = 2;

  // Load more (infinite scroll)
  $scope.loadMore = function() {

    if( !$scope.moreItems ) {
      return;
    }

    var pg = paged++;

    $log.log('loadMore ' + pg );

    $timeout(function() {

      DataLoader.get( postsApi + '?page=' + pg ).then(function(response) {

        angular.forEach( response.data, function( value, key ) {
          $scope.posts.push(value);
		   $scope.$broadcast("scroll.infiniteScrollComplete");
        });

        if( response.data.length <= 0 ) {
          $scope.moreItems = false;
		   $scope.$broadcast("scroll.infiniteScrollComplete");
        }
      }, function(response) {
        $scope.moreItems = false;
        $log.error(response);
      });

      $scope.$broadcast('scroll.infiniteScrollComplete');
      $scope.$broadcast('scroll.resize');

    }, 1000);

  }

  $scope.moreDataExists = function() {
    return $scope.moreItems;
  }

  // Pull to refresh
  $scope.doRefresh = function() {
  
    $timeout( function() {

      $scope.loadPosts();

      //Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    
    }, 1000);
      
  };
   $scope.shareAnywhere = function(title,url) {
        $cordovaSocialSharing.share('pls find the interesting article', title, null, url);
    };
    
})


//youtube
.controller('depnewyoutube', function($scope, $ionicModal,$http,$ionicLoading,$ionicHistory){
 $ionicLoading.show({
                template: 'Loading ......',
				duration: 3000
            });
$ionicHistory.nextViewOptions({
  disableAnimate: true,
  disableBack: true
  });
$scope.playerVars = {
      rel: 0,
      showinfo: 0,
      modestbranding: 0,
    };
    $scope.videos = [];
	

   
$http.get('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=PL5PkFRWjgu7qEUdu2-piKVeA6E3pMLTOn&maxResults=40&key=AIzaSyA__rddrUDI_xZZ0Xo4lr57RRPVxWAb8Oo').then(function(resp) {
    console.log('Success', resp);
	
	$scope.videos=resp.data.items;
	console.log($scope.videos);
	});
	$scope.doRefresh = function () {
	$http.get('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=PL5PkFRWjgu7qEUdu2-piKVeA6E3pMLTOn&maxResults=40&key=AIzaSyA__rddrUDI_xZZ0Xo4lr57RRPVxWAb8Oo').then(function(resp) {
    console.log('Success', resp);
	
	$scope.videos=resp.data.items;
		
			
		});
	}
	
	$scope.$broadcast('scroll.refreshComplete');
	})
	.controller('TabsCtrl', function($scope) {

  // Tabs stuff here

})
//file download
.controller('DownloadController', function($scope, $cordovaFileTransfer) {
   $scope.myObj = {
        "color" : "white",
        "background-color" : "coral",
        "font-size" : "20px",
        "padding" : "60px"
    }

  $scope.Download = function () {
      ionic.Platform.ready(function(){
             var url = "http://eurestcanteen.in/eurest/wp-content/uploads/2016/12/excel.pdf";
             var filename = url.split("/").pop();
             var targetPath = cordova.file.externalRootDirectory + 'Pictures/' + filename;
  
              $cordovaFileTransfer.download(url, targetPath, {}, true).then(function (result) {
                    $scope.hasil = 'Save file on '+targetPath+' success!';
                    $scope.mywallpaper=targetPath;
              }, function (error) {
                    $scope.hasil = 'Error Download file';
              }, function (progress) {
                    $scope.downloadProgress = (progress.loaded / progress.total) * 100;
              });
      });
  }
    
})
.controller("wikiController", ["$scope","$window", "searchResults", function($scope,$window, searchResults) {
    $scope.reset = function() {
        if($scope.content) $scope.content = '';
        if($scope.results) $scope.results = '';
    };

    $scope.check = function() {
        if ($scope.content === "" || !$scope.content) return false;
        return true;
    }

    
    $scope.getResults = function(){
        if($scope.check()) {
            searchResults.get($scope.content).then(function(data){
                $scope.results = data.data.query.pages;
                for(var page in $scope.results){
                    $scope.results[page].link = 'https://en.wikipedia.org/wiki/' + $scope.results[page].title; 
                }
            });
        }
    };

}])
.controller('qodQtr', function($scope, $http) {
$scope.myObj = {
       
        
        "margin" : "0px",
		"width":"100%",
		"height":"100%",
        
    }
  $http.get("http://quotes.rest/qod.json")
    .then(function(response) {
      $scope.qod = response.data.contents.quotes[0].quote;
      $scope.qod_author = response.data.contents.quotes[0].author;    
    });
})
//nutrisearch
 .controller('nutriCtrl', function($scope, nutriDataService,nutriDataServiceHTTP) {

  $scope.data = {searchKey:''};

  $scope.getItemHeight = function(item, index) {
    //Make evenly indexed items be 10px taller, for the sake of example
    return (index % 2) === 0 ? 50 : 60;
  };

  /**
  *
  */
  $scope.doSearch = function() {
    console.debug("Searching for: " +  $scope.data.searchKey);

    if ( true ) {

      // use the $resource based service
      var promise = nutriDataService.getAll( { 
        'term' : $scope.data.searchKey, 
        'results':'0:50',      // <-- variable substitution
        //'fields':'item_name'    <-- you can specify field params
      }).$promise;
      promise.then(function(_response) {
        console.debug(" The data " + JSON.stringify(_response));
        $scope.items = _response.hits;
      });

    } else {
      // use the $http based service
      var promise = nutriDataServiceHTTP.getAll($scope.data.searchKey);
      promise.then(function(_response) {
        console.debug(" The data " + JSON.stringify(_response.data));
        $scope.items = _response.data.hits;
      });
    }
  };
})
/**
*
*/
//weather


.controller('weatherCtrl', function($scope, $http, $ionicPopup) {
  $scope.weatherCity = function(cityName){
         var url='http://api.openweathermap.org/data/2.5/forecast/daily?q='+cityName+'&mode=json&units=metric&cnt=7&APPID=5a159066152d32363a0261ac875e1659';
        console.log(url);
          $http.get(url)
        .then(function(response) {
          $scope.weatherreport = response.data.list;
          console.log($scope.weatherreport);
      });
  }
  $scope.cityName= 'copenhagen';
   var url='http://api.openweathermap.org/data/2.5/forecast/daily?q='+$scope.cityName+'&mode=json&units=metric&cnt=7&APPID=5a159066152d32363a0261ac875e1659';
        console.log(url);
          $http.get(url)
        .then(function(response) {
          $scope.weatherreport = response.data.list;
          console.log($scope.weatherreport);
      });

  $scope.days= ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  $scope.dates=[];
  for(var i =0; i<7;i++){
     $scope.dates.push(new Date(Date.now()+(1000*86400*i)));
  }

    $scope.showDetails = function(index) {
      $scope.data = {}
      $scope.daily = index;
    console.log($scope.daily);
      // Custom popup
      $scope.myPopup = $ionicPopup.show({
          templateUrl: 'details.html',
          title: 'daily forecast',
          scope: $scope,
        });

      $scope.myPopup.then(function(res) {
         console.log('Tapped!', res);
      });    
   };
   $scope.closePopUp = function() {
      $scope.myPopup.close();
};

})

//stock

angular.module('starter.controllers', ['youtube-embed','ionic.contrib.ui.tinderCards','ngCordova','ngResource'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $sce, DataLoader,  $log ) {
  
  // Enter your site url here. You must have the WP-API v2 installed on this site. Leave /wp-json/wp/v2/ at the end.
  var root1 = 'http://eurestcanteen.in/eurest/wp-json/wp/v2/';

  // $rootScope.callback = '_jsonp=JSON_CALLBACK';

})

.controller('SettingsCtrl', function($scope, Settings) {
  $scope.settings = Settings.getSettings();

  // Watch deeply for settings changes, and save them
  // if necessary
  $scope.$watch('settings', function(v) {
    Settings.save();
  }, true);

  $scope.closeSettings = function() {
    $scope.modal.hide();
  };

})


.controller('PostCtrl', function($scope,$cordovaSocialSharing, $stateParams, DataLoader, $ionicLoading,  $sce, CacheFactory, $log, Bookmark, $timeout ) {
	var root1 = 'http://eurestcanteen.in/eurest/wp-json/wp/v2/';
	

  if ( ! CacheFactory.get('postCache') ) {
    CacheFactory.createCache('postCache');
  }

  var postCache = CacheFactory.get( 'postCache' );

  $scope.itemID = $stateParams.postId;

  var singlePostApi = root1 + 'posts/' + $scope.itemID;

  $scope.loadPost = function() {

    // Fetch remote post

    $ionicLoading.show({
      noBackdrop: true
    });

    DataLoader.get( singlePostApi ).then(function(response) {

      $scope.post = response.data;

      $log.debug($scope.post);

      // Don't strip post html
      $scope.content = $sce.trustAsHtml(response.data.content.rendered);

      // $scope.comments = $scope.post._embedded['replies'][0];

      // add post to our cache
      postCache.put( response.data.id, response.data );

      $ionicLoading.hide();
    }, function(response) {
      $log.error('error', response);
      $ionicLoading.hide();
    });

  }

  if( !postCache.get( $scope.itemID ) ) {

    // Item is not in cache, go get it
    $scope.loadPost();

  } else {
    // Item exists, use cached item
    $scope.post = postCache.get( $scope.itemID );
    $scope.content = $sce.trustAsHtml( $scope.post.content.rendered );
    // $scope.comments = $scope.post._embedded['replies'][0];
  }

  // Bookmarking
  $scope.bookmarked = Bookmark.check( $scope.itemID );

  $scope.bookmarkItem = function( id ) {
    
    if( $scope.bookmarked ) {
      Bookmark.remove( id );
      $scope.bookmarked = false;
    } else {
      Bookmark.set( id );
      $scope.bookmarked = true;
    }
  }

  // Pull to refresh
  $scope.doRefresh = function() {
  
    $timeout( function() {

      $scope.loadPost();

      //Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    
    }, 1000);
      
  }
  //sharing
   $scope.shareAnywhere = function(title,url) {
        $cordovaSocialSharing.share('pls find the interesting article', title, null, url);
    };

})
 .controller('TabsCtrl', function($scope) {

  // Tabs stuff here

})

.controller('PostsCtrl', function( $scope, $http, $cordovaSocialSharing, DataLoader, $timeout, $ionicSlideBoxDelegate, $rootScope, $log ,$ionicLoading,backcallFactory) {
backcallFactory.backcallfun();
var root1 = 'http://eurestcanteen.in/eurest/wp-json/wp/v2/';

$ionicLoading.show({
                template: 'Loading .....',
				duration: 3000
            });
  var postsApi = root1 + 'posts';

  $scope.moreItems = false;

  $scope.loadPosts = function() {
 

    // Get all of our posts
    DataLoader.get( postsApi ).then(function(response) {

      $scope.posts = response.data;

      $scope.moreItems = true;

      $log.log(postsApi, response.data);

    }, function(response) {
      $log.log(postsApi, response.data);
    });

  }

  // Load posts on  load
  $scope.loadPosts();

  paged = 2;

  // Load more (infinite scroll)
  $scope.loadMore = function() {

    if( !$scope.moreItems ) {
      return;
    }

    var pg = paged++;

    $log.log('loadMore ' + pg );

    $timeout(function() {

      DataLoader.get( postsApi + '?page=' + pg ).then(function(response) {

        angular.forEach( response.data, function( value, key ) {
          $scope.posts.push(value);
		   $scope.$broadcast("scroll.infiniteScrollComplete");
        });

        if( response.data.length <= 0 ) {
          $scope.moreItems = false;
		   $scope.$broadcast("scroll.infiniteScrollComplete");
        }
      }, function(response) {
        $scope.moreItems = false;
        $log.error(response);
      });

      $scope.$broadcast('scroll.infiniteScrollComplete');
      $scope.$broadcast('scroll.resize');

    }, 1000);

  }

  $scope.moreDataExists = function() {
    return $scope.moreItems;
  }

  // Pull to refresh
  $scope.doRefresh = function() {
  
    $timeout( function() {

      $scope.loadPosts();

      //Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    
    }, 1000);
      
  };
   $scope.shareAnywhere = function(title,url) {
        $cordovaSocialSharing.share('pls find the interesting article', title, null, url);
    };
    
})

.controller('BookmarksCtrl', function( $scope, $http, DataLoader, $timeout, $rootScope, $log, Bookmark, CacheFactory ) {

  $scope.$on('$ionicView.enter', function(e) {

    if ( ! CacheFactory.get('postCache') ) {
      CacheFactory.createCache('postCache');
    }

    var postCache = CacheFactory.get( 'postCache' );

    if ( ! CacheFactory.get('bookmarkCache') ) {
      CacheFactory.createCache('bookmarkCache');
    }

    var bookmarkCacheKeys = CacheFactory.get( 'bookmarkCache' ).keys();

    $scope.posts = [];
  
    angular.forEach( bookmarkCacheKeys, function( value, key ) {
      var newPost = postCache.get( value );
      $scope.posts.push( newPost );
    });

  });
    
})



.controller('ListaCtrl',function($scope,$http,$state,$ionicHistory){
$ionicHistory.nextViewOptions({
  disableAnimate: true,
  disableBack: true
  });
	$http.get('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=PL5PkFRWjgu7pKct6RaLfX4l6GnlkyUz-R&maxResults=40&key=AIzaSyA__rddrUDI_xZZ0Xo4lr57RRPVxWAb8Oo').then(function(resp) {
    console.log('Success', resp);
 	$scope.items = resp.data.items;
           
    $scope.playvideo = function(id,title){
        $state.go('app.now-playing',{id:id,title:title});
       //SocialShare function
        
    }
   // console.log("VideoID: " + id);
    
        // For JSON responses, resp.data contains the result
  }, function(err) {
    console.error('ERR', err);
    // err.status will contain the status code
        //PLueTNPnrNvSHjlZcJb4-Yt6LXUwa53M_p - Sami Yusuf
        //PL97C2D4AAC980FDD7 Ilahi
  })
})
//newyoutube-my channel
.controller('newyoutube', function($scope, $ionicModal,$http,$ionicLoading,$ionicHistory){
 $ionicLoading.show({
                template: 'Loading ......',
				duration: 3000
            });
$ionicHistory.nextViewOptions({
  disableAnimate: true,
  disableBack: true
  });
$scope.playerVars = {
      rel: 0,
      showinfo: 0,
      modestbranding: 0,
    };
    $scope.videos = [];
	

   
$http.get('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=PL5PkFRWjgu7pKct6RaLfX4l6GnlkyUz-R&maxResults=40&key=AIzaSyA__rddrUDI_xZZ0Xo4lr57RRPVxWAb8Oo').then(function(resp) {
    console.log('Success', resp);
	
	$scope.videos=resp.data.items;
	console.log($scope.videos);
	});
	 $scope.playvideo = function(id,title){
        $state.go('now-playing',{id:id,title:title});
       //SocialShare function
        
    }
	$scope.doRefresh = function () {
	$http.get('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=PL5PkFRWjgu7pKct6RaLfX4l6GnlkyUz-R&maxResults=40&key=AIzaSyA__rddrUDI_xZZ0Xo4lr57RRPVxWAb8Oo').then(function(resp) {
    console.log('Success', resp);
	
	$scope.videos=resp.data.items;
		
			
		});
	}
	
	$scope.$broadcast('scroll.refreshComplete');
	})
	
	
	//
	.controller('nowPlayingCtrl',function ($scope, $http, $stateParams){
    $scope.videoId = $stateParams.id;
    $scope.videoTitle = $stateParams.title;
    console.log('videoID: '+ $scope.videoId);
    
    document.getElementById("video-player").innerHTML = '<iframe src="http://www.youtube.com/embed/' + $scope.videoId + '" frameborder="0" allowfullscreen class="yt-playeri"></iframe>';
    document.getElementById("now-playing").innerHTML = $scope.videoTitle;
    
   
   
   
   }
)
	//youtube search
	
	
	.controller('youtubevideos', function($scope, $http,$ionicLoading,$ionicHistory){
	 $ionicLoading.show({
                template: 'Loading...... ',
				duration: 3000
            });
			$ionicHistory.nextViewOptions({
  disableAnimate: true,
  disableBack: true
  });
  $scope.videos = [ ];
  $scope.searchInput = { };

  $scope.search = function(){
    $scope.videos = [];
    $scope.youtubeParams = {
        key: 'AIzaSyA__rddrUDI_xZZ0Xo4lr57RRPVxWAb8Oo',
        type: 'video',
        maxResults: '10',
        part: 'id,snippet',
        fields:'items/id,items/snippet/title,items/snippet/description,items/snippet/thumbnails/default,items/snippet/channelTitle,nextPageToken',
        q: $scope.searchInput
      }

    $http.get('https://www.googleapis.com/youtube/v3/search', {params:$scope.youtubeParams}).success(function(response){
      angular.forEach(response.items, function(child){
      $scope.videos.push(child);
      });
    });
  }
  $scope.playerVars = {
  rel: 0,
  showinfo: 0,
  modestbranding: 0,
}
})



	
	//team eurest
	.controller("TeamCtrl", function($scope,$sce,$ionicLoading) {
	 $ionicLoading.show({
                template: 'Loading .....',
				duration: 5000
            });
var FIREBASE_URL= 'https://mynewtv.firebaseio.com';
var ref = new Firebase(FIREBASE_URL);
    ref.once("value", function(snapshot){
 var list=[];
 list.Data =snapshot.val();
  $scope.limitsize=100;
console.log(list);
var jokes=[];
//team eurest
$scope.Names=list.Data;
$scope.list2=[];
angular.forEach($scope.Names,function(value,key){

$scope.list2.push(value)
$scope.list2.splice(23);


});


var names1=$scope.Names;
$scope.names2=names1.Month;
//jokes
$scope.mngmt=list.Data;
var jokes=$scope.mngmt;
$scope.names4=jokes.management;
//quotes
$scope.quotes1=list.Data;
var quotes2=$scope.quotes1;
$scope.quotes3=quotes2.quotes;









})
})
//instagram
.controller('ApiCtrl',function($scope, $http, $q, $cordovaSocialSharing) {

  $scope.init = function(){
    $scope.getImages()
    .then(function(res){
      // success
      console.log('Images: ',res)
      $scope.imageList = res.data;
    }, function(status){
      // err
      console.log('Error: ', status)
    })
  }

  $scope.getImages = function(){
    var defer = $q.defer();
    var url = "https://api.instagram.com/v1/users/3194446479/media/recent?access_token=3194446479.1677ed0.923d6de449fe4066832e74275947a1f2&callback=JSON_CALLBACK";
    $http.jsonp(url)
    .success(function(res){
      defer.resolve(res)
    })
    .error(function(status, err){
      defer.reject(status)
    })

    return defer.promise;
  }

  $scope.init();
   $scope.shareAnywhere = function(title,url) {
        $cordovaSocialSharing.share('pls find the image', null, null, null);
    };
})
//example controller
.controller("ExampleController", function($scope, $cordovaSocialSharing) {
 
    $scope.shareAnywhere = function() {
        $cordovaSocialSharing.share(null, null, null, null);
    }
	})

	.controller('todoCtrl', ['$scope', function($scope) {
  // Initialize the todo list array
    //if local storage is null save the todolist to local storage
    if (localStorage.getItem("mytodos") == null)
    {
 		$scope.todoList = [ {todoText:'Create app', done:false} ];
       localStorage.setItem("mytodos", angular.toJson($scope.todoList));

    }else
    {
        //set the todolist from local storage
        $scope.todoList = angular.fromJson(localStorage.getItem("mytodos"));
    }



// Add an item function
    $scope.todoAdd = function() {
      //check to see if text has been entered, if not exit
        if ($scope.todoInput == null || $scope.todoInput == ''){return;}

        //if there is text add it to the array
        $scope.todoList.push({todoText:$scope.todoInput, done:false});

        //clear the textbox
        $scope.todoInput = "";

        //resave the list to localstorage
        localStorage.setItem("mytodos", angular.toJson($scope.todoList));

    };

    $scope.remove = function() {
      //copy list
        var oldList = $scope.todoList;
        //clear list
        $scope.todoList = [];
        //cycle through list
        angular.forEach(oldList, function(x) {
          //add any non-done items to todo list
            if (!x.done) $scope.todoList.push(x);
        });
        //update local storage
         localStorage.setItem("mytodos", angular.toJson($scope.todoList));

    };

    //The Update function
    //This waits 100ms to store the data in local storage
    $scope.update = function() {
    //update local storage 100 ms after the checkbox is clicked to allow it to process
    setTimeout(function(){
        localStorage.setItem("mytodos", angular.toJson($scope.todoList));
    },100)


    }

}])



//tinder cards
.controller('newtinderCtrl',function(tindernewService){

		var vm = angular.extend(this, {
			items: [],
			cardDestroyed: cardDestroyed,
			refresh: refresh
		});

		(function activate() {
			getItems();
		})();

		

		function refresh() {
			cardDestroyed(0);
			getItems();
		}

		function getItems() {
			tindernewService.getItems().then(function (items) {
				vm.items = items;
			});
		}
		
		 function cardSwipedLeft(index) {
        console.log('Left swipe');
    }

		function cardDestroyed(index) {
			vm.items.splice(index, 1);
		}
	})
//feedback
.controller('feedbackCtrl', function ($scope,$cordovaSocialSharing) {
 $scope.shareAnywhere = function(title,url) {
        $cordovaSocialSharing.share('pls find the interesting article', title, null, null);
    };

$scope.model = {
		sounds:[
		
			{
				'Name': 'Soren',
				'image': 'img/denmark.png',
				'Designation': 'CanteenChef',
				'info':'For general services,complaints & feedback',
				'Tel': '12345678'
			},
			{
				'Name': 'Flemming',
				'image': 'img/denmark.png',
				'Designation': 'CantineSouchef',
				'info':'For quality & buffet services,complaints & feedback',
				'Tel': '234567893'
			},
			{
				'Name': 'Srinath',
				'image': 'img/india.png',
				'Designation': 'Opvask',
				'info':'For issues regarding plates/glasses etc',
				'Tel': '91437097'
			}
			
			
		
	
	]
	};
	
})
//sendmail

.controller('SendMailCtrl', function($scope) {
	$scope.sendMail = function(){
		$cordovaEmailComposer.isAvailable(
			function (isAvailable) {
				// alert('Service is not available') unless isAvailable;
				$cordovaEmailComposer.open({
					to:      'srinath.erp@gmail.com',
					cc:      'dk53@@gmail.com',
					// bcc:     ['john@doe.com', 'jane@doe.com'],
					subject: 'Greetings',
					body:    'How are you? Nice greetings from IonFullApp'
				});
			}
		);
	};
})

 
.controller("ExampleController", function($scope, $cordovaSocialSharing) {
 
    $scope.shareAnywhere = function() {
        $cordovaSocialSharing.share(null, null, null, null);
    }
	})
	
//chart
 .controller("ChartCtrl", function($scope) {
 

 
    $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
    $scope.series = ['Series A', 'Series B'];
    $scope.data = [
        [65, 59, 80, 81, 56, 55, 40],
        [28, 48, 40, 19, 86, 27, 90]
    ];
 
})
//search ctrl
  .controller('SearchCtrl', function($scope,dataFactory) {
	   var url1='posts?filter[tag]=';

	$scope.posts = [];
	$scope.page = 1;
	$scope.form = {};

	$scope.search = function(){
		dataFactory.httpRequest(url1 + $scope.form.search).then(function(data) {
			$scope.posts = data;

			
			$scope.page++;
		});
	}
})

//wordpress page 
.controller('Mainpage', function($scope, $http, $stateParams,$ionicHistory,$cordovaSocialSharing) {
$ionicHistory.nextViewOptions({
  disableAnimate: true,
  disableBack: true
  });
    $http.get('http://eurestcanteen.in/eurest/wp-json/wp/v2/pages/?slug=notice-board').success(function(res){
        $scope.pages = res;
    })
	 $scope.shareAnywhere = function(title,url) {
        $cordovaSocialSharing.share('pls find the interesting article', title, null, url);
    }
})
 //device info
  .controller('deviceCtrl', function($scope, $cordovaDevice) {

  document.addEventListener("deviceready", function () {

    $scope.device = $cordovaDevice.getDevice();

     $scope.cordova = $cordovaDevice.getCordova();

     $scope.model = $cordovaDevice.getModel();

     $scope.platform = $cordovaDevice.getPlatform();

     $scope. uuid = $cordovaDevice.getUUID();

     $scope. version = $cordovaDevice.getVersion();

  }, false);
})

//stor
.controller('ProductsController', [
	'$scope', '$state','Products', function(
	$scope, $state, Products) {
		$scope.items = [];
		$scope.times = 0 ;
		$scope.postsCompleted = false;
		// load more content function
		$scope.getPosts = function(){
			Products.getPosts()
			.success(function (posts) {
				$scope.items = $scope.items.concat(posts);
				$scope.$broadcast('scroll.infiniteScrollComplete');
				$scope.times = $scope.times + 1;
				$scope.postsCompleted = true;
			})
			.error(function (error) {
				$scope.items = [];
			});
		}
		// pull to refresh buttons
		$scope.doRefresh = function(){
			$scope.times = 0 ;
			$scope.items = [];
			$scope.postsCompleted = false;
			$scope.getPosts();
			$scope.$broadcast('scroll.refreshComplete');
		}
	}
])
/*   product controller  */
.controller('ProductController', [
	'$scope', '$stateParams', 'Products', function(
	$scope, $stateParams, Products) {	
		var product_id = $stateParams.productId;
		$scope.selected_ = {};
		$scope.items = [];
		$scope.details = true;
		// looping though all data and get particular product
		$scope.selectProduct = function(p){
			p.forEach(function(data) {
			    if(data._id == product_id){
			    	$scope.selected_ = data;

			    }
			});
		}
		// get all posts // try some function to get a single produt from server
		$scope.getPosts = function(){
			Products.getPosts()
			.success(function (posts) {
				$scope.items = $scope.items.concat(posts);
				$scope.selectProduct($scope.items);
			})
			.error(function (error) {
				$scope.items = [];
			});
		}
		$scope.getPosts();
		$scope.changeRev = function(){
			if($scope.details == true){
				$scope.details = false;
			} else {
				$scope.details = true;
			}
		}
	}

])
//flickr
.controller('FlickrCtrl', function($scope,$ionicLoading,$state,Flickr){
	$ionicLoading.show();

	// Getting Photosets Detail from Flickr Service
	Flickr.getPhotoSets().then(function(result){
		$scope.photoList = result.data.photosets.photoset;
		$ionicLoading.hide();
	});

	// Opening Album
	$scope.openAlbum = function(photoset_id) {
    	$state.go('app.album',{id: photoset_id });
    };

})
.controller('AlbumCtrl', function($scope,$ionicLoading,$stateParams,Flickr) {
	$ionicLoading.show();
		$scope.id = $stateParams.id;
		$scope.photoList = [];

		// Getting List of Photos from a Photoset
		Flickr.getPhotos($scope.id).then(function(result){
			$ionicLoading.hide();
			console.log(result);
			$scope.photos = result.data.photoset.photo;
			$scope.title = result.data.photoset.title;

			angular.forEach($scope.photos, function(photo,key) {
				var id = photo.id;
				var secret = photo.secret;
				Flickr.getInfo(id,secret).then(function(result) {
					$scope.photoList.push({sizes: result[0].data, info: result[1].data});
					console.log($scope.photoList);

				});
			});

		});
})

//lundbeck images
.controller('FlickrCtrllundbeck', function($scope,$ionicLoading,$state,Flickrlundbeckdata){
	$ionicLoading.show();

	// Getting Photosets Detail from Flickr Service
	Flickrlundbeckdata.getPhotoSets().then(function(result){
		$scope.photoList = result.data.photosets.photoset;
		$ionicLoading.hide();
	});

	// Opening Album
	$scope.openAlbum = function(photoset_id) {
    	$state.go('app.lundbeckalbum',{id: photoset_id });
    };

})
.controller('AlbumCtrllundbeck', function($scope,$ionicLoading,$stateParams,Flickrlundbeckdata) {
	$ionicLoading.show();
		$scope.id = $stateParams.id;
		$scope.photoList = [];

		// Getting List of Photos from a Photoset
		Flickrlundbeckdata.getPhotos($scope.id).then(function(result){
			$ionicLoading.hide();
			console.log(result);
			$scope.photos = result.data.photoset.photo;
			$scope.title = result.data.photoset.title;

			angular.forEach($scope.photos, function(photo,key) {
				var id = photo.id;
				var secret = photo.secret;
				Flickrlundbeckdata.getInfo(id,secret).then(function(result) {
					$scope.photoList.push({sizes: result[0].data, info: result[1].data});
					console.log($scope.photoList);

				});
			});

		});
})

/* Features Controller */
.controller('FeaturesCtrl', ['$scope', 'Features', function($scope, Features) {
	$scope.items = Features.items;
}])
/* other features controller*/
.controller('otherFeaturesCtrl',['$scope', 'otherFeatures', function($scope, Features) {
	$scope.items = Features.items;
}])
//rethinkdepression
.controller('rethinkdepressionFeaturesCtrl',['$scope', 'rethinkdepression', function($scope, rethinkdepression) {
	$scope.items = rethinkdepression.items;
}])

//months menu controller
.controller('MenuController',function($scope,MonthsEvents){

  MonthsEvents.loadEvents()

  var getToday=function(){
    var today=new Date() 
    var year=today.getFullYear()
    var month=today.getMonth()+1
    var date=today.getDate()
    return month>10? year+'-'+month+'-'+date:year+'-0'+month+'-'+date
  }

  $scope.select_date=getToday()
  
  $scope.events_in_select_date=MonthsEvents.getEventsByDate($scope.select_date)

  $scope.eventSources={
    events:MonthsEvents.getAllEvents().map(function(e){
      var temp={
        title:e.title,
        start:e.start,
		
       
      }
      return temp
    }),
    textColor: 'black',
	color:'blue',
	textSize:'50cm'
	
	
	
  }

  $scope.alertEventOnClick=function(date,jsEvent,view){
    $scope.select_date=date.format()
    $scope.events_in_select_date=MonthsEvents.getEventsByDate($scope.select_date)
  }

  $scope.uiConfig = {
     calendar:{
       height: 600,
       editable: false,
	   aspectRatio: 2,
       header:{
         left: '',
         center: 'title',
         right: 'today prev,next'
       },
       dayClick: $scope.alertEventOnClick,
	   
     }
   }
})


//Eurest Event controller
.controller('EuresteventController',function($scope,MonthsEvents){

  MonthsEvents.loadEvents()

  var getToday=function(){
    var today=new Date() 
    var year=today.getFullYear()
    var month=today.getMonth()+1
    var date=today.getDate()
    return month>10? year+'-'+month+'-'+date:year+'-0'+month+'-'+date
  }

  $scope.select_date=getToday()
  
  $scope.events_in_select_date=MonthsEvents.getEventsByDate($scope.select_date)

  $scope.eventSources={
    events:MonthsEvents.getAllEvents().map(function(e){
      var temp={
        title:e.title,
        start:e.start
       
      }
      return temp
    }),
    textColor: 'black'
  }

  $scope.alertEventOnClick=function(date,jsEvent,view){
    $scope.select_date=date.format()
    $scope.events_in_select_date=MonthsEvents.getEventsByDate($scope.select_date)
  }

  $scope.uiConfig = {
     calendar:{
       height: 500,
       editable: true,
       header:{
         left: '',
         center: 'title',
         right: 'today prev,next'
       },
       dayClick: $scope.alertEventOnClick,
     }
   }
})




	



//
.controller('SettingsCtrl', function($scope, SettingsService) {
  $scope.settings = SettingsService;  
})






.controller('astroPostsCtrl', function( $scope, $http, DataLoader, $timeout, $ionicSlideBoxDelegate,$ionicHistory, $rootScope, $log ,$ionicLoading,backcallFactory) {
backcallFactory.backcallfun();
$ionicLoading.show({
                template: 'Loading ......',
				duration: 3000
            })
$ionicHistory.nextViewOptions({
  disableAnimate: true,
  disableBack: true
  })
var root1 = 'http://eurestcanteen.in/astro/wp-json/wp/v2/';


  var postsApi = root1 + 'posts';

  $scope.moreItems = false;

  $scope.loadPosts = function() {
  

    // Get all of our posts
    DataLoader.get( postsApi ).then(function(response) {

      $scope.posts = response.data;
	 

      $scope.moreItems = true;

      $log.log(postsApi, response.data);

    }, function(response) {
      $log.log(postsApi, response.data);
    });
	
     

  }

  // Load posts on  load
  $scope.loadPosts();

  paged = 2;

  // Load more (infinite scroll)
  $scope.loadMore = function() {
  

    if( !$scope.moreItems ) {
      return;
    }

    var pg = paged++;

    $log.log('loadMore ' + pg );

    $timeout(function() {

      DataLoader.get( postsApi + '?page=' + pg ).then(function(response) {
	  

        angular.forEach( response.data, function( value, key ) {
		
          $scope.posts.push(value);
		  $scope.$broadcast("scroll.infiniteScrollComplete");
		  
        });
		
		

        if( response.data.length <= 0 ) {
          $scope.moreItems = false;
		  $scope.$broadcast("scroll.infiniteScrollComplete");
		
        }
      }, function(response) {
        $scope.moreItems = false;
		
        $log.error(response);
      });

     
      

    }, 1000);
	
	

  }
  //again load more
  
		
	

  $scope.moreDataExists = function() {
   
    return $scope.moreItems;
  }

  // Pull to refresh
  $scope.doRefresh = function() {
  
    $timeout( function() {

      $scope.loadPosts();

      //Stop the ion-refresher from spinning
      
    
    }, 1000);
      
  };
   
})





	//conf
	.controller('CalendarController', ['$scope', '$http', '$state', function($scope, $http, $state) {
  $http.get('js/data.json').success (function (data){
    $scope.calendar = data.calendar;

    $scope.onItemDelete = function (dayIndex, item) {
      $scope.calendar[dayIndex].schedule.splice($scope.calendar[dayIndex].schedule.indexOf(item), 1);
    }

    $scope.toggleStar = function (item) {
      item.star = !item.star;
    }

    $scope.doRefresh = function () {  
        $http.get('js/data.json').success (function (data) {
        $scope.calendar = data.calendar;
        $scope.$broadcast('scroll.refreshComplete');
      });
    }

  });
}])


.controller('ListController', ['$scope', '$http', '$state', function($scope, $http, $state) {
  $http.get('js/data.json').success (function (data){
    $scope.artists = data.artists;
    $scope.whichartist = $state.params.aId;
    $scope.data = {
      showDelete: false,
      showReorder: false
    }

    $scope.onItemDelete = function (item) {
      $scope.artists.splice($scope.artists.indexOf(item), 1);
    }

    $scope.toggleStar = function (item) {
      item.star = !item.star;
    }

    $scope.moveItem = function (item, fromIndex, toIndex) {
      $scope.artists.splice(fromIndex, 1);
      $scope.artists.splice(toIndex, 0, item);
    }

    $scope.doRefresh = function () {  
        $http.get('js/data.json').success (function (data) {
        $scope.artists = data;
        $scope.$broadcast('scroll.refreshComplete');
      });
    }

  });
}])
//quiz


.controller('faqCtrl', function($scope, $timeout) {
  $scope.faqArr = [
    {
    question: 'A milkman has two empty jugs: a three gallon jug and a five gallon jug.  How can he measure exactly one gallon without wasting any milk?',
    answer: 'The milkman filled the three gallon jug, and then emptied the contents into the five gallon jug.  He then filled the three gallon jug again, and continued to fill the five gallon jug until it was full.  The milk remaining in the three gallon jug was precisely one gallon.'
  },
  {
    question: 'You are in the dark, and on the floor there are six shoes of three colors, and a heap of twenty-four socks, black and brown.  How many socks and shoes must you take into the light to be certain that you have a matching pair of socks and a matching pair of shoes?',
    answer: 'Three socks and four shoes would guarantee that you would have a matching pair of each.  Since there are only two colors of socks, it doesnt matter how many are in the heap, as long as you take at least three, you are certain to have two of the same.  As for the shoes, you must pick four, because selecting only three could result in one shoe in each of the three colors! '
  },
  {
    question: 'Assume 9 is twice 5; how will you write 6 times 5 in the same system of notation?',
    answer: 'The answer is 27.  Once you assume that 9 is twice 5, you conclude that 5 = 4.5 (9/2).  Therefore, 6 times 4.5 is 27. '
  },
  {
    question: 'Suppose there are twin brothers; one which always tells the truth and one which always lies.  What single yes/no question could you ask to either brother to figure out which one is which?',
    answer: 'The key to this logic problem, is to find a question that the two brothers would answer differently, and that difference would therefore identify the two from each other.  The lying brother would answer the above question "yes."  The truthful brother would answer the same question "no."  '
  },
  {
    question: 'A king wants his daughter to marry the smartest of 3 extremely intelligent young princes, and so the kings wise men devised an intelligence test.The princes are gathered into a room and seated, facing one another, and are shown 2 black hats and 3 white hats. They are blindfolded, and 1 hat is placed on each of their heads, with the remaining hats hidden in a different room.The king tells them that the first prince to deduce the color of his hat without removing it or looking at it will marry his daughter. A wrong guess will mean death. The blindfolds are then removed.You are one of the princes. You see 2 white hats on the other princes heads. After some time you realize that the other princes are unable to deduce the color of their hat, or are unwilling to guess. What color is your hat?',


    answer: 'The king would not select two white hats and one black hat. This would mean two princes would see one black hat and one white hat. You would be at a disadvantage if you were the only prince wearing a black hat.If you were wearing the black hat, it would not take long for one of the other princes to deduce he was wearing a white hat.If an intelligent prince saw a white hat and a black hat, he would eventually realize that the king would never select two black hats and one white hat. Any prince seeing two black hats would instantly know he was wearing a white hat. Therefore if a prince can see one black hat, he can work out he is wearing white.	Therefore the only fair test is for all three princes to be wearing white hats. After waiting some time just to be sure, you can safely assert you are wearing a white hat. '
  },
  {
    question: 'Five pirates have obtained 100 gold coins and have to divide up the loot. The pirates are all extremely intelligent, treacherous and selfish (especially the captain).The captain always proposes a distribution of the loot. All pirates vote on the proposal, and if half the crew or more go "Aye", the loot is divided as proposed, as no pirate would be willing to take on the captain without superior force on their side.If the captain fails to obtain support of at least half his crew (which includes himself), he faces a mutiny, and all pirates will turn against him and make him walk the plank. The pirates start over again with the next senior pirate as captain.What is the maximum number of coins the captain can keep without risking his life?',
    answer: 'The captain says he will take 98 coins, and will give one coin to the third most senior pirate and another coin to the most junior pirate. He then explains his decision in a manner like this... If there were 2 pirates, pirate 2 being the most senior, he would just vote for himself and that would be 50% of the vote, so he obviously going to keep all the money for himself.If there were 3 pirates, pirate 3 has to convince at least one other person to join in his plan. Pirate 3 would take 99 gold coins and give 1 coin to pirate 1. Pirate 1 knows if he does not vote for pirate 3, then he gets nothing, so obviously is going to vote for this plan.If there were 4 pirates, pirate 4 would give 1 coin to pirate 2, and pirate 2 knows if he does not vote for pirate 4, then he gets nothing, so obviously is going to vote for this plan.As there are 5 pirates, pirates 1 & 3 had obviously better vote for the captain, or they face choosing nothing or risking death. '
  }
  ];
  
  $scope.showOrDont = function(index) {
    if(index !== $scope.show) {
      $scope.show = index;
    } else {
      $scope.show=undefined;
    }
  };
  
})
//depression
.controller('depPostCtrl', function($scope,$cordovaSocialSharing, $stateParams, DataLoader, $ionicLoading,  $sce, CacheFactory, $log, Bookmark, $timeout ) {
	var root1 = 'http://eurestcanteen.in/depression/wp-json/wp/v2/';
	

  if ( ! CacheFactory.get('postCache') ) {
    CacheFactory.createCache('postCache');
  }

  var postCache = CacheFactory.get( 'postCache' );

  $scope.itemID = $stateParams.postId;

  var singlePostApi = root1 + 'posts/' + $scope.itemID;

  $scope.loadPost = function() {

    // Fetch remote post

    $ionicLoading.show({
      noBackdrop: true
    });

    DataLoader.get( singlePostApi ).then(function(response) {

      $scope.post = response.data;

      $log.debug($scope.post);

      // Don't strip post html
      $scope.content = $sce.trustAsHtml(response.data.content.rendered);

      // $scope.comments = $scope.post._embedded['replies'][0];

      // add post to our cache
      postCache.put( response.data.id, response.data );

      $ionicLoading.hide();
    }, function(response) {
      $log.error('error', response);
      $ionicLoading.hide();
    });

  }

  if( !postCache.get( $scope.itemID ) ) {

    // Item is not in cache, go get it
    $scope.loadPost();

  } else {
    // Item exists, use cached item
    $scope.post = postCache.get( $scope.itemID );
    $scope.content = $sce.trustAsHtml( $scope.post.content.rendered );
    // $scope.comments = $scope.post._embedded['replies'][0];
  }

  // Bookmarking
  $scope.bookmarked = Bookmark.check( $scope.itemID );

  $scope.bookmarkItem = function( id ) {
    
    if( $scope.bookmarked ) {
      Bookmark.remove( id );
      $scope.bookmarked = false;
    } else {
      Bookmark.set( id );
      $scope.bookmarked = true;
    }
  }

  // Pull to refresh
  $scope.doRefresh = function() {
  
    $timeout( function() {

      $scope.loadPost();

      //Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    
    }, 1000);
      
  }
  //sharing
   $scope.shareAnywhere = function(title,url) {
        $cordovaSocialSharing.share('pls find the interesting article', title, null, url);
    };

})
 .controller('TabsCtrl', function($scope) {

  // Tabs stuff here

})

.controller('depPostsCtrl', function( $scope, $http, $cordovaSocialSharing, DataLoader, $timeout, $ionicSlideBoxDelegate, $rootScope, $log ,$ionicLoading,backcallFactory) {
backcallFactory.backcallfun();
var root1 = 'http://eurestcanteen.in/depression/wp-json/wp/v2/';

$ionicLoading.show({
                template: 'Loading .....',
				duration: 3000
            });
  var postsApi = root1 + 'posts';

  $scope.moreItems = false;

  $scope.loadPosts = function() {
 

    // Get all of our posts
    DataLoader.get( postsApi ).then(function(response) {

      $scope.posts = response.data;

      $scope.moreItems = true;

      $log.log(postsApi, response.data);

    }, function(response) {
      $log.log(postsApi, response.data);
    });

  }

  // Load posts on  load
  $scope.loadPosts();

  paged = 2;

  // Load more (infinite scroll)
  $scope.loadMore = function() {

    if( !$scope.moreItems ) {
      return;
    }

    var pg = paged++;

    $log.log('loadMore ' + pg );

    $timeout(function() {

      DataLoader.get( postsApi + '?page=' + pg ).then(function(response) {

        angular.forEach( response.data, function( value, key ) {
          $scope.posts.push(value);
		   $scope.$broadcast("scroll.infiniteScrollComplete");
        });

        if( response.data.length <= 0 ) {
          $scope.moreItems = false;
		   $scope.$broadcast("scroll.infiniteScrollComplete");
        }
      }, function(response) {
        $scope.moreItems = false;
        $log.error(response);
      });

      $scope.$broadcast('scroll.infiniteScrollComplete');
      $scope.$broadcast('scroll.resize');

    }, 1000);

  }

  $scope.moreDataExists = function() {
    return $scope.moreItems;
  }

  // Pull to refresh
  $scope.doRefresh = function() {
  
    $timeout( function() {

      $scope.loadPosts();

      //Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    
    }, 1000);
      
  };
   $scope.shareAnywhere = function(title,url) {
        $cordovaSocialSharing.share('pls find the interesting article', title, null, url);
    };
    
})


//youtube
.controller('depnewyoutube', function($scope, $ionicModal,$http,$ionicLoading,$ionicHistory){
 $ionicLoading.show({
                template: 'Loading ......',
				duration: 3000
            });
$ionicHistory.nextViewOptions({
  disableAnimate: true,
  disableBack: true
  });
$scope.playerVars = {
      rel: 0,
      showinfo: 0,
      modestbranding: 0,
    };
    $scope.videos = [];
	

   
$http.get('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=PL5PkFRWjgu7qEUdu2-piKVeA6E3pMLTOn&maxResults=40&key=AIzaSyA__rddrUDI_xZZ0Xo4lr57RRPVxWAb8Oo').then(function(resp) {
    console.log('Success', resp);
	
	$scope.videos=resp.data.items;
	console.log($scope.videos);
	});
	$scope.doRefresh = function () {
	$http.get('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=PL5PkFRWjgu7qEUdu2-piKVeA6E3pMLTOn&maxResults=40&key=AIzaSyA__rddrUDI_xZZ0Xo4lr57RRPVxWAb8Oo').then(function(resp) {
    console.log('Success', resp);
	
	$scope.videos=resp.data.items;
		
			
		});
	}
	
	$scope.$broadcast('scroll.refreshComplete');
	})
	.controller('TabsCtrl', function($scope) {

  // Tabs stuff here

})
//file download
.controller('DownloadController', function($scope, $cordovaFileTransfer) {
   $scope.myObj = {
        "color" : "white",
        "background-color" : "coral",
        "font-size" : "20px",
        "padding" : "60px"
    }

  $scope.Download = function () {
      ionic.Platform.ready(function(){
             var url = "http://eurestcanteen.in/eurest/wp-content/uploads/2016/12/excel.pdf";
             var filename = url.split("/").pop();
             var targetPath = cordova.file.externalRootDirectory + 'Pictures/' + filename;
  
              $cordovaFileTransfer.download(url, targetPath, {}, true).then(function (result) {
                    $scope.hasil = 'Save file on '+targetPath+' success!';
                    $scope.mywallpaper=targetPath;
              }, function (error) {
                    $scope.hasil = 'Error Download file';
              }, function (progress) {
                    $scope.downloadProgress = (progress.loaded / progress.total) * 100;
              });
      });
  }
    
})
.controller("wikiController", ["$scope","$window", "searchResults", function($scope,$window, searchResults) {
    $scope.reset = function() {
        if($scope.content) $scope.content = '';
        if($scope.results) $scope.results = '';
    };

    $scope.check = function() {
        if ($scope.content === "" || !$scope.content) return false;
        return true;
    }

    
    $scope.getResults = function(){
        if($scope.check()) {
            searchResults.get($scope.content).then(function(data){
                $scope.results = data.data.query.pages;
                for(var page in $scope.results){
                    $scope.results[page].link = 'https://en.wikipedia.org/wiki/' + $scope.results[page].title; 
                }
            });
        }
    };

}])
.controller('qodQtr', function($scope, $http) {
$scope.myObj = {
       
        
        "margin" : "0px",
		"width":"100%",
		"height":"100%",
        
    }
  $http.get("http://quotes.rest/qod.json")
    .then(function(response) {
      $scope.qod = response.data.contents.quotes[0].quote;
      $scope.qod_author = response.data.contents.quotes[0].author;    
    });
})
//nutrisearch
 .controller('nutriCtrl', function($scope, nutriDataService,nutriDataServiceHTTP) {

  $scope.data = {searchKey:''};

  $scope.getItemHeight = function(item, index) {
    //Make evenly indexed items be 10px taller, for the sake of example
    return (index % 2) === 0 ? 50 : 60;
  };

  /**
  *
  */
  $scope.doSearch = function() {
    console.debug("Searching for: " +  $scope.data.searchKey);

    if ( true ) {

      // use the $resource based service
      var promise = nutriDataService.getAll( { 
        'term' : $scope.data.searchKey, 
        'results':'0:50',      // <-- variable substitution
        //'fields':'item_name'    <-- you can specify field params
      }).$promise;
      promise.then(function(_response) {
        console.debug(" The data " + JSON.stringify(_response));
        $scope.items = _response.hits;
      });

    } else {
      // use the $http based service
      var promise = nutriDataServiceHTTP.getAll($scope.data.searchKey);
      promise.then(function(_response) {
        console.debug(" The data " + JSON.stringify(_response.data));
        $scope.items = _response.data.hits;
      });
    }
  };
})
/**
*
*/
//weather


.controller('weatherCtrl', function($scope, $http, $ionicPopup) {
  $scope.weatherCity = function(cityName){
         var url='http://api.openweathermap.org/data/2.5/forecast/daily?q='+cityName+'&mode=json&units=metric&cnt=7&APPID=5a159066152d32363a0261ac875e1659';
        console.log(url);
          $http.get(url)
        .then(function(response) {
          $scope.weatherreport = response.data.list;
          console.log($scope.weatherreport);
      });
  }
  $scope.cityName= 'copenhagen';
   var url='http://api.openweathermap.org/data/2.5/forecast/daily?q='+$scope.cityName+'&mode=json&units=metric&cnt=7&APPID=5a159066152d32363a0261ac875e1659';
        console.log(url);
          $http.get(url)
        .then(function(response) {
          $scope.weatherreport = response.data.list;
          console.log($scope.weatherreport);
      });

  $scope.days= ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  $scope.dates=[];
  for(var i =0; i<7;i++){
     $scope.dates.push(new Date(Date.now()+(1000*86400*i)));
  }

    $scope.showDetails = function(index) {
      $scope.data = {}
      $scope.daily = index;
    console.log($scope.daily);
      // Custom popup
      $scope.myPopup = $ionicPopup.show({
          templateUrl: 'details.html',
          title: 'daily forecast',
          scope: $scope,
        });

      $scope.myPopup.then(function(res) {
         console.log('Tapped!', res);
      });    
   };
   $scope.closePopUp = function() {
      $scope.myPopup.close();
};

})

//stock
//data
angular.module('starter.controllers', ['youtube-embed','ionic.contrib.ui.tinderCards','ngCordova','ngResource'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $sce, DataLoader,  $log ) {
  
  // Enter your site url here. You must have the WP-API v2 installed on this site. Leave /wp-json/wp/v2/ at the end.
  var root1 = 'http://eurestcanteen.in/eurest/wp-json/wp/v2/';

  // $rootScope.callback = '_jsonp=JSON_CALLBACK';

})

.controller('SettingsCtrl', function($scope, Settings) {
  $scope.settings = Settings.getSettings();

  // Watch deeply for settings changes, and save them
  // if necessary
  $scope.$watch('settings', function(v) {
    Settings.save();
  }, true);

  $scope.closeSettings = function() {
    $scope.modal.hide();
  };

})


.controller('PostCtrl', function($scope,$cordovaSocialSharing, $stateParams, DataLoader, $ionicLoading,  $sce, CacheFactory, $log, Bookmark, $timeout ) {
	var root1 = 'http://eurestcanteen.in/eurest/wp-json/wp/v2/';
	

  if ( ! CacheFactory.get('postCache') ) {
    CacheFactory.createCache('postCache');
  }

  var postCache = CacheFactory.get( 'postCache' );

  $scope.itemID = $stateParams.postId;

  var singlePostApi = root1 + 'posts/' + $scope.itemID;

  $scope.loadPost = function() {

    // Fetch remote post

    $ionicLoading.show({
      noBackdrop: true
    });

    DataLoader.get( singlePostApi ).then(function(response) {

      $scope.post = response.data;

      $log.debug($scope.post);

      // Don't strip post html
      $scope.content = $sce.trustAsHtml(response.data.content.rendered);

      // $scope.comments = $scope.post._embedded['replies'][0];

      // add post to our cache
      postCache.put( response.data.id, response.data );

      $ionicLoading.hide();
    }, function(response) {
      $log.error('error', response);
      $ionicLoading.hide();
    });

  }

  if( !postCache.get( $scope.itemID ) ) {

    // Item is not in cache, go get it
    $scope.loadPost();

  } else {
    // Item exists, use cached item
    $scope.post = postCache.get( $scope.itemID );
    $scope.content = $sce.trustAsHtml( $scope.post.content.rendered );
    // $scope.comments = $scope.post._embedded['replies'][0];
  }

  // Bookmarking
  $scope.bookmarked = Bookmark.check( $scope.itemID );

  $scope.bookmarkItem = function( id ) {
    
    if( $scope.bookmarked ) {
      Bookmark.remove( id );
      $scope.bookmarked = false;
    } else {
      Bookmark.set( id );
      $scope.bookmarked = true;
    }
  }

  // Pull to refresh
  $scope.doRefresh = function() {
  
    $timeout( function() {

      $scope.loadPost();

      //Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    
    }, 1000);
      
  }
  //sharing
   $scope.shareAnywhere = function(title,url) {
        $cordovaSocialSharing.share('pls find the interesting article', title, null, url);
    };

})
 .controller('TabsCtrl', function($scope) {

  // Tabs stuff here

})

.controller('PostsCtrl', function( $scope, $http, $cordovaSocialSharing, DataLoader, $timeout, $ionicSlideBoxDelegate, $rootScope, $log ,$ionicLoading,backcallFactory) {
backcallFactory.backcallfun();
var root1 = 'http://eurestcanteen.in/eurest/wp-json/wp/v2/';

$ionicLoading.show({
                template: 'Loading .....',
				duration: 3000
            });
  var postsApi = root1 + 'posts';

  $scope.moreItems = false;

  $scope.loadPosts = function() {
 

    // Get all of our posts
    DataLoader.get( postsApi ).then(function(response) {

      $scope.posts = response.data;

      $scope.moreItems = true;

      $log.log(postsApi, response.data);

    }, function(response) {
      $log.log(postsApi, response.data);
    });

  }

  // Load posts on  load
  $scope.loadPosts();

  paged = 2;

  // Load more (infinite scroll)
  $scope.loadMore = function() {

    if( !$scope.moreItems ) {
      return;
    }

    var pg = paged++;

    $log.log('loadMore ' + pg );

    $timeout(function() {

      DataLoader.get( postsApi + '?page=' + pg ).then(function(response) {

        angular.forEach( response.data, function( value, key ) {
          $scope.posts.push(value);
		   $scope.$broadcast("scroll.infiniteScrollComplete");
        });

        if( response.data.length <= 0 ) {
          $scope.moreItems = false;
		   $scope.$broadcast("scroll.infiniteScrollComplete");
        }
      }, function(response) {
        $scope.moreItems = false;
        $log.error(response);
      });

      $scope.$broadcast('scroll.infiniteScrollComplete');
      $scope.$broadcast('scroll.resize');

    }, 1000);

  }

  $scope.moreDataExists = function() {
    return $scope.moreItems;
  }

  // Pull to refresh
  $scope.doRefresh = function() {
  
    $timeout( function() {

      $scope.loadPosts();

      //Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    
    }, 1000);
      
  };
   $scope.shareAnywhere = function(title,url) {
        $cordovaSocialSharing.share('pls find the interesting article', title, null, url);
    };
    
})

.controller('BookmarksCtrl', function( $scope, $http, DataLoader, $timeout, $rootScope, $log, Bookmark, CacheFactory ) {

  $scope.$on('$ionicView.enter', function(e) {

    if ( ! CacheFactory.get('postCache') ) {
      CacheFactory.createCache('postCache');
    }

    var postCache = CacheFactory.get( 'postCache' );

    if ( ! CacheFactory.get('bookmarkCache') ) {
      CacheFactory.createCache('bookmarkCache');
    }

    var bookmarkCacheKeys = CacheFactory.get( 'bookmarkCache' ).keys();

    $scope.posts = [];
  
    angular.forEach( bookmarkCacheKeys, function( value, key ) {
      var newPost = postCache.get( value );
      $scope.posts.push( newPost );
    });

  });
    
})



.controller('ListaCtrl',function($scope,$http,$state,$ionicHistory){
$ionicHistory.nextViewOptions({
  disableAnimate: true,
  disableBack: true
  });
	$http.get('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=PL5PkFRWjgu7pKct6RaLfX4l6GnlkyUz-R&maxResults=40&key=AIzaSyA__rddrUDI_xZZ0Xo4lr57RRPVxWAb8Oo').then(function(resp) {
    console.log('Success', resp);
 	$scope.items = resp.data.items;
           
    $scope.playvideo = function(id,title){
        $state.go('app.now-playing',{id:id,title:title});
       //SocialShare function
        
    }
   // console.log("VideoID: " + id);
    
        // For JSON responses, resp.data contains the result
  }, function(err) {
    console.error('ERR', err);
    // err.status will contain the status code
        //PLueTNPnrNvSHjlZcJb4-Yt6LXUwa53M_p - Sami Yusuf
        //PL97C2D4AAC980FDD7 Ilahi
  })
})
//newyoutube-my channel
.controller('newyoutube', function($scope, $ionicModal,$http,$ionicLoading,$ionicHistory){
 $ionicLoading.show({
                template: 'Loading ......',
				duration: 3000
            });
$ionicHistory.nextViewOptions({
  disableAnimate: true,
  disableBack: true
  });
$scope.playerVars = {
      rel: 0,
      showinfo: 0,
      modestbranding: 0,
    };
    $scope.videos = [];
	

   
$http.get('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=PL5PkFRWjgu7pKct6RaLfX4l6GnlkyUz-R&maxResults=40&key=AIzaSyA__rddrUDI_xZZ0Xo4lr57RRPVxWAb8Oo').then(function(resp) {
    console.log('Success', resp);
	
	$scope.videos=resp.data.items;
	console.log($scope.videos);
	});
	 $scope.playvideo = function(id,title){
        $state.go('now-playing',{id:id,title:title});
       //SocialShare function
        
    }
	$scope.doRefresh = function () {
	$http.get('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=PL5PkFRWjgu7pKct6RaLfX4l6GnlkyUz-R&maxResults=40&key=AIzaSyA__rddrUDI_xZZ0Xo4lr57RRPVxWAb8Oo').then(function(resp) {
    console.log('Success', resp);
	
	$scope.videos=resp.data.items;
		
			
		});
	}
	
	$scope.$broadcast('scroll.refreshComplete');
	})
	
	
	//
	.controller('nowPlayingCtrl',function ($scope, $http, $stateParams){
    $scope.videoId = $stateParams.id;
    $scope.videoTitle = $stateParams.title;
    console.log('videoID: '+ $scope.videoId);
    
    document.getElementById("video-player").innerHTML = '<iframe src="http://www.youtube.com/embed/' + $scope.videoId + '" frameborder="0" allowfullscreen class="yt-playeri"></iframe>';
    document.getElementById("now-playing").innerHTML = $scope.videoTitle;
    
   
   
   
   }
)
	//youtube search
	
	
	.controller('youtubevideos', function($scope, $http,$ionicLoading,$ionicHistory){
	 $ionicLoading.show({
                template: 'Loading...... ',
				duration: 3000
            });
			$ionicHistory.nextViewOptions({
  disableAnimate: true,
  disableBack: true
  });
  $scope.videos = [ ];
  $scope.searchInput = { };

  $scope.search = function(){
    $scope.videos = [];
    $scope.youtubeParams = {
        key: 'AIzaSyA__rddrUDI_xZZ0Xo4lr57RRPVxWAb8Oo',
        type: 'video',
        maxResults: '10',
        part: 'id,snippet',
        fields:'items/id,items/snippet/title,items/snippet/description,items/snippet/thumbnails/default,items/snippet/channelTitle,nextPageToken',
        q: $scope.searchInput
      }

    $http.get('https://www.googleapis.com/youtube/v3/search', {params:$scope.youtubeParams}).success(function(response){
      angular.forEach(response.items, function(child){
      $scope.videos.push(child);
      });
    });
  }
  $scope.playerVars = {
  rel: 0,
  showinfo: 0,
  modestbranding: 0,
}
})



	
	//team eurest
	.controller("TeamCtrl", function($scope,$sce,$ionicLoading) {
	 $ionicLoading.show({
                template: 'Loading .....',
				duration: 5000
            });
var FIREBASE_URL= 'https://mynewtv.firebaseio.com';
var ref = new Firebase(FIREBASE_URL);
    ref.once("value", function(snapshot){
 var list=[];
 list.Data =snapshot.val();
  $scope.limitsize=100;
console.log(list);
var jokes=[];
//team eurest
$scope.Names=list.Data;
$scope.list2=[];
angular.forEach($scope.Names,function(value,key){

$scope.list2.push(value)
$scope.list2.splice(23);


});


var names1=$scope.Names;
$scope.names2=names1.Month;
//jokes
$scope.mngmt=list.Data;
var jokes=$scope.mngmt;
$scope.names4=jokes.management;
//quotes
$scope.quotes1=list.Data;
var quotes2=$scope.quotes1;
$scope.quotes3=quotes2.quotes;









})
})
//instagram
.controller('ApiCtrl',function($scope, $http, $q, $cordovaSocialSharing) {

  $scope.init = function(){
    $scope.getImages()
    .then(function(res){
      // success
      console.log('Images: ',res)
      $scope.imageList = res.data;
    }, function(status){
      // err
      console.log('Error: ', status)
    })
  }

  $scope.getImages = function(){
    var defer = $q.defer();
    var url = "https://api.instagram.com/v1/users/3194446479/media/recent?access_token=3194446479.1677ed0.923d6de449fe4066832e74275947a1f2&callback=JSON_CALLBACK";
    $http.jsonp(url)
    .success(function(res){
      defer.resolve(res)
    })
    .error(function(status, err){
      defer.reject(status)
    })

    return defer.promise;
  }

  $scope.init();
   $scope.shareAnywhere = function(title,url) {
        $cordovaSocialSharing.share('pls find the image', null, null, null);
    };
})
//example controller
.controller("ExampleController", function($scope, $cordovaSocialSharing) {
 
    $scope.shareAnywhere = function() {
        $cordovaSocialSharing.share(null, null, null, null);
    }
	})

	.controller('todoCtrl', ['$scope', function($scope) {
  // Initialize the todo list array
    //if local storage is null save the todolist to local storage
    if (localStorage.getItem("mytodos") == null)
    {
 		$scope.todoList = [ {todoText:'Create app', done:false} ];
       localStorage.setItem("mytodos", angular.toJson($scope.todoList));

    }else
    {
        //set the todolist from local storage
        $scope.todoList = angular.fromJson(localStorage.getItem("mytodos"));
    }



// Add an item function
    $scope.todoAdd = function() {
      //check to see if text has been entered, if not exit
        if ($scope.todoInput == null || $scope.todoInput == ''){return;}

        //if there is text add it to the array
        $scope.todoList.push({todoText:$scope.todoInput, done:false});

        //clear the textbox
        $scope.todoInput = "";

        //resave the list to localstorage
        localStorage.setItem("mytodos", angular.toJson($scope.todoList));

    };

    $scope.remove = function() {
      //copy list
        var oldList = $scope.todoList;
        //clear list
        $scope.todoList = [];
        //cycle through list
        angular.forEach(oldList, function(x) {
          //add any non-done items to todo list
            if (!x.done) $scope.todoList.push(x);
        });
        //update local storage
         localStorage.setItem("mytodos", angular.toJson($scope.todoList));

    };

    //The Update function
    //This waits 100ms to store the data in local storage
    $scope.update = function() {
    //update local storage 100 ms after the checkbox is clicked to allow it to process
    setTimeout(function(){
        localStorage.setItem("mytodos", angular.toJson($scope.todoList));
    },100)


    }

}])



//tinder cards
.controller('newtinderCtrl',function(tindernewService){

		var vm = angular.extend(this, {
			items: [],
			cardDestroyed: cardDestroyed,
			refresh: refresh
		});

		(function activate() {
			getItems();
		})();

		

		function refresh() {
			cardDestroyed(0);
			getItems();
		}

		function getItems() {
			tindernewService.getItems().then(function (items) {
				vm.items = items;
			});
		}
		
		 function cardSwipedLeft(index) {
        console.log('Left swipe');
    }

		function cardDestroyed(index) {
			vm.items.splice(index, 1);
		}
	})
//feedback
.controller('feedbackCtrl', function ($scope,$cordovaSocialSharing) {
 $scope.shareAnywhere = function(title,url) {
        $cordovaSocialSharing.share('pls find the interesting article', title, null, null);
    };

$scope.model = {
		sounds:[
		
			{
				'Name': 'Soren',
				'image': 'img/denmark.png',
				'Designation': 'CanteenChef',
				'info':'For general services,complaints & feedback',
				'Tel': '12345678'
			},
			{
				'Name': 'Flemming',
				'image': 'img/denmark.png',
				'Designation': 'CantineSouchef',
				'info':'For quality & buffet services,complaints & feedback',
				'Tel': '234567893'
			},
			{
				'Name': 'Srinath',
				'image': 'img/india.png',
				'Designation': 'Opvask',
				'info':'For issues regarding plates/glasses etc',
				'Tel': '91437097'
			}
			
			
		
	
	]
	};
	
})
//sendmail

.controller('SendMailCtrl', function($scope) {
	$scope.sendMail = function(){
		$cordovaEmailComposer.isAvailable(
			function (isAvailable) {
				// alert('Service is not available') unless isAvailable;
				$cordovaEmailComposer.open({
					to:      'srinath.erp@gmail.com',
					cc:      'dk53@@gmail.com',
					// bcc:     ['john@doe.com', 'jane@doe.com'],
					subject: 'Greetings',
					body:    'How are you? Nice greetings from IonFullApp'
				});
			}
		);
	};
})

 
.controller("ExampleController", function($scope, $cordovaSocialSharing) {
 
    $scope.shareAnywhere = function() {
        $cordovaSocialSharing.share(null, null, null, null);
    }
	})
	
//chart
 .controller("ChartCtrl", function($scope) {
 

 
    $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
    $scope.series = ['Series A', 'Series B'];
    $scope.data = [
        [65, 59, 80, 81, 56, 55, 40],
        [28, 48, 40, 19, 86, 27, 90]
    ];
 
})
//search ctrl
  .controller('SearchCtrl', function($scope,dataFactory) {
	   var url1='posts?filter[tag]=';

	$scope.posts = [];
	$scope.page = 1;
	$scope.form = {};

	$scope.search = function(){
		dataFactory.httpRequest(url1 + $scope.form.search).then(function(data) {
			$scope.posts = data;

			
			$scope.page++;
		});
	}
})

//wordpress page 
.controller('Mainpage', function($scope, $http, $stateParams,$ionicHistory,$cordovaSocialSharing) {
$ionicHistory.nextViewOptions({
  disableAnimate: true,
  disableBack: true
  });
    $http.get('http://eurestcanteen.in/eurest/wp-json/wp/v2/pages/?slug=notice-board').success(function(res){
        $scope.pages = res;
    })
	 $scope.shareAnywhere = function(title,url) {
        $cordovaSocialSharing.share('pls find the interesting article', title, null, url);
    }
})
 //device info
  .controller('deviceCtrl', function($scope, $cordovaDevice) {

  document.addEventListener("deviceready", function () {

    $scope.device = $cordovaDevice.getDevice();

     $scope.cordova = $cordovaDevice.getCordova();

     $scope.model = $cordovaDevice.getModel();

     $scope.platform = $cordovaDevice.getPlatform();

     $scope. uuid = $cordovaDevice.getUUID();

     $scope. version = $cordovaDevice.getVersion();

  }, false);
})

//stor
.controller('ProductsController', [
	'$scope', '$state','Products', function(
	$scope, $state, Products) {
		$scope.items = [];
		$scope.times = 0 ;
		$scope.postsCompleted = false;
		// load more content function
		$scope.getPosts = function(){
			Products.getPosts()
			.success(function (posts) {
				$scope.items = $scope.items.concat(posts);
				$scope.$broadcast('scroll.infiniteScrollComplete');
				$scope.times = $scope.times + 1;
				$scope.postsCompleted = true;
			})
			.error(function (error) {
				$scope.items = [];
			});
		}
		// pull to refresh buttons
		$scope.doRefresh = function(){
			$scope.times = 0 ;
			$scope.items = [];
			$scope.postsCompleted = false;
			$scope.getPosts();
			$scope.$broadcast('scroll.refreshComplete');
		}
	}
])
/*   product controller  */
.controller('ProductController', [
	'$scope', '$stateParams', 'Products', function(
	$scope, $stateParams, Products) {	
		var product_id = $stateParams.productId;
		$scope.selected_ = {};
		$scope.items = [];
		$scope.details = true;
		// looping though all data and get particular product
		$scope.selectProduct = function(p){
			p.forEach(function(data) {
			    if(data._id == product_id){
			    	$scope.selected_ = data;

			    }
			});
		}
		// get all posts // try some function to get a single produt from server
		$scope.getPosts = function(){
			Products.getPosts()
			.success(function (posts) {
				$scope.items = $scope.items.concat(posts);
				$scope.selectProduct($scope.items);
			})
			.error(function (error) {
				$scope.items = [];
			});
		}
		$scope.getPosts();
		$scope.changeRev = function(){
			if($scope.details == true){
				$scope.details = false;
			} else {
				$scope.details = true;
			}
		}
	}

])
//flickr
.controller('FlickrCtrl', function($scope,$ionicLoading,$state,Flickr){
	$ionicLoading.show();

	// Getting Photosets Detail from Flickr Service
	Flickr.getPhotoSets().then(function(result){
		$scope.photoList = result.data.photosets.photoset;
		$ionicLoading.hide();
	});

	// Opening Album
	$scope.openAlbum = function(photoset_id) {
    	$state.go('app.album',{id: photoset_id });
    };

})
.controller('AlbumCtrl', function($scope,$ionicLoading,$stateParams,Flickr) {
	$ionicLoading.show();
		$scope.id = $stateParams.id;
		$scope.photoList = [];

		// Getting List of Photos from a Photoset
		Flickr.getPhotos($scope.id).then(function(result){
			$ionicLoading.hide();
			console.log(result);
			$scope.photos = result.data.photoset.photo;
			$scope.title = result.data.photoset.title;

			angular.forEach($scope.photos, function(photo,key) {
				var id = photo.id;
				var secret = photo.secret;
				Flickr.getInfo(id,secret).then(function(result) {
					$scope.photoList.push({sizes: result[0].data, info: result[1].data});
					console.log($scope.photoList);

				});
			});

		});
})

//lundbeck images
.controller('FlickrCtrllundbeck', function($scope,$ionicLoading,$state,Flickrlundbeckdata){
	$ionicLoading.show();

	// Getting Photosets Detail from Flickr Service
	Flickrlundbeckdata.getPhotoSets().then(function(result){
		$scope.photoList = result.data.photosets.photoset;
		$ionicLoading.hide();
	});

	// Opening Album
	$scope.openAlbum = function(photoset_id) {
    	$state.go('app.lundbeckalbum',{id: photoset_id });
    };

})
.controller('AlbumCtrllundbeck', function($scope,$ionicLoading,$stateParams,Flickrlundbeckdata) {
	$ionicLoading.show();
		$scope.id = $stateParams.id;
		$scope.photoList = [];

		// Getting List of Photos from a Photoset
		Flickrlundbeckdata.getPhotos($scope.id).then(function(result){
			$ionicLoading.hide();
			console.log(result);
			$scope.photos = result.data.photoset.photo;
			$scope.title = result.data.photoset.title;

			angular.forEach($scope.photos, function(photo,key) {
				var id = photo.id;
				var secret = photo.secret;
				Flickrlundbeckdata.getInfo(id,secret).then(function(result) {
					$scope.photoList.push({sizes: result[0].data, info: result[1].data});
					console.log($scope.photoList);

				});
			});

		});
})

/* Features Controller */
.controller('FeaturesCtrl', ['$scope', 'Features', function($scope, Features) {
	$scope.items = Features.items;
}])
/* other features controller*/
.controller('otherFeaturesCtrl',['$scope', 'otherFeatures', function($scope, Features) {
	$scope.items = Features.items;
}])
//rethinkdepression
.controller('rethinkdepressionFeaturesCtrl',['$scope', 'rethinkdepression', function($scope, rethinkdepression) {
	$scope.items = rethinkdepression.items;
}])

//months menu controller
.controller('MenuController',function($scope,MonthsEvents){

  MonthsEvents.loadEvents()

  var getToday=function(){
    var today=new Date() 
    var year=today.getFullYear()
    var month=today.getMonth()+1
    var date=today.getDate()
    return month>10? year+'-'+month+'-'+date:year+'-0'+month+'-'+date
  }

  $scope.select_date=getToday()
  
  $scope.events_in_select_date=MonthsEvents.getEventsByDate($scope.select_date)

  $scope.eventSources={
    events:MonthsEvents.getAllEvents().map(function(e){
      var temp={
        title:e.title,
        start:e.start,
		
       
      }
      return temp
    }),
    textColor: 'black',
	color:'blue',
	textSize:'50cm'
	
	
	
  }

  $scope.alertEventOnClick=function(date,jsEvent,view){
    $scope.select_date=date.format()
    $scope.events_in_select_date=MonthsEvents.getEventsByDate($scope.select_date)
  }

  $scope.uiConfig = {
     calendar:{
       height: 600,
       editable: false,
	   aspectRatio: 2,
       header:{
         left: '',
         center: 'title',
         right: 'today prev,next'
       },
       dayClick: $scope.alertEventOnClick,
	   
     }
   }
})


//Eurest Event controller
.controller('EuresteventController',function($scope,MonthsEvents){

  MonthsEvents.loadEvents()

  var getToday=function(){
    var today=new Date() 
    var year=today.getFullYear()
    var month=today.getMonth()+1
    var date=today.getDate()
    return month>10? year+'-'+month+'-'+date:year+'-0'+month+'-'+date
  }

  $scope.select_date=getToday()
  
  $scope.events_in_select_date=MonthsEvents.getEventsByDate($scope.select_date)

  $scope.eventSources={
    events:MonthsEvents.getAllEvents().map(function(e){
      var temp={
        title:e.title,
        start:e.start
       
      }
      return temp
    }),
    textColor: 'black'
  }

  $scope.alertEventOnClick=function(date,jsEvent,view){
    $scope.select_date=date.format()
    $scope.events_in_select_date=MonthsEvents.getEventsByDate($scope.select_date)
  }

  $scope.uiConfig = {
     calendar:{
       height: 500,
       editable: true,
       header:{
         left: '',
         center: 'title',
         right: 'today prev,next'
       },
       dayClick: $scope.alertEventOnClick,
     }
   }
})




	



//
.controller('SettingsCtrl', function($scope, SettingsService) {
  $scope.settings = SettingsService;  
})






.controller('astroPostsCtrl', function( $scope, $http, DataLoader, $timeout, $ionicSlideBoxDelegate,$ionicHistory, $rootScope, $log ,$ionicLoading,backcallFactory) {
backcallFactory.backcallfun();
$ionicLoading.show({
                template: 'Loading ......',
				duration: 3000
            })
$ionicHistory.nextViewOptions({
  disableAnimate: true,
  disableBack: true
  })
var root1 = 'http://eurestcanteen.in/astro/wp-json/wp/v2/';


  var postsApi = root1 + 'posts';

  $scope.moreItems = false;

  $scope.loadPosts = function() {
  

    // Get all of our posts
    DataLoader.get( postsApi ).then(function(response) {

      $scope.posts = response.data;
	 

      $scope.moreItems = true;

      $log.log(postsApi, response.data);

    }, function(response) {
      $log.log(postsApi, response.data);
    });
	
     

  }

  // Load posts on  load
  $scope.loadPosts();

  paged = 2;

  // Load more (infinite scroll)
  $scope.loadMore = function() {
  

    if( !$scope.moreItems ) {
      return;
    }

    var pg = paged++;

    $log.log('loadMore ' + pg );

    $timeout(function() {

      DataLoader.get( postsApi + '?page=' + pg ).then(function(response) {
	  

        angular.forEach( response.data, function( value, key ) {
		
          $scope.posts.push(value);
		  $scope.$broadcast("scroll.infiniteScrollComplete");
		  
        });
		
		

        if( response.data.length <= 0 ) {
          $scope.moreItems = false;
		  $scope.$broadcast("scroll.infiniteScrollComplete");
		
        }
      }, function(response) {
        $scope.moreItems = false;
		
        $log.error(response);
      });

     
      

    }, 1000);
	
	

  }
  //again load more
  
		
	

  $scope.moreDataExists = function() {
   
    return $scope.moreItems;
  }

  // Pull to refresh
  $scope.doRefresh = function() {
  
    $timeout( function() {

      $scope.loadPosts();

      //Stop the ion-refresher from spinning
      
    
    }, 1000);
      
  };
   
})





	//conf
	.controller('CalendarController', ['$scope', '$http', '$state', function($scope, $http, $state) {
  $http.get('js/data.json').success (function (data){
    $scope.calendar = data.calendar;

    $scope.onItemDelete = function (dayIndex, item) {
      $scope.calendar[dayIndex].schedule.splice($scope.calendar[dayIndex].schedule.indexOf(item), 1);
    }

    $scope.toggleStar = function (item) {
      item.star = !item.star;
    }

    $scope.doRefresh = function () {  
        $http.get('js/data.json').success (function (data) {
        $scope.calendar = data.calendar;
        $scope.$broadcast('scroll.refreshComplete');
      });
    }

  });
}])


.controller('ListController', ['$scope', '$http', '$state', function($scope, $http, $state) {
  $http.get('js/data.json').success (function (data){
    $scope.artists = data.artists;
    $scope.whichartist = $state.params.aId;
    $scope.data = {
      showDelete: false,
      showReorder: false
    }

    $scope.onItemDelete = function (item) {
      $scope.artists.splice($scope.artists.indexOf(item), 1);
    }

    $scope.toggleStar = function (item) {
      item.star = !item.star;
    }

    $scope.moveItem = function (item, fromIndex, toIndex) {
      $scope.artists.splice(fromIndex, 1);
      $scope.artists.splice(toIndex, 0, item);
    }

    $scope.doRefresh = function () {  
        $http.get('js/data.json').success (function (data) {
        $scope.artists = data;
        $scope.$broadcast('scroll.refreshComplete');
      });
    }

  });
}])
//quiz


.controller('faqCtrl', function($scope, $timeout) {
  $scope.faqArr = [
    {
    question: 'A milkman has two empty jugs: a three gallon jug and a five gallon jug.  How can he measure exactly one gallon without wasting any milk?',
    answer: 'The milkman filled the three gallon jug, and then emptied the contents into the five gallon jug.  He then filled the three gallon jug again, and continued to fill the five gallon jug until it was full.  The milk remaining in the three gallon jug was precisely one gallon.'
  },
  {
    question: 'You are in the dark, and on the floor there are six shoes of three colors, and a heap of twenty-four socks, black and brown.  How many socks and shoes must you take into the light to be certain that you have a matching pair of socks and a matching pair of shoes?',
    answer: 'Three socks and four shoes would guarantee that you would have a matching pair of each.  Since there are only two colors of socks, it doesnt matter how many are in the heap, as long as you take at least three, you are certain to have two of the same.  As for the shoes, you must pick four, because selecting only three could result in one shoe in each of the three colors! '
  },
  {
    question: 'Assume 9 is twice 5; how will you write 6 times 5 in the same system of notation?',
    answer: 'The answer is 27.  Once you assume that 9 is twice 5, you conclude that 5 = 4.5 (9/2).  Therefore, 6 times 4.5 is 27. '
  },
  {
    question: 'Suppose there are twin brothers; one which always tells the truth and one which always lies.  What single yes/no question could you ask to either brother to figure out which one is which?',
    answer: 'The key to this logic problem, is to find a question that the two brothers would answer differently, and that difference would therefore identify the two from each other.  The lying brother would answer the above question "yes."  The truthful brother would answer the same question "no."  '
  },
  {
    question: 'A king wants his daughter to marry the smartest of 3 extremely intelligent young princes, and so the kings wise men devised an intelligence test.The princes are gathered into a room and seated, facing one another, and are shown 2 black hats and 3 white hats. They are blindfolded, and 1 hat is placed on each of their heads, with the remaining hats hidden in a different room.The king tells them that the first prince to deduce the color of his hat without removing it or looking at it will marry his daughter. A wrong guess will mean death. The blindfolds are then removed.You are one of the princes. You see 2 white hats on the other princes heads. After some time you realize that the other princes are unable to deduce the color of their hat, or are unwilling to guess. What color is your hat?',


    answer: 'The king would not select two white hats and one black hat. This would mean two princes would see one black hat and one white hat. You would be at a disadvantage if you were the only prince wearing a black hat.If you were wearing the black hat, it would not take long for one of the other princes to deduce he was wearing a white hat.If an intelligent prince saw a white hat and a black hat, he would eventually realize that the king would never select two black hats and one white hat. Any prince seeing two black hats would instantly know he was wearing a white hat. Therefore if a prince can see one black hat, he can work out he is wearing white.	Therefore the only fair test is for all three princes to be wearing white hats. After waiting some time just to be sure, you can safely assert you are wearing a white hat. '
  },
  {
    question: 'Five pirates have obtained 100 gold coins and have to divide up the loot. The pirates are all extremely intelligent, treacherous and selfish (especially the captain).The captain always proposes a distribution of the loot. All pirates vote on the proposal, and if half the crew or more go "Aye", the loot is divided as proposed, as no pirate would be willing to take on the captain without superior force on their side.If the captain fails to obtain support of at least half his crew (which includes himself), he faces a mutiny, and all pirates will turn against him and make him walk the plank. The pirates start over again with the next senior pirate as captain.What is the maximum number of coins the captain can keep without risking his life?',
    answer: 'The captain says he will take 98 coins, and will give one coin to the third most senior pirate and another coin to the most junior pirate. He then explains his decision in a manner like this... If there were 2 pirates, pirate 2 being the most senior, he would just vote for himself and that would be 50% of the vote, so he obviously going to keep all the money for himself.If there were 3 pirates, pirate 3 has to convince at least one other person to join in his plan. Pirate 3 would take 99 gold coins and give 1 coin to pirate 1. Pirate 1 knows if he does not vote for pirate 3, then he gets nothing, so obviously is going to vote for this plan.If there were 4 pirates, pirate 4 would give 1 coin to pirate 2, and pirate 2 knows if he does not vote for pirate 4, then he gets nothing, so obviously is going to vote for this plan.As there are 5 pirates, pirates 1 & 3 had obviously better vote for the captain, or they face choosing nothing or risking death. '
  }
  ];
  
  $scope.showOrDont = function(index) {
    if(index !== $scope.show) {
      $scope.show = index;
    } else {
      $scope.show=undefined;
    }
  };
  
})
//depression
.controller('depPostCtrl', function($scope,$cordovaSocialSharing, $stateParams, DataLoader, $ionicLoading,  $sce, CacheFactory, $log, Bookmark, $timeout ) {
	var root1 = 'http://eurestcanteen.in/depression/wp-json/wp/v2/';
	

  if ( ! CacheFactory.get('postCache') ) {
    CacheFactory.createCache('postCache');
  }

  var postCache = CacheFactory.get( 'postCache' );

  $scope.itemID = $stateParams.postId;

  var singlePostApi = root1 + 'posts/' + $scope.itemID;

  $scope.loadPost = function() {

    // Fetch remote post

    $ionicLoading.show({
      noBackdrop: true
    });

    DataLoader.get( singlePostApi ).then(function(response) {

      $scope.post = response.data;

      $log.debug($scope.post);

      // Don't strip post html
      $scope.content = $sce.trustAsHtml(response.data.content.rendered);

      // $scope.comments = $scope.post._embedded['replies'][0];

      // add post to our cache
      postCache.put( response.data.id, response.data );

      $ionicLoading.hide();
    }, function(response) {
      $log.error('error', response);
      $ionicLoading.hide();
    });

  }

  if( !postCache.get( $scope.itemID ) ) {

    // Item is not in cache, go get it
    $scope.loadPost();

  } else {
    // Item exists, use cached item
    $scope.post = postCache.get( $scope.itemID );
    $scope.content = $sce.trustAsHtml( $scope.post.content.rendered );
    // $scope.comments = $scope.post._embedded['replies'][0];
  }

  // Bookmarking
  $scope.bookmarked = Bookmark.check( $scope.itemID );

  $scope.bookmarkItem = function( id ) {
    
    if( $scope.bookmarked ) {
      Bookmark.remove( id );
      $scope.bookmarked = false;
    } else {
      Bookmark.set( id );
      $scope.bookmarked = true;
    }
  }

  // Pull to refresh
  $scope.doRefresh = function() {
  
    $timeout( function() {

      $scope.loadPost();

      //Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    
    }, 1000);
      
  }
  //sharing
   $scope.shareAnywhere = function(title,url) {
        $cordovaSocialSharing.share('pls find the interesting article', title, null, url);
    };

})
 .controller('TabsCtrl', function($scope) {

  // Tabs stuff here

})

.controller('depPostsCtrl', function( $scope, $http, $cordovaSocialSharing, DataLoader, $timeout, $ionicSlideBoxDelegate, $rootScope, $log ,$ionicLoading,backcallFactory) {
backcallFactory.backcallfun();
var root1 = 'http://eurestcanteen.in/depression/wp-json/wp/v2/';

$ionicLoading.show({
                template: 'Loading .....',
				duration: 3000
            });
  var postsApi = root1 + 'posts';

  $scope.moreItems = false;

  $scope.loadPosts = function() {
 

    // Get all of our posts
    DataLoader.get( postsApi ).then(function(response) {

      $scope.posts = response.data;

      $scope.moreItems = true;

      $log.log(postsApi, response.data);

    }, function(response) {
      $log.log(postsApi, response.data);
    });

  }

  // Load posts on  load
  $scope.loadPosts();

  paged = 2;

  // Load more (infinite scroll)
  $scope.loadMore = function() {

    if( !$scope.moreItems ) {
      return;
    }

    var pg = paged++;

    $log.log('loadMore ' + pg );

    $timeout(function() {

      DataLoader.get( postsApi + '?page=' + pg ).then(function(response) {

        angular.forEach( response.data, function( value, key ) {
          $scope.posts.push(value);
		   $scope.$broadcast("scroll.infiniteScrollComplete");
        });

        if( response.data.length <= 0 ) {
          $scope.moreItems = false;
		   $scope.$broadcast("scroll.infiniteScrollComplete");
        }
      }, function(response) {
        $scope.moreItems = false;
        $log.error(response);
      });

      $scope.$broadcast('scroll.infiniteScrollComplete');
      $scope.$broadcast('scroll.resize');

    }, 1000);

  }

  $scope.moreDataExists = function() {
    return $scope.moreItems;
  }

  // Pull to refresh
  $scope.doRefresh = function() {
  
    $timeout( function() {

      $scope.loadPosts();

      //Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    
    }, 1000);
      
  };
   $scope.shareAnywhere = function(title,url) {
        $cordovaSocialSharing.share('pls find the interesting article', title, null, url);
    };
    
})


//youtube
.controller('depnewyoutube', function($scope, $ionicModal,$http,$ionicLoading,$ionicHistory){
 $ionicLoading.show({
                template: 'Loading ......',
				duration: 3000
            });
$ionicHistory.nextViewOptions({
  disableAnimate: true,
  disableBack: true
  });
$scope.playerVars = {
      rel: 0,
      showinfo: 0,
      modestbranding: 0,
    };
    $scope.videos = [];
	

   
$http.get('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=PL5PkFRWjgu7qEUdu2-piKVeA6E3pMLTOn&maxResults=40&key=AIzaSyA__rddrUDI_xZZ0Xo4lr57RRPVxWAb8Oo').then(function(resp) {
    console.log('Success', resp);
	
	$scope.videos=resp.data.items;
	console.log($scope.videos);
	});
	$scope.doRefresh = function () {
	$http.get('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=PL5PkFRWjgu7qEUdu2-piKVeA6E3pMLTOn&maxResults=40&key=AIzaSyA__rddrUDI_xZZ0Xo4lr57RRPVxWAb8Oo').then(function(resp) {
    console.log('Success', resp);
	
	$scope.videos=resp.data.items;
		
			
		});
	}
	
	$scope.$broadcast('scroll.refreshComplete');
	})
	.controller('TabsCtrl', function($scope) {

  // Tabs stuff here

})
//file download
.controller('DownloadController', function($scope, $cordovaFileTransfer) {
   $scope.myObj = {
        "color" : "white",
        "background-color" : "coral",
        "font-size" : "20px",
        "padding" : "60px"
    }

  $scope.Download = function () {
      ionic.Platform.ready(function(){
             var url = "http://eurestcanteen.in/eurest/wp-content/uploads/2016/12/excel.pdf";
             var filename = url.split("/").pop();
             var targetPath = cordova.file.externalRootDirectory + 'Pictures/' + filename;
  
              $cordovaFileTransfer.download(url, targetPath, {}, true).then(function (result) {
                    $scope.hasil = 'Save file on '+targetPath+' success!';
                    $scope.mywallpaper=targetPath;
              }, function (error) {
                    $scope.hasil = 'Error Download file';
              }, function (progress) {
                    $scope.downloadProgress = (progress.loaded / progress.total) * 100;
              });
      });
  }
    
})
.controller("wikiController", ["$scope","$window", "searchResults", function($scope,$window, searchResults) {
    $scope.reset = function() {
        if($scope.content) $scope.content = '';
        if($scope.results) $scope.results = '';
    };

    $scope.check = function() {
        if ($scope.content === "" || !$scope.content) return false;
        return true;
    }

    
    $scope.getResults = function(){
        if($scope.check()) {
            searchResults.get($scope.content).then(function(data){
                $scope.results = data.data.query.pages;
                for(var page in $scope.results){
                    $scope.results[page].link = 'https://en.wikipedia.org/wiki/' + $scope.results[page].title; 
                }
            });
        }
    };

}])
.controller('qodQtr', function($scope, $http) {
$scope.myObj = {
       
        
        "margin" : "0px",
		"width":"100%",
		"height":"100%",
        
    }
  $http.get("http://quotes.rest/qod.json")
    .then(function(response) {
      $scope.qod = response.data.contents.quotes[0].quote;
      $scope.qod_author = response.data.contents.quotes[0].author;    
    });
})
//nutrisearch
 .controller('nutriCtrl', function($scope, nutriDataService,nutriDataServiceHTTP) {

  $scope.data = {searchKey:''};

  $scope.getItemHeight = function(item, index) {
    //Make evenly indexed items be 10px taller, for the sake of example
    return (index % 2) === 0 ? 50 : 60;
  };

  /**
  *
  */
  $scope.doSearch = function() {
    console.debug("Searching for: " +  $scope.data.searchKey);

    if ( true ) {

      // use the $resource based service
      var promise = nutriDataService.getAll( { 
        'term' : $scope.data.searchKey, 
        'results':'0:50',      // <-- variable substitution
        //'fields':'item_name'    <-- you can specify field params
      }).$promise;
      promise.then(function(_response) {
        console.debug(" The data " + JSON.stringify(_response));
        $scope.items = _response.hits;
      });

    } else {
      // use the $http based service
      var promise = nutriDataServiceHTTP.getAll($scope.data.searchKey);
      promise.then(function(_response) {
        console.debug(" The data " + JSON.stringify(_response.data));
        $scope.items = _response.data.hits;
      });
    }
  };
})
/**
*
*/
//weather


.controller('weatherCtrl', function($scope, $http, $ionicPopup) {
  $scope.weatherCity = function(cityName){
         var url='http://api.openweathermap.org/data/2.5/forecast/daily?q='+cityName+'&mode=json&units=metric&cnt=7&APPID=5a159066152d32363a0261ac875e1659';
        console.log(url);
          $http.get(url)
        .then(function(response) {
          $scope.weatherreport = response.data.list;
          console.log($scope.weatherreport);
      });
  }
  $scope.cityName= 'copenhagen';
   var url='http://api.openweathermap.org/data/2.5/forecast/daily?q='+$scope.cityName+'&mode=json&units=metric&cnt=7&APPID=5a159066152d32363a0261ac875e1659';
        console.log(url);
          $http.get(url)
        .then(function(response) {
          $scope.weatherreport = response.data.list;
          console.log($scope.weatherreport);
      });

  $scope.days= ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  $scope.dates=[];
  for(var i =0; i<7;i++){
     $scope.dates.push(new Date(Date.now()+(1000*86400*i)));
  }

    $scope.showDetails = function(index) {
      $scope.data = {}
      $scope.daily = index;
    console.log($scope.daily);
      // Custom popup
      $scope.myPopup = $ionicPopup.show({
          templateUrl: 'details.html',
          title: 'daily forecast',
          scope: $scope,
        });

      $scope.myPopup.then(function(res) {
         console.log('Tapped!', res);
      });    
   };
   $scope.closePopUp = function() {
      $scope.myPopup.close();
};

})

//astro controller

.controller('astroMenuCtrl', function($http, $scope, $sce, $ionicScrollDelegate,$timeout,$rootScope){
	
	$scope.categories = [];
	
	});

	$http.get("http://eurtestcanteen.in/astro/api/get_category_index/").then(
		function(returnedData){

			$scope.categories = returnedData.data.categories;
			$scope.categories.forEach(function(element, index, array){
				element.title = $sce.trustAsHtml(element.title);
			})
			console.log(returnedData);

		}, function(err){
			console.log(err);
	})

})

.controller('astroMainCtrl', function($http, $scope, $sce, $ionicScrollDelegate,$timeout, $localStorage, $ionicLoading){

	$scope.offset = 0;
	$scope.count_total = 1;

	$scope.doRefresh = function(){
		$scope.recent_posts = [];
		$http.get("http://eurtestcanteen.in/astro/api/get_posts/").then(function(data){
			console.log(data);
			$scope.recent_posts = data.data.posts;
			$scope.count_total = data.data.count_total;
			$scope.recent_posts.forEach(function(element, index, array){
				element.excerpt = element.excerpt.substr(0,100);
				element.excerpt = element.excerpt + "... Read More";
				element.excerpt = $sce.trustAsHtml(element.excerpt);
				if($scope.Favorites.indexOf(element.id) != -1)
					element.isFavorite = true;
				else
					element.isFavorite = false;
			})
			
			$scope.$broadcast('scroll.refreshComplete');

		}, function(err){

		})
	}

	$scope.Favorites = $localStorage.Favorites;
	if(!$scope.Favorites)
		$scope.Favorites = [];

	$scope.recent_posts = [];

	$http.get("http://eurtestcanteen.in/astro/api/get_posts/").then(function(data){
		console.log(data);
		$scope.recent_posts = data.data.posts;
		$scope.count_total = data.data.count_total;
		$scope.recent_posts.forEach(function(element, index, array){
			element.excerpt = element.excerpt.substr(0,100);
			element.excerpt = element.excerpt + "... Read More";
			element.excerpt = $sce.trustAsHtml(element.excerpt);
			if($scope.Favorites.indexOf(element.id) != -1)
				element.isFavorite = true;
			else
				element.isFavorite = false;
		})
	}, function(err){

	})

	$scope.canLoadMore = function()
	{
		return true;
	}

	$scope.timer = new Date().getTime();
	$scope.lastTimer = new Date().getTime();

	$scope.loadMore = function(){
		
		$scope.timer = new Date().getTime();
		//console.log(new Date($scope.timer - $scope.lastTimer).getTime())
		if(new Date($scope.timer - $scope.lastTimer) > 5000)
		{
			$scope.lastTimer = new Date().getTime();
			$http.get("http://eurtestcanteen.in/astro/api/get_posts/?offset="+$scope.offset)
			.then(function(data){
				var newPosts = data.data.posts;
				$scope.count_total = data.data.count_total;

				newPosts.forEach(function(element, index, array){
					element.excerpt = element.excerpt.substr(0,100);
					element.excerpt = element.excerpt + "... Read More";
					element.excerpt = $sce.trustAsHtml(element.excerpt);
				})

				$scope.recent_posts.push.apply($scope.recent_posts, newPosts);
				$scope.$broadcast("scroll.infiniteScrollComplete");
				$scope.offset += 10;
		});
		}

		
	};
	
	$scope.searchTextChanged = function(){
		$ionicScrollDelegate.$getByHandle('mainScroll').scrollTop(true);
	}

	$scope.toggleFavorite = function(post){

		post.isFavorite = !post.isFavorite;

		if(post.isFavorite == true)
		{
			$scope.Favorites.push(post.id);
		}
		else
		{
			$scope.Favorites.forEach(function(e, i ,a){
				if(e == post.id){
					$scope.Favorites.splice(i, 1);
					console.log("Spliced index "+ i);
				}
			})
		}

		$localStorage.Favorites = $scope.Favorites;
	}
})
.controller('astroPostCtrl', function($scope, $http, $stateParams, $sce){
	
	$http.get('http://eurtestcanteen.in/astro/api/get_post/?id='+ $stateParams.postId).then(
		function(data){
			$scope.post_title = data.data.post.title;
			$scope.post_category = data.data.post.categories[0].title ? data.data.post.categories[0]
				.title : 'No Category';
			$scope.post_content = $sce.trustAsHtml(data.data.post.content);
			$scope.post_date = data.data.post.date;
			$scope.post_authorName = data.data.post.author.first_name + " " + data.data.post.author.last_name;
		      if($scope.post_authorName.trim() == '')
		        $scope.post_authorName = "No Name";
		      $scope.post_authorImage = 'http://ionicframework.com/img/docs/mcfly.jpg';
		      $scope.post_image = data.data.post.thumbnail_images.full.url;
		      $scope.post_commentCount = data.data.post.comment_count;
		      $scope.post_views = data.data.post.custom_fields.post_views_count[0];
		      $scope.post_url = data.data.post.url;
		}, function(err){

		})

	$scope.Share = function(){
		window.plugins.socialsharing.share($scope.post_title, $scope.post_title, $scope.post_image, $scope.post_url);
	}

})



.controller('astroFavCtrl', function($http, $scope, $localStorage, $sce){

	$scope.doRefresh = function(){

    $scope.Favorites = $localStorage.Favorites;
    $scope.favorite_posts = [];
    $scope.Favorites.forEach(function(element, index, array){
      $http.get('http://eurtestcanteen.in/astro/api/get_post/?id='+element)
      .success(function(data){
        $scope.favorite_posts.push(data.post);

        if($scope.favorite_posts.length == $scope.Favorites.length)
        {
          $scope.favorite_posts.forEach(function(post, position, list){
            post.excerpt = post.excerpt.substr(0,100);
            post.excerpt = post.excerpt + '... Read More';
            post.excerpt = $sce.trustAsHtml(post.excerpt);
            
            if($scope.Favorites.indexOf(post.id) != -1)
              post.isFavorite = true;
            else
              post.isFavorite = false;
          })
        }
      })

      .finally(function(){
        $scope.$broadcast('scroll.refreshComplete');
      })
    })

  }

  $scope.doRefresh();

  $scope.toggleFavorite = function(post){
    post.isFavorite = !post.isFavorite;

    if(post.isFavorite)
    {
      $scope.Favorites.push(post.id)
    }
    else
    {
      $scope.Favorites.forEach(function(element, index, array){
        if(element == post.id)
        {
          $scope.Favorites.splice(index, 1);
          console.log("Spliced Item from index " + index);
        }
      })
    }

    $localStorage.Favorites = $scope.Favorites;
}
})
//data
{
  "calendar": [
    {
      "weekday": "Monday",
      "title": "Art in Full Color",
      "description": "The first day of CAC events and exhibits is kicked off under the theme of Art in Full Color From a demonstration in graffiti art on a wall of the Rousseau Room, to the exhibit of colorful glazed modern glassware in the Dover Hall, Art in Full Color will get CAC started in full swing!",
      "schedule": [
        {
          "time": "9:30-10:30am",
          "shortname": "LaVonne_LaRue",
          "artist": "LaVonne L. LaRue",
          "room": "Elizabeth Hall",
          "description": "Watch LaVonne L. LaRue, a Chicago graffiti artist share her love and skill of mural art on Monday's schedule, as she starts the painting of a 20-foot high wall in the Rousseau Room of Hotel Contempo, which will be finished at the end of the conference. Make sure to show up a bit early, as this session will be standing-room only.",
          "title": "Art in Unexpected Places"
        }, {
          "time": "11:00am-1pm",
          "shortname": "Hassum_Harrod",
          "name": "Hassum Harrod",
          "room": "Victoria Hall",
          "description": "Drawing and painting flowers may seem like a first-year art student's assignment, but Hassum Harrod brings depth, shadows, light, and color to new heights with his unique technique of painting on canvas with ceramic glaze. This session is sure to be a hit with mixed media buffs.",
          "title": "Art in Full Bloom"
        },{
          "time": "2:30-4:00pm",
          "room": "Dennison Hall",
          "description": "Grab your pencils, charcoal, acrylics, watercolors, or whatever painting tools suit your fancy, and participate in the capturing of various still life settings that are staged all around Dennison Hall. You won't believe the wealth and depth of choices.",
          "title": "Still Life"
        }
      ]
    }, {
      "weekday": "Tuesday",
      "title": "Water in Art",
      "description": "Water in Art is the theme for the second day, as art students from around the world gather at the Fountain of Intrigue in the gardens of Hotel Contempo to create ice sculptures, and art lecturers discuss the use of water as an art material, and water as an art subject.",
      "schedule": [
        {
          "time": "9:30-10:30am",
          "shortname": "Jennifer_Jerome",
          "artist": "Jennifer Jerome",
          "room": "Elizabeth Hall",
          "description": "Jennifer Jerome, a native of New Orleans, whose work has centered around abstract images that depict flooding and rebuilding, will talk about how the floods inspired her artistically, and how, despite the sadness of devastation and lives lost, her work also depicts the hope and togetherness of a community that has persevered.",
          "title": "Water in Art Kickoff Session"
        },{
          "time": "10:30am-1pm",
          "room": "Fountain of Intrigue",
          "description": "Get on your mittens and earmuffs, and join your fellow artists at the Fountain of Intrigue, in the Hotel Contempo gardens, where the ambient temperature has been turned down to allow the sculpting of ice into the most mysterious and beautiful of shapes. Various masters will share their secrets for chiseling ice into a shape that their imagination has envisioned.",
          "title": "Ice Sculptures"
        },{
          "time": "2:30-4:00pm",
          "shortname": "Hillary_Goldwynn",
          "artist": "Hillary Hewitt Goldwynn-Post",
          "room": "Dennison Hall",
          "description": "Hilary Goldywynn Post has been inspiring deep sea divers to paint what they experience under water, since she began diving at the early age of 14. Not only does she explain texture, color, and tools, but she also explains methods for capturing your under sea explorations in your mind for future expulsion onto canvas. And, even if snorkeling is as far under water as you're willing to go, Hilary's techniques will work just as well for you.",
          "title": "Deep Sea Wonders"
        }
      ]
    }, {
      "weekday": "Wednesday",
      "schedule": [
        {
          "time": "9:30 to 10:30 am",
          "shortname": "Barot_Bellingham",
          "artist": "Barot Bellingham",
          "room": "Elizabeth Hall",
          "description": "Barot Bellingham's new collection is pieced together from seemingly unrelated individual works of varying topic. From portraits to landscapes to abstract, Barot does it all, and does it all well. The only unifying factor is the excellence in form, technique, color, and balance that exudes from each and every individual work in The Un-Collection. Meet Barot, and his undeniably original collection of art, and be forever enchanted.",
          "title": "The Un-Collection"
        },{
          "time": "10:45 to 12:00 pm",
          "shortname": "Xhou_Ta",
          "artist": "Xhou Ta",
          "room": "Dennison Hall",
          "description": "Get a glimpse at the rare offerings in Xhou's exhibit, ranging from an exquisite skyscraper painted on a grain of rice, to a miniature sculpture of an oak tree filled with detailed animals, the size of a thimble. Items are shown on a large screen, using Xhou's patented rear-projection device that magnifies the image to reveal incredible detail. Beyond the Naked Eye is a fantastic exhibit that blends art and science in a most magical way.",
          "title": "Beyond the Naked Eye"
        }
      ]
    }, {
      "weekday": "Thursday",
      "schedule": [
        {
          "time": "09:30 to 10:30 am",
          "shortname": "Hassum_Harrod",
          "artist": "Hassum Harrod",
          "room": "Elizabeth Hall",
          "description": "Hassum's inherent ability to create color palettes that illuminate an image and allure an audience, has drawn praise from traditionalists as well as modern artists - no small feat in today's diverse art world. His master's thesis at San Francisco Art Academy is entitled \"Color Upon Color – The Mixing and Reinventing of Color.\" It is this thesis that prompted Hillford & Bilken to publish his solo-authored book on color, that will be used in undergraduate art programs throughout the world starting next year.",
          "title": "The Use and Absence of Color in Modern Art"
        },{
          "time": "10:30 to 11:30 am",
          "shortname": "Constance_Smith",
          "artist": "Constance Olivia Smith",
          "room": "Victoria Hall",
          "description": "In the Art of Salvaging, Olivia will share her talent for finding and selecting scrap materials, as well as the philosophy behind several of her more celebrated works of art. If you're interested in recycling and mixed media, this session will include a lively discussion of both, from the woman who Art International Digest calls the \"foremost queen of scrap art.\"",
          "title": "The Art of Salvaging"
        },{
          "time": "1:30 to 2:30",
          "shortname": "Riley_Rewington",
          "artist": "Riley Rudolph Rewington",
          "room": "Dennison Hall",
          "description": "The leader of the MMA artistic movement in his hometown of Portland, Riley Rudolph Rewington draws a crowd wherever he goes. Mixing street performance, video, music, and traditional art, Riley has created some of the most unique and deeply poignant abstract works of his generation. Join Riley in Dennison Hall for an intimate discussion on The Art of Abstract, in which he shares his philosophies about modern abstract art, and critiques some of this own work – with complete candor and a healthy dose of personality.",
          "title": "The Art of Abstract"
        }
      ]
    }
  ],
  "artists": [
    {
      "bio": "Barot has just finished his final year at The Royal Academy of Painting and Sculpture, where he excelled in glass etching paintings and portraiture. Hailed as one of the most diverse artists of his generation, Barot is equally as skilled with watercolors as he is with oils, and is just as well-balanced in different subject areas. Barot's collection entitled 'The Un-Collection' will adorn the walls of Gilbert Hall, depicting his range of skills and sensibilities - all of them, uniquely Barot, yet undeniably different",
      "shortname": "Barot_Bellingham",
      "name": "Barot Bellingham",
      "reknown": "Royal Academy of Painting and Sculpture"
    },{
      "bio": "The Artist to Watch in 2012 by the London Review, Johnathan has already sold one of the highest priced-commissions paid to an art student, ever on record. The piece, entitled Gratitude Resort, a work in oil and mixed media, was sold for $750,000 and Jonathan donated all the proceeds to Art for Peace, an organization that provides college art scholarships for creative children in developing nations",
      "shortname": "Jonathan_Ferrar",
      "name": "Jonathan G. Ferrar II",
      "reknown": "Artist to Watch in 2012"
    },{
      "bio": "Hillary is a sophomore art sculpture student at New York University, and has already won all the major international prizes for new sculptors, including the Divinity Circle, the International Sculptor's Medal, and the Academy of Paris Award. Hillary's CAC exhibit features 25 abstract watercolor paintings that contain only water images including waves, deep sea, and river.",
      "shortname": "Hillary_Goldwynn",
      "name": "Hillary Hewitt Goldwynn-Post",
      "reknown": "New York University"
    },{
      "bio": "The Art College in New Dehli has sponsored Hassum on scholarship for his entire undergraduate career at the university, seeing great promise in his contemporary paintings of landscapes - that use equal parts muted and vibrant tones, and are almost a contradiction in art. Hassum will be speaking on 'The use and absence of color in modern art' during Thursday's agenda.",
      "shortname": "Hassum_Harrod",
      "name": "Hassum Harrod",
      "reknown": "Art College in New Dehli"
    },{
      "bio": "A native of New Orleans, much of Jennifer's work has centered around abstract images that depict flooding and rebuilding, having grown up as a teenager in the post-flood years. Despite the sadness of devastation and lives lost, Jennifer's work also depicts the hope and togetherness of a community that has persevered. Jennifer's exhibit will be discussed during Tuesday's Water in Art theme.",
      "shortname": "Jennifer_Jerome",
      "name": "Jennifer Jerome",
      "reknown": "New Orleans, LA"
    },{
      "bio": "LaVonne's giant-sized paintings all around Chicago tell the story of love, nature, and conservation - themes that are central to her heart. LaVonne will share her love and skill of graffiti art on Monday's schedule, as she starts the painting of a 20-foot high wall in the Rousseau Room of Hotel Contempo in front of a standing-room only audience in Art in Unexpected Places.",
      "shortname": "LaVonne_LaRue",
      "name": "LaVonne L. LaRue",
      "reknown": "Chicago, IL"
    },{
      "bio": "Constance received the Fullerton-Brighton-Norwell Award for Modern Art for her mixed-media image of a tree of life, with jewel-adorned branches depicting the arms of humanity, and precious gemstone-decorated leaves representing the spouting buds of togetherness. The daughter of a New York jeweler, Constance has been salvaging the discarded remnants of her father's jewelry-making since she was five years old, and won the New York State Fair grand prize at the age of 8 years old for a gem-adorned painting of the Manhattan Bridge.",
      "shortname": "Constance_Smith",
      "name": "Constance Olivia Smith",
      "reknown": "Fullerton-Brighton-Norwell Award"
    },{
      "bio": "A first-year student at the Roux Academy of Art, Media, and Design, Riley is already changing the face of modern art at the university. Riley's exquisite abstract pieces have no intention of ever being understood, but instead beg the viewer to dream, create, pretend, and envision with their mind's eye. Riley will be speaking on the 'Art of Abstract' during Thursday's schedule",
      "shortname": "Riley_Rewington",
      "name": "Riley Rudolph Rewington",
      "reknown": "Roux Academy of Art, Media, and Design"
    },{
      "bio": "A senior at the China International Art University, Xhou has become well-known for his miniature sculptures, often the size of a rice granule, that are displayed by rear projection of microscope images on canvas. Xhou will discuss the art and science behind his incredibly detailed works of art.",
      "shortname": "Xhou_Ta",
      "name": "Xhou Ta",
      "reknown": "China International Art University"
    }
  ]
}
//directives
angular.module('starter', [])
 
.directive('noScroll', function() {
    return {
        restrict: 'A',
        link: function($scope, $element, $attr) {
            $element.on('touchmove', function(e) {
                e.preventDefault();
            });
        }
    }
})
// DIRECTIVES
.directive("weatherReport", function() {
   return {
       restrict: 'E',
       templateUrl: 'directives/weatherReport.html',
       replace: true,
       scope: {
           weatherDay: "=",
           convertToStandard: "&",
           convertToDate: "&",
           dateFormat: "@"
       }
   }
})


//factories
angular.module('myapp.factories', [])

.factory('FeedLoader', function ($resource){
  return $resource('http://ajax.googleapis.com/ajax/services/feed/load', {}, {
    fetch: { method: 'JSONP', params: {v: '1.0', callback: 'JSON_CALLBACK'} }
  });
})

//page services
angular.module('pageservices', [])
.service('pageservice', function ( $http,$rootScope, $q){
   $rootScope = 'http://eurestkantine.com/wp-json/wp/v2/';
 this.getWordpressPage = function(page_slug) {
    var deferred = $q.defer();

    $http.get($rootScope + 'pages/' +  '?slug='+ page_slug )
    .success(function(data) {
      deferred.resolve(data);
    })
    .error(function(data) {
      deferred.reject(data);
    });
    return deferred.promise;
  };
  });























