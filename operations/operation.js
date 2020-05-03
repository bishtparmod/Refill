var connection = require("./connection");
var {
    SUCCESS,
    ERROR,
    NOVALUE,
    PRESENT,
    EMAIL_PRESENT,
    PHONE_PRESENT,
    AUTH_USER_DATA,
    NOT_AUTHORIZED,
    USER,
    ADMIN,
    DRIVER,
    METHOD_TYPE_FORGOT_PASSWORD,
    ACTIVE,
    DEACTIVE,
    DATA_TABLE_SUCCESS,

    ANDROID_PLATFORM,
    IOS_PLATFORM
} = require("./constant");
var {
    ObjectID,
    ObjectId
} = require("mongodb");
var {
    close,
    generateToken,
    randomPassword
} = require("./common");
var jwt = require('jsonwebtoken');
var common = require("../operations/common");
var sendMail = require("./sendMail");

/**
 * Post report
 * @param {*object} obj 
 * @param {*function} cb 
 */
var login = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('users');
            var { email, password } = obj;
            email = email ? email.toLowerCase() : email;
            collection.find({ email, userType: ADMIN }).toArray((err, data) => {
                if (err) close(client, ERROR, err, cb);
                else if (data && data.length !== 0) {
                    const { slug } = data[0];
                    randomPassword(slug, password, (password, slug) => {
                        collection.find({ email, password }, {
                            projection: {
                                password: 0,
                                slug: 0
                            }
                        }).toArray((err, data) => {
                            if (err) close(client, ERROR, err, cb);
                            else if (data && data.length !== 0) {
                                const { userAccessToken, ...rest } = data[0];
                                jwt.sign({ ...rest }, userAccessToken, { expiresIn: 24 * 60 * 60 }, (err, token) => {
                                    if (err) close(client, ERROR, err, cb);
                                    else close(client, SUCCESS, {
                                        ...rest,
                                        user_token: token
                                    }, cb);
                                });
                            }
                            else close(client, NOT_AUTHORIZED, {
                                message: "Either email or password is incorrect."
                            }, cb);
                        });
                    });
                }
                else close(client, NOT_AUTHORIZED, {
                    message: "Either email or password is incorrect."
                }, cb);
            });
        }
    })
}

/**
 * Customer login
 * @param {*object} obj 
 * @param {*function} cb 
 */
var customerLogin = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('users');
            var { email, password } = obj;
            email = email ? email.toLowerCase() : email;
            collection.find({ email, userType: USER }).toArray((err, data) => {
                if (err) close(client, ERROR, err, cb);
                else if (data && data.length !== 0) {
                    const { slug } = data[0];
                    randomPassword(slug, password, (password, slug) => {
                        collection.find({ email, password }, {
                            projection: {
                                password: 0,
                                slug: 0
                            }
                        }).toArray((err, data) => {
                            if (err) close(client, ERROR, err, cb);
                            else if (data && data.length !== 0) {
                                const { userAccessToken, ...rest } = data[0];
                                jwt.sign({ ...rest }, userAccessToken, { expiresIn: 24 * 60 * 60 }, (err, token) => {
                                    if (err) close(client, ERROR, err, cb);
                                    else close(client, SUCCESS, {
                                        ...rest,
                                        user_token: token
                                    }, cb);
                                });
                            }
                            else close(client, NOT_AUTHORIZED, {
                                message: "Either email or password is incorrect."
                            }, cb);
                        });
                    });
                }
                else close(client, NOT_AUTHORIZED, {
                    message: "Either email or password is incorrect."
                }, cb);
            });
        }
    })
}

/**
 * Driver login
 * @param {*object} obj 
 * @param {*function} cb 
 */
