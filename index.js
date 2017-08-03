var fs = require('fs');
var parse = require('csv-parse');
//
// var csv = require('csv');
// var split = require('split');
//

var csv = require("fast-csv");

var express = require('express');
var app = express();
var axios = require('axios');
var GeoJSON = require('geojson');


app.get('/', function(req, res) {
    res.send('Hello World');
})

app.get('/listings', function(req, res) {
    var min_price = req.query.min_price || 0;
    var max_price = req.query.max_price || Number.MAX_VALUE;
    var min_bed = req.query.min_bed || 0;
    var max_bed = req.query.max_bed || Number.MAX_VALUE;
    var min_bath = req.query.min_bath || 0;
    var max_bath = req.query.max_bath || Number.MAX_VALUE;
    var dataArray = [];

    axios.get('https://s3.amazonaws.com/opendoor-problems/listing-details.csv')
    .then(function(response){
        csv
        .fromString(response.data, {headers: true})
        .on("data", function(data){
            // console.log(data);
            if (min_price <= data.price && data.price <= max_price
            && min_bed <= data.bedrooms && data.bedrooms <= max_bed
            && min_bath <= data.bathrooms && data.bathrooms <= max_bath) {
                dataArray.push(data);

            }

            // console.log(data);
        })
        .on("end", function(){
            var result = GeoJSON.parse(dataArray, {Point: ['lat', 'lng']});
            res.json(result);
            console.log(result);
            console.log("done");
        })
    })

})



app.listen(3000);
