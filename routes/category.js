var express = require('express');
var router = express.Router();
var path = require('path');

var common = require("../operations/common");
var { SUCCESS, VALIDATE_ERROR, AUTH_USER_DATA } = require("../operations/constant");
var { verifyJsonToken, verifyJsonTokenAndAdmin } = require("../operations/operation");
var {
    createCategory,
    createSubCategory,
    getCategory,
    getAndSearchCategory,
    getAndSearchSubCategory,
    getSubCategory,
    enableCategory,
    enableSubCategory,
    disableCategory,
    disableSubCategory,
    getCategoryViaId,
    getSubCategoryViaId,
    getAllCategoriesList,
    getAllSubCategoriesListWithProducts,
    getAllSubCategoryListWithProducts
} = require("../operations/controller/product");

/**
 * Create Category
 */
router
    .post("/", function (req, res, next) {
        common.validate("add_category", req.body, (status, keys) => {
            if (status) next();
            else common.httpResponse(req, res, VALIDATE_ERROR, keys);
        });
    }, verifyJsonTokenAndAdmin, (req, res) => {
        const { _id, userType } = req[AUTH_USER_DATA];

        createCategory({
            _id,
            userType,
            ...req.body
        }, (status, response) => common.httpResponse(req, res, status, response));
    })
    .get("/", function (req, res, next) {
        common.validate("get_category", req.query, (status, keys) => {
            if (status) next();
            else common.httpResponse(req, res, VALIDATE_ERROR, keys);
        });
    }, verifyJsonToken, (req, res) => {
        const { _id } = req[AUTH_USER_DATA];

        getAndSearchCategory({
            ...req.query
        }, (status, response) => common.httpResponse(req, res, status, response));
    })

/**
 * Create sub category of product
 */
router
    .post("/sub_category", function (req, res, next) {
        common.validate("add_sub_category", req.body, (status, keys) => {
            if (status) next();
            else common.httpResponse(req, res, VALIDATE_ERROR, keys);
        });
    }, verifyJsonTokenAndAdmin, (req, res) => {
        const { _id, userType } = req[AUTH_USER_DATA];

        createSubCategory({
            _id,
            userType,
            ...req.body
        }, (status, response) => common.httpResponse(req, res, status, response));
    })
    .get("/sub_category", function (req, res, next) {
        common.validate("get_sub_category", req.query, (status, keys) => {
            if (status) next();
            else common.httpResponse(req, res, VALIDATE_ERROR, keys);
        });
    }, verifyJsonToken, (req, res) => {
        const { _id } = req[AUTH_USER_DATA];

        getAndSearchSubCategory({
            ...req.query
        }, (status, response) => common.httpResponse(req, res, status, response));
    })

/** Enable and Disable Category */

/**
 * Enable category
 */
router.post("/enable", function (req, res, next) {
    common.validate("enable_category", req.body, (status, keys) => {
        if (status) next();
        else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
}, verifyJsonTokenAndAdmin, (req, res) => {
    const { _id, userType } = req[AUTH_USER_DATA];

    enableCategory({
        _id,
        userType,
        ...req.body
    }, (status, response) => common.httpResponse(req, res, status, response));
});

/**
 * Disable category
 */
router.post("/disable", function (req, res, next) {
    common.validate("disable_category", req.body, (status, keys) => {
        if (status) next();
        else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
}, verifyJsonTokenAndAdmin, (req, res) => {
    const { _id, userType } = req[AUTH_USER_DATA];

    disableCategory({
        _id,
        userType,
        ...req.body
    }, (status, response) => common.httpResponse(req, res, status, response));
});

/**
 * Get Category Via Id
 */
router.post("/get_via_id", function (req, res, next) {
    common.validate("get_category_via_id", req.body, (status, keys) => {
        if (status) next();
        else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
}, verifyJsonTokenAndAdmin, (req, res) => {
    const { _id } = req[AUTH_USER_DATA];

    getCategoryViaId({
        ...req.body
    }, (status, response) => common.httpResponse(req, res, status, response));
});

/**
 * Get Sub Category Via Id
 */
router.post("/sub_category/get_via_id", function (req, res, next) {
    common.validate("get_sub_category_via_id", req.body, (status, keys) => {
        if (status) next();
        else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
}, verifyJsonTokenAndAdmin, (req, res) => {
    const { _id } = req[AUTH_USER_DATA];

    getSubCategoryViaId({
        ...req.body
    }, (status, response) => common.httpResponse(req, res, status, response));
});

/**
 * Enable sub category
 */
router.post("/sub_category/enable", function (req, res, next) {
    common.validate("enable_sub_category", req.body, (status, keys) => {
        if (status) next();
        else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
}, verifyJsonTokenAndAdmin, (req, res) => {
    const { _id, userType } = req[AUTH_USER_DATA];

    enableSubCategory({
        _id,
        userType,
        ...req.body
    }, (status, response) => common.httpResponse(req, res, status, response));
});

/**
 * Disable category
 */
router.post("/sub_category/disable", function (req, res, next) {
    common.validate("disable_sub_category", req.body, (status, keys) => {
        if (status) next();
        else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
}, verifyJsonTokenAndAdmin, (req, res) => {
    const { _id, userType } = req[AUTH_USER_DATA];

    disableSubCategory({
        _id,
        userType,
        ...req.body
    }, (status, response) => common.httpResponse(req, res, status, response));
});

/** --------------------------------------------------- */


/** Datatables list */

/**
 * Get category
 */
router.post("/list", function (req, res, next) {
    common.validate("get_category_data_tables", req.body, (status, keys) => {
        if (status) next();
        else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
}, verifyJsonToken, (req, res) => {
    const { _id } = req[AUTH_USER_DATA];

    getCategory({
        _id,
        ...req.body
    }, (status, response) => common.httpResponse(req, res, status, response));
});

router.post("/sub_category/list", function (req, res, next) {
    common.validate("get_category_data_tables", req.body, (status, keys) => {
        if (status) next();
        else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
}, verifyJsonToken, (req, res) => {
    const { _id } = req[AUTH_USER_DATA];

    getSubCategory({
        _id,
        ...req.body
    }, (status, response) => common.httpResponse(req, res, status, response));
});

/** ------------------------------------------- */

/**
|--------------------------------------------------
| Consumer App APIs
|--------------------------------------------------
*/

router.post("/list/all", function (req, res, next) {
    common.validate("get_all_categories", req.body, (status, keys) => {
        if (status) next();
        else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
}, (req, res) => {

    getAllCategoriesList({
        ...req.body
    }, (status, response) => common.httpResponse(req, res, status, response));
});

router.post("/sub_categories/list/all", function (req, res, next) {
    common.validate("get_all_sub_categories", req.body, (status, keys) => {
        if (status) next();
        else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
}, (req, res) => {

    getAllSubCategoriesListWithProducts({
        ...req.body
    }, (status, response) => common.httpResponse(req, res, status, response));
});

router.post("/sub_category/list/all", function (req, res, next) {
    common.validate("get_all_sub_category", req.body, (status, keys) => {
        if (status) next();
        else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
}, (req, res) => {

    getAllSubCategoryListWithProducts({
        ...req.body
    }, (status, response) => common.httpResponse(req, res, status, response));
});

//--------------------------------------------------
module.exports = router;
