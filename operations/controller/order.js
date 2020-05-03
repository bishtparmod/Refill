var connection = require("../connection");
var {
    SUCCESS,
    ERROR,
    NOVALUE,
    PRESENT,
    ACTIVE,
    DATA_TABLE_SUCCESS,
    NOT_VALID,
    ADMIN,
    DEACTIVE,
    DRIVER,
    PHONE_PRESENT,
    EMAIL_PRESENT,

    ORDER_TYPE_BI_WEEKLY,
    ORDER_TYPE_WEEKLY,
    ORDER_TYPE_BI_MONTHLY,
    ORDER_TYPE_MONTHLY,
    ORDER_TYPE_CUSTOM,

    ORDER_STATUS_RECEIVED,
    ORDER_STATUS_CANCELLED,
    ORDER_STATUS_SKIPPED,
    ORDER_STATUS_PROCESSED,
    ORDER_STATUS_SHIPPED,
    ORDER_STATUS_DELIVERED,
    ORDER_STATUS_REFILL,
    ORDER_STATUS_REFUNDED,

    ACTIVE_ORDER,
    PENDING_ORDER,
    REFILL_ORDER,
    PAST_ORDER,
    ALL_ORDER,

    ORDER_CANCEL_BEFORE_TIME_IN_SECONDS,

    ASCENDING_SORT,
    DESCENDING_SORT,

    CURRENT_ORDER,
    FUTURE_ORDER,
    CANCELLED_ORDER
} = require("../constant");
var {
    ObjectID,
    ObjectId
} = require("mongodb");
var {
    close,
    generateToken,
    randomPassword,
    getTime,
    getMonthNumber
} = require("../common");
var { getCollection } = require("./customer");

/**
 * Place Order
 * @param {*array} orders 
 * @param {*function} cb 
 */
var placeOrder = function (orders, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('orders');

            collection.insertMany(orders).then((data) => {
                close(client, SUCCESS, {
                    message: "Order placed successfully"
                }, cb);
            }).catch(error => {
                close(client, ERROR, error, cb);
            });;
        }
    })
}

/**
 * Place Get Now Order
 * @param {*object} orders 
 * @param {*function} cb 
 */
var placeGetNowOrder = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('orders');

            collection.insert(obj).then((data) => {
                close(client, SUCCESS, {
                    message: "Order placed successfully"
                }, cb);
            }).catch(error => {
                close(client, ERROR, error, cb);
            });;
        }
    })
}

/**
 * Get all Placed Orders
 * @param {*object} orders 
 * @param {*function} cb 
 */
var getAllPlacedOrders = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('orders');
            const { common_order_id } = obj;

            collection.find({ uuid: common_order_id }).toArray((err, data) => {
                if (err) close(client, ERROR, err, cb);
                else close(client, SUCCESS, data, cb);
            })
        }
    })
}

/**
 * Cancel Order
 * @param {*array} orders 
 * @param {*function} cb 
 */
