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
    DRIVER,
    PHONE_PRESENT,
    EMAIL_PRESENT,
    OFFERS_ALL_CATEGORY_PRODUCTS,
    OFFERS_ALL_PRODUCTS,
    OFFERS_ALL_SUB_CATEGORY_PRODUCTS,
    OFFERS_CUSTOM_PRODUCTS
} = require("../constant");
var {
    ObjectID,
    ObjectId
} = require("mongodb");
var {
    close,
    generateToken,
    randomPassword,
    getTime
} = require("../common");
var { getCollection } = require("./customer");

/**
 * Make Offer 
 * @param {*object} obj 
 * @param {*function} cb 
 */
var makeOffer = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('products');
            var { _id, category_id, offer_type, _sub_cateogry_id, discount, start_date, end_date, product_ids, description } = obj;

            let _query = undefined;

            switch (offer_type) {
                case OFFERS_ALL_PRODUCTS:
                    _query = {};
                    break;
                case OFFERS_ALL_CATEGORY_PRODUCTS:
                    _query = {
                        categoryId: ObjectId(category_id)
                    }
                    break;
                case OFFERS_ALL_SUB_CATEGORY_PRODUCTS:
                    _query = {
                        categoryId: ObjectId(category_id),
                        subCategoryId: ObjectId(_sub_cateogry_id)
                    }
                    break;
                case OFFERS_CUSTOM_PRODUCTS:
                    if (!product_ids || (product_ids && !product_ids.length)) {
                        close(client, ERROR, {
                            message: "No Product ID is Available."
                        }, cb);
                        return;
                    }

                    let ids = product_ids.map(ele => {
                        if (ele && ele.length === 24) return ObjectId(ele);

                        return null;
                    })

                    if ((ids.indexOf(null) !== -1) || (ids && !ids.length) || (!ids)) {
                        close(client, ERROR, {
                            message: "Products ID are Not Valid"
                        }, cb);
                        return;
                    }

                    _query = {
                        _id: { $in: ids }
                    }
                    break;
            }

            if (!_query) {
                close(client, ERROR, {
                    message: "No query found to update the records"
                }, cb);
                return;
            }

            collection.updateMany(_query, {
                $set: {
                    discount: {
                        value: discount,
                        description,
                        createdBy: ObjectId(_id),
                        start_date: new Date(start_date).toISOString(),
                        end_date: new Date(end_date).toISOString(),
                        updateAt: new Date().toISOString()
                    },
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
        }
    })
}

/**
 * Remove Offer 
 * @param {*function} cb 
 */
var removeOffer = function (cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('products');

            collection.aggregate([
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $lt: ["$discount.end_date", new Date().toISOString()] },
                                { $ne: ["$discount", null] }
                            ]
                        }
                    }
                },
                {
                    $project: {
                        _id: 1
                    }
                }
            ], (err, cursor) => {
                if (err) close(client, ERROR, err, cb);
                else {
                    cursor.toArray((err, data) => {
                        if (err) close(client, ERROR, err, cb);
                        else if (data && data.length)
                            collection.updateMany({ _id: { $in: data.map(ele => ele._id) } }, {
                                $set: {
                                    discount: null,
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
                        else close(client, NOVALUE, {
                            message: "No product found"
                        }, cb);
                    })
                }
            });
        }
    })
}

module.exports = {
    makeOffer,
    removeOffer
}