var driverLogin = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('users');
            email = email ? email.toLowerCase() : email;
            var { email, password } = obj;
            collection.find({ email, userType: DRIVER }).toArray((err, data) => {
                if (err) close(client, ERROR, err, cb);
                else if (data && data.length !== 0) {
                    const { slug } = data[0];
                    randomPassword(slug, password, (password, slug) => {
                        collection.find({ email, password }, {
                            projection: {
                                password: 0,
                                slug: 0
                            }
                        }).toArray((err, data) => {
                            if (err) close(client, ERROR, err, cb);
                            else if (data && data.length !== 0) {
                                const { userAccessToken, ...rest } = data[0];
                                jwt.sign({ ...rest }, userAccessToken, { expiresIn: 24 * 60 * 60 }, (err, token) => {
                                    if (err) close(client, ERROR, err, cb);
                                    else close(client, SUCCESS, {
                                        ...rest,
                                        user_token: token
                                    }, cb);
                                });
                            }
                            else close(client, NOT_AUTHORIZED, {
                                message: "Either email or password is incorrect."
                            }, cb);
                        });
                    });
                }
                else close(client, NOT_AUTHORIZED, {
                    message: "Either email or password is incorrect."
                }, cb);
            });
        }
    })
}

/**
 * Create admin
 * @param {*object} obj 
 * @param {*function} cb 
 */
