var server = require('./toneExample.js');
var port = process.env.PORT || process.env.VCAP_APP_PORT || 3000;

server.listen(port, function() {
  console.log('Server running on port: %d', port);
});