var cancelOrder = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('orders');
            const { order_id } = obj;

            collection.updateOne({ _id: new ObjectId(order_id) }, {
                $set: {
                    orderStatus: ORDER_STATUS_CANCELLED,
                    cancelledOrderDate: new Date().toISOString(),
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
 * Cancel Refill Order
 * @param {*array} orders 
 * @param {*function} cb 
 */
var cancelRefillOrder = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('orders');
            const { uuid } = obj;
            console.log("{ uuid: uuid, orderStatus: ORDER_STATUS_REFILL } ===> ", JSON.stringify({ uuid: uuid, orderStatus: ORDER_STATUS_REFILL }));
            collection.updateMany({ uuid: uuid, orderStatus: ORDER_STATUS_REFILL }, {
                $set: {
                    orderStatus: ORDER_STATUS_CANCELLED,
                    cancelledOrderDate: new Date().toISOString(),
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
 * Skip Order
 * @param {*array} orders 
 * @param {*function} cb 
 */
var skipOrder = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('orders');
            const { order_id } = obj;

            collection.updateOne({ _id: new ObjectId(order_id) }, {
                $set: {
                    orderStatus: ORDER_STATUS_SKIPPED,
                    skippedOrderDate: new Date().toISOString(),
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
 * Valid Order
 * @param {*array} orders 
 * @param {*function} cb 
 */
var isValidCancelSkip = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('orders');
            const { order_id } = obj;

            collection.find({ _id: new ObjectId(order_id) }).toArray((err, data) => {
                if (err) close(client, ERROR, err, cb);
                else if (data && data.length) {
                    const { place_order_date } = data[0];
                    const seconds = (new Date(place_order_date) - new Date());
                    if (seconds >= ORDER_CANCEL_BEFORE_TIME_IN_SECONDS) close(client, SUCCESS, seconds, cb);
                    else close(client, NOT_VALID, {
                        message: "Order is under processing state, you can't skip/cancel"
                    }, cb);
                } else close(client, NOVALUE, data, cb);
            });
        }
    })
}

/**
 * Processed Order
 * @param {*array} orders 
 * @param {*function} cb 
 */
var processOrder = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('orders');
            const { order_id } = obj;

            collection.updateOne({ _id: new ObjectId(order_id) }, {
                $set: {
                    orderStatus: ORDER_STATUS_PROCESSED,
                    processedOrderDate: new Date().toISOString(),
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
 * Shipped Order
 * @param {*array} orders 
 * @param {*function} cb 
 */
var shippedOrder = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('orders');
            const { order_id, driver_id } = obj;

            collection.updateOne({ _id: new ObjectId(order_id) }, {
                $set: {
                    orderStatus: ORDER_STATUS_SHIPPED,
                    assigned_driver_id: ObjectId(driver_id),
                    shippedOrderDate: new Date().toISOString(),
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
 * Delivered Order
 * @param {*array} orders 
 * @param {*function} cb 
 */
var deliveredOrder = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('orders');
            const { order_id } = obj;

            collection.updateOne({ _id: new ObjectId(order_id) }, {
                $set: {
                    orderStatus: ORDER_STATUS_DELIVERED,
                    deliveredOrderDate: new Date().toISOString(),
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

/** Compute order
 * @param {@object} obj
 */
var computeOrders = (obj) => {
    const { orderDate, orderType } = obj;
    let placeOrderDates = '';

    if (orderType !== ORDER_TYPE_CUSTOM) {
        const startDate = new Date(getTime(orderDate[0]));
        const endDate = new Date(getTime(orderDate[1]));

        let order_process_gap_in_days = 0;
        switch (orderType) {
            case ORDER_TYPE_WEEKLY:
                order_process_gap_in_days = 7;
                break;
            case ORDER_TYPE_BI_WEEKLY:
                order_process_gap_in_days = 14;
                break;
            case ORDER_TYPE_MONTHLY:
                order_process_gap_in_days = 28;
                break;
            case ORDER_TYPE_BI_MONTHLY:
                order_process_gap_in_days = 56;
                break;
        }

        let initDate = startDate;
        while (initDate <= endDate) {
            console.log("initDate ===> endDate", startDate === endDate);
            placeOrderDates += `,${getTime(initDate)}`
            initDate.setDate(initDate.getDate() + order_process_gap_in_days);
        }

        return placeOrderDates.split(',').filter(ele => ele);
    }

    return orderDate.map(ele => `${getTime(ele)}`);
}

/**
 * View Order
 * @param {*array} orders 
 * @param {*function} cb 
 */
var viewOrder = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('orders');
            const { order_id } = obj;

            collection.aggregate([
                {
                    $match: { "_id": ObjectId(order_id) }
                },
                {
                    $lookup: {
                        from: "product_categories",
                        let: { categoryId: "$productDetail.categoryId" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: {
                                            $eq: ["$_id", "$$categoryId"]
                                        }
                                    }
                                }
                            }
                        ],
                        as: "productCategory"
                    }
                },
                {
                    $unwind: {
                        path: "$productCategory",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "product_sub_categories",
                        let: { subCategoryId: "$productDetail.subCategoryId" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: {
                                            $eq: ["$_id", "$$subCategoryId"]
                                        }
                                    }
                                }
                            }
                        ],
                        as: "productSubCategory"
                    }
                },
                {
                    $unwind: {
                        path: "$productSubCategory",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        let: { driver_id: "$assigned_driver_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: {
                                            $eq: ["$_id", "$$driver_id"]
                                        }
                                    }
                                }
                            }
                        ],
                        as: "productDriver"
                    }
                },
                {
                    $unwind: {
                        path: "$productDriver",
                        preserveNullAndEmptyArrays: true
                    }
                }
            ], (err, cursor) => {
                if (err) close(client, ERROR, err, cb);
                cursor
                    .toArray((err, data) => {
                        if (err) close(client, ERROR, err, cb);
                        else if (data && data.length) close(client, SUCCESS, data[0], cb);
                        else close(client, NOVALUE, {
                            message: "No record found"
                        }, cb);
                    });
            });
        }
    });
}


