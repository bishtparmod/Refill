var express = require('express');
var router = express.Router();
var path = require('path');

var common = require("../operations/common");
var { SUCCESS, VALIDATE_ERROR, AUTH_USER_DATA, OFFERS_ALL_CATEGORY_PRODUCTS, OFFERS_ALL_SUB_CATEGORY_PRODUCTS, OFFERS_ALL_PRODUCTS } = require("../operations/constant");
var { verifyJsonToken, verifyJsonTokenAndAdmin } = require("../operations/operation");
var { createSplashScreen, getAllSplashScreens } = require("../operations/controller/content");

/**
|--------------------------------------------------
| Admin APIs
|--------------------------------------------------
*/
router.post('/', (req, res, next) => {
    common.validate("update_splash", req.body, (status, keys) => {
        if (status) next();
        else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
}, verifyJsonTokenAndAdmin, (req, res) => {
    //Request data
    const { _id } = req[AUTH_USER_DATA];

    createSplashScreen({
        _id,
        ...req.body
    }, (status, response) => common.httpResponse(req, res, status, response));
});

router.post('/list', (req, res, next) => {
    common.validate("get_splash", req.body, (status, keys) => {
        if (status) next();
        else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
}, verifyJsonTokenAndAdmin, (req, res) => {
    //Request data
    const { _id } = req[AUTH_USER_DATA];

    getAllSplashScreens({
        _id,
        ...req.body
    }, (status, response) => common.httpResponse(req, res, status, response));
});

/** ----------------------------------------------- */

/**
|--------------------------------------------------
| User APIs 
|--------------------------------------------------
*/

/** List all apis */
router.get('/list', (req, res) => getAllSplashScreens({
    ...req.body
}, (status, response) => common.httpResponse(req, res, status, response)));

/** ----------------------------------------------- */

module.exports = router;
