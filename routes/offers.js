var express = require('express');
var router = express.Router();
var path = require('path');

var common = require("../operations/common");
var { SUCCESS, VALIDATE_ERROR, AUTH_USER_DATA, OFFERS_ALL_CATEGORY_PRODUCTS, OFFERS_ALL_SUB_CATEGORY_PRODUCTS, OFFERS_ALL_PRODUCTS, OFFERS_CUSTOM_PRODUCTS } = require("../operations/constant");
var { verifyJsonTokenAndAdmin } = require("../operations/operation");
var { makeOffer } = require("../operations/controller/offers");

router.post('/', (req, res, next) => {
    common.validate("makey_offer", req.body, (status, keys) => {
        if (status) {
            const { offer_type, category_id, _sub_cateogry_id, start_date, end_date, discount, product_ids } = req.body;

            let _start_date = new Date(start_date);
            let _end_date = new Date(end_date);
            let current_date = new Date();

            //Reset start time
            _start_date.setHours(0);
            _start_date.setMinutes(0);
            _start_date.setSeconds(0, 0);

            //Reset current time
            current_date.setHours(0);
            current_date.setMinutes(0);
            current_date.setSeconds(0, 0);

            let _keys = [];

            if (discount <= 0 || discount > 100) {
                _keys.push({
                    fieldName: "discount",
                    message: "Invalid discount value"
                });
            }

            if (!_start_date || (_start_date && !_start_date.getDate()) || _start_date < current_date) {
                _keys.push({
                    fieldName: "start_date",
                    message: "Invalid start date or start date must be greater than euqal to current date"
                });
            }

            if (!_end_date || (_end_date && !_end_date.getDate()) || _end_date < _start_date) {
                _keys.push({
                    fieldName: "end_date",
                    message: "Invalid end date or end date must be greater than euqal to start date"
                });
            }

            switch (offer_type) {
                case OFFERS_ALL_CATEGORY_PRODUCTS:
                    if (!category_id) _keys.push({
                        fieldName: "category_id",
                        message: "Required for category_products offers"
                    });
                    break;
                case OFFERS_ALL_SUB_CATEGORY_PRODUCTS:
                    if (!category_id) _keys.push({
                        fieldName: "category_id",
                        message: "Required for offers_all_sub_category_products offers"
                    });

                    if (!_sub_cateogry_id) _keys.push({
                        fieldName: "_sub_cateogry_id",
                        message: "Required for offers_all_sub_category_products offers"
                    });
                    break;
                case OFFERS_CUSTOM_PRODUCTS:
                    if (!product_ids || (product_ids && !product_ids.length)) _keys.push({
                        fieldName: "product_ids",
                        message: "Required for custom_products offers"
                    });
                    break;
            }

            if (_keys.length) {
                common.httpResponse(req, res, VALIDATE_ERROR, _keys);
            } else next();

        } else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
}, verifyJsonTokenAndAdmin, (req, res) => {
    //Request data
    const { _id } = req[AUTH_USER_DATA];

    makeOffer({
        _id,
        ...req.body
    }, (status, response) => common.httpResponse(req, res, status, response));
});

module.exports = router;
