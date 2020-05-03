import AsyncStorage from '@react-native-community/async-storage';
import { REFILL_LOGIN_DATA, ERROR, SUCCESS, RESPONSE, STATUS, REFILL_SKIP_LOGIN_DATA, REFILL_SKIP_WELCOME_SCREEN_DATA, REFILL_NOTIFICATION_DATA, REFILL_FCM_DEVICE_TOKEN } from '../redux/Types';
import Utils from '../common/util/Utils';

export default class RefillStorage {

    /** Store Refill Login data */
    static storeRefillLoginData = async (data) => {
        try {
            await AsyncStorage.setItem(REFILL_LOGIN_DATA, JSON.stringify(data));
            return new Promise(resolve => resolve({
                [STATUS]: SUCCESS
            }));
        } catch (e) {
            // error
            Utils.log("Store Refill Login Data ===> error ", e);

            return new Promise((resolve, rejects) => rejects({
                [STATUS]: ERROR
            }));
        }
    }

    /** Get Refill Login data */
    static getRefillLoginData = async (key) => {
        try {
            const data = await AsyncStorage.getItem(REFILL_LOGIN_DATA);
            const res = data && data.length ? JSON.parse(data) : {};

            return new Promise(resolve => resolve({
                [STATUS]: SUCCESS,
                [RESPONSE]: res && key && res[key] ? res[key] : res
            }));
        } catch (e) {
            // error
            Utils.log("Get Refill Login Data ===> error ", e);

            return new Promise((resolve, rejects) => rejects({
                [STATUS]: ERROR,
                [RESPONSE]: e
            }));
        }
    }

    /** Clear Refill Login data */
    static clearRefillLoginData = async () => {
        try {
            await AsyncStorage.removeItem(REFILL_LOGIN_DATA);
            return new Promise(resolve => resolve({
                [STATUS]: SUCCESS
            }));
        } catch (e) {
            // error
            Utils.log("Remove Refill Login Data ===> error ", e);

            return new Promise((resolve, rejects) => rejects({
                [STATUS]: ERROR
            }));
        }
    }

    /** Store Refill Skip Login data */
    static storeRefillSkipLoginData = async (data) => {
        try {
            await AsyncStorage.setItem(REFILL_SKIP_LOGIN_DATA, JSON.stringify(data));
            return new Promise(resolve => resolve({
                [STATUS]: SUCCESS
            }));
        } catch (e) {
            // error
            Utils.log("Store Refill Skip Login Data ===> error ", e);

            return new Promise((resolve, rejects) => rejects({
                [STATUS]: ERROR
            }));
        }
    }

    /** Get Refill Skip Login data */
    static getRefillSkipLoginData = async (key) => {
        try {
            const data = await AsyncStorage.getItem(REFILL_SKIP_LOGIN_DATA);
            const res = data && data.length ? JSON.parse(data) : {};

            return new Promise(resolve => resolve({
                [STATUS]: SUCCESS,
                [RESPONSE]: res && key && res[key] ? res[key] : res
            }));
        } catch (e) {
            // error
            Utils.log("Get Refill Skip Login Data ===> error ", e);

            return new Promise((resolve, rejects) => rejects({
                [STATUS]: ERROR,
                [RESPONSE]: e
            }));
        }
    }

    /** Clear Refill Skip Login data */
    static clearRefillSkipLoginData = async () => {
        try {
            await AsyncStorage.removeItem(REFILL_SKIP_LOGIN_DATA);
            return new Promise(resolve => resolve({
                [STATUS]: SUCCESS
            }));
        } catch (e) {
            // error
            Utils.log("Remove Refill Skip Login Data ===> error ", e);

            return new Promise((resolve, rejects) => rejects({
                [STATUS]: ERROR
            }));
        }
    }

    /** Store Refill Skip Welcome Screen data */
    static storeRefillSkipWelcomeScreenData = async (data) => {
        try {
            await AsyncStorage.setItem(REFILL_SKIP_WELCOME_SCREEN_DATA, JSON.stringify(data));
            return new Promise(resolve => resolve({
                [STATUS]: SUCCESS
            }));
        } catch (e) {
            // error
            Utils.log("Store Refill Skip Welcome Screen Data ===> error ", e);

            return new Promise((resolve, rejects) => rejects({
                [STATUS]: ERROR
            }));
        }
    }

