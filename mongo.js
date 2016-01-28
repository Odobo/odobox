/**
 * Created by cristinaionescu on 26/01/2016.
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
            cb(object);
        } else {
            console.log("ERR " + err);
            cb(err);
        }
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
                cb({statusCode: 404, message: "ERROR: Doc from '" + collectionName + "' not found: " + query});
            }
        } else {
            console.error("Error when fetching from '" + collectionName + "' the doc: " + query);
            cb({statusCode: 500, message: res_err.message});
        }
    });
};