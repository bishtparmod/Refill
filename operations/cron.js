var cron = require('node-cron');
var { removeOffer } = require("./controller/offers");
let { autoPlaceOrder } = require("./controller/order");

module.exports.init = function () {
    cron.schedule("*/5 * * * *", function () {
        console.log("running a task every 5 minutes");

        //Remove all invalid discounts
        removeOffer((status, response) => {
            console.log("Remove Offer ===> response ", status);
        });

        // Place valid refill orders
        autoPlaceOrder((status, response) => {
            console.log("Place Order ===> response ", status);
        });
    });
}
