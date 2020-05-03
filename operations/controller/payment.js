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

    ORDER_STATUS_CANCELLED,
    ORDER_STATUS_SKIPPED,
    ORDER_STATUS_REVIEWED,
    ORDER_STATUS_SHIPPED,

    ORDER_CANCEL_BEFORE_TIME_IN_SECONDS
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
const stripe = require('stripe')('sk_test_ws2GR8HLb9gMtA9dAyvnclCL');

/**
 * Create Customer
 * @param {*object} obj 
 * @param {*function} cb 
 */
var createCustomer = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('users');

            const { _id } = obj;
            collection.find({ _id: ObjectId(_id) }).toArray((err, data) => {
                if (err) close(client, ERROR, err, cb);
                else if (data && data.length !== 0) {
                    const user_data = data[0];

                    if (user_data.stripeCustomerId) close(client, SUCCESS, user_data, cb);
                    else {
                        stripe.customers.create({}, function (err, customer) {
                            if (err) close(client, ERROR, err, cb);
                            else {
                                collection.updateOne({ _id: new ObjectId(_id) }, {
                                    $set: {
                                        stripeCustomerId: customer.id,
                                        updatedAt: new Date().toISOString()
                                    }
                                }, (err, value) => {
                                    if (err) close(client, ERROR, err, cb);
                                    else {
                                        const { result: data } = value;
                                        if (data && data.n) {
                                            getCollection(collection, { _id: new ObjectId(_id) }, { password: 0, slug: 0 }, client, cb);
                                        } else close(client, NOVALUE, {
                                            data: value.data,
                                            message: "No value found."
                                        }, cb);
                                    }
                                });
                            }
                        });
                    }
                } else close(client, NOVALUE, {
                    message: "No user found"
                }, cb);
            });
        }
    })
}

/**
 * Create Card
 * @param {*object} obj 
 * @param {*function} cb 
 */
var createCard = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('users');
            const { stripeCustomerId, card_number, cvv, expire_month, expire_year, card_holder_name } = obj

            stripe.tokens.create(
                {
                    card: {
                        name: card_holder_name,
                        number: card_number,
                        exp_month: expire_month,
                        exp_year: expire_year,
                        cvc: cvv,
                    },
                },
                function (err, token) {
                    if (err) close(client, ERROR, err, cb);
                    else {
                        stripe.customers.createSource(
                            stripeCustomerId,
                            { source: token.id },
                            function (err, card) {
                                console.log('err ===> ', err, card);
                                if (err) close(client, ERROR, err, cb);
                                else close(client, SUCCESS, card, cb);
                            }
                        );
                    }
                }
            );
        }
    })
}

/**
 * Get Cards List
 * @param {*object} obj 
 * @param {*function} cb 
 */
var getCardsList = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            const { stripeCustomerId } = obj

            stripe.customers.listSources(
                stripeCustomerId,
                function (err, cards) {
                    console.log('err ===> ', err, cards);
                    if (err) close(client, ERROR, err, cb);
                    else close(client, SUCCESS, cards, cb);
                }
            );
        }
    })
}

/**
 * Delete card
 * @param {*object} obj 
 * @param {*function} cb 
 */
var deleteCard = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            const { stripeCustomerId, card_id } = obj

            stripe.customers.deleteSource(
                stripeCustomerId,
                card_id,
                function (err, confirmation) {
                    if (err) close(client, ERROR, err, cb);
                    else close(client, SUCCESS, confirmation, cb);
                }
            );

        }
    })
}

/**
 * Charge Customer
 * @param {*array} orders 
 * @param {*function} cb 
 */
var chargeCustomer = function (orders, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            stripe.charges.create(
                {
                    amount: 1,
                    currency: 'USD',
                    source: 'card_1Fi584JOp7DNz0X32xg1O1tl',
                    description: 'Charge for jenny.rosen@example.com',
                },
                function (err, charge) {
                    if (err) close(client, ERROR, err, cb);
                    else close(client, SUCCESS, charge, cb);
                }
            );
        }
    })
}

/**
 * Create WebHook
 * @param {*object} obj 
 * @param {*function} cb 
 */
var createWebHook = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {

            stripe.webhookEndpoints.create(
                {
                    url: 'http://stripe.tttester.ultrahook.com/v0/api/payment/webhook',
                    enabled_events: [
                        'charge.failed',
                        'charge.succeeded',
                        'charge.pending',
                        'charge.refunded',
                        'invoice.payment_succeeded',
                        "invoice.payment_failed"
                    ],
                },
                function (err, webhookEndpoint) {
                    if (err) close(client, ERROR, err, cb);
                    else close(client, SUCCESS, webhookEndpoint, cb);
                }
            );
        }
    })
}

/**
 * Get WebHook
 * @param {*object} obj 
 * @param {*function} cb 
 */
