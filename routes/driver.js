var express = require('express');
var router = express.Router();
var path = require('path');

var common = require("../operations/common");
var { SUCCESS, VALIDATE_ERROR, AUTH_USER_DATA, METHOD_TYPE_FORGOT_PASSWORD } = require("../operations/constant");
var { driverLogin, forgotPassword, verifyJsonTokenAndDriver, changePassword, changePasswordConfirmData, sessionLogin, logout } = require("../operations/operation");
var { searchUsers } = require("../operations/controller/customer");

/**
 * Customer login
 */
router.post("/login", function (req, res, next) {
    common.validate("login", req.body, (status, keys) => {
        if (status) next();
        else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
}, (req, res) => driverLogin(req.body, (status, response) => common.httpResponse(req, res, status, response)));

/**
 * Session Login
 */
router.post("/session_login", function (req, res, next) {
    common.validate("session_login", req.body, (status, keys) => {
        if (status) next();
        else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
}, verifyJsonTokenAndDriver, (req, res) => {
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
}, verifyJsonTokenAndDriver, (req, res) => {
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
}, verifyJsonTokenAndDriver, (req, res, next) => {
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
}, verifyJsonTokenAndDriver, (req, res) => {
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
 * Customer search
 */
router.post("/customer_search", function (req, res, next) {
    common.validate("customer_search", req.body, (status, keys) => {
        if (status) next();
        else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
}, verifyJsonTokenAndDriver, (req, res) => {
    //Request data
    const { _id } = req[AUTH_USER_DATA];

    searchUsers({
        _id,
        ...req.body
    }, (status, response) => common.httpResponse(req, res, status, response));
});

module.exports = router;