var adminSignup = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('users');
            var { name, password, email } = obj;
            randomPassword(email, password, (password, slug) => {
                collection.find({ email }).toArray((err, data) => {
                    if (err) close(client, ERROR, err, cb);
                    else if (data && data.length === 0) {
                        generateToken(email, (userAccessToken, data) => {
                            if (userAccessToken) {
                                collection.insertOne({
                                    name,
                                    email: email ? email.toLowerCase() : '',
                                    userAccessToken,
                                    password,
                                    userType: ADMIN,
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

/** Session Login */
var sessionLogin = (obj, cb) => {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('users');
            const { _id } = obj;
            getCollection(collection, { _id: new ObjectId(_id) }, { password: 0, slug: 0 }, client, cb);
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

/** Verify json token */
var verifyJsonToken = (req, res, next) => {
    var user_token;
    const { user_token: user_token_via_body } = req.body;

    user_token = user_token_via_body;

    if (!user_token) {
        const { user_token: user_token_via_query } = req.query;
        user_token = user_token_via_query;
    }

    if (!user_token) {
        const { user_token: user_token_via_params } = req.params;
        user_token = user_token_via_params;
    }

    const { payload } = jwt.decode(user_token, {
        complete: true
    });

    getUserViaId(payload, (status, response) => {
        if (status === SUCCESS) {
            const { userAccessToken, ...rest } = response;
            jwt.verify(user_token, userAccessToken, (err, decoded) => {
                if (err) common.httpResponse(req, res, ERROR, err);
                else {
                    const { userType } = decoded;

                    if (userType === USER || userType === ADMIN) {
                        req[AUTH_USER_DATA] = decoded;
                        next();
                    } else {
                        common.httpResponse(req, res, NOT_AUTHORIZED, {
                            message: "Not valid user token detected"
                        });
                    }
                }
            });
        } else common.httpResponse(req, res, NOVALUE, response);
    });
}

/** Verify json token and admin */
var verifyJsonTokenAndAdmin = (req, res, next) => {
    var user_token;
    const { user_token: user_token_via_body } = req.body;

    user_token = user_token_via_body;

    if (!user_token) {
        const { user_token: user_token_via_query } = req.query;
        user_token = user_token_via_query;
    }

    if (!user_token) {
        const { user_token: user_token_via_params } = req.params;
        user_token = user_token_via_params;
    }

    const { payload } = jwt.decode(user_token, {
        complete: true
    });

    getUserViaId(payload, (status, response) => {
        if (status === SUCCESS) {
            const { userAccessToken, ...rest } = response;
            jwt.verify(user_token, userAccessToken, (err, decoded) => {
                if (err) common.httpResponse(req, res, ERROR, err);
                else {
                    const { userType } = decoded;

                    if (userType === ADMIN) {
                        req[AUTH_USER_DATA] = decoded;
                        next();
                    } else {
                        common.httpResponse(req, res, NOT_AUTHORIZED, {
                            message: "User is not admin"
                        });
                    }
                }
            });
        } else common.httpResponse(req, res, NOVALUE, {
            message: "Token is not available in records"
        });
    });
}

/** Verify json token and driver */
var verifyJsonTokenAndDriver = (req, res, next) => {
    var user_token;
    const { user_token: user_token_via_body } = req.body;

    user_token = user_token_via_body;

    if (!user_token) {
        const { user_token: user_token_via_query } = req.query;
        user_token = user_token_via_query;
    }

    if (!user_token) {
        const { user_token: user_token_via_params } = req.params;
        user_token = user_token_via_params;
    }

    const { payload } = jwt.decode(user_token, {
        complete: true
    });

    getUserViaId(payload, (status, response) => {
        if (status === SUCCESS) {
            const { userAccessToken, ...rest } = response;
            jwt.verify(user_token, userAccessToken, (err, decoded) => {
                if (err) common.httpResponse(req, res, ERROR, err);
                else {
                    const { userType } = decoded;

                    if (userType === DRIVER) {
                        req[AUTH_USER_DATA] = decoded;
                        next();
                    } else {
                        common.httpResponse(req, res, NOT_AUTHORIZED, {
                            message: "User is not driver"
                        });
                    }
                }
            });
        } else common.httpResponse(req, res, NOVALUE, response);
    });
}

/** Verify json token with socket */
var verifyJsonTokenWithSocket = (data, cb) => {
    const { user_token } = data;

    const { payload } = jwt.decode(user_token, {
        complete: true
    });

    getUserViaId(payload, (status, response) => {
        if (status === SUCCESS) {
            const { userAccessToken, ...rest } = response;
            jwt.verify(user_token, userAccessToken, (err, decoded) => {
                if (err) cb(ERROR, err);
                else cb(SUCCESS, decoded);
            });
        } else common.httpResponse(req, res, NOVALUE, response);
    });
}

/** 
 * Forgot password
 */
var forgotPassword = (obj, cb) => {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('users');
            const { email } = obj;
            collection.find({ email }).toArray((err, data) => {
                if (err) close(client, ERROR, err, cb);
                else if (data && data.length !== 0) {
                    const user = data[0];

                    if (user && user.email) {
                        close(client, SUCCESS, data[0], cb);
                    } else close(client, NOVALUE, {
                        message: "User email is not present."
                    }, cb);
                } else close(client, NOVALUE, {
                    message: "User data is not available"
                }, cb);
            });
        }
    })
}

/** 
 * Confirm change password user data
 */
var changePasswordConfirmData = (obj, cb) => {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('users');
            const { email, password } = obj;
            randomPassword(email, password, (password, slug) => {
                collection.find({ email, password }, {
                    projection: {
                        password: 0,
                        slug: 0
                    }
                }).toArray((err, data) => {
                    if (err) close(client, ERROR, err, cb);
                    else if (data && data.length !== 0) {
                        close(client, SUCCESS, data[0], cb);
                    }
                    else close(client, NOVALUE, {
                        message: "User data is not available"
                    }, cb);
                });
            });
        }
    })
}

/** 
 * Reset Password
 */
var resetPassword = (obj, cb) => {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('users');
            const { id } = obj;
            collection.find({ _id: new ObjectId(id) }, {
                projection: {
                    password: 0,
                    slug: 0
                }
            }).toArray((err, data) => {
                if (err) close(client, ERROR, err, cb);
                else if (data && data.length !== 0) {
                    close(client, SUCCESS, data[0], cb);
                }
                else close(client, NOVALUE, {
                    message: "User data is not available"
                }, cb);
            });
        }
    })
}

/** 
 * Change Password
 */
var changePassword = (obj, cb) => {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('users');

            var { _id, email, password, type } = obj;
            var random_password = password;
            console.log("password ===> ", random_password);
            randomPassword(email, password, (password, slug) => {
                collection.updateOne({ _id: new ObjectId(_id) }, {
                    $set: {
                        password,
                        updatedAt: new Date().toISOString(),
                        reset_password: type === METHOD_TYPE_FORGOT_PASSWORD ? ACTIVE : DEACTIVE
                    }
                }, (err, value) => {
                    if (err) close(client, ERROR, err, cb);
                    else {
                        const { result: data } = value;
                        if (data && data.n) {
                            if (type === METHOD_TYPE_FORGOT_PASSWORD)
                                sendMail.forgetPassword({
                                    randomPassword: random_password,
                                    email
                                }, (status, data) => {
                                    if (status === 'err') close(client, SUCCESS, {
                                        status: data && data.nModified >= 1 ? "Changed" : "Not Changed",
                                        data: err,
                                        message: "MailNotSent"
                                    }, cb);
                                    if (status === 'sent') {
                                        close(client, SUCCESS, {
                                            status: data && data.nModified >= 1 ? "Changed" : "Not Changed",
                                            data: value,
                                            message: data && data.nModified >= 1 ? "Changed successfully" : "Not updated"
                                        }, cb);
                                    }
                                });
                            else close(client, SUCCESS, {
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
            })
        }
    })
}

/**
 * Logout
 * @param {*object} obj 
 * @param {*function} cb 
 */
var logout = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('users');
            var { _id, email } = obj;
            generateToken(email, (userAccessToken, data) => {
                if (userAccessToken) {
                    collection.updateOne({ _id: new ObjectId(_id) }, {
                        $set: {
                            userAccessToken,
                            updatedAt: new Date().toISOString(),
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
                } else close(client, ERROR, {
                    message: "Unable to generate access token, please try again."
                }, cb);
            })
        }
    })
}

/** 
 * Get user via id
 */
var getUserViaId = (obj, cb) => {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('users');
            const { _id } = obj;
            collection.find({ _id: new ObjectId(_id) }, {
                projection: {
                    password: 0,
                    slug: 0
                }
            }).toArray((err, data) => {
                if (err) close(client, ERROR, err, cb);
                else if (data && data.length !== 0) {
                    close(client, SUCCESS, data[0], cb);
                }
                else close(client, NOVALUE, err, cb);
            });
        }
    })
}

/**
 * Get users
 * @param {*object} obj 
 * @param {*function} cb 
 */
var getUsers = function (obj, cb) {
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
                                        $eq: ["$userType", USER]
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
                                            $eq: ["$userType", USER]
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
                collection.find({ deletedStatus: 0, userType: USER }).count((err, count) => {
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

/**
 * Export all users csv file
 * @param {*object} obj 
 * @param {*function} cb 
 */
var exportAllUsers = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('users');

            collection.aggregate([
                {
                    $match: {
                        $expr: {
                            $or: [
                                {
                                    $eq: ["$userType", USER]
                                }
                            ]
                        }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1
                    }
                }
            ], (err, cursor) => {
                if (err) close(client, ERROR, err, cb);
                else cursor.toArray((err, data) => {
                    if (err) close(client, ERROR, err, cb);
                    else if (data && data.length !== 0) close(client, SUCCESS, data, cb);
                    else close(client, NOVALUE, data, cb);
                });
            });
        }
    })
}


