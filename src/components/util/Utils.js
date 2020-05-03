import { ToastsStore } from 'react-toasts';
import { SERVER_FORBIDDEN } from '../../redux/Types';

export default class Utils {

    static verifyResponse = response => new Promise((resolve, rejects) => response && response.ok ? resolve(response) : rejects(response))

    static handleError = error => {
        if (error && (error.status === 409 && error.message === SERVER_FORBIDDEN)) {
            ToastsStore.error("Not Authorized!");
        }

        if (error && (error.status === 422 || error.status === 501 || error.status === 401 || error.status === 404 || error.status === 409 || error.status === 401 || error.status === 400 || error.status === 304 || error.status === 409 || error.status === 500)) return error.json();
        return error;
    }

    static log = (prefix, ...args) => {
        // if (__DEV__) {
        console.log(prefix, args);
        // }
    }

}