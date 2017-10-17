var DJIParser =  module.exports = require("./lib");
var fs = require("fs");

var parser = new DJIParser();
var prefix = '<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2">    <Document id="feat_161">        <Placemark id="feat_162">            <name>track</name>            <gx:Track>';
var buffer = '';

parser.on("OSD", function(obj) {
  buffer += '<gx:coord>' + obj.getLongitude() + ' ' + obj.getLatitude() + ' ' + obj.getHeight() + '</gx:coord>';
});

parser.parse(fs.readFileSync("DJIFlightRecord_2015-06-10_[12-38-57].txt"));
//parser.parse(fs.readFileSync("DJIFlightRecord_2017-09-21_[15-37-52].txt"));

var suffix = '<altitudeMode>relativeToGround</altitudeMode></gx:Track></Placemark></Document></kml>';

console.log(prefix + buffer + suffix);