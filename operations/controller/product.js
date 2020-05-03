var connection = require("../connection");
var {
    SUCCESS,
    ERROR,
    NOVALUE,
    PRESENT,
    ACTIVE,
    DATA_TABLE_SUCCESS,
    ADMIN,
    DEACTIVE,

    ASCENDING_SORT,
    DESCENDING_SORT
} = require("../constant");
var {
    ObjectID,
    ObjectId
} = require("mongodb");
var {
    close,
    generateToken,
    randomPassword
} = require("../common");

/**
 * Create product
 * @param {*object} obj 
 * @param {*function} cb 
 */
var createProduct = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('products');
            var { _id, name, short_description, long_description, images, manufacture_at, brand, distributor, retail_price, refill_price, notes, discount, alerts, size, code, weight, unit, expiry_at, pupc_gtin_code, category_id, sub_category_id, quantity, average_life_in_days, delivery_time_in_days } = obj;
            collection.insertOne({
                name,
                shortDescription: short_description,
                longDescription: long_description,
                createdBy: new ObjectId(_id),
                categoryId: new ObjectId(category_id),
                subCategoryId: new ObjectId(sub_category_id),
                quantity,
                images: images && images.length ? images : [],
                manufactureAt: manufacture_at ? new Date(manufacture_at).toISOString() : "",
                brand,
                distributor,
                deliveryTimeInDays: delivery_time_in_days,
                retailPrice: retail_price,
                refillPrice: refill_price,
                notes,
                alerts,
                size,
                code,
                weight,
                unit,
                averageLifeInDays: average_life_in_days,
                expiryAt: expiry_at ? new Date(expiry_at).toISOString() : "",
                pupcGtinCode: pupc_gtin_code,
                deletedStatus: 0,
                status: ACTIVE,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }, (err, data) => {
                if (err) close(client, ERROR, err, cb);
                else close(client, SUCCESS, {
                    message: "Product successfully created."
                }, cb);
            });
        }
    })
}

/** 
 * Update product
 */
var updateProduct = (obj, cb) => {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('products');

            var { _id, product_id, name, short_description, long_description, images, manufacture_at, brand, distributor, retail_price, refill_price, notes, alerts, size, code, weight, unit, expiry_at, pupc_gtin_code, category_id, sub_category_id, quantity, average_life_in_days, delivery_time_in_days } = obj;

            collection.find({ _id: new ObjectId(product_id) }).toArray((err, data) => {
                if (err) close(client, ERROR, err, cb);
                else if (data && data.length !== 0) {
                    var product = data[0];

                    collection.updateOne({ _id: new ObjectId(product_id) }, {
                        $set: {
                            name: name ? name : product.name ? product.name : '',
                            updatedBy: new ObjectId(_id),
                            shortDescription: short_description ? short_description : product.shortDescription ? product.shortDescription : '',
                            longDescription: long_description ? long_description : product.longDescription ? product.longDescription : '',
                            images: images && images.length ? images : product.images ? product.images : [],
                            manufactureAt: manufacture_at ? new Date(manufacture_at).toISOString() : product.manufactureAt ? product.manufactureAt : '',
                            brand: brand ? brand : product.brand ? product.brand : '',
                            distributor: distributor ? distributor : product.distributor ? product.distributor : '',
                            retailPrice: retail_price ? retail_price : product.retailPrice ? product.retailPrice : '',
                            refillPrice: refill_price ? refill_price : product.refillPrice ? product.refillPrice : '',
                            notes: notes ? notes : product.notes ? product.notes : '',
                            alerts: alerts ? alerts : product.alerts ? product.alerts : '',
                            size: size ? size : product.size ? product.size : '',
                            code: code ? code : product.code ? product.code : '',
                            weight: weight ? weight : product.weight ? product.weight : '',
                            unit: unit ? unit : product.unit ? product.unit : '',
                            quantity: quantity ? quantity : product.quantity ? product.quantity : '',
                            expiryAt: expiry_at ? new Date(expiry_at).toISOString() : product.expiryAt ? product.expiryAt : '',
                            pupcGtinCode: pupc_gtin_code ? pupc_gtin_code : product.pupcGtinCode ? product.pupcGtinCode : '',
                            deliveryTimeInDays: delivery_time_in_days ? delivery_time_in_days : product.deliveryTimeInDays ? product.deliveryTimeInDays : '',
                            averageLifeInDays: average_life_in_days ? average_life_in_days : product.averageLifeInDays ? product.averageLifeInDays : '',
                            categoryId: category_id ? new ObjectId(category_id) : product.category_id ? product.category_id : '',
                            subCategoryId: sub_category_id ? new ObjectId(sub_category_id) : product.sub_category_id ? product.sub_category_id : '',
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
                                    message: data && data.nModified >= 1 ? "Product updated successfully" : "Product not modified"
                                }, cb);
                            } else close(client, SUCCESS, {
                                data: value.data,
                                message: "No value found."
                            }, cb);
                        }
                    });
                } else close(client, NOVALUE, {
                    message: "Product data is not available."
                }, cb);
            });
        }
    })
}