var getWebHook = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection("webhooks");

            collection.insertOne(obj)
                .then(data => {
                    close(client, SUCCESS, data, cb);
                })
                .catch(error => {
                    close(client, ERROR, err, cb);
                });
        }
    })
}

/**
 * Create plan and start subscription
 * @param {*array} orders 
 * @param {*function} cb 
 */
var createPlanAndSubscription = function (orders, cb) {
    const { totalPrice, productId, orderType, customerDetail = {}, date = {}, productDetail = {} } = orders;
    const { stripeCustomerId } = customerDetail;
    const { endDate } = date;
    const { name } = productDetail;

    // cb(null, {});
    // return;
    // createWebHook(null, () => {

    // });

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

    console.log("totalPrice ===> ", totalPrice);
    stripe.plans.create(
        {
            amount_decimal: parseFloat(totalPrice * 100),
            currency: 'usd',
            interval: 'day',
            interval_count: 1,
            product: {
                metadata: {
                    product_id: typeof productId === "string" ? productId : productId.toString()
                },
                name
            },
        },
        function (err, plan) {
            if (err) cb(err, null);
            else {
                const { id } = plan;

                stripe.subscriptions.create(
                    {
                        customer: stripeCustomerId,
                        items: [{ plan: id }],
                        cancel_at: new Date(endDate).getTime()
                    },
                    function (err, subscription) {
                        if (err) cb(err, null);
                        else cb(null, {
                            plan,
                            subscription
                        })
                    }
                );
            }
        }
    );
}

/**
 * Cancel Subscription
 * @param {*object} obj 
 * @param {*function} cb 
 */
var cancelSubscription = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            const collection = db.collection("orders");
            const { order_id, uuid } = obj;
            var query = { _id: ObjectId(order_id) };

            if (uuid) {
                query = { uuid };
            }

            collection.find(query).toArray((err, data) => {
                if (err) close(client, ERROR, err, cb);
                else if (data && data.length) {
                    const { payment_info } = data[0];
                    const { subscription, ...rest } = payment_info;

                    stripe.subscriptions.del(
                        subscription.id,
                        function (err, confirmation) {
                            if (err) close(client, ERROR, err, cb);
                            else collection.updateMany({ "payment_info.subscription.id": subscription.id }, {
                                $set: {
                                    payment_info: { subscription: confirmation, ...rest },
                                    updatedAt: new Date().toISOString()
                                }
                            }, (err, value) => {
                                if (err) close(client, ERROR, err, cb);
                                else {
                                    const { result: data } = value;
                                    if (data && data.n) {
                                        close(client, SUCCESS, { subscription: confirmation, ...rest }, cb);
                                    } else close(client, NOVALUE, {
                                        data: value.data,
                                        message: "No value found."
                                    }, cb);
                                }
                            });
                        }
                    );
                } else close(client, NOVALUE, {
                    message: "No value"
                }, cb);
            });
        }
    });
}

/**
 * Cancel Subscription and refund   
 * @param {*object} obj 
 * @param {*function} cb 
 */
var cancelSubscriptionAndRefund = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            const collection = db.collection("orders");
            const { order_id, uuid } = obj;
            var query = { _id: ObjectId(order_id) };

            if (uuid) {
                query = { uuid };
            }

            collection.find(query).toArray((err, data) => {
                if (err) close(client, ERROR, err, cb);
                else if (data && data.length) {
                    const { payment_info } = data[0];
                    const { subscription, ...rest } = payment_info;
                    const { invoice } = payment_info;

                    stripe.refunds.create(
                        { charge: invoice.charge },
                        function (err, refund) {
                            stripe.subscriptions.del(
                                subscription.id,
                                function (err, confirmation) {
                                    if (err) close(client, ERROR, err, cb);
                                    else collection.updateMany({ "payment_info.subscription.id": subscription.id }, {
                                        $set: {
                                            payment_info: { subscription: confirmation, refund, ...rest },
                                            updatedAt: new Date().toISOString()
                                        }
                                    }, (err, value) => {
                                        if (err) close(client, ERROR, err, cb);
                                        else {
                                            const { result: data } = value;
                                            if (data && data.n) {
                                                close(client, SUCCESS, { subscription: confirmation, ...rest }, cb);
                                            } else close(client, NOVALUE, {
                                                data: value.data,
                                                message: "No value found."
                                            }, cb);
                                        }
                                    });
                                }
                            );
                        }
                    );
                } else close(client, NOVALUE, {
                    message: "No value"
                }, cb);
            });
        }
    });
}

module.exports = {
    createCard,
    createCustomer,
    chargeCustomer,
    getCardsList,
    deleteCard,
    createPlanAndSubscription,
    getWebHook,
    cancelSubscription,
    cancelSubscriptionAndRefund
}