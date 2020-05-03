import Utils from '../components/util/Utils';
import { REFILL_LOGIN_DATA, STATUS, SUCCESS, ERROR, RESPONSE } from '../redux/Types';

export default class RefillStorage {

    /** Store Refill Login data */
    static storeRefillLoginData = async (data) => {
        try {
            await localStorage.setItem(REFILL_LOGIN_DATA, JSON.stringify(data));
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
            const data = await localStorage.getItem(REFILL_LOGIN_DATA);
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
            await localStorage.removeItem(REFILL_LOGIN_DATA);
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

}