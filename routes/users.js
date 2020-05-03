var express = require('express');
var router = express.Router();
var path = require('path');
var { Parser } = require('json2csv');
var stream = require('stream');
var product = require('./product');
var category = require('./category');
var customer = require('./customer');
var driver = require('./driver');
var order = require('./order');
var charges = require('./charges');
var offers = require("./offers");
var content = require("./content");
var payment = require("./payment");
var notification = require("./notification");
var axios = require("axios");

var common = require("../operations/common");
var { SUCCESS, VALIDATE_ERROR, AUTH_USER_DATA, METHOD_TYPE_FORGOT_PASSWORD, ERROR } = require("../operations/constant");
var { login, adminSignup, forgotPassword, verifyJsonToken, verifyJsonTokenAndAdmin, changePassword, changePasswordConfirmData, sessionLogin, logout, getUsers, exportAllUsers, enableUser, disableUser, isValidUser, isValidUserEmailAndMobileNumber, updateUser, isValidUser } = require("../operations/operation");
var { createDriver, updateDriver, isValidDriverEmailAndMobileNumber, isValidDriver, getDrivers, getAndSearchDriver } = require('../operations/controller/driver');

/**
 * Login
 */
router.post("/login", function (req, res) {
    common.validate("login", req.body, (status, keys) => {
        if (status) login(req.body, (status, response) => common.httpResponse(req, res, status, response));
        else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
});

/**
 * Find place from text
 */
router.get("/maps/api/place/findplacefromtext/json", function (req, res) {
    common.validate("find_place_from_text", req.query, (status, keys) => {
        if (status) {
            const { inputQuery, fields } = req.query

            axios
                .get(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${inputQuery}&inputtype=textquery&fields=${fields}&key=AIzaSyBZPVrEhzx9jD-U5-TiYpUm7OlZFMkQWv8`)
                .then(value => {
                    common.httpResponse(req, res, SUCCESS, value.data);
                })
                .catch(error => {
                    common.httpResponse(req, res, ERROR, error);
                });
        } else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
});

/**
 * Admin signup
 */
router.post("/admin/signup", function (req, res) {
    common.validate("admin_signup", req.body, (status, keys) => {
        if (status) adminSignup(req.body, (status, response) => common.httpResponse(req, res, status, response));
        else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
});

/**
 * Session Login
 */
router.post("/session_login", function (req, res, next) {
    common.validate("session_login", req.body, (status, keys) => {
        if (status) next();
        else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
}, verifyJsonToken, (req, res) => {
    //Request data
    const { _id } = req[AUTH_USER_DATA];

    sessionLogin({
        _id
    }, (status, response) => common.httpResponse(req, res, status, response));
});

/**
 * Logout
 */
router.post("/logout", function (req, res, next) {
    common.validate("logout", req.body, (status, keys) => {
        if (status) next();
        else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
}, verifyJsonToken, (req, res) => {
    //Request data
    const { _id, email } = req[AUTH_USER_DATA];

    logout({
        _id,
        email
    }, (status, response) => common.httpResponse(req, res, status, response));
});

/**
 * Forgot password
 */
router.post("/forgot_password", function (req, res, next) {
    common.validate("forgot_password", req.body, (status, keys) => {
        if (status) forgotPassword(req.body, (status, response) => {
            if (status === SUCCESS) {
                req[AUTH_USER_DATA] = response;
                next();
            } else common.httpResponse(req, res, status, response);
        });
        else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
}, function (req, res) {
    //Request data
    const { _id, email } = req[AUTH_USER_DATA];
    const password = `${parseInt(Math.random() * 1000000)}`;

    changePassword({
        _id,
        email,
        password,
        type: METHOD_TYPE_FORGOT_PASSWORD
    }, (status, response) => common.httpResponse(req, res, status, response));
});

/**
 * Change password
 */
router.post("/change_password", function (req, res, next) {
    common.validate("change_password", req.body, (status, keys) => {
        if (status) next();
        else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
}, verifyJsonToken, (req, res, next) => {
    const { email } = req[AUTH_USER_DATA];
    const { old_password } = req.body;

    changePasswordConfirmData({
        email,
        password: old_password
    }, (status, response) => {
        if (status === SUCCESS) {
            req[AUTH_USER_DATA] = response;
            next();
        } else common.httpResponse(req, res, status, response);
    });
}, (req, res) => {
    //Request data
    const { _id, email } = req[AUTH_USER_DATA];
    const { password } = req.body;

    changePassword({
        _id,
        email,
        password
    }, (status, response) => common.httpResponse(req, res, status, response));
});

/**
 * Reset password
 */
router.post("/reset_password", function (req, res, next) {
    common.validate("reset_password", req.body, (status, keys) => {
        if (status) next();
        else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
}, verifyJsonToken, (req, res) => {
    //Request data
    const { _id, email } = req[AUTH_USER_DATA];
    const { password } = req.body;

    changePassword({
        _id,
        email,
        password
    }, (status, response) => common.httpResponse(req, res, status, response));
});

/** Admin APIs */

/**
 * Get users data tables
 */
router.post("/admin/users/list", function (req, res, next) {
    common.validate("get_category_data_tables", req.body, (status, keys) => {
        if (status) next();
        else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
}, verifyJsonTokenAndAdmin, (req, res) => {
    const { _id } = req[AUTH_USER_DATA];

    getUsers({
        _id,
        ...req.body
    }, (status, response) => common.httpResponse(req, res, status, response));
});

/**
 * Get all users csv file
 */
router.get("/admin/export_all_users", function (req, res, next) {
    common.validate("export_all_users", req.query, (status, keys) => {
        if (status) next();
        else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
}, verifyJsonTokenAndAdmin, (req, res) => {
    const { _id } = req[AUTH_USER_DATA];

    exportAllUsers({
        _id,
        ...req.body
    }, (status, response) => {
        if (status === SUCCESS) {
            const fields = ['_id', 'name'];
            const opts = { fields };

            const parser = new Parser(opts);
            const csv = parser.parse(response);

            var fileContents = Buffer.from(csv, 'utf8');

            var readStream = new stream.PassThrough();
            readStream.end(fileContents);

            res.writeHead(200, {
                "Content-Type": "application/octet-stream",
                "Content-Disposition": "attachment; filename=products.csv"
            });

            readStream.pipe(res);
        } else common.httpResponse(req, res, status, response)
    });
});

/**
 * Enable user
 */
router.post("/admin/user/enable", function (req, res, next) {
    common.validate("enable_user", req.body, (status, keys) => {
        if (status) next();
        else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
}, verifyJsonTokenAndAdmin, (req, res) => {
    const { _id, userType } = req[AUTH_USER_DATA];

    enableUser({
        _id,
        userType,
        ...req.body
    }, (status, response) => common.httpResponse(req, res, status, response));
});

/**
 * Disable user
 */
router.post("/admin/user/disable", function (req, res, next) {
    common.validate("disable_user", req.body, (status, keys) => {
        if (status) next();
        else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
}, verifyJsonTokenAndAdmin, (req, res) => {
    const { _id, userType } = req[AUTH_USER_DATA];

    disableUser({
        _id,
        userType,
        ...req.body
    }, (status, response) => common.httpResponse(req, res, status, response));
});

/**
 * Edit enable user
 */
router.post("/admin/user/edit", function (req, res, next) {
    common.validate("edit_user", req.body, (status, keys) => {
        if (status) next();
        else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
},
    verifyJsonTokenAndAdmin,
    (req, res, next) => {
        isValidUser(req.body, (status, response) => {
            if (status === SUCCESS) next();
            else common.httpResponse(req, res, status, response);
        })
    },
    (req, res, next) => {
        isValidUserEmailAndMobileNumber(req.body, (status, response) => {
            if (status === SUCCESS) next();
            else common.httpResponse(req, res, status, response);
        })
    },
    (req, res) => {
        const { _id, userType } = req[AUTH_USER_DATA];

        updateUser({
            _id,
            userType,
            ...req.body
        }, (status, response) => common.httpResponse(req, res, status, response));
    });

/**
 * View user via id
 */
router.post("/admin/user/view", function (req, res, next) {
    common.validate("view_user_via_id", req.body, (status, keys) => {
        if (status) next();
        else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
}, verifyJsonTokenAndAdmin, (req, res) => {
    const { _id, userType } = req[AUTH_USER_DATA];

    isValidUser({
        _id,
        userType,
        ...req.body
    }, (status, response) => common.httpResponse(req, res, status, response));
});

/**
 * Get driver data tables
 */
router.post("/admin/driver/list", function (req, res, next) {
    common.validate("get_category_data_tables", req.body, (status, keys) => {
        if (status) next();
        else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
}, verifyJsonTokenAndAdmin, (req, res) => {
    const { _id } = req[AUTH_USER_DATA];

    getDrivers({
        _id,
        ...req.body
    }, (status, response) => common.httpResponse(req, res, status, response));
});

/**
 * Crate driver
 */
router.post("/admin/driver", function (req, res, next) {
    common.validate("driver_signup", req.body, (status, keys) => {
        if (status) next();
        else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
}, verifyJsonTokenAndAdmin,
    (req, res, next) => {
        isValidDriverEmailAndMobileNumber(req.body, (status, response) => {
            if (status === SUCCESS) next();
            else common.httpResponse(req, res, status, response);
        })
    }, (req, res) => {
        const { _id } = req[AUTH_USER_DATA];

        createDriver({
            _id,
            ...req.body
        }, (status, response) => common.httpResponse(req, res, status, response));
    });

/**
 * Edit driver
 */
router.post("/admin/driver/edit", function (req, res, next) {
    common.validate("edit_driver", req.body, (status, keys) => {
        if (status) next();
        else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
},
    verifyJsonTokenAndAdmin,
    (req, res, next) => {
        isValidDriver(req.body, (status, response) => {
            if (status === SUCCESS) next();
            else common.httpResponse(req, res, status, response);
        })
    },
    (req, res, next) => {
        isValidDriverEmailAndMobileNumber(req.body, (status, response) => {
            if (status === SUCCESS) next();
            else common.httpResponse(req, res, status, response);
        })
    },
    (req, res) => {
        const { _id, userType } = req[AUTH_USER_DATA];

        updateDriver({
            _id,
            userType,
            ...req.body
        }, (status, response) => common.httpResponse(req, res, status, response));
    });

/**
 * View driver via id
 */
router.post("/admin/driver/view", function (req, res, next) {
    common.validate("view_driver_via_id", req.body, (status, keys) => {
        if (status) next();
        else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
}, verifyJsonTokenAndAdmin, (req, res) => {
    const { _id, userType } = req[AUTH_USER_DATA];

    isValidDriver({
        _id,
        userType,
        ...req.body
    }, (status, response) => common.httpResponse(req, res, status, response));
});

/**
 * View driver via id
 */
router.get("/admin/driver/search", function (req, res, next) {
    common.validate("get_driver", req.query, (status, keys) => {
        if (status) next();
        else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
}, verifyJsonTokenAndAdmin, (req, res) => {
    const { _id, userType } = req[AUTH_USER_DATA];

    getAndSearchDriver({
        _id,
        userType,
        ...req.query
    }, (status, response) => common.httpResponse(req, res, status, response));
});


/** ------------------------------------------- */

/** ------------------------------ */

/** Product */
router.use('/admin/product', product);

/** Category */
router.use('/admin/category', category);

/** Customer */
router.use('/customer', customer);

/** Driver */
router.use('/driver', driver);

/** Order */
router.use('/order', order);

/** Create Sales Tax and Delivery Charges */
router.use('/charges', charges);

/** Create Offer */
router.use('/offer', offers);

/** Create Content */
router.use('/content', content);

/** Payment */
router.use('/payment', payment);

/** Notification */
router.use('/notification', notification);

module.exports = router;
