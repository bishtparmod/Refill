import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import NotifyService from './NotifyService';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/messaging';
import { SERVER_ORDER_STATUS_RECEIVED, SERVER_ORDER_STATUS_PROCESSED, SERVER_ORDER_STATUS_SHIPPED, SERVER_ORDER_STATUS_CANCELLED, SERVER_ORDER_STATUS_SKIPPED } from './src/redux/Types';
import moment from 'moment-timezone';
import { RefillStorage } from './src/apis';

firebase.messaging().setBackgroundMessageHandler(async (remoteMessage) => {

    const obj = JSON.parse(remoteMessage.data.data);
    const { order_id, orderStatus, receivedOrderDate, processedOrderDate, shippedOrderDate, cancelledOrderDate, skippedOrderDate } = obj;

    const getTime = () => {

        let date = '';
        switch (orderStatus) {
            case SERVER_ORDER_STATUS_RECEIVED:
                date = receivedOrderDate;
                break;
            case SERVER_ORDER_STATUS_PROCESSED:
                date = processedOrderDate;
                break;
            case SERVER_ORDER_STATUS_SHIPPED:
                date = shippedOrderDate;
                break;
            case SERVER_ORDER_STATUS_CANCELLED:
                date = cancelledOrderDate;
                break;
            case SERVER_ORDER_STATUS_SKIPPED:
                date = skippedOrderDate;
                break;
        }

        if (!date) return '';

        return moment(date).format("DD MMM, YYYY")
    }

    const getTitle = () => {

        switch (orderStatus) {
            case SERVER_ORDER_STATUS_RECEIVED:
                return "Received";
            case SERVER_ORDER_STATUS_PROCESSED:
                return "Processed";
            case SERVER_ORDER_STATUS_SHIPPED:
                return "Shipped"
            case SERVER_ORDER_STATUS_CANCELLED:
                return "Cancelled";
            case SERVER_ORDER_STATUS_SKIPPED:
                return "Skipped";
        }
    }

    NotifyService.sendNotification(getTitle(), `Your order has been ${orderStatus} at ${getTime()}`)

    console.log("order id ===> ", order_id);
    await RefillStorage.storeRefillNotificationData({
        order_id
    });
});
AppRegistry.registerComponent(appName, () => App);
