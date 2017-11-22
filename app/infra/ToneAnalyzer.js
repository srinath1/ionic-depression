var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');

var tone_analyzer = new ToneAnalyzerV3({

    username: 'ea5a0727-769c-4c8c-aa8b-5521c378aa73',
    password: '7PA6sYyClY5J',
    version_date: '2016-05-19'

});

// var params = {'text': 'Eu estou muito nervoso', 'tones': 'emotion'};

function ToneAnalyzer() {}

ToneAnalyzer.prototype.analizar = function (item, callback) {
    tone_analyzer.tone({text: item.txtEntrada, tones: 'emotion'}, callback);
}

module.exports = function () {
    return ToneAnalyzer;
}