/**
 * Disable user
 * @param {*object} obj 
 * @param {*function} cb 
 */
var disableUser = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('users');
            var { user_id } = obj;

            checkUser(collection, {
                _id: new ObjectId(user_id)
            }, client, cb, () => {
                collection.updateOne({
                    _id: new ObjectId(user_id)
                }, {
                    $set: {
                        status: DEACTIVE,
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
            });
        }
    })
}

/**
 * Enable user
 * @param {*object} obj 
 * @param {*function} cb 
 */
var enableUser = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('users');
            var { user_id } = obj;

            checkUser(collection, {
                _id: new ObjectId(user_id)
            }, client, cb, () => {
                collection.updateOne({
                    _id: new ObjectId(user_id)
                }, {
                    $set: {
                        status: ACTIVE,
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
            });
        }
    })
}

/**
 * Check for user info
 */
var checkUser = function (collection, query, client, cb, callback) {
    collection.find(query).toArray((err, data) => {
        if (err) close(client, ERROR, err, cb);
        else if (data && data.length !== 0) {
            callback();
        } else close(client, NOVALUE, {
            message: "No Value"
        }, cb);
    });
}

/**
 * Update User
 * @param {*object} obj 
 * @param {*function} cb 
 */
var updateUser = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('users');
            var { user_id, customer_name, customer_email, customer_phone, customer_shipping_full_address, customer_shipping_city, customer_shipping_state, customer_shipping_country, customer_shipping_zip_code, customer_shipping_latitude, customer_shipping_longitude, customer_billing_full_address, customer_billing_city, customer_billing_state, customer_billing_country, customer_billing_zip_code, customer_billing_latitude, customer_billing_longitude } = obj;
            const email = customer_email ? customer_email.toLowerCase() : '';

            collection.updateOne({ _id: new ObjectId(user_id) }, {
                $set: {
                    name: customer_name,
                    email: email,
                    phone: customer_phone,
                    shippingAddress: {
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
 * Check User
 * @param {*object} obj 
 * @param {*function} cb 
 */
var isValidUser = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('users');
            var { user_id } = obj;

            collection.find({ _id: new ObjectId(user_id) }, { password: 0, slug: 0, userAccessToken: 0 }).toArray((err, data) => {
                if (err) close(client, ERROR, err, cb);
                else if (data && data.length) close(client, SUCCESS, data[0], cb);
                else close(client, NOVALUE, {
                    message: "No user found."
                }, cb);
            });
        }
    })
}

