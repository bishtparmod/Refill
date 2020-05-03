var express = require('express');
var router = express.Router();
var path = require('path');

var common = require("../operations/common");
var { SUCCESS, VALIDATE_ERROR, AUTH_USER_DATA } = require("../operations/constant");
var { verifyJsonToken } = require("../operations/operation");
var { createCard, createCustomer, getCardsList, deleteCard } = require("../operations/controller/payment");

/**
|--------------------------------------------------
| Customer APIs
|--------------------------------------------------
*/

/** Create customer card */
router.post('/createCard', (req, res, next) => {
    common.validate("create_card", req.body, (status, keys) => {
        if (status) next();
        else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
}, verifyJsonToken,
    (req, res, next) => {
        const { _id } = req[AUTH_USER_DATA];

        createCustomer({
            _id
        }, (status, response) => {
            if (status === SUCCESS) {
                if (response && response._id) {
                    req[AUTH_USER_DATA] = response;
                }
                next();
            } else common.httpResponse(req, res, status, response);
        });
    }, (req, res) => {
        //Request data
        const { _id, stripeCustomerId } = req[AUTH_USER_DATA];

        createCard({
            _id,
            stripeCustomerId,
            ...req.body
        }, (status, response) => common.httpResponse(req, res, status, response));
    });

/** Get card list */
router.post('/card_list', (req, res, next) => {
    common.validate("card_list", req.body, (status, keys) => {
        if (status) next();
        else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
}, verifyJsonToken,
    (req, res, next) => {
        const { _id } = req[AUTH_USER_DATA];

        createCustomer({
            _id
        }, (status, response) => {
            if (status === SUCCESS) {
                if (response && response._id) {
                    req[AUTH_USER_DATA] = response;
                }
                next();
            } else common.httpResponse(req, res, status, response);
        });
    },
    (req, res) => {
        //Request data
        const { _id, stripeCustomerId } = req[AUTH_USER_DATA];

        getCardsList({
            _id,
            stripeCustomerId
        }, (status, response) => common.httpResponse(req, res, status, response));
    });

//--------------------------------------------------

/** Delete card list */
router.post('/delete_card', (req, res, next) => {
    common.validate("delete_card", req.body, (status, keys) => {
        if (status) next();
        else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
}, verifyJsonToken,
    (req, res, next) => {
        const { _id } = req[AUTH_USER_DATA];

        createCustomer({
            _id
        }, (status, response) => {
            if (status === SUCCESS) {
                if (response && response._id) {
                    req[AUTH_USER_DATA] = response;
                }
                next();
            } else common.httpResponse(req, res, status, response);
        });
    },
    (req, res) => {
        //Request data
        const { _id, stripeCustomerId } = req[AUTH_USER_DATA];

        deleteCard({
            _id,
            stripeCustomerId,
            ...req.body
        }, (status, response) => common.httpResponse(req, res, status, response));
    });

//--------------------------------------------------

module.exports = router;
