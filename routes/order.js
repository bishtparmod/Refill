var express = require('express');
var router = express.Router();
var path = require('path');
var {
    ObjectID,
    ObjectId
} = require("mongodb");

var common = require("../operations/common");
var { SUCCESS, VALIDATE_ERROR, ORDER_TYPE_CUSTOM, ORDER_STATUS_RECEIVED, ORDER_STATUS_REFILL, ORDER_TYPE_GET_NOW, ERROR, AUTH_USER_DATA, ACTIVE, NOT_VALID, PAYMENT_STATUS_PENDING, PAYMENT_STATUS_PAID, PAYMENT_STATUS_FAILED } = require("../operations/constant");
var { adminSignup, forgotPassword, verifyJsonToken, verifyJsonTokenAndAdmin, verifyJsonTokenAndDriver, isValidUser } = require("../operations/operation");
var { computeOrders, computeCustomOrders, placeOrder, cancelOrder, cancelRefillOrder, skipOrder, isValidCancelSkip, processOrder, shippedOrder, deliveredOrder, getOrders, viewOrder, shippedOrderList, deliveredOrderList, getAllPlacedOrders, orderList, placeGetNowOrder } = require("../operations/controller/order");
var { getProductViaId } = require("../operations/controller/product");
var { createCard, createCustomer, chargeCustomer } = require("../operations/controller/payment");
var { sendNotification, createNotification } = require("../operations/controller/firebase");
var { getTaxAndCharges } = require("../operations/controller/charges");
var { createPlanAndSubscription, cancelSubscription, cancelSubscriptionAndRefund } = require("../operations/controller/payment");
const uuid = require('uuid');

