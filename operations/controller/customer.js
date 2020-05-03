var connection = require("../connection");
var {
    SUCCESS,
    ERROR,
    NOVALUE,
    PRESENT,
    AUTH_USER_DATA,
    NOT_AUTHORIZED,
    USER,
    ADMIN,
    METHOD_TYPE_FORGOT_PASSWORD,
    ACTIVE,
    DEACTIVE,
    EMAIL_PRESENT,
    MANUAL_LOGIN_USER,
    SOCIAL_LOGIN_USER,

    ASCENDING_SORT,
    DESCENDING_SORT
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
var jwt = require('jsonwebtoken');
var common = require("../../operations/common");
var sendMail = require("../sendMail");

/**
 * Create customer
 * @param {*object} obj 
 * @param {*function} cb 
 */
var customerSignup = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('users');
            var { customer_name, customer_email, customer_password, customer_phone, customer_company_address, customer_created_by, customer_ip, customer_device, customer_notes, customer_shipping_full_address, customer_shipping_street_address, customer_shipping_city, customer_shipping_state, customer_shipping_country, customer_shipping_zip_code, customer_shipping_latitude, customer_shipping_longitude, customer_billing_full_address, customer_billing_street_address, customer_billing_city, customer_billing_state, customer_billing_country, customer_billing_zip_code, customer_billing_latitude, customer_billing_longitude } = obj;
            const email = customer_email ? customer_email.toLowerCase() : '';

            randomPassword(email, customer_password, (password, slug) => {
                collection.find({ email }).toArray((err, data) => {
                    if (err) close(client, ERROR, err, cb);
                    else if (data && data.length === 0) {
                        generateToken(email, (userAccessToken, data) => {
                            if (userAccessToken) {
                                collection.insertOne({
                                    name: customer_name,
                                    email: email,
                                    phone: customer_phone,
                                    createdBy: customer_created_by,
                                    ip: customer_ip,
                                    device: customer_device,
                                    notes: customer_notes,
                                    userAccessToken,
                                    password,
                                    userType: USER,
                                    type: MANUAL_LOGIN_USER,
                                    shippingAddress: {
                                        fullAddress: customer_shipping_full_address,
                                        street: customer_shipping_street_address,
                                        city: customer_shipping_city,
                                        state: customer_shipping_state,
                                        country: customer_shipping_country,
                                        zipCode: customer_shipping_zip_code,
                                        location: {
                                            type: "Point",
                                            coordinates: [customer_shipping_longitude, customer_shipping_latitude]
                                        }
                                    },
                                    billingAddress: {
                                        fullAddress: customer_billing_full_address,
                                        street: customer_billing_street_address,
                                        city: customer_billing_city,
                                        state: customer_billing_state,
                                        country: customer_billing_country,
                                        zipCode: customer_billing_zip_code,
                                        location: {
                                            type: "Point",
                                            coordinates: [customer_billing_longitude, customer_billing_latitude]
                                        }
                                    },
                                    deletedStatus: 0,
                                    status: ACTIVE,
                                    slug,
                                    createdAt: new Date().toISOString(),
                                    updatedAt: new Date().toISOString()
                                }).then((data) => {
                                    getCollection(collection, { email }, { password: 0, slug: 0 }, client, cb);
                                });
                            } else close(client, ERROR, {
                                message: "Unable to generate access token, please try again."
                            }, cb);
                        })
                    } else close(client, PRESENT, {}, cb);
                });
            })
        }
    })
}

/**
 * Create customer
 * @param {*object} obj 
 * @param {*function} cb 
 */
