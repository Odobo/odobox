/*

 The MIT License (MIT)
 Copyright (c) 2016 Odobo Limited

 Permission is hereby granted, free of charge, to any person obtaining a copy of
 this software and associated documentation files (the "Software"), to deal in the
 Software without restriction, including without limitation the rights to use, copy,
 modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
 and to permit persons to whom the Software is furnished to do so, subject to the
 following conditions:

 The above copyright notice and this permission notice shall be included in all copies
 or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 DEALINGS IN THE SOFTWARE.

 */
var MongoClient = require("vertx-mongo-js/mongo_client");

module.exports = MongoClientObj;

function MongoClientObj(host, port, dbName, poolname) {
    this.collectionName = null;
    this.mongoClient = MongoClient.createShared(vertx, {
        "connection_string": "mongodb://" + host + ":" + port,
        "db_name": dbName
    }, poolname);

    if ( this.mongoClient ) {
        console.log("Connected to MongoDB @ " + host + ":" + port + "/" + dbName);
    } else {
        throw "MongoClient could not be instantiated";
    }
};


MongoClientObj.prototype.saveObjectToDB = function(object, colName, cb) {
    var collectionName = colName ? colName : this.collectionName;

    this.mongoClient.save(collectionName, object, function (id, err) {
        if (!err && !id) {
            id = object._id;
        }
        cb(id, err);
    });
};

MongoClientObj.prototype.getDocumentsFromDB = function(query, colName, cb) {
    var collectionName = colName ? colName : this.collectionName;
    var queryResults = [];

    this.mongoClient.find(collectionName, query, function (res, res_err) {
        if (!res_err) {
            if (res.length > 0) {
                Array.prototype.forEach.call(res, function(doc) {
                    queryResults.push(doc);
                });
                query._id ? cb(queryResults[0]) : cb(queryResults);
            } else {
                cb(null, {statusCode: 404, message: "ERROR: Doc from '" + collectionName + "' not found: " + query});
            }
        } else {
            console.error("Error when fetching from '" + collectionName + "' the doc: " + query);
            cb(null, {statusCode: 500, message: res_err.message});
        }
    });
};

MongoClientObj.prototype.removeDocumentsFromDB = function(query, colName, cb) {
    var collectionName = colName ? colName : this.collectionName;

    this.mongoClient.remove(collectionName, query, function(res, err) {
        if ( cb ) {
            cb(res, err);
        }
    });
}