/**
 * Place automatic payment
 * @param {*function} cb 
 */
var autoPlaceOrder = function (cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('orders');

            collection.aggregate([
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $lt: ["$place_order_date_iso", new Date().toISOString()] },
                                { $eq: ["$orderStatus", ORDER_STATUS_REFILL] }
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
                                    orderStatus: ORDER_STATUS_PROCESSED,
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

/**
 * 48 hours prior notification
 * @param {*function} cb 
 */
var getUpcomingOrders = function (cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('orders');
            var users = db.collection('device_tokens');

            collection.aggregate([
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: ["$orderStatus", ORDER_STATUS_REFILL] }
                            ]
                        }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        place_order_date_iso: 1,
                        customerId: 1
                    }
                }
            ], (err, cursor) => {
                if (err) close(client, ERROR, err, cb);
                else {
                    cursor.toArray((err, data) => {

                        if (err) close(client, ERROR, err, cb);
                        else if (data && data.length) {
                            const allOrders = data.map(ele => {
                                ele.timeDifference = (new Date(ele.place_order_date_iso) - new Date()) / (1000 * 3600);
                                return ele;
                            }).filter(ele => ele.timeDifference >= 8057 && ele.timeDifference <= 8394);

                            let users_id = allOrders.map(ele => ele.customerId.toString());
                            users_id = users_id.filter((ele, index) => (users_id.indexOf(ele.toString()) === index) ? true : false).map(ele => new ObjectId(ele));

                            users.find({ user_id: { $in: users_id } }).toArray((err, data) => {
                                if (err) close(client, ERROR, err, cb);
                                else {
                                    const notificationTokens = data.map(ele => ele.devices);
                                    close(client, SUCCESS, notificationTokens, cb);
                                }
                            });
                        } else close(client, NOVALUE, {
                            message: "No order found"
                        }, cb);
                    })
                }
            });
        }
    })
}

/** Order data tables */

/**
 * Get orders
 * @param {*object} obj 
 * @param {*function} cb 
 */
