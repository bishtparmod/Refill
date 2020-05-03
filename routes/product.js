var express = require('express');
var router = express.Router();
var path = require('path');
var { Parser } = require('json2csv');
var stream = require('stream');
var fs = require('fs');

var common = require("../operations/common");
var { SUCCESS, VALIDATE_ERROR, AUTH_USER_DATA } = require("../operations/constant");
var { verifyJsonTokenAndAdmin, verifyJsonToken } = require("../operations/operation");
var { createProduct, updateProduct, getProducts, getAllProducts, getProductViaId, deleteProduct, exportAllProducts } = require("../operations/controller/product");

/** Admin APIs */

/**
 * Create Product
 */
router
    .post("/", function (req, res, next) {
        common.validate("add_product", req.body, (status, keys) => {
            if (status) next();
            else common.httpResponse(req, res, VALIDATE_ERROR, keys);
        });
    }, verifyJsonTokenAndAdmin, (req, res) => {
        const { _id } = req[AUTH_USER_DATA];


        createProduct({
            _id,
            ...req.body
        }, (status, response) => common.httpResponse(req, res, status, response));
    })
    .put("/", function (req, res, next) {
        common.validate("edit_product", req.body, (status, keys) => {
            if (status) next();
            else common.httpResponse(req, res, VALIDATE_ERROR, keys);
        });
    }, verifyJsonTokenAndAdmin, (req, res) => {
        const { _id } = req[AUTH_USER_DATA];

        updateProduct({
            _id,
            ...req.body
        }, (status, response) => common.httpResponse(req, res, status, response));
    })
    .delete("/", function (req, res, next) {
        common.validate("delete_product", req.body, (status, keys) => {
            if (status) next();
            else common.httpResponse(req, res, VALIDATE_ERROR, keys);
        });
    }, verifyJsonTokenAndAdmin, (req, res) => {
        const { _id } = req[AUTH_USER_DATA];

        deleteProduct({
            _id,
            ...req.body
        }, (status, response) => common.httpResponse(req, res, status, response));
    });

/**
 * Get Product via id
 */
router.post("/get_product_via_id", function (req, res, next) {
    common.validate("get_product_via_id", req.body, (status, keys) => {
        if (status) next();
        else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
}, verifyJsonToken, (req, res) => {
    const { _id } = req[AUTH_USER_DATA];


    getProductViaId({
        _id,
        ...req.body
    }, (status, response) => common.httpResponse(req, res, status, response));
});

/**
 * Get all products csv file
 */
router.get("/export_all_products", function (req, res, next) {
    common.validate("export_all_products", req.query, (status, keys) => {
        if (status) next();
        else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
}, verifyJsonTokenAndAdmin, (req, res) => {
    const { _id } = req[AUTH_USER_DATA];

    exportAllProducts({
        _id,
        ...req.body
    }, (status, response) => {
        if (status === SUCCESS) {
            const fields = ['_id', 'name', "category", "sub_category"];
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


/** Datatables list */

/**
 * Get product
 */
router.post("/list", function (req, res, next) {
    common.validate("get_category_data_tables", req.body, (status, keys) => {
        if (status) next();
        else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
}, verifyJsonTokenAndAdmin, (req, res) => {
    const { _id } = req[AUTH_USER_DATA];

    getProducts({
        _id,
        ...req.body
    }, (status, response) => common.httpResponse(req, res, status, response));
});

/** ------------------------------------------- */

/** ------------------------------------------- */


/** Datatables list */

/**
 * Get product
 */
router.post("/list/all", function (req, res, next) {
    common.validate("search_product", req.body, (status, keys) => {
        if (status) next();
        else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
}, (req, res) => {

    getAllProducts({
        ...req.body
    }, (status, response) => common.httpResponse(req, res, status, response));
});

/** ------------------------------------------- */
module.exports = router;
