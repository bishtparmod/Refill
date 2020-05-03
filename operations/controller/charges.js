var connection = require("../connection");
var {
    SUCCESS,
    ERROR,
    NOVALUE,
    PRESENT,
    ACTIVE,
    DATA_TABLE_SUCCESS,
    ADMIN,
    DEACTIVE,
    DRIVER,
    PHONE_PRESENT,
    EMAIL_PRESENT
} = require("../constant");
var {
    ObjectID,
    ObjectId
} = require("mongodb");
var {
    close,
    generateToken,
    randomPassword
} = require("../common");
var { getCollection } = require("./customer");

/**
 * Make Tax and Charges 
 * @param {*object} obj 
 * @param {*function} cb 
 */
var makeTax = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('order_tax_charges');
            var { _id, sales_tax, item_id } = obj;

            collection.find({ _id: ObjectId(item_id) }).toArray((err, data) => {
                if (err) close(client, ERROR, err, cb);
                else if (data && data.length) {
                    const { salesTax } = data[0];
                    collection.updateOne({ _id: ObjectId(item_id) }, {
                        $set: {
                            salesTax: sales_tax ? sales_tax : salesTax,
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
                } else close(client, NOVALUE, {
                    message: "No value found."
                }, cb);
            })
        }
    })
}

/**
 * Make Delivery Charges 
 * @param {*object} obj 
 * @param {*function} cb 
 */
var makeDeliveryCharges = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('order_tax_charges');
            var { _id, delivery_charges, delivery_charges_valid_limit, item_id } = obj;

            collection.find({ _id: ObjectId(item_id) }).toArray((err, data) => {
                if (err) close(client, ERROR, err, cb);
                else if (data && data.length) {
                    collection.updateOne({ _id: ObjectId(item_id) }, {
                        $set: {
                            deliveryCharges: delivery_charges,
                            deliveryChargesValidLimit: delivery_charges_valid_limit,
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
                } else close(client, NOVALUE, {
                    message: "No value found."
                }, cb);
            })
        }
    })
}

/**
 * Make Tax and Charges 
 * @param {*object} obj 
 * @param {*function} cb 
 */
var getTaxAndCharges = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('order_tax_charges');

            collection.find({}).toArray((err, data) => {
                if (err) close(client, ERROR, err, cb);
                else close(client, SUCCESS, data, cb);
            })
        }
    })
}

module.exports = {
    makeTax,
    makeDeliveryCharges,
    getTaxAndCharges
}