var getOrders = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('orders');
            const { draw, length, start, order_status } = obj;
            var _length = length ? typeof start === "string" ? parseInt(start) : start : 0;
            var _start = start ? typeof length === "string" ? parseInt(length) : length : 10;
            var _draw = draw ? typeof draw === 'string' ? parseInt(draw) : draw : 0;

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
                        createAt: orderBy === "asc" ? 1 : -1
                    }
                    break;
            }

            var orderStatusFilter = [];

            switch (order_status) {
                case ACTIVE_ORDER:
                    orderStatusFilter = [
                        {
                            $or: [
                                {
                                    $eq: ["$orderStatus", ORDER_STATUS_SHIPPED]
                                },
                                {
                                    $eq: ["$orderStatus", ORDER_STATUS_PROCESSED],
                                }
                            ]
                        }
                    ];
                    break;
                case REFILL_ORDER:
                    orderStatusFilter = [
                        {
                            $eq: ["$orderStatus", ORDER_STATUS_REFILL]
                        }
                    ];
                    break;
                case PENDING_ORDER:
                    orderStatusFilter = [
                        {
                            $eq: ["$orderStatus", ORDER_STATUS_RECEIVED]
                        }
                    ];
                    break;
                case PAST_ORDER:
                    orderStatusFilter = [
                        {
                            $or: [
                                {
                                    $eq: ["$orderStatus", ORDER_STATUS_CANCELLED]
                                },
                                {
                                    $eq: ["$orderStatus", ORDER_STATUS_SKIPPED]
                                },
                                {
                                    $eq: ["$orderStatus", ORDER_STATUS_DELIVERED]
                                }
                            ]
                        }
                    ];
                    break;
            }

            orderStatusFilter.push({
                $eq: ["$deletedStatus", 0]
            });

            //Search query
            var search = obj && obj['search[value]'] ? obj['search[value]'] : '';

            if (search) {
                orderStatusFilter.push({
                    $eq: ["$_id", search.length === 24 ? ObjectId(search) : search]
                });
            }

            //Query
            var query = [
                { $limit: _start },
                { $skip: _length },
                { $sort: sortQuery },
                {
                    $unwind: {
                        path: "$productDriver",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        let: { driver_id: "$assigned_driver_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: {
                                            $eq: ["$_id", "$$driver_id"]
                                        }
                                    }
                                }
                            },
                            {
                                $project: {
                                    slug: 0,
                                    password: 0,
                                    userAccessToken: 0
                                }
                            }
                        ],
                        as: "productDriver"
                    }
                },
                {
                    $unwind: {
                        path: "$productCategory",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "product_categories",
                        let: { categoryId: "$productDetail.categoryId" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: {
                                            $eq: ["$_id", "$$categoryId"]
                                        }
                                    }
                                }
                            }
                        ],
                        as: "productCategory"
                    }
                },
                {
                    $unwind: {
                        path: "$productSubCategory",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "product_sub_categories",
                        let: { subCategoryId: "$productDetail.subCategoryId" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: {
                                            $eq: ["$_id", "$$subCategoryId"]
                                        }
                                    }
                                }
                            }
                        ],
                        as: "productSubCategory"
                    }
                }
            ]
                .concat(search ? [
                    {
                        $match: {
                            $expr: {
                                $and: orderStatusFilter
                            }
                        },

                    }
                ] : [
                        {
                            $match: {
                                $expr: {
                                    $and: orderStatusFilter
                                }
                            }
                        }
                    ])
                .reverse();

            let _order_status = {};
            switch (order_status) {
                case ACTIVE_ORDER:
                    _order_status = {
                        orderStatus: { $in: [ORDER_STATUS_PROCESSED, ORDER_STATUS_SHIPPED] }
                    };
                    break;
                case REFILL_ORDER:
                    _order_status = {
                        orderStatus: ORDER_STATUS_REFILL
                    };
                    break;
                case PENDING_ORDER:
                    _order_status = {
                        orderStatus: ORDER_STATUS_RECEIVED
                    };
                    break;
                case PAST_ORDER:
                    _order_status = {
                        orderStatus: { $in: [ORDER_STATUS_CANCELLED, ORDER_STATUS_SKIPPED, ORDER_STATUS_DELIVERED] }
                    };
                    break;
            }

            collection.aggregate(query, (err, cursor) => {
                if (err) close(client, DATA_TABLE_SUCCESS, {
                    "draw": _draw,
                    "recordsTotal": 0,
                    "recordsFiltered": 0,
                    "data": []
                }, cb);
                collection.find({ deletedStatus: 0, ..._order_status }).count((err, count) => {
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
 * Shipped order list
 * @param {*array} orders 
 * @param {*function} cb 
 */
var shippedOrderList = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('orders');
            var { page, page_size, _id, sort = ASCENDING_SORT, user_id, order_id } = obj;
            page_size = page_size ? page_size : 10;
            page = page ? page : 1;
            var skip = (!page || (page === 1 || page === 0)) ? 0 : (page - 1) * page_size;

            console.log("skip ===> ", skip, page_size, sort);
            collection.aggregate([
                {
                    $match: Object.assign({
                        orderStatus: ORDER_STATUS_SHIPPED,
                        assigned_driver_id: ObjectId(_id)
                    }, user_id ? {
                        customerId: new ObjectId(user_id)
                    } : order_id ? {
                        _id: new ObjectId(order_id)
                    } : {})
                },
                {
                    $sort: {
                        updatedAt: sort === ASCENDING_SORT ? 1 : -1
                    }
                },
                { $skip: skip },
                { $limit: page_size }
            ], (err, cursor) => {
                if (err) close(client, ERROR, err, cb);
                cursor
                    .toArray((err, data) => {
                        if (err) close(client, ERROR, err, cb);
                        else close(client, SUCCESS, data, cb);
                    });
            });
        }
    });
}