/**
 * Delete product
 * @param {*object} obj 
 * @param {*function} cb 
 */
var deleteProduct = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('products');
            var { product_id } = obj;

            confirmProduct(collection, {
                _id: new ObjectId(product_id)
            }, client, cb, () => {
                collection.updateOne({
                    _id: new ObjectId(product_id)
                }, {
                    $set: {
                        deletedStatus: ACTIVE,
                        updatedAt: new Date().toISOString()
                    }
                }, (err, value) => {
                    if (err) close(client, ERROR, err, cb);
                    else {
                        const { result: data } = value;
                        if (data && data.n) {
                            close(client, SUCCESS, {
                                status: data && data.nModified >= 1 ? "Deleted" : "Not Deleted",
                                data: value,
                                message: data && data.nModified >= 1 ? "Deleted successfully" : "Not Deleted"
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
 * Create category
 * @param {*object} obj 
 * @param {*function} cb 
 */
var createCategory = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('product_categories');
            var { name, _id } = obj;

            confirmCategory(collection, {
                name: name ? name.toLowerCase() : ''
            }, client, cb, () => {
                collection.insertOne({
                    name: name ? name.toLowerCase() : '',
                    createdBy: new ObjectId(_id),
                    deletedStatus: 0,
                    status: ACTIVE,
                    created_at: new Date().getTime(),
                    updated_at: new Date().getTime()
                }, (err, data) => {
                    if (err) close(client, ERROR, err, cb);
                    else close(client, SUCCESS, {
                        message: "Category successfully created."
                    }, cb);
                });
            });
        }
    })
}


/**
 * Disable category
 * @param {*object} obj 
 * @param {*function} cb 
 */
var disableCategory = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('product_categories');
            var { category_id } = obj;

            checkCategory(collection, {
                _id: new ObjectId(category_id)
            }, client, cb, () => {
                collection.updateOne({
                    _id: new ObjectId(category_id)
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
 * Enable category
 * @param {*object} obj 
 * @param {*function} cb 
 */
var enableCategory = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('product_categories');
            var { category_id } = obj;

            checkCategory(collection, {
                _id: new ObjectId(category_id)
            }, client, cb, () => {
                collection.updateOne({
                    _id: new ObjectId(category_id)
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
 * Get category via id
 * @param {*object} obj 
 * @param {*function} cb 
 */
var getCategoryViaId = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('product_categories');
            var { category_id } = obj;

            collection.find({
                _id: new ObjectId(category_id)
            }).toArray((err, data) => {
                if (err) close(client, ERROR, err, cb);
                else if (data && data.length !== 0) close(client, SUCCESS, data[0], cb);
                else close(client, NOVALUE, {
                    message: "Not Found"
                }, cb);
            });
        }
    })
}

/**
 * Get sub category via id
 * @param {*object} obj 
 * @param {*function} cb 
 */
var getSubCategoryViaId = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('product_sub_categories');
            var { category_id, sub_category_id } = obj;

            collection.find({
                _id: new ObjectId(sub_category_id),
                categoryId: new ObjectId(category_id)
            }).toArray((err, data) => {
                if (err) close(client, ERROR, err, cb);
                else if (data && data.length !== 0) close(client, SUCCESS, data[0], cb);
                else close(client, NOVALUE, {
                    message: "Not Found"
                }, cb);
            });
        }
    })
}

/**
 * Disable sub category
 * @param {*object} obj 
 * @param {*function} cb 
 */
var disableSubCategory = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('product_sub_categories');
            var { category_id, sub_category_id } = obj;

            checkCategory(collection, {
                _id: new ObjectId(sub_category_id),
                categoryId: new ObjectId(category_id)
            }, client, cb, () => {
                collection.updateOne({
                    _id: new ObjectId(sub_category_id),
                    categoryId: new ObjectId(category_id)
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
 * Enable sub category
 * @param {*object} obj 
 * @param {*function} cb 
 */
var enableSubCategory = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('product_sub_categories');
            var { category_id, sub_category_id } = obj;

            checkCategory(collection, {
                _id: new ObjectId(sub_category_id),
                categoryId: new ObjectId(category_id)
            }, client, cb, () => {
                collection.updateOne({
                    _id: new ObjectId(sub_category_id),
                    categoryId: new ObjectId(category_id)
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
 * Create sub-category
 * @param {*object} obj 
 * @param {*function} cb 
 */
var createSubCategory = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('product_sub_categories');
            var { name, _id, category_id } = obj;

            confirmCategory(collection, {
                categoryId: new ObjectId(category_id),
                name: name ? name.toLowerCase() : ''
            }, client, cb, () => {
                collection.insertOne({
                    name: name ? name.toLowerCase() : '',
                    createdBy: new ObjectId(_id),
                    categoryId: new ObjectId(category_id),
                    deletedStatus: 0,
                    status: ACTIVE,
                    created_at: new Date().getTime(),
                    updated_at: new Date().getTime()
                }, (err, data) => {
                    if (err) close(client, ERROR, err, cb);
                    else close(client, SUCCESS, {
                        message: "Sub-Category successfully created."
                    }, cb);
                });
            });
        }
    })
}

/**
 * Check for category info
 */
var confirmCategory = function (collection, query, client, cb, callback) {
    collection.find(query).toArray((err, data) => {
        if (err) close(client, ERROR, err, cb);
        else if (data && data.length === 0) {
            callback();
        } else close(client, PRESENT, {
            message: "Already present"
        }, cb);
    });
}

/**
 * Check for product info
 */
var confirmProduct = function (collection, query, client, cb, callback) {
    collection.find(query).toArray((err, data) => {
        if (err) close(client, ERROR, err, cb);
        else if (data && data.length !== 0) {
            callback();
        } else close(client, NOVALUE, {
            message: "Not Found"
        }, cb);
    });
}

/**
 * Check for category info
 */
var checkCategory = function (collection, query, client, cb, callback) {
    collection.find(query).toArray((err, data) => {
        if (err) close(client, ERROR, err, cb);
        else if (data && data.length !== 0) {
            callback();
        } else close(client, NOVALUE, {
            message: "No Value"
        }, cb);
    });
}

/** Data table api methods */

/**
 * Get category
 * @param {*object} obj 
 * @param {*function} cb 
 */
var getCategory = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('product_categories');
            const { draw, length, start } = obj;
            var _length = length ? typeof start === "string" ? parseInt(start) : start : 0;
            var _start = start ? typeof length === "string" ? parseInt(length) : length : 10;
            var _draw = draw ? typeof draw === 'string' ? parseInt(draw) : draw : 0;

            console.log("data ===> obj ", obj);

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
                        created_at: orderBy === "asc" ? 1 : -1
                    }
                    break;
                default:
                    // "_id"
                    sortQuery = {
                        created_at: -1
                    }
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
                                $or: [{
                                    $ne: [{
                                        $indexOfCP: [{ $toLower: "$name" }, search ? search.toLowerCase() : search]
                                    }, -1]
                                }]
                            }
                        },

                    }
                ] : [])
                .reverse();

            collection.aggregate(query, (err, cursor) => {
                if (err) close(client, DATA_TABLE_SUCCESS, {
                    "draw": _draw,
                    "recordsTotal": 0,
                    "recordsFiltered": 0,
                    "data": []
                }, cb);
                collection.find({}).count((err, count) => {
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
 * Get sub category
 * @param {*object} obj 
 * @param {*function} cb 
 */
var getSubCategory = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('product_sub_categories');
            const { draw, length, start } = obj;
            var _length = length ? typeof start === "string" ? parseInt(start) : start : 0;
            var _start = start ? typeof length === "string" ? parseInt(length) : length : 10;
            var _draw = draw ? typeof draw === 'string' ? parseInt(draw) : draw : 0;

            console.log("data ===> obj ", obj);

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
                    // "createdBy"
                    sortQuery = {
                        createdBy: orderBy === "asc" ? 1 : -1
                    }
                    break;
                case '2':
                    // "name"
                    sortQuery = {
                        name: orderBy === "asc" ? 1 : -1
                    }
                    break;
                case '3':
                    // "created_at"
                    sortQuery = {
                        created_at: orderBy === "asc" ? 1 : -1
                    }
                    break;
                default:
                    // "_id"
                    sortQuery = {
                        created_at: -1
                    }
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
                                $or: [{
                                    $ne: [{
                                        $indexOfCP: [{ $toLower: "$name" }, search ? search.toLowerCase() : search]
                                    }, -1]
                                }]
                            }
                        },

                    }
                ] : [])
                .reverse();

            collection.aggregate(query, (err, cursor) => {
                if (err) close(client, DATA_TABLE_SUCCESS, {
                    "draw": _draw,
                    "recordsTotal": 0,
                    "recordsFiltered": 0,
                    "data": []
                }, cb);
                collection.find({}).count((err, count) => {
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
 * Get products
 * @param {*object} obj 
 * @param {*function} cb 
 */
var getProducts = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('products');
            const { draw, length, start, category_id, sub_category_id } = obj;
            var _length = length ? typeof start === "string" ? parseInt(start) : start : 0;
            var _start = start ? typeof length === "string" ? parseInt(length) : length : 10;
            var _draw = draw ? typeof draw === 'string' ? parseInt(draw) : draw : 0;

            console.log("data ===> obj ", obj);

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
                case '4':
                    // "created_at"
                    sortQuery = {
                        createdAt: orderBy === "asc" ? 1 : -1
                    }
                    break;
            }

            //Search query
            var search = obj && obj['search[value]'] ? obj['search[value]'] : '';


            //Search query if category id is present
            var searchQuery = search ? [
                {
                    $eq: ["$deletedStatus", 0]
                },
                {
                    $ne: [{
                        $indexOfCP: [{ $toLower: "$name" }, search ? search.toLowerCase() : search]
                    }, -1]
                }
            ] : [
                    {
                        $eq: ["$deletedStatus", 0]
                    }
                ];

            if (category_id && sub_category_id && search) {
                searchQuery = [
                    { $eq: ["$categoryId", new ObjectId(category_id)] },
                    { $eq: ["$subCategoryId", new ObjectId(sub_category_id)] },
                    { $eq: ["$deletedStatus", 0] },
                    {
                        $ne: [{
                            $indexOfCP: [{ $toLower: "$name" }, search ? search.toLowerCase() : search]
                        }, -1]
                    }
                ]
            }

            if (category_id && sub_category_id && !search) {
                searchQuery = [
                    { $eq: ["$categoryId", new ObjectId(category_id)] },
                    { $eq: ["$subCategoryId", new ObjectId(sub_category_id)] },
                    { $eq: ["$deletedStatus", 0] }
                ]
            }

            //No search
            if (!search && !category_id && !sub_category_id) {
                searchQuery = [
                    {
                        $eq: ["$deletedStatus", 0]
                    }
                ];
            }

            //Query
            var query = [
                {
                    $unwind: {
                        path: "$subCategory",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "product_sub_categories",
                        let: { category_id: "$subCategoryId" },
                        pipeline: [
                            {
                                $match: {
                                    $expr:
                                    {
                                        $and:
                                            [
                                                { $eq: ["$_id", "$$category_id"] }
                                            ]
                                    }
                                }
                            },
                            {
                                $project: {
                                    name: 1
                                }
                            }
                        ],
                        as: "subCategory"
                    }
                },
                {
                    $unwind: {
                        path: "$category",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "product_categories",
                        let: { category_id: "$categoryId" },
                        pipeline: [
                            {
                                $match: {
                                    $expr:
                                    {
                                        $and:
                                            [
                                                { $eq: ["$_id", "$$category_id"] }
                                            ]
                                    }
                                }
                            },
                            {
                                $project: {
                                    name: 1
                                }
                            }
                        ],
                        as: "category"
                    }
                },
                { $limit: _start },
                { $skip: _length },
                { $sort: sortQuery }
            ]
                .concat([{
                    $match: {
                        $expr: {
                            $and: searchQuery
                        }
                    }
                }])
                .reverse();

            collection.aggregate(query, (err, cursor) => {
                if (err) close(client, DATA_TABLE_SUCCESS, {
                    "draw": _draw,
                    "recordsTotal": 0,
                    "recordsFiltered": 0,
                    "data": []
                }, cb);

                collection.aggregate([{
                    $match: {
                        $expr: {
                            $and: searchQuery
                        }
                    }
                }], (err, cursor1) => {
                    if (err) close(client, DATA_TABLE_SUCCESS, {
                        "draw": _draw,
                        "recordsTotal": 0,
                        "recordsFiltered": 0,
                        "data": []
                    }, cb);

                    cursor1.toArray((err, data) => {
                        if (err) {
                            close(client, DATA_TABLE_SUCCESS, {
                                "draw": _draw,
                                "recordsTotal": count,
                                "recordsFiltered": count,
                                "data": []
                            }, cb);
                            return;
                        }

                        var count = data && data.length ? data.length : 0;

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
            });
        }
    })
}

/** ----------------------------------------------------------------- */

/**
 * Get and Search category
 * @param {*object} obj 
 * @param {*function} cb 
 */
var getAndSearchCategory = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('product_categories');
            const { page, page_size, search } = obj;

            var _page = typeof page === "string" ? parseInt(page) : page;
            var _page_size = typeof page_size === "string" ? parseInt(page_size) : page_size;
            var skip = _page <= 0 ? 0 : (_page - 1) * _page_size;

            //Query
            var query = [
                {
                    $match: {
                        $expr: {
                            $and: [
                                {
                                    $eq: ["$status", ACTIVE]
                                }
                            ].concat(search ? [
                                {
                                    $ne: [{
                                        $indexOfCP: ["$name", search.toLowerCase()]
                                    }, -1]
                                }
                            ] : [])
                        }
                    },

                },
                { $sort: { "created_at": 1 } },
                { $skip: skip },
                { $limit: _page_size }
            ];

            collection.aggregate(query, (err, cursor) => {
                if (err) close(client, ERROR, err, cb);
                else collection.find({}).count((err, count) => {
                    if (err) {
                        close(client, ERROR, err, cb);
                        return;
                    }

                    cursor
                        .toArray((err, data) => {
                            if (err) close(client, ERROR, err, cb);
                            else close(client, SUCCESS, {
                                "totalItems": count,
                                "hasMore": count >= (skip + (_page_size + _page_size)),
                                "items": data
                            }, cb);
                        });
                });
            });
        }
    })
}

