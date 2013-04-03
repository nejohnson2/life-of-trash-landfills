var express = require('express');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var request = require('request');



//var EPA = require('./epa_echo_full.json');


var app = express();

app.configure(function(){

  // server port number
  app.set('port', process.env.PORT || 5000);

  //  templates directory to 'views'
  app.set('views', __dirname + '/views');

  // setup template engine - we're using Hogan-Express
  app.set('view engine', 'html');
  app.set('layout','layout');
  app.engine('html', require('hogan-express')); // https://github.com/vol4ok/hogan-express

  app.use(express.favicon());
  // app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));

  // database - skipping until week 5
  app.db = mongoose.connect(process.env.MONGOLAB_URI);
  console.log("connected to database");
  
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

var routes = require('./routes/index.js');

app.get('/', routes.index);
app.get('/carto', routes.cartoGet);
app.post('/carto', routes.cartoPost);
app.get('/liveMapTest', routes.liveMapTest);
app.get('/json', routes.json);



http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

