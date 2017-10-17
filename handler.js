'use strict';

const AWS = require('aws-sdk');
const S3 = new AWS.S3({
  signatureVersion: 'v4',
});
const DJIParser =  module.exports = require("./lib");

var parser = new DJIParser();
var prefix = '<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2">    <Document id="feat_161">        <Placemark id="feat_162">            <name>track</name>            <gx:Track>';
var suffix = '<altitudeMode>relativeToGround</altitudeMode></gx:Track></Placemark></Document></kml>';
var buffer = '';

parser.on("OSD", function(obj) {
  buffer += '<gx:coord>' + obj.getLongitude() + ' ' + obj.getLatitude() + ' ' + obj.getHeight() + '</gx:coord>';
});

const BUCKET = process.env.BUCKET;
const URL = process.env.URL;

exports.handler = function(event, context, callback) {
  const key = event.key;

  S3.getObject({Bucket: BUCKET, Key: Key}).promise()
    .then(data => parser.parse(data.Body);
    )
    .then(buffer => S3.putObject({
        Body: prefix + buffer + suffix,
        Bucket: BUCKET,
        ContentType: 'application/xml',
        Key: key,
      }).promise()
    )
    .then(() => callback(null, {
        statusCode: '200',
        body: 'OK',
      })
    )
    .catch(err => callback(err))
}