/**
 * Get and Search sub category
 * @param {*object} obj 
 * @param {*function} cb 
 */
var getAndSearchSubCategory = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('product_sub_categories');
            const { page, page_size, search, category_id } = obj;

            var _page = typeof page === "string" ? parseInt(page) : page;
            var _page_size = typeof page_size === "string" ? parseInt(page_size) : page_size;
            var skip = _page <= 0 ? 0 : (_page - 1) * _page_size;

            //Query
            var query = [
                {
                    $match: {
                        $expr: {
                            $and: [
                                {
                                    $eq: ["$status", ACTIVE],
                                    $eq: ["$categoryId", new ObjectId(category_id)]
                                }
                            ].concat(search ? [
                                {
                                    $ne: [{
                                        $indexOfCP: ["$name", search.toLowerCase()]
                                    }, -1]
                                }
                            ] : [])
                        }
                    },

                },
                { $sort: { "created_at": 1 } },
                { $skip: skip },
                { $limit: _page_size }
            ];

            collection.aggregate(query, (err, cursor) => {
                if (err) close(client, ERROR, err, cb);
                else collection.find({}).count((err, count) => {
                    if (err) {
                        close(client, ERROR, err, cb);
                        return;
                    }

                    cursor
                        .toArray((err, data) => {
                            if (err) close(client, ERROR, err, cb);
                            else close(client, SUCCESS, {
                                "totalItems": count,
                                "hasMore": count >= (skip + (_page_size + _page_size)),
                                "items": data
                            }, cb);
                        });
                });
            });
        }
    })
}

