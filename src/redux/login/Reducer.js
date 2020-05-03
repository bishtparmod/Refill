import { LOGIN_KEY, LOGIN_FORM, LOGIN_FORM_EMAIL, LOGIN_FORM_PASSWORD, LOGIN_REQEUST_LOADING, LOGIN_PASSWORD_TOGGLE_SECURE_ENTRY, LOGIN_ERRORS, LOGIN_REQUEST_STATUS, STATUS, MESSAGE, LOGIN_UPDATE, LOGIN_RESET, LOG_OUT } from "../Types";

const INIT_STATE = {
    [LOGIN_KEY]: {
        [LOGIN_FORM]: {
            [LOGIN_FORM_EMAIL]: "",
            [LOGIN_FORM_PASSWORD]: ""
        },
        [LOGIN_REQEUST_LOADING]: false,
        [LOGIN_PASSWORD_TOGGLE_SECURE_ENTRY]: true,
        [LOGIN_ERRORS]: [],
        [LOGIN_REQUEST_STATUS]: {
            [STATUS]: undefined,
            [MESSAGE]: undefined
        }
    }
}

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case LOGIN_UPDATE:
            return { ...state, [LOGIN_KEY]: action.payload };
        case LOGIN_RESET:
        case LOG_OUT:
            return {
                ...state,
                ...{
                    [LOGIN_KEY]: {
                        [LOGIN_FORM]: {
                            [LOGIN_FORM_EMAIL]: "",
                            [LOGIN_FORM_PASSWORD]: ""
                        },
                        [LOGIN_REQEUST_LOADING]: false,
                        [LOGIN_PASSWORD_TOGGLE_SECURE_ENTRY]: true,
                        [LOGIN_ERRORS]: [],
                        [LOGIN_REQUEST_STATUS]: {
                            [STATUS]: undefined,
                            [MESSAGE]: undefined
                        }
                    }
                }
            }
        default:
            return state;
    }
};