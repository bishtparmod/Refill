var express = require('express');
var router = express.Router();
var path = require('path');
var {
    ObjectID,
    ObjectId
} = require("mongodb");

var common = require("../operations/common");
var { VALIDATE_ERROR, AUTH_USER_DATA } = require("../operations/constant");
var { verifyJsonToken } = require("../operations/operation");
var { notificationsList } = require("../operations/controller/firebase");

/**
 * Get users data tables
 */
router.post("/list", function (req, res, next) {
    common.validate("notifications_list", req.body, (status, keys) => {
        if (status) next();
        else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
}, verifyJsonToken, (req, res) => {
    const { _id } = req[AUTH_USER_DATA];

    notificationsList({
        _id,
        ...req.body
    }, (status, response) => common.httpResponse(req, res, status, response));
});

module.exports = router;