/**
 * Get products via id
 * @param {*object} obj 
 * @param {*function} cb 
 */
var getProductViaId = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('products');
            const { product_id } = obj;

            collection.find({ _id: new ObjectId(product_id) }).toArray((err, data) => {
                if (err) close(client, ERROR, err, cb);
                else if (data && data.length !== 0) close(client, SUCCESS, data[0], cb);
                else close(client, NOVALUE, {
                    message: "No Product Found"
                }, cb);
            });
        }
    })
}

/**
 * Export all products csv file
 * @param {*object} obj 
 * @param {*function} cb 
 */
var exportAllProducts = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('products');

            collection.aggregate([
                {
                    $lookup: {
                        from: "product_categories",
                        let: { category_id: "$categoryId" },
                        pipeline: [
                            {
                                $match: {
                                    $expr:
                                    {
                                        $and:
                                            [
                                                { $eq: ["$_id", "$$category_id"] }
                                            ]
                                    }
                                }
                            },
                            {
                                $project: {
                                    name: 1
                                }
                            }
                        ],
                        as: "category"
                    }
                },
                {
                    $unwind: {
                        path: "$category",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "product_sub_categories",
                        let: { category_id: "$subCategoryId" },
                        pipeline: [
                            {
                                $match: {
                                    $expr:
                                    {
                                        $and:
                                            [
                                                { $eq: ["$_id", "$$category_id"] }
                                            ]
                                    }
                                }
                            },
                            {
                                $project: {
                                    name: 1
                                }
                            }
                        ],
                        as: "subCategory"
                    }
                },
                {
                    $unwind: {
                        path: "$subCategory",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $addFields: {
                        "specs.fuel_type": "unleaded"
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        category: "$category.name",
                        sub_category: "$subCategory.name"
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
 * Get all categories list
 * @param {*object} obj 
 * @param {*function} cb 
 */
var getAllCategoriesList = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('product_categories');
            var { page, page_size } = obj;

            page_size = page_size ? page_size : 10;
            page = page ? page : 1;
            var skip = (!page || (page === 1 || page === 0)) ? 0 : (page - 1) * page_size;

            //Query
            var query = [
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: ["$status", ACTIVE] },
                            ]
                        }
                    }
                },
                { $sort: { "created_at": 1 } },
                { $skip: skip },
                { $limit: page_size }
            ];

            collection.aggregate(query, (err, cursor) => {
                if (err) close(client, ERROR, err, cb);
                else cursor
                    .toArray((err, data) => {
                        if (err) close(client, ERROR, err, cb);
                        else close(client, SUCCESS, data, cb);
                    });
            });
        }
    })
}