var createCustomer = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('users');
            var { customer_email, customer_password, customer_ip, customer_device } = obj;
            const email = customer_email ? customer_email.toLowerCase() : '';

            randomPassword(email, customer_password, (password, slug) => {
                collection.find({ email }).toArray((err, data) => {
                    if (err) close(client, ERROR, err, cb);
                    else if (data && data.length === 0) {
                        generateToken(email, (userAccessToken, data) => {
                            if (userAccessToken) {
                                collection.insertOne({
                                    email,
                                    ip: customer_ip,
                                    userAccessToken,
                                    password,
                                    device_token: customer_device,
                                    userType: USER,
                                    type: MANUAL_LOGIN_USER,
                                    deletedStatus: 0,
                                    status: ACTIVE,
                                    slug,
                                    createdAt: new Date().toISOString(),
                                    updatedAt: new Date().toISOString()
                                }).then((data) => {
                                    getCollection(collection, { email }, { password: 0, slug: 0, type: 0 }, client, cb);
                                });
                            } else close(client, ERROR, {
                                message: "Unable to generate access token, please try again."
                            }, cb);
                        })
                    } else close(client, PRESENT, {}, cb);
                });
            })
        }
    })
}

/**
 * Edit customer billing and shipping address
 * @param {*object} obj 
 * @param {*function} cb 
 */
var editCustomerBillingAndShippingAddress = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('users');
            var {
                _id,

                customer_shipping_name,
                customer_shipping_phone,
                customer_shipping_full_address,
                customer_shipping_city,
                customer_shipping_state,
                customer_shipping_country,
                customer_shipping_zip_code,
                customer_shipping_latitude,
                customer_shipping_longitude,

                customer_billing_name,
                customer_billing_phone,
                customer_billing_full_address,
                customer_billing_city,
                customer_billing_state,
                customer_billing_country,
                customer_billing_zip_code,
                customer_billing_latitude,
                customer_billing_longitude,

                is_add_billing_address_as_shipping_address
            } = obj;

            collection.find({ _id: new ObjectId(_id) }).toArray((err, data) => {
                if (err) close(client, ERROR, err, cb);
                else if (data && data.length !== 0) {
                    collection.updateOne({ _id: new ObjectId(_id) },
                        {
                            $set: {
                                shippingAddress: {
                                    name: customer_shipping_name,
                                    phone: customer_shipping_phone,
                                    fullAddress: customer_shipping_full_address,
                                    city: customer_shipping_city,
                                    state: customer_shipping_state,
                                    country: customer_shipping_country,
                                    zipCode: customer_shipping_zip_code,
                                    location: {
                                        type: "Point",
                                        coordinates: [customer_shipping_longitude, customer_shipping_latitude]
                                    }
                                },
                                billingAddress: {
                                    name: customer_billing_name,
                                    phone: customer_billing_phone,
                                    fullAddress: customer_billing_full_address,
                                    city: customer_billing_city,
                                    state: customer_billing_state,
                                    country: customer_billing_country,
                                    zipCode: customer_billing_zip_code,
                                    location: {
                                        type: "Point",
                                        coordinates: [customer_billing_longitude, customer_billing_latitude]
                                    }
                                },
                                is_add_billing_address_as_shipping_address,
                                updatedAt: new Date().toISOString()
                            }
                        }, (err, value) => {
                            if (err) close(client, ERROR, err, cb);
                            else {
                                const { result: data } = value;
                                if (data && data.n) {
                                    getCollection(collection, { _id: new ObjectId(_id) }, { password: 0, slug: 0 }, client, cb);
                                } else close(client, NOVALUE, {
                                    data: value.data,
                                    message: "No value found."
                                }, cb);
                            }
                        });
                } else close(client, NOVALUE, {}, cb);
            });
        }
    })
}

/**
 * social login
 * @param {*object} obj 
 * @param {*function} cb 
 */