/**
 * Check User email and mobile number
 * @param {*object} obj 
 * @param {*function} cb 
 */
var isValidUserEmailAndMobileNumber = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('users');
            var { user_id, customer_phone, customer_email } = obj;
            const email = customer_email ? customer_email.toLowerCase() : '';

            collection.find({ _id: { $ne: new ObjectId(user_id) }, email: email }).toArray((err, data) => {
                if (err) close(client, ERROR, err, cb);
                else if (data && data.length === 0) {
                    collection.find({ _id: { $ne: new ObjectId(user_id) }, phone: customer_phone }).toArray((err, data) => {
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
 * Update device token
 */
var updateDeviceToken = (obj, cb) => {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('device_tokens');

            var { _id, device_token, platform } = obj;

            collection.find({ user_id: new ObjectId(_id) }).toArray((err, tokensData) => {
                if (err) close(client, ERROR, err, cb);
                else if (tokensData && tokensData.length === 0) {
                    collection.insert({
                        user_id: new ObjectId(_id),
                        devices: [
                            {
                                type: platform,
                                token: device_token
                            }
                        ],
                        createAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    }, (err, value) => {
                        if (err) close(client, ERROR, err, cb);
                        else close(client, SUCCESS, {}, cb);
                    });
                } else {
                    const { devices } = tokensData[0];

                    const index = devices && devices.length ? devices.findIndex(ele => ele.token === device_token) : -1;

                    if (index === -1) {
                        devices.push({
                            type: platform,
                            token: device_token
                        });
                    }

                    collection.updateOne({ user_id: new ObjectId(_id) }, {
                        $set: {
                            devices: devices
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
            });
        }
    })
}

/** 
 * Remove device token
 */
var removeDeviceToken = (obj, cb) => {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('device_tokens');

            var { _id, device_token } = obj;

            collection.find({ user_id: new ObjectId(_id) }).toArray((err, tokensData) => {
                if (err) close(client, ERROR, err, cb);
                else {
                    const { devices } = tokensData[0];

                    const index = devices && devices.length ? devices.findIndex(ele => ele.token === device_token) : -1;

                    if (index !== -1) {
                        devices.splice(index, 1);
                    }

                    collection.updateOne({ user_id: new ObjectId(_id) }, {
                        $set: {
                            devices: devices
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
            });
        }
    })
}

/** ----------------------------------------------------------------- */




module.exports = {
    login,
    customerLogin,
    driverLogin,
    adminSignup,
    getCollection,
    verifyJsonToken,
    sessionLogin,

    forgotPassword,
    changePasswordConfirmData,
    resetPassword,
    changePassword,
    logout,

    verifyJsonTokenWithSocket,
    verifyJsonTokenAndAdmin,
    verifyJsonTokenAndDriver,
    getUsers,
    exportAllUsers,
    enableUser,
    disableUser,

    updateUser,
    isValidUser,
    isValidUserEmailAndMobileNumber,
    updateDeviceToken,
    removeDeviceToken
}



//Order date
// {
//     $match: {
//            $expr: {
//                    $or: {
//                            $lte: ["$place_order_date_iso", new Date("2019-11-30T06:22:09.000Z").toISOString()]
//                    }
//            }
//         }
// }