/** Place order */
router.post("/place", (req, res, next) => {
    common.validate("place_order", req.body, (status, keys) => {
        if (status) {
            const { orderDate, orderType } = req.body;

            if (orderDate && ((orderDate.length === 2) || (orderType === ORDER_TYPE_CUSTOM && orderDate.length >= 1))) {
                let _start_date = new Date(orderDate && orderDate.length ? orderDate[0] : '');
                let _end_date = new Date(orderDate && orderDate.length >= 2 ? orderDate[1] : '');
                let _keys = [];

                if (!_start_date || (_start_date && !_start_date.getDate()) || _start_date < new Date()) {
                    _keys.push({
                        fieldName: "orderDate",
                        message: "Invalid start date or start date must be greater than euqal to current date"
                    });
                }

                if (!_end_date || (_end_date && !_end_date.getDate()) || _end_date < _start_date) {
                    if (orderType !== ORDER_TYPE_CUSTOM)
                        _keys.push({
                            fieldName: "orderDate",
                            message: "Invalid end date or end date must be greater than euqal to start date"
                        });
                }

                if (_keys.length) {
                    common.httpResponse(req, res, VALIDATE_ERROR, _keys);
                } else next();
            } else {
                common.httpResponse(req, res, VALIDATE_ERROR, [{
                    fieldName: 'orderDate',
                    message: orderDate && orderDate.length === 1 ? 'Order end date not found' : 'No order date found'
                }]);
            }
        }
        else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
},
    verifyJsonToken,
    (req, res) => {
        const { _id } = req[AUTH_USER_DATA];

        isValidUser({ user_id: _id }, (status, customerData) => {
            if (status === SUCCESS) {
                getProductViaId(req.body, (status, productDetail) => {
                    if (status === SUCCESS) {

                        getTaxAndCharges({}, (status, response) => {
                            if (status === SUCCESS) {
                                let orders = computeOrders(req.body);
                                const { product_id, totalPrice, discount, orderType, orderDate, quantity } = req.body;
                                const { salesTax, deliveryCharges, deliveryChargesValidLimit } = response[0];
                                const startDate = `${common.getTime(orderDate[0])}`;
                                const endDate = orderDate && orderDate.length >= 2 ? `${common.getTime(orderDate[orderDate.length - 1])}` : '';

                                const common_order_id = uuid.v4();
                                let _totalPrice = salesTax ? totalPrice + (totalPrice * (salesTax / 100)) : totalPrice;
                                let _deliveryCharges = 0;

                                if (totalPrice >= deliveryChargesValidLimit) {
                                    _totalPrice = _totalPrice + deliveryCharges;
                                    _deliveryCharges = deliveryCharges;
                                }

                                orders = orders.map(ele => {
                                    return (Object.assign({
                                        productId: new ObjectId(product_id),
                                        customerId: new ObjectId(_id),
                                        uuid: common_order_id,
                                        quantity: quantity,
                                        orderStatus: startDate === ele ? ORDER_STATUS_RECEIVED : ORDER_STATUS_REFILL,
                                        productDetail: productDetail,
                                        customerDetail: customerData,
                                        totalPrice: _totalPrice,
                                        discount: discount,
                                        appliedSalesTax: salesTax,
                                        appliedDeliveryCharges: _deliveryCharges,
                                        date: {
                                            startDate,
                                            endDate
                                        },
                                        order_tax_charges: {
                                            salesTax: salesTax,
                                            deliveryCharges: deliveryCharges,
                                            deliveryChargesValidLimit: deliveryChargesValidLimit
                                        },
                                        place_order_date: ele,
                                        place_order_date_iso: new Date(ele).toISOString(),
                                        orderType: orderType,
                                        paidStatus: PAYMENT_STATUS_PENDING,
                                        status: ACTIVE,
                                        deletedStatus: 0,
                                        createAt: new Date().toISOString(),
                                        updateAt: new Date().toISOString()
                                    }, startDate === ele ? {
                                        receivedOrderDate: new Date().toISOString()
                                    } : {}));
                                });

                                const placedOrderIndex = orders.findIndex(ele => ele.orderStatus === ORDER_STATUS_RECEIVED);

                                if (placedOrderIndex === -1) {
                                    return common.httpResponse(req, res, ERROR, {
                                        message: "Order unable to place, please try again."
                                    });
                                }

                                createPlanAndSubscription(orders[placedOrderIndex], (err, planAndSubscriptionResponse) => {
                                    if (err) common.httpResponse(req, res, ERROR, err);
                                    else {
                                        orders = orders.map(ele => {
                                            ele.payment_info = planAndSubscriptionResponse;
                                            return ele
                                        });

                                        //Place order
                                        placeOrder(orders, (status, response) => {
                                            if (status === SUCCESS) {
                                                getAllPlacedOrders({
                                                    common_order_id
                                                }, (status, saved_orders) => {
                                                    if (status === SUCCESS) {
                                                        const index = saved_orders.findIndex(ele => ele.orderStatus === ORDER_STATUS_RECEIVED);
                                                        const placedOrder = saved_orders[index];

                                                        if (index !== -1)
                                                            createNotification({
                                                                order_id: new ObjectId(placedOrder._id)
                                                            }, (status, notificationResponse) => common.httpResponse(req, res, SUCCESS, orders));
                                                        else common.httpResponse(req, res, SUCCESS, saved_orders);
                                                    } else common.httpResponse(req, res, status, saved_orders);
                                                });
                                            } else common.httpResponse(req, res, status, response);
                                        });
                                    }
                                });

                                // common.httpResponse(req, res, status, orders);

                            } else common.httpResponse(req, res, status, response);
                        });
                    } else common.httpResponse(req, res, status, productDetail);
                });
            } else common.httpResponse(req, res, status, customerData);
        });
    });

/** Get now order */
router.post("/get_now", (req, res, next) => {
    common.validate("get_now_order", req.body, (status, keys) => {
        if (status) {
            const { order_date } = req.body;
            let _start_date = new Date(order_date);
            let _keys = [];

            if (!_start_date || (_start_date && !_start_date.getDate()) || _start_date < new Date()) {
                _keys.push({
                    fieldName: "order_date",
                    message: "Invalid start date or start date must be greater than euqal to current date"
                });
            }

            if (_keys.length) {
                common.httpResponse(req, res, VALIDATE_ERROR, _keys);
            } else next();
        } else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
},
    verifyJsonToken,
    (req, res) => isValidCancelSkip(req.body, (status, response) => {
        const { is_skip } = req.body;
        if (status === SUCCESS || (status === NOT_VALID && !is_skip)) {

            const { _id } = req[AUTH_USER_DATA];

            viewOrder({
                _id,
                ...req.body
            }, (status, orderResponse) => {
                if (status === SUCCESS) {
                    const { order_date } = req.body;
                    const date = `${common.getTime(new Date(order_date))}`;
                    const {
                        _id,
                        orderStatus,
                        place_order_date,
                        place_order_date_iso,
                        orderType,
                        receivedOrderDate,
                        createAt,
                        updateAt,
                        ...rest
                    } = orderResponse;

                    order = Object.assign({
                        ...rest
                    }, {
                        orderStatus: ORDER_STATUS_RECEIVED,
                        place_order_date: date,
                        place_order_date_iso: new Date(date).toISOString(),
                        orderType: ORDER_TYPE_GET_NOW,
                        receivedOrderDate: new Date().toISOString(),
                        createAt: new Date().toISOString(),
                        updateAt: new Date().toISOString()
                    });

                    placeGetNowOrder(order, (status, response) => {
                        if (status === SUCCESS) {
                            if (is_skip) {
                                skipOrder(req.body, (status, skipResponse) => {
                                    const { order_id } = req.body;

                                    if (status === SUCCESS) {
                                        createNotification({
                                            order_id: new ObjectId(order_id)
                                        }, (status, notificationResponse) => common.httpResponse(req, res, SUCCESS, response));
                                    } else common.httpResponse(req, res, status, skipResponse);
                                });
                            } else
                                getAllPlacedOrders({
                                    common_order_id: orderResponse.uuid
                                }, (status, saved_orders) => {
                                    if (status === SUCCESS) {
                                        const index = saved_orders.findIndex(ele => ele.orderStatus === ORDER_STATUS_RECEIVED);
                                        const placedOrder = saved_orders[index];

                                        if (index !== -1)
                                            createNotification({
                                                order_id: new ObjectId(placedOrder._id)
                                            }, (status, notificationResponse) => common.httpResponse(req, res, SUCCESS, response));
                                        else common.httpResponse(req, res, SUCCESS, response);
                                    } else common.httpResponse(req, res, status, response);
                                });

                        } else common.httpResponse(req, res, status, order);
                    })
                } else common.httpResponse(req, res, status, response);
            });
        } else common.httpResponse(req, res, status, response)
    }));


/** Cancel order */
router.post("/cancel", (req, res, next) => {
    common.validate("cancel_order", req.body, (status, keys) => {
        if (status) {
            next();
        } else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
},
    verifyJsonToken,
    (req, res) => isValidCancelSkip(req.body, (status, response) => {
        if (status === SUCCESS) cancelSubscriptionAndRefund(req.body, (status, cancelSubscriptionResponse) => {
            console.log("subscription.id ===> ", cancelSubscriptionResponse);

            cancelOrder({ payment_info: cancelSubscriptionResponse, ...req.body }, (status, response) => {
                const { order_id } = req.body;

                if (status === SUCCESS) {
                    createNotification({
                        order_id: new ObjectId(order_id)
                    }, (status, notificationResponse) => common.httpResponse(req, res, SUCCESS, response));
                } else common.httpResponse(req, res, status, response);
            });
        })
        else common.httpResponse(req, res, status, response)
    }));

/** Cancel order and via customer */
router.post("/cancel_via_customer", (req, res, next) => {
    common.validate("cancel_order", req.body, (status, keys) => {
        if (status) {
            next();
        } else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
},
    verifyJsonToken,
    (req, res) => isValidCancelSkip(req.body, (status, response) => {
        if (status === SUCCESS) cancelOrder({ ...req.body }, (status, response) => {
            const { order_id } = req.body;

            if (status === SUCCESS) {
                createNotification({
                    order_id: new ObjectId(order_id)
                }, (status, notificationResponse) => common.httpResponse(req, res, SUCCESS, response));
            } else common.httpResponse(req, res, status, response);
        })
        else common.httpResponse(req, res, status, response)
    }));

/** Cancel refill order */
router.post("/cancel_refill", (req, res, next) => {
    common.validate("cancel_refill_order", req.body, (status, keys) => {
        if (status) {
            next();
        } else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
},
    verifyJsonToken,
    (req, res) => cancelSubscription(req.body, (status, cancelSubscriptionResponse) => {
        if (status === SUCCESS) {
            cancelRefillOrder({ payment_info: cancelSubscriptionResponse, ...req.body }, (status, response) => {
                const { uuid } = req.body;

                if (status === SUCCESS) {
                    createNotification({
                        uuid
                    }, (status, notificationResponse) => common.httpResponse(req, res, SUCCESS, response));
                } else common.httpResponse(req, res, status, response);
            });
        } else common.httpResponse(req, res, status, response);
    }));

/** Skip order */
router.post("/skip", (req, res, next) => {
    common.validate("skip_order", req.body, (status, keys) => {
        if (status) {
            next();
        } else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
},
    verifyJsonToken,
    (req, res) => isValidCancelSkip(req.body, (status, response) => {
        if (status === SUCCESS) skipOrder(req.body, (status, response) => {
            const { order_id } = req.body;

            if (status === SUCCESS) {
                createNotification({
                    order_id: new ObjectId(order_id)
                }, (status, notificationResponse) => common.httpResponse(req, res, SUCCESS, response));
            } else common.httpResponse(req, res, status, response);
        });
        else common.httpResponse(req, res, status, response)
    }));

/** Process order */
router.post("/process", (req, res, next) => {
    common.validate("order_status_payload", req.body, (status, keys) => {
        if (status) {
            next();
        } else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
},
    verifyJsonTokenAndAdmin,
    (req, res) => processOrder(req.body, (status, response) => {
        const { order_id } = req.body;

        if (status === SUCCESS) {
            createNotification({
                order_id: new ObjectId(order_id)
            }, (status, notificationResponse) => common.httpResponse(req, res, SUCCESS, response));
        } else common.httpResponse(req, res, status, response)
    }));

/** Shipped order */
router.post("/shipped", (req, res, next) => {
    common.validate("shipped_payload", req.body, (status, keys) => {
        if (status) {
            next();
        } else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
},
    verifyJsonTokenAndAdmin,
    (req, res) => shippedOrder(req.body, (status, response) => {
        const { user_id, order_id } = req.body;

        if (status === SUCCESS) {
            createNotification({
                order_id: new ObjectId(order_id)
            }, (status, notificationResponse) => common.httpResponse(req, res, SUCCESS, response));
        } else common.httpResponse(req, res, status, response)
    }));

/** Delivered order */
router.post("/delivered", (req, res, next) => {
    common.validate("order_status_payload", req.body, (status, keys) => {
        if (status) {
            next();
        } else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
},
    verifyJsonTokenAndDriver,
    (req, res) => deliveredOrder(req.body, (status, response) => {
        const { user_id, order_id } = req.body;

        if (status === SUCCESS) {
            createNotification({
                order_id: new ObjectId(order_id)
            }, (status, notificationResponse) => common.httpResponse(req, res, SUCCESS, response));
        } else common.httpResponse(req, res, status, response);
    }));


/** Create card */
router.post("/createCard", (req, res, next) => {
    chargeCustomer(null, (status, response) => common.httpResponse(req, res, status, response));
});

/**
 * Get users data tables
 */
router.post("/list", function (req, res, next) {
    common.validate("get_order_data_tables", req.body, (status, keys) => {
        if (status) next();
        else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
}, verifyJsonTokenAndAdmin, (req, res) => {
    const { _id } = req[AUTH_USER_DATA];

    getOrders({
        _id,
        ...req.body
    }, (status, response) => common.httpResponse(req, res, status, response));
});

/**
 * Get order view
 */
router.post("/view", function (req, res, next) {
    common.validate("order_status_payload", req.body, (status, keys) => {
        if (status) next();
        else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
}, verifyJsonToken, (req, res) => {
    const { _id } = req[AUTH_USER_DATA];

    viewOrder({
        _id,
        ...req.body
    }, (status, response) => common.httpResponse(req, res, status, response));
});

/**
|--------------------------------------------------
| Driver APIs
|--------------------------------------------------
*/

/**
 * Get pending order list
 */
router.post("/list/shipped", function (req, res, next) {
    common.validate("list_order", req.body, (status, keys) => {
        if (status) next();
        else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
}, verifyJsonTokenAndDriver, (req, res) => {
    const { _id } = req[AUTH_USER_DATA];

    shippedOrderList({
        _id,
        ...req.body
    }, (status, response) => common.httpResponse(req, res, status, response));
});

/**
 * Get Delivered Orders List
 */
router.post("/list/delivered", function (req, res, next) {
    common.validate("list_order", req.body, (status, keys) => {
        if (status) next();
        else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
}, verifyJsonTokenAndDriver, (req, res) => {
    const { _id } = req[AUTH_USER_DATA];

    deliveredOrderList({
        _id,
        ...req.body
    }, (status, response) => common.httpResponse(req, res, status, response));
});

/**
 * View Delivered List
 */
router.post("/shipped/view/:order_id", function (req, res, next) {
    common.validate("order_status_payload", { ...req.body, ...req.params }, (status, keys) => {
        if (status) next();
        else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
}, verifyJsonTokenAndDriver, (req, res) => {
    const { _id } = req[AUTH_USER_DATA];

    viewOrder({
        _id,
        ...req.params,
        ...req.body
    }, (status, response) => common.httpResponse(req, res, status, response));
});

//-------------------------------------------------

/**
|--------------------------------------------------
| Consumer App
|--------------------------------------------------
*/

/** Estimeated cost of place order */
router.post("/place/estimate", (req, res, next) => {
    common.validate("place_order", req.body, (status, keys) => {
        if (status) {
            const { orderDate, orderType } = req.body;

            if (orderDate && ((orderDate.length === 2) || (orderType === ORDER_TYPE_CUSTOM && orderDate.length >= 1))) {
                let _start_date = new Date(orderDate && orderDate.length ? orderDate[0] : '');
                let _end_date = new Date(orderDate && orderDate.length >= 2 ? orderDate[1] : '');
                let _keys = [];

                if (!_start_date || (_start_date && !_start_date.getDate()) || _start_date < new Date()) {
                    _keys.push({
                        fieldName: "orderDate",
                        message: "Invalid start date or start date must be greater than euqal to current date"
                    });
                }

                if (!_end_date || (_end_date && !_end_date.getDate()) || _end_date < _start_date) {
                    if (orderType !== ORDER_TYPE_CUSTOM)
                        _keys.push({
                            fieldName: "orderDate",
                            message: "Invalid end date or end date must be greater than euqal to start date"
                        });
                }

                if (_keys.length) {
                    common.httpResponse(req, res, VALIDATE_ERROR, _keys);
                } else next();
            } else {
                common.httpResponse(req, res, VALIDATE_ERROR, [{
                    fieldName: 'orderDate',
                    message: orderDate && orderDate.length === 1 ? 'Order end date not found' : 'No order date found'
                }]);
            }
        }
        else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
},
    verifyJsonToken,
    (req, res) => {
        const { _id } = req[AUTH_USER_DATA];

        getTaxAndCharges({}, (status, response) => {
            if (status === SUCCESS) {
                let orders = computeOrders(req.body);
                const { product_id, totalPrice, discount, orderType, orderDate, quantity } = req.body;
                const { salesTax, deliveryCharges, deliveryChargesValidLimit } = response[0];
                const startDate = `${common.getTime(orderDate[0])}`;
                const endDate = orderDate && orderDate.length >= 2 ? `${common.getTime(orderDate[orderDate.length - 1])}` : '';

                const common_order_id = uuid.v4();
                let _totalPrice = salesTax ? totalPrice + (totalPrice * (salesTax / 100)) : totalPrice;
                let _deliveryCharges = 0;

                if (totalPrice >= deliveryChargesValidLimit) {
                    _totalPrice = _totalPrice + deliveryCharges;
                    _deliveryCharges = deliveryCharges;
                }

                orders = orders.map(ele => {
                    return ({
                        productId: new ObjectId(product_id),
                        customerId: new ObjectId(_id),
                        quantity: quantity,
                        uuid: common_order_id,
                        orderStatus: startDate === ele ? ORDER_STATUS_RECEIVED : ORDER_STATUS_REFILL,
                        totalPrice: _totalPrice,
                        discount: discount,
                        appliedSalesTax: salesTax,
                        appliedDeliveryCharges: _deliveryCharges,
                        date: {
                            startDate,
                            endDate
                        },
                        order_tax_charges: {
                            salesTax: salesTax,
                            deliveryCharges: deliveryCharges,
                            deliveryChargesValidLimit: deliveryChargesValidLimit
                        },
                        place_order_date: ele,
                        place_order_date_iso: new Date(ele).toISOString(),
                        orderType: orderType,
                        status: ACTIVE,
                        deletedStatus: 0,
                        createAt: new Date().toISOString(),
                        updateAt: new Date().toISOString()
                    });
                });

                const placedOrderIndex = orders.findIndex(ele => ele.orderStatus === ORDER_STATUS_RECEIVED);

                if (placedOrderIndex === -1) {
                    return common.httpResponse(req, res, ERROR, {
                        message: "Order unable to place, please try again."
                    });
                }

                common.httpResponse(req, res, status, orders);
            } else common.httpResponse(req, res, status, response);
        });
    });

/** Send notification */
router.post("/sendNotification", (req, res, next) => {
    sendNotification(() => {
        res.json({
            message: "hello one"
        });
    });
});

/**
 * View Delivered List
 */
router.post("/list/customer", function (req, res, next) {
    common.validate("order_list", req.body, (status, keys) => {
        if (status) next();
        else common.httpResponse(req, res, VALIDATE_ERROR, keys);
    });
}, verifyJsonToken, (req, res) => {
    const { _id } = req[AUTH_USER_DATA];

    orderList({
        _id,
        ...req.body
    }, (status, response) => common.httpResponse(req, res, status, response));
});

//--------------------------------------------------

module.exports = router;
