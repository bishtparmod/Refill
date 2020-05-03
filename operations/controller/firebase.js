var connection = require("../connection");
var moment = require("moment");
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

    ORDER_STATUS_RECEIVED,
    ORDER_STATUS_REVIEWED,
    ORDER_STATUS_PROCESSED,
    ORDER_STATUS_CANCELLED,
    ORDER_STATUS_SHIPPED,
    ORDER_STATUS_SKIPPED,
    ORDER_STATUS_DELIVERED,
    ORDER_STATUS_REFUNDED,
    ORDER_STATUS_REFILL,

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
var { getCollection } = require("./customer");
var admin = require('firebase-admin');

var serviceAccount = require("../../service-account-file.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://refill-6fa9a.firebaseio.com"
});

/**
 * Send Notification
 * @param {*object} obj 
 * @param {*function} cb 
 */
var sendNotification = function (obj, cb) {
    let { _id, registrationTokens, orderStatus, receivedOrderDate, processedOrderDate, shippedOrderDate, cancelledOrderDate, skippedOrderDate } = obj;
    // var registrationToken = "d4w77acrhg4:APA91bEuSvgmWWpeDwsFhzy4CBEghIfCTMwm6KfFiVBYFPPMMdQoIqTtATS66C0QjMp2TvShlp1XtMEcjG28R2AJMKrwT_RDvqlOpiisiA1uCYdhq1gqSW0cYfaR7VVJB0cZgFb_K006";
    // registrationTokens = ["fu_ilQxtqsM:APA91bEl7dnYJ0dQNfu5Cs7XgRHg1YeuvUEtioQ716RfGdoShmMvziB4yYj2cAXgdwIpa7x6foEc27li4wbIdp0kxCaD6dGfo6OhFVJMbbEbK7YgMJm8rw9aEEfbyNqFrytUxwvzVcAd"];

    if (!registrationTokens || (registrationTokens && !registrationTokens.length)) return;

    const getTime = () => {

        let date = '';
        switch (orderStatus) {
            case ORDER_STATUS_RECEIVED:
                date = receivedOrderDate;
                break;
            case ORDER_STATUS_PROCESSED:
                date = processedOrderDate;
                break;
            case ORDER_STATUS_SHIPPED:
                date = shippedOrderDate;
                break;
            case ORDER_STATUS_CANCELLED:
                date = cancelledOrderDate;
                break;
            case ORDER_STATUS_SHIPPED:
                date = skippedOrderDate;
                break;
        }

        if (!date) return '';

        return moment(date).format("DD MMM, YYYY")
    }

    const getTitle = () => {

        switch (orderStatus) {
            case ORDER_STATUS_RECEIVED:
                return "Received";
            case ORDER_STATUS_PROCESSED:
                return "Processed";
            case ORDER_STATUS_SHIPPED:
                return "Shipped"
            case ORDER_STATUS_CANCELLED:
                return "Cancelled";
            case ORDER_STATUS_SKIPPED:
                return "Skipped";
        }
    }

    const iosTokens = registrationTokens && registrationTokens.length ? registrationTokens.filter(ele => ele.type === "ios" && ele.token).map(ele => ele.token) : [];
    // const iosTokens = ["fOO-nk5_uRE:APA91bHZtZ4DwswtftM8XxYrdLDRRst8Kgm2AmJ1kc2VFeizXkpimEOdW3T9CxG7GiSgYF8JOyvk1WtNQEw_zZ5GY0BCDk8qqGJWuVYFxgoMzsSbeH0ptOhuLNbyXhr9gWVDKxvWMJrd"];
    const androidTokens = registrationTokens && registrationTokens.length ? registrationTokens.filter(ele => ele.type === "android" && ele.token).map(ele => ele.token) : [];

    console.log("registrationToken ===> ", iosTokens, androidTokens);

    var message = undefined;

    if(iosTokens && iosTokens.length){
        message = {
            data: {
                data: JSON.stringify({
                    order_id: _id, orderStatus, receivedOrderDate, processedOrderDate, shippedOrderDate, cancelledOrderDate, skippedOrderDate
                })
            },
            notification: {
                title: getTitle(),
                body: `Your order has been ${orderStatus} at ${getTime()}`
            },
            tokens: iosTokens
        };
    }
    
    if(androidTokens && androidTokens.length){
        message = {
            data: {
                data: JSON.stringify({
                    order_id: _id, orderStatus, receivedOrderDate, processedOrderDate, shippedOrderDate, cancelledOrderDate, skippedOrderDate
                })
            },
            android: {
                priority: "high"
            },
            tokens: androidTokens
        };
    }

    if(!message) return;

    admin.messaging().sendMulticast(message)
        .then((response) => {
            console.log('Successfully sent message:', response);
            cb();
        })
        .catch((error) => {
            console.log('Error sending message:', error);
            cb();
        });
}

/**
 * Create notification
 * @param {*object} orders 
 * @param {*function} cb 
 */
var createNotification = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('notifications');
            var orders = db.collection('orders');
            var device_tokens = db.collection('device_tokens');
            var { uuid, order_id } = obj;
            var query = { _id: order_id };

            if (uuid) {
                query = {
                    uuid: uuid,
                    orderStatus: ORDER_STATUS_CANCELLED
                };
            }

            orders.find(query).toArray((err, data) => {
                if (err) close(client, ERROR, err, cb);
                else if (data && data.length) {
                    const order = data[0];
                    const { customerId } = order;

                    device_tokens.find({ user_id: customerId }).toArray((err, deviceTokens) => {
                        if (err) close(client, ERROR, err, cb);
                        else {
                            if (deviceTokens && deviceTokens.length) {
                                const { devices } = deviceTokens[0];

                                sendNotification({
                                    ...order,
                                    registrationTokens: devices
                                }, () => { });
                            }

                            collection.insertOne({
                                userId: order.customerId,
                                orderType: order.orderType,
                                orderStatus: order.orderStatus,
                                productName: order && order.productDetail && order.productDetail.name ? order.productDetail.name : "",
                                orderId: order_id,
                                order: data.map(ele => {
                                    const { productDetail, customerDetail, ...rest } = ele;
                                    return { ...rest };
                                }),
                                createdAt: new Date().toISOString(),
                                updatedAt: new Date().toISOString()
                            }).then((data) => {
                                close(client, SUCCESS, {
                                    message: "Notification created successfully"
                                }, cb);
                            }).catch((error) => {
                                close(client, ERROR, error, cb);
                            });
                        }
                    })
                } else close(client, NOVALUE, {
                    message: "No order found"
                }, cb)
            });
        }
    });
}

/**
 * Notifications list
 * @param {*array} orders 
 * @param {*function} cb 
 */
var notificationsList = function (obj, cb) {
    connection((err, db, client) => {
        if (err) close(client, ERROR, err, cb);
        else {
            var collection = db.collection('notifications');
            var { page, page_size, _id, sort = ASCENDING_SORT } = obj;
            page_size = page_size ? page_size : 10;
            page = page ? page : 1;
            var skip = (!page || (page === 1 || page === 0)) ? 0 : (page - 1) * page_size;

            console.log("skip ===> ", skip, page_size, sort);
            collection.aggregate([
                {
                    $match: {
                        userId: ObjectId(_id)
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
                        else close(client, SUCCESS, data, cb);
                    });
            });
        }
    });
}

/** -------------------------------------------------------------- */

module.exports = {
    sendNotification,
    notificationsList,
    createNotification
}