/**
 * Get all sub-categories list including products
 * @param {*object} obj 
 * @param {*function} cb 
 */
var getAllSubCategoriesListWithProducts = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('product_sub_categories');

            var { page, page_size, category_id } = obj;

            page_size = page_size ? page_size : 10;
            page = page ? page : 1;
            var skip = (!page || (page === 1 || page === 0)) ? 0 : (page - 1) * page_size;

            //Query
            var query = [
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: ["$status", ACTIVE] },
                                { $eq: ["$categoryId", new ObjectId(category_id)] }
                            ]
                        }
                    }
                },
                {
                    $lookup: {
                        from: "products",
                        let: { sub_category_id: "$_id", category_id: "$categoryId" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$deletedStatus", 0] },
                                            { $eq: ["$subCategoryId", "$$sub_category_id"] },
                                            { $eq: ["$categoryId", "$$category_id"] }
                                        ]
                                    }
                                }
                            },
                            {
                                $limit: 2
                            }
                        ],
                        as: "products"
                    }
                },
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $ne: [{ $cond: { if: { $isArray: "$products" }, then: { $size: "$products" }, else: 0 } }, 0] },
                            ]
                        }
                    }
                },
                { $sort: { "created_at": 1 } },
                { $skip: skip },
                { $limit: page_size }
            ];

            collection.aggregate(query, (err, cursor) => {
                if (err) close(client, ERROR, err, cb);
                else cursor
                    .toArray((err, data) => {
                        if (err) close(client, ERROR, err, cb);
                        else close(client, SUCCESS, data, cb);
                    });
            });
        }
    })
}

