"use strict"

let express = require("express");
let bodyParser = require('body-parser');
let routes  = require('./routes');
let path = require('path');
var util = require('util');
let ejs = require('ejs');
const prismic  = require('./api/prismic');
let app = express();

let moltin = require('moltin')({
  publicId: 'gSeDLjpiuZ6myThZIdAQDMqHKqRDJ1jIdJRN1wTQFh',
  secretKey: '4mu6CUANi0P8cAwG90cKyB2RLl1J5K5fgQQVOH21lz'
});


app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/../client');
app.use( express.static(__dirname + "/../client") );
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies






app.get('/api/prismic/get/single', function(req, res){
  prismic.getSingle(req, res);
});

app.get('/api/prismic/get/all', function(req, res){
  prismic.getAll(req, res);
});





app.get('/api/prismic/get/type', function(req, res){
  prismic.getType(req, res);
});





    // app.get('/partials/:name', routes.partials);
    //
    // // redirect all others to the index (HTML5 history)



    // function requestGateway(req, res){
    //   Moltin.Gateway.List(null, function(gateways) {
    //   console.log(gateways);
    //     }, function(error) {
    //       // Something went wrong...
    //     });
    // }

    app.get('*', routes.index);


    app.listen(8081, () => console.log("listening on 8081"));
