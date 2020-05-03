var connection = require("../connection");
var {
    SUCCESS,
    ERROR,
    NOVALUE
} = require("../constant");
var {
    ObjectId
} = require("mongodb");
var {
    close
} = require("../common");

/**
 * Make Splash Screen 
 * @param {*object} obj 
 * @param {*function} cb 
 */
var createSplashScreen = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('content');
            var { splash_id, title, description, image } = obj;

            collection.updateOne({
                _id: ObjectId(splash_id)
            }, {
                $set: {
                    title,
                    description,
                    image,
                    updatedAt: new Date().toISOString()
                }
            }, (err, value) => {
                if (err) close(client, ERROR, err, cb);
                else {
                    const { result: data } = value;
                    if (data && data.n) {
                        close(client, SUCCESS, {
                            status: data && data.nModified >= 1 ? "Changed" : "Not Changed",
                            data: value,
                            message: data && data.nModified >= 1 ? "Changed successfully" : "Not updated"
                        }, cb);
                    } else close(client, NOVALUE, {
                        data: value.data,
                        message: "No value found."
                    }, cb);
                }
            });
        }
    })
}

/**
 * Get all splash screens
 * @param {*object} obj 
 * @param {*function} cb 
 */
var getAllSplashScreens = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('content');

            collection.find({}).toArray((err, data) => {
                if (err) close(client, ERROR, err, cb);
                else if (data && data.length) close(client, SUCCESS, data, cb);
                else close(client, NOVALUE, {
                    message: "No data available"
                }, cb);
            });
        }
    })
}

module.exports = {
    createSplashScreen,
    getAllSplashScreens
}