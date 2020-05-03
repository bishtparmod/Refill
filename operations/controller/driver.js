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
 * Create driver
 * @param {*object} obj 
 * @param {*function} cb 
 */
var createDriver = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('users');
            var { _id, name, email: driver_email, password: driver_password, image, phone, age, vehicalName, vehicalNumber, licenseNumber, driver_full_address, driver_street_address, driver_city, driver_state, driver_country, driver_zipcode, driver_longitude, driver_latitude } = obj;
            const email = driver_email ? driver_email.toLowerCase() : '';

            randomPassword(email, driver_password, (password, slug) => {
                collection.find({ email }).toArray((err, data) => {
                    if (err) close(client, ERROR, err, cb);
                    else if (data && data.length === 0) {
                        generateToken(email, (userAccessToken, data) => {
                            if (userAccessToken) {
                                collection.insertOne({
                                    name,
                                    password,
                                    driverPassword: driver_password,
                                    email,
                                    image,
                                    phone,
                                    age,
                                    vehicalName,
                                    vehicalNumber,
                                    licenseNumber,
                                    address: {
                                        fullAddress: driver_full_address,
                                        street: driver_street_address,
                                        city: driver_city,
                                        state: driver_state,
                                        country: driver_country,
                                        zipcode: driver_zipcode,
                                    },
                                    location: {
                                        type: "Point",
                                        coordinates: [driver_longitude, driver_latitude]
                                    },
                                    createdBy: new ObjectId(_id),
                                    userType: DRIVER,
                                    userAccessToken,
                                    password,
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
 * Update Driver
 * @param {*object} obj 
 * @param {*function} cb 
 */
var updateDriver = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('users');
            var { driver_id, name, email: driver_email, image, phone, age, vehicalName, vehicalNumber, licenseNumber, driver_full_address, driver_street_address, driver_city, driver_state, driver_country, driver_zipcode, driver_latitude, driver_longitude } = obj;
            const email = driver_email ? driver_email.toLowerCase() : '';

            collection.updateOne({ _id: new ObjectId(driver_id) }, {
                $set: {
                    name,
                    email,
                    image,
                    phone,
                    age,
                    vehicalName,
                    vehicalNumber,
                    licenseNumber,
                    address: {
                        fullAddress: driver_full_address,
                        street: driver_street_address,
                        city: driver_city,
                        state: driver_state,
                        country: driver_country,
                        zipcode: driver_zipcode
                    },
                    location: {
                        type: "Point",
                        coordinates: [driver_longitude, driver_latitude]
                    },
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
 * Check driver
 * @param {*object} obj 
 * @param {*function} cb 
 */
var isValidDriver = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('users');
            var { driver_id } = obj;

            collection.find({ _id: new ObjectId(driver_id) }).toArray((err, data) => {
                if (err) close(client, ERROR, err, cb);
                else if (data && data.length) close(client, SUCCESS, data, cb);
                else close(client, NOVALUE, {
                    message: "No driver found."
                }, cb);
            });
        }
    })
}

/**
 * Check Driver email and mobile number
 * @param {*object} obj 
 * @param {*function} cb 
 */
var isValidDriverEmailAndMobileNumber = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('users');
            var { driver_id, phone, email: deriver_email } = obj;
            const email = deriver_email ? deriver_email.toLowerCase() : '';

            collection.find({ _id: { $ne: new ObjectId(driver_id) }, email: email }).toArray((err, data) => {
                if (err) close(client, ERROR, err, cb);
                else if (data && data.length === 0) {
                    collection.find({ _id: { $ne: new ObjectId(driver_id) }, phone: phone }).toArray((err, data) => {
                        if (err) close(client, ERROR, err, cb);
                        else if (data && data.length === 0) {
                            close(client, SUCCESS, data, cb);
                        } else if (data && data.length > 0) close(client, PHONE_PRESENT, {
                            message: "Phone number is already present"
                        }, cb);
                        else close(client, NOVALUE, {
                            message: "No data found"
                        }, cb);
                    });
                } else if (data && data.length > 0) close(client, EMAIL_PRESENT, {
                    message: "Email is already present"
                }, cb);
                else close(client, NOVALUE, {
                    message: "No data found"
                }, cb);
            });
        }
    })
}

/**
 * Get and Search driver
 * @param {*object} obj 
 * @param {*function} cb 
 */
var getAndSearchDriver = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('users');
            const { page, page_size, search } = obj;

            var _page = typeof page === "string" ? parseInt(page) : page;
            var _page_size = typeof page_size === "string" ? parseInt(page_size) : page_size;
            var skip = _page <= 0 ? 0 : (_page - 1) * _page_size;

            //Query
            var query = [
                {
                    $match: {
                        $expr: {
                            $and: [
                                {
                                    $eq: ["$status", ACTIVE]
                                },
                                {
                                    $eq: ["$userType", DRIVER]
                                }
                            ].concat(search ? [
                                {
                                    $ne: [{
                                        $indexOfCP: ["$name", search.toLowerCase()]
                                    }, -1]
                                }
                            ] : [])
                        }
                    },

                },
                { $sort: { "created_at": 1 } },
                { $skip: skip },
                { $limit: _page_size }
            ];

            collection.aggregate(query, (err, cursor) => {
                if (err) close(client, ERROR, err, cb);
                collection.find({ userType: DRIVER }).count((err, count) => {
                    if (err) {
                        close(client, ERROR, err, cb);
                        return;
                    }

                    cursor
                        .toArray((err, data) => {
                            if (err) close(client, ERROR, err, cb);
                            else close(client, SUCCESS, {
                                "totalItems": count,
                                "hasMore": count >= (skip + (_page_size + _page_size)),
                                "items": data
                            }, cb);
                        });
                });
            });
        }
    })
}

/** Driver data tables */

/**
 * Get drivers
 * @param {*object} obj 
 * @param {*function} cb 
 */
var getDrivers = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('users');
            const { draw, length, start } = obj;
            var _length = length ? typeof start === "string" ? parseInt(start) : start : 0;
            var _start = start ? typeof length === "string" ? parseInt(length) : length : 10;
            var _draw = draw ? typeof draw === 'string' ? parseInt(draw) : draw : 0;

            var sortQuery = {};
            var orderBy = obj['order[0][dir]'];
            switch (obj['order[0][column]']) {
                case '0':
                    // "_id"
                    sortQuery = {
                        _id: orderBy === "asc" ? 1 : -1
                    }
                    break;
                case '1':
                    // "name"
                    sortQuery = {
                        name: orderBy === "asc" ? 1 : -1
                    }
                    break;
                case '2':
                    // "created_at"
                    sortQuery = {
                        createdAt: orderBy === "asc" ? 1 : -1
                    }
                    break;
            }

            //Search query
            var search = obj && obj['search[value]'] ? obj['search[value]'] : '';
            //Query
            var query = [
                { $limit: _start },
                { $skip: _length },
                { $sort: sortQuery }
            ]
                .concat(search ? [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $eq: ["$userType", DRIVER]
                                    },
                                    {
                                        $eq: ["$deletedStatus", 0]
                                    },
                                    {
                                        $ne: [{
                                            $indexOfCP: [{ $toLower: "$name" }, search ? search.toLowerCase() : search]
                                        }, -1]
                                    }
                                ]
                            }
                        },

                    }
                ] : [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $eq: ["$userType", DRIVER]
                                        },
                                        {
                                            $eq: ["$deletedStatus", 0]
                                        }
                                    ]
                                }
                            },

                        }
                    ])
                .reverse();

            collection.aggregate(query, (err, cursor) => {
                if (err) close(client, DATA_TABLE_SUCCESS, {
                    "draw": _draw,
                    "recordsTotal": 0,
                    "recordsFiltered": 0,
                    "data": []
                }, cb);
                collection.find({ deletedStatus: 0, userType: DRIVER }).count((err, count) => {
                    if (err) {
                        close(client, DATA_TABLE_SUCCESS, {
                            "draw": _draw,
                            "recordsTotal": count,
                            "recordsFiltered": count,
                            "data": []
                        }, cb);
                        return;
                    }

                    cursor
                        .toArray((err, data) => {
                            if (err) close(client, DATA_TABLE_SUCCESS, {
                                "draw": _draw,
                                "recordsTotal": count,
                                "recordsFiltered": count,
                                "data": data
                            }, cb);
                            else close(client, DATA_TABLE_SUCCESS, {
                                "draw": _draw,
                                "recordsTotal": count,
                                "recordsFiltered": count,
                                "data": data
                            }, cb);
                        });
                });
            });
        }
    })
}

/** -------------------------------------------------------------- */

module.exports = {
    createDriver,
    updateDriver,
    isValidDriverEmailAndMobileNumber,
    isValidDriver,
    getDrivers,
    getAndSearchDriver
}