/**
 * Get all sub-category list including products
 * @param {*object} obj 
 * @param {*function} cb 
 */
var getAllSubCategoryListWithProducts = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('products');

            var { page, page_size, category_id, sub_category_id, name_sorting, price_sorting } = obj;

            page_size = page_size ? page_size : 10;
            page = page ? page : 1;
            var skip = (!page || (page === 1 || page === 0)) ? 0 : (page - 1) * page_size;

            var sortQuery = { "created_at": 1 };
            if (name_sorting) {
                sortQuery = { "name": name_sorting === ASCENDING_SORT ? 1 : -1 };
            } else if (price_sorting) {
                sortQuery = { "refillPrice": price_sorting === ASCENDING_SORT ? 1 : -1 };
            }

            console.log(sortQuery, obj);

            //Query
            var query = [
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: ["$deletedStatus", 0] },
                                { $eq: ["$subCategoryId", new ObjectId(sub_category_id)] },
                                { $eq: ["$categoryId", new ObjectId(category_id)] }
                            ]
                        }
                    }
                },
                {
                    $lookup: {
                        from: "product_sub_categories",
                        let: { sub_category_id: "$subCategoryId", category_id: "$categoryId" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$status", ACTIVE] },
                                            { $eq: ["$_id", "$$sub_category_id"] }
                                        ]
                                    }
                                }
                            }
                        ],
                        as: "sub_category"
                    }
                },
                { $sort: sortQuery },
                { $skip: skip },
                { $limit: page_size }
            ];

            collection.aggregate(query, (err, cursor) => {
                if (err) close(client, ERROR, err, cb);
                else cursor
                    .toArray((err, data) => {
                        if (err) close(client, ERROR, err, cb);
                        else close(client, SUCCESS, data, cb);
                    });
            });
        }
    })
}