var socialLogin = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('users');
            var { email: customer_email, social_id: customer_social_id, social_name: customer_social_name, social_image: customer_social_image, device: customer_device, ip: customer_ip } = obj;
            const email = customer_email ? customer_email.toLowerCase() : '';

            collection.find({ email, social_id: { $ne: customer_social_id } }).toArray((err, data) => {
                if (err) close(client, ERROR, err, cb);
                else if (data && data.length === 0) {
                    collection.find({ social_id: customer_social_id }).toArray((err, data) => {
                        if (err) close(client, ERROR, err, cb);
                        else if (data && data.length === 0) {
                            generateToken(email, (userAccessToken, data) => {
                                if (userAccessToken) {
                                    collection.insertOne({
                                        email,
                                        social_id: customer_social_id,
                                        ip: customer_ip,
                                        name: customer_social_name,
                                        device_token: customer_device,
                                        image: customer_social_image,
                                        userAccessToken,
                                        userType: USER,
                                        type: SOCIAL_LOGIN_USER,
                                        deletedStatus: 0,
                                        status: ACTIVE,
                                        createdAt: new Date().toISOString(),
                                        updatedAt: new Date().toISOString()
                                    }).then((data) => {
                                        getCollection(collection, { social_id: customer_social_id }, { ip: 0, type: 0 }, client, cb);
                                    });
                                } else close(client, ERROR, {
                                    message: "Unable to generate access token, please try again."
                                }, cb);
                            })
                        } else getCollection(collection, { social_id: customer_social_id }, { ip: 0, type: 0 }, client, cb);
                    });
                } else close(client, EMAIL_PRESENT, {}, cb);
            });
        }
    })
}

/** 
 * Get Collection data with respective find object
 */
var getCollection = (collection, query, projection, client, cb) => {
    collection.find(query, { projection }).toArray((err, data) => {
        if (err) close(client, ERROR, err, cb);
        else if (data && data.length !== 0) {
            const { userAccessToken, token, ...rest } = data[0];
            jwt.sign({ ...rest }, userAccessToken, { expiresIn: 24 * 60 * 60 }, (err, token) => {
                if (err) close(client, ERROR, err, cb);
                else {
                    close(client, SUCCESS, {
                        ...rest,
                        user_token: token
                    }, cb);
                }
            });
        } else close(client, NOVALUE, {}, cb);
    });
}

/**
 * Search users
 * @param {*object} obj 
 * @param {*function} cb 
 */
var searchUsers = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('orders');
            let { page, page_size, search, sort = ASCENDING_SORT, _id } = obj;

            page_size = page_size ? page_size : 10;
            page = page ? page : 1;
            var skip = (!page || (page === 1 || page === 0)) ? 0 : (page - 1) * page_size;

            //Query
            var query = [
                {
                    $addFields: {
                        name: { $cond: { if: "$customerDetail.name", then: { $toLower: "$customerDetail.name" }, else: null } }
                    }
                },
                {
                    $addFields: {
                        user_id: { $cond: { if: "$customerDetail._id", then: "$customerDetail._id", else: null } }
                    }
                },
                {
                    $addFields: {
                        email: { $cond: { if: "$customerDetail.email", then: { $toLower: "$customerDetail.email" }, else: null } }
                    }
                },
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: ["$assigned_driver_id", new ObjectId(_id)] }
                            ].concat(search ? [
                                { $ne: ["$name", undefined] },
                                { $ne: ["$name", null] },
                                {
                                    $ne: [{
                                        $indexOfCP: ["$name", search.toLowerCase()]
                                    }, -1]
                                }
                            ] : [])
                        }
                    },

                },
                {
                    $project: {
                        _id: "$user_id",
                        name: 1,
                        email: 1
                    }
                },
                { $sort: { "updatedAt": ASCENDING_SORT === sort ? 1 : -1 } },
                { $skip: skip },
                { $limit: page_size }
            ];

            collection.aggregate(query, (err, cursor) => {
                if (err) close(client, ERROR, err, cb);
                else cursor
                    .toArray((err, data) => {
                        if (err) close(client, ERROR, err, cb);
                        else {
                            let users = [];

                            if (data && data.length) {
                                users = data.filter((ele, index) => data.findIndex(user => user._id.toString() === ele._id.toString()) === index);
                            }

                            close(client, SUCCESS, users, cb);
                        }
                    });
            });
        }
    })
}

module.exports = {
    customerSignup,
    getCollection,
    createCustomer,
    socialLogin,
    editCustomerBillingAndShippingAddress,
    searchUsers
}