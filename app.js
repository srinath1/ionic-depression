var http = require('http');
var bodyParser = require("body-parser");
var express = require('express');
var vision = require('@google-cloud/vision');
var fs = require('fs');
	
var formidable = require('formidable');
var router = express();

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());
router.post('/uploadpic',function(req,res){
        var visionClient = vision( {
  projectId: 'ionic-face-api',
  keyFilename:{
  "type": "service_account",
  "project_id": "ionic-face-api",
  "private_key_id": "d55b476d1081e3e78df368c5eb532c0c9212ed3a",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC6LZnrzFutilnB\nBAA4r6tZ7ET2b3UEOuMP8C9tkLv4g/mas/LBZx3krC3UPOSFvuFjGS21+X+KJ4f7\ndM87LhpKwC5A9iHsmLI9NeYSOx72GV1qQcBAsjJsO9T5wYUK6QDOoZaUUex5AbVq\n+KM48QiSWAG5NPZmrhQi4dtiS9g2Hu3kDq3RqswZuQRUjUe4Zwq8XSK2wZwl6tqp\nGYxZnyzvVgqwGFxUsgMzQypI8RLzCOguIQHBWeOVpg0HqXpAcGT+WGUvSgFbs3lm\n1BD+KQxutvLzQsXfXlxcOMb4WkzGKFUISWZFWe6sIC0QmOnwlJk6cMRo2hLv0GjO\nk0QaKXG3AgMBAAECggEABG+MTV7QUH68YwnIZdWeKuFFPigehpJxAAYc2ZExt7R/\nqBd/RoUWyr2HTmYbRf+N8rGFUA1hbKDca2AiL7VXHxckfJNE8INPxKGCe5u2yn8e\nrfOEnsxiOG3ePXHGd2Xpb6UDVpb75D7WRrolM0WbJGAgV3PMwElUeuNYfg3ANyoc\nrpmJG9n6YRlcOvRgNvPdExsBUvDDxDU3YXwKwdvYAviphLUB9MKVxHayT8cVh7B7\naBjDUjl3EoEG8y2PyL7uUQEgo9PTF8ege4lPPGJMiHr8iHc2R70J2O59mYUPwKZ7\nRQwvOiUeJgcRvi3ooWW7UAw4+DAJyQ65cLjm3nJc7QKBgQD0OrzrR1gCKHaeWFi+\nFS/SGbk1zLeNFq0/Ny1c33azECOX0OFF0/26wj03Z9JaEViAe80AT7ERk/pSwiFg\ntXV1jw7LqGylQnKuOgzHDCVTyWDCxKgN0pUgt1YhSpWhVXprairPVCqTvEZDQaQi\nP7oGZ16BzQEAtAxymzQwAck+AwKBgQDDJqLIl58+2W+mVt6gXLK1+H/zFnSqKZzH\nFsArHxPB5Ln+s11dpC07M904v7128y+tFwmxuMBSFdp3iXBKC0q/cLC2dfYq9ic5\nK7sAofIVLDpGoonO14gK5SjA3D0TNt1DmcKqeZMe+7JRe9ArAEBBPtH6Lx/rVXXq\nXdr5Es05PQKBgEz0PRa9ciOr8ERQfhXWwyymYk9rY+KW5JvonOiImPQu/6gUbwb7\nlxVDotpUYlly4boKSDvy4E4znEp7VN0OECasnvLY7PLdjxkKvX/yech+yXhVUsaY\nNdkLK55ty9v7/QjfeQG++XN3fYQvqLIJ9mmSJJstp0U7djieYsFFrs1VAoGBAJOA\nXWOebqfzcxdX65dr2Uv/Ur5qx61iHHTCdmdhau6PsiGYcsZ3dBSeY+Qj0NHah7ud\ngR9KVFr215SoVi4xEMNYKskOqgzY1ta4ffTBcxebwURoUB79+364rK/xB1zBiEYz\nLtbpY1D0z1gVbEdEPkzSbaVa/xZCFwkY/YxrMKDFAoGBAO5Ers8UoWqlYM4N6Zc5\nC84k8E2jlLI8Dokxlk38dEDpwrlsPnh+J9cuNmS+Uj3R5o2vmmrsRbe7t22bA1QS\nctECEWrsuwRyYiQL/xCA5worjsQJQ5jQvNNSnDvl0FgKdx1UwJsidKvSiy69IxzF\ngqqR2Rb8tmEjhBoCaaZRqSx1\n-----END PRIVATE KEY-----\n",
  "client_email": "ionicface@ionic-face-api.iam.gserviceaccount.com",
  "client_id": "108714999439108667232",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://accounts.google.com/o/oauth2/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/ionicface%40ionic-face-api.iam.gserviceaccount.com"
}
});
    var form = new formidable.IncomingForm();
	form.keepExtensions = true;
	
    form.parse(req, function(err, fields, files) {
		var params = {
			image_file: fs.createReadStream(files.image.path)
};
        var source = {
    gcsImageUri : params
};
var image = {
    source : source
};
var type = vision.v1.types.Feature.Type.FACE_DETECTION;
var featuresElement = {
    type : type
};
var features = [featuresElement];
var requestsElement = {
    image : image,
    features : features
};
var requests = [requestsElement];
visionClient.batchAnnotateImages({requests: requests}).then(function(responses) {
    var response = responses[0];
    var newresp=response.responses[0].faceAnnotations[0].detectionConfidence;
     var newresp1=response.responses[0].faceAnnotations[0].joyLikelihood;
    
   
    
      console.log(newresp1);
    // doThingsWith(response)
})
.catch(function(err) {
    console.error(err);
});
            
            
})
});
            


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