    /** Get Refill Skip Welcome Screen data */
    static getRefillSkipWelcomeScreenData = async (key) => {
        try {
            const data = await AsyncStorage.getItem(REFILL_SKIP_WELCOME_SCREEN_DATA);
            const res = data && data.length ? JSON.parse(data) : {};

            return new Promise(resolve => resolve({
                [STATUS]: SUCCESS,
                [RESPONSE]: res && key && res[key] ? res[key] : res
            }));
        } catch (e) {
            // error
            Utils.log("Get Refill Skip Welcome Screen Data ===> error ", e);

            return new Promise((resolve, rejects) => rejects({
                [STATUS]: ERROR,
                [RESPONSE]: e
            }));
        }
    }

    /** Clear Refill Welcome Screen Login data */
    static clearRefillSkipWelcomeScreenData = async () => {
        try {
            await AsyncStorage.removeItem(REFILL_SKIP_WELCOME_SCREEN_DATA);
            return new Promise(resolve => resolve({
                [STATUS]: SUCCESS
            }));
        } catch (e) {
            // error
            Utils.log("Remove Refill Skip Welcome Screen Data ===> error ", e);

            return new Promise((resolve, rejects) => rejects({
                [STATUS]: ERROR
            }));
        }
    }

    /** Store Refill Notification data */
    static storeRefillNotificationData = async (data) => {
        try {
            await AsyncStorage.setItem(REFILL_NOTIFICATION_DATA, JSON.stringify(data));
            return new Promise(resolve => resolve({
                [STATUS]: SUCCESS
            }));
        } catch (e) {
            // error
            Utils.log("Store Refill Notification Data ===> error ", e);

            return new Promise((resolve, rejects) => rejects({
                [STATUS]: ERROR
            }));
        }
    }

    /** Get Refill Notifiation data */
    static getRefillNotificationData = async (key) => {
        try {
            const data = await AsyncStorage.getItem(REFILL_NOTIFICATION_DATA);
            const res = data && data.length ? JSON.parse(data) : {};

            return new Promise(resolve => resolve({
                [STATUS]: SUCCESS,
                [RESPONSE]: res && key && res[key] ? res[key] : res
            }));
        } catch (e) {
            // error
            Utils.log("Get Refill Notification Data ===> error ", e);

            return new Promise((resolve, rejects) => rejects({
                [STATUS]: ERROR,
                [RESPONSE]: e
            }));
        }
    }

    /** Clear Refill Notification data */
    static clearRefillNotificationData = async () => {
        try {
            await AsyncStorage.removeItem(REFILL_NOTIFICATION_DATA);
            return new Promise(resolve => resolve({
                [STATUS]: SUCCESS
            }));
        } catch (e) {
            // error
            Utils.log("Remove Refill Notification Data ===> error ", e);

            return new Promise((resolve, rejects) => rejects({
                [STATUS]: ERROR
            }));
        }
    }

    /** Store Refill FCM Device Token data */
    static storeRefillFCMDeviceTokenData = async (data) => {
        try {
            await AsyncStorage.setItem(REFILL_FCM_DEVICE_TOKEN, JSON.stringify(data));
            return new Promise(resolve => resolve({
                [STATUS]: SUCCESS
            }));
        } catch (e) {
            // error
            Utils.log("Store Refill FCM Device Token Data ===> error ", e);

            return new Promise((resolve, rejects) => rejects({
                [STATUS]: ERROR
            }));
        }
    }

    /** Get Refill FCM Device Token data */
    static getRefillFCMDeviceTokenData = async (key) => {
        try {
            const data = await AsyncStorage.getItem(REFILL_FCM_DEVICE_TOKEN);
            const res = data && data.length ? JSON.parse(data) : {};

            return new Promise(resolve => resolve({
                [STATUS]: SUCCESS,
                [RESPONSE]: res && key && res[key] ? res[key] : res
            }));
        } catch (e) {
            // error
            Utils.log("Get Refill FCM Device Token Data ===> error ", e);

            return new Promise((resolve, rejects) => rejects({
                [STATUS]: ERROR,
                [RESPONSE]: e
            }));
        }
    }

    /** Clear Refill FCM Device Token data */
    static clearRefillFCMDeviceTokenData = async () => {
        try {
            await AsyncStorage.removeItem(REFILL_FCM_DEVICE_TOKEN);
            return new Promise(resolve => resolve({
                [STATUS]: SUCCESS
            }));
        } catch (e) {
            // error
            Utils.log("Remove Refill FCM Device Token Data ===> error ", e);

            return new Promise((resolve, rejects) => rejects({
                [STATUS]: ERROR
            }));
        }
    }

}