/**
 * Delivered order list
 * @param {*array} orders 
 * @param {*function} cb 
 */
var deliveredOrderList = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('orders');
            var { page, page_size, _id, sort = ASCENDING_SORT, user_id, order_id } = obj;
            page_size = page_size ? page_size : 10;
            page = page ? page : 1;
            var skip = (!page || (page === 1 || page === 0)) ? 0 : (page - 1) * page_size;

            console.log("skip ===> ", skip, page_size, sort);
            collection.aggregate([
                {
                    $match: Object.assign({
                        orderStatus: ORDER_STATUS_DELIVERED,
                        assigned_driver_id: ObjectId(_id)
                    }, user_id ? {
                        customerId: new ObjectId(user_id)
                    } : order_id ? {
                        _id: new ObjectId(order_id)
                    } : {})
                },
                {
                    $sort: {
                        updatedAt: sort === ASCENDING_SORT ? 1 : -1
                    }
                },
                { $skip: skip },
                { $limit: page_size }
            ], (err, cursor) => {
                if (err) close(client, ERROR, err, cb);
                cursor
                    .toArray((err, data) => {
                        if (err) close(client, ERROR, err, cb);
                        else close(client, SUCCESS, data, cb);
                    });
            });
        }
    });
}

/**
 * Order list
 * @param {*array} orders 
 * @param {*function} cb 
 */
var orderList = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('orders');
            var { page, page_size, _id, sort = ASCENDING_SORT, order_status } = obj;
            page_size = page_size ? page_size : 10;
            page = page ? page : 1;
            var skip = (!page || (page === 1 || page === 0)) ? 0 : (page - 1) * page_size;
            var orderStatus = [];
            var query = undefined;

            const current_order = [ORDER_STATUS_RECEIVED, ORDER_STATUS_PROCESSED, ORDER_STATUS_SHIPPED];
            const future_order = [ORDER_STATUS_REFILL];
            const past_order = [ORDER_STATUS_DELIVERED];
            const cancelled_order = [ORDER_STATUS_SKIPPED, ORDER_STATUS_CANCELLED];

            switch (order_status) {
                case CURRENT_ORDER:
                    orderStatus = current_order;
                    break;
                case FUTURE_ORDER:
                    orderStatus = future_order;
                    break;
                case PAST_ORDER:
                    orderStatus = past_order;
                    break;
                case CANCELLED_ORDER:
                    orderStatus = cancelled_order;
                    break;
                case ALL_ORDER:
                default:
                    query = [
                        {
                            $match: {
                                $expr: {
                                    $and: {
                                        $eq: [new ObjectId(_id), "$customerId"]
                                    }
                                }
                            }
                        },
                        {
                            $sort: {
                                updatedAt: sort === ASCENDING_SORT ? 1 : -1
                            }
                        },
                        {
                            $group: {
                                _id: 1,
                                current: {
                                    $addToSet: {
                                        $cond: {
                                            if: { $in: ["$orderStatus", current_order] },
                                            then: "$$ROOT",
                                            else: null
                                        }
                                    }
                                },
                                future: {
                                    $addToSet: {
                                        $cond: {
                                            if: { $in: ["$orderStatus", future_order] },
                                            then: "$$ROOT",
                                            else: null
                                        }
                                    }
                                },
                                past: {
                                    $addToSet: {
                                        $cond: {
                                            if: { $in: ["$orderStatus", past_order] },
                                            then: "$$ROOT",
                                            else: null
                                        }
                                    }
                                },
                                cancel: {
                                    $addToSet: {
                                        $cond: {
                                            if: { $in: ["$orderStatus", cancelled_order] },
                                            then: "$$ROOT",
                                            else: null
                                        }
                                    }
                                }
                            }
                        }
                    ]
            }

            console.log("skip ===> ", skip, page_size, sort, orderStatus);
            collection.aggregate(query ?
                query : [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: [{ $in: ["$orderStatus", orderStatus] }, true] },
                                    { $eq: [new ObjectId(_id), "$customerId"] }
                                ]
                            }
                        }
                    },
                    {
                        $sort: {
                            updatedAt: sort === ASCENDING_SORT ? 1 : -1
                        }
                    },
                    { $skip: skip },
                    { $limit: page_size }
                ], (err, cursor) => {
                    if (err) close(client, ERROR, err, cb);
                    cursor
                        .toArray((err, data) => {
                            if (err) close(client, ERROR, err, cb);
                            else if (data && data.length) {
                                const info = data[0];

                                if (order_status === ALL_ORDER)
                                    close(client, SUCCESS, {
                                        hasMore: false,
                                        data: {
                                            current: info && info.current && info.current.length ? info.current.filter(ele => ele).slice(0, 4) : [],
                                            future: info && info.future && info.future.length ? info.future.filter(ele => ele).slice(0, 4) : [],
                                            past: info && info.past && info.past.length ? info.past.filter(ele => ele).slice(0, 4) : [],
                                            cancel: info && info.cancel && info.cancel.length ? info.cancel.filter(ele => ele).slice(0, 4) : [],
                                        }
                                    }, cb);
                                else close(client, SUCCESS, {
                                    hasMore: data.length ? true : false,
                                    data
                                }, cb);
                            } else close(client, NOVALUE, [], cb);
                        });
                });
        }
    });
}

