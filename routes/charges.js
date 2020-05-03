var express = require('express');
var router = express.Router();
var path = require('path');

var common = require("../operations/common");
var { SUCCESS, VALIDATE_ERROR, AUTH_USER_DATA, METHOD_TYPE_FORGOT_PASSWORD } = require("../operations/constant");
var { verifyJsonTokenAndAdmin } = require("../operations/operation");
var { makeTax, makeDeliveryCharges, getTaxAndCharges } = require("../operations/controller/charges");

/**
|--------------------------------------------------
| Admin APIs
|--------------------------------------------------
*/

router.post('/sales_tax', (req, res, next) => {
    common.validate("sales_tax_payload", req.body, (status, keys) => {
        if (status) {
            var _keys = [];
            const { sales_tax } = req.body;

            if (sales_tax <= 0 || sales_tax > 100) {
                _keys.push({
                    fieldName: "sales_tax",
                    message: "Inavlid sales tax"
                })
            }

            if (_keys && _keys.length) {
                common.httpResponse(req, res, VALIDATE_ERROR, _keys);
            } else next();
        } else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
}, verifyJsonTokenAndAdmin, (req, res) => {
    //Request data
    const { _id } = req[AUTH_USER_DATA];

    makeTax({
        _id,
        ...req.body
    }, (status, response) => common.httpResponse(req, res, status, response));
});

router.post('/delivery_charges', (req, res, next) => {
    common.validate("delivery_charges_payload", req.body, (status, keys) => {
        if (status) next();
        else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
}, verifyJsonTokenAndAdmin, (req, res) => {
    //Request data
    const { _id } = req[AUTH_USER_DATA];

    makeDeliveryCharges({
        _id,
        ...req.body
    }, (status, response) => common.httpResponse(req, res, status, response));
});

router.post('/list', (req, res, next) => {
    common.validate("get_charges_payload", req.body, (status, keys) => {
        if (status) next();
        else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
}, verifyJsonTokenAndAdmin, (req, res) => {
    //Request data
    const { _id } = req[AUTH_USER_DATA];

    getTaxAndCharges({
        _id
    }, (status, response) => common.httpResponse(req, res, status, response));
});

//--------------------------------------------------

module.exports = router;
