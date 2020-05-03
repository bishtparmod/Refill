import { Dimensions, Platform, PixelRatio, Linking } from 'react-native';
import { WEEKLY_ORDER, SERVER_ORDER_TYPE_BI_MONTHLY, SERVER_ORDER_TYPE_WEEKLY, TWO_WEEKLY_ORDER, SERVER_ORDER_TYPE_BI_WEEKLY, FOUR_WEEKLY_ORDER, SERVER_ORDER_TYPE_MONTHLY, EIGHT_WEEKLY_ORDER, CUSTOM_ORDER, SERVER_ORDER_TYPE_CUSTOM, SILENT_LOGOUT } from '../../redux/Types';

const {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
} = Dimensions.get('window');

// based on iphone 5s's scale
const isPortrait = SCREEN_HEIGHT > SCREEN_WIDTH ? true : false
const scale = (isPortrait ? SCREEN_WIDTH : SCREEN_HEIGHT) / 320;

let _refillEventEmitter = undefined;
export default class Utils {

    static setRefillEventEmitter = (eventRef) => {
        _refillEventEmitter = eventRef;
    }

    static emitEvent = (type) => {
        if (!_refillEventEmitter) return;

        _refillEventEmitter.emit(type);
    }

    static getHeightInPortraitMode = isPortrait ? SCREEN_HEIGHT : SCREEN_WIDTH;
    static isPortrait = () => {
        const {
            width,
            height,
        } = Dimensions.get('window');

        return height > width ? true : false;
    }
    static scaleSize(size) {
        const newSize = size * scale
        if (Platform.OS === 'ios') {
            return Math.round(PixelRatio.roundToNearestPixel(newSize))
        } else {
            return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
        }
    }

    static formatCurrency = (amount = 0) => {
        return `$${parseFloat(amount).toFixed(2)}`
    }

    static orderType(order_type) {
        switch (order_type) {
            case WEEKLY_ORDER:
                return SERVER_ORDER_TYPE_WEEKLY;
            case TWO_WEEKLY_ORDER:
                return SERVER_ORDER_TYPE_BI_WEEKLY;
            case FOUR_WEEKLY_ORDER:
                return SERVER_ORDER_TYPE_MONTHLY;
            case EIGHT_WEEKLY_ORDER:
                return SERVER_ORDER_TYPE_BI_MONTHLY;
            case CUSTOM_ORDER:
                return SERVER_ORDER_TYPE_CUSTOM;
        }
    }

    static getDeviceDimentions = () => Dimensions.get('window');

    static verifyResponse = response => new Promise((resolve, rejects) => response && response.ok ? resolve(response) : rejects(response))

    static handleError = error => {
        if (error && (error.status === 422 || error.status === 501 || error.status === 401 || error.status === 404 || error.status === 409 || error.status === 401 || error.status === 400 || error.status === 304 || error.status === 409 || error.status === 500)) {

            if (error.status === 501) {
                error.json().then(ele => {
                    if (ele && ele.data && ele.data.name === "TokenExpiredError") {
                        Utils.emitEvent(SILENT_LOGOUT);
                    }
                });
            }

            return error.json();
        }
        return error;
    }

    static log = (prefix, ...args) => {
        if (__DEV__) {
            console.log(prefix, args);
        }
    }

    static sendEmail = url => Linking.canOpenURL(`mailto:${url}`)
        .then(supported => {
            if (supported) Linking.openURL(`mailto:${url}`)
        })
        .catch(err => {
            alert(JSON.stringify(err));
            Utils.log('Linking error ===> send email ', err)
        });
}