/**
 * Get all order list with subscription list
 * @param {*object} orders 
 * @param {*function} cb 
 */
var getAllSubscribedOrderViaSubscriptionId = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('orders');
            var { subscriptionId } = obj;

            collection.find({ "payment_info.subscription.id": subscriptionId }).sort({ place_order_date_iso: 1 }).toArray((err, data) => {
                if (err) close(client, ERROR, error, cb);
                else close(client, SUCCESS, data, cb);
            });
        }
    })
}

/**
 * Mark Order Paid
 * @param {*array} orders 
 * @param {*function} cb 
 */
var markOrderPaid = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('orders');
            const { order_id, paidStatus, payment_info } = obj;

            collection.updateOne({ _id: new ObjectId(order_id) }, {
                $set: {
                    paidStatus: paidStatus,
                    payment_info: payment_info,
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

/** -------------------------------------------------------------- */

module.exports = {
    getOrders,
    computeOrders,
    placeOrder,
    cancelOrder,
    skipOrder,
    processOrder,
    deliveredOrder,
    shippedOrder,
    isValidCancelSkip,
    viewOrder,
    cancelRefillOrder,
    autoPlaceOrder,
    shippedOrderList,
    deliveredOrderList,
    getAllPlacedOrders,
    orderList,
    placeGetNowOrder,
    getAllSubscribedOrderViaSubscriptionId,
    markOrderPaid,
    getUpcomingOrders
}





















// switch (order_status) {
//     case ACTIVE_ORDER:
//         orderStatusFilter = [
//             {
//                 $eq: ["$orderStatus", ORDER_STATUS_PROCESSED]
//             }
//         ];
//         break;
//     case REFILL_ORDER:
//         orderStatusFilter = [
//             {
//                 $eq: ["$orderStatus", ORDER_STATUS_REFILL]
//             },
//             // {
//             //     $gte: ["$place_order_date_iso", new Date().toISOString()]
//             // }
//         ];
//         break;
//     case PENDING_ORDER:
//         orderStatusFilter = [
//             {
//                 $eq: ["$orderStatus", ORDER_STATUS_RECEIVED]
//             },
//             // {
//             //     $gte: ["$place_order_date_iso", new Date().toISOString()]
//             // }
//         ];
//         break;
//     case PAST_ORDER:
//         orderStatusFilter = [
//             {
//                 $or: [
//                     {
//                         $eq: ["$orderStatus", ORDER_STATUS_CANCELLED]
//                     },
//                     {
//                         $eq: ["$orderStatus", ORDER_STATUS_SKIPPED]
//                     },
//                     {
//                         $eq: ["$orderStatus", ORDER_STATUS_DELIVERED]
//                     },
//                     // {
//                     //     $lt: ["$place_order_date_iso", new Date().toISOString()]
//                     // }
//                 ]
//             }
//         ];
//         break;
// }