/**
 * Get all products
 * @param {*object} obj 
 * @param {*function} cb 
 */
var getAllProducts = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('products');
            let { page, page_size, search, sort = ASCENDING_SORT } = obj;

            page_size = page_size ? page_size : 10;
            page = page ? page : 1;
            var skip = (!page || (page === 1 || page === 0)) ? 0 : (page - 1) * page_size;

            //Query
            var query = [
                {
                    $addFields: {
                        name: { $cond: { if: "$name", then: { $toLower: "$name" }, else: null } }
                    }
                },
                {
                    $match: {
                        $expr: {
                            $and: [
                                {
                                    $eq: ["$deletedStatus", 0]
                                }
                            ].concat(search ? [
                                { $ne: ["$name", undefined] },
                                { $ne: ["$name", null] },
                                {
                                    $ne: [{
                                        $indexOfCP: ["$name", search.toLowerCase()]
                                    }, -1]
                                }
                            ] : [])
                        }
                    },

                },
                { $sort: { "updatedAt": ASCENDING_SORT === sort ? 1 : -1 } },
                { $skip: skip },
                { $limit: page_size }
            ];

            collection.aggregate(query, (err, cursor) => {
                if (err) close(client, ERROR, err, cb);
                else cursor
                    .toArray((err, data) => {
                        if (err) close(client, ERROR, err, cb);
                        else close(client, SUCCESS, data, cb);
                    });
            });
        }
    })
}

module.exports = {
    createProduct,
    updateProduct,
    createCategory,
    createSubCategory,
    getCategory,
    getAndSearchCategory,
    getAndSearchSubCategory,

    enableCategory,
    disableCategory,
    enableSubCategory,
    disableSubCategory,

    getSubCategory,
    getProducts,
    getProductViaId,
    exportAllProducts,

    getCategoryViaId,
    getSubCategoryViaId,
    deleteProduct,

    getAllCategoriesList,
    getAllSubCategoriesListWithProducts,
    getAllSubCategoryListWithProducts,

    getAllProducts
}