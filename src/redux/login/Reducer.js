import { LOGIN_KEY, LOGIN_REQEUST_LOADING, LOGIN_REQUEST_STATUS, STATUS, MESSAGE, EMPTY, LOGIN_FORM, LOGIN_FORM_PASSWORD, LOGIN_ERRORS, LOGIN_FORM_EMAIL, LOGIN_UPDATE, LOG_OUT, LOGIN_REQEUST_SESSION_LOADING, LOGIN_REQUEST_SESSION_STATUS, LOGIN_RESET } from "../Types";

const INITIAL_STATE = {
    [LOGIN_KEY]: {
        [LOGIN_FORM]: {
            [LOGIN_FORM_EMAIL]: "",
            [LOGIN_FORM_PASSWORD]: ""
        },
        [LOGIN_REQEUST_LOADING]: false,
        [LOGIN_REQUEST_STATUS]: {
            [STATUS]: EMPTY,
            [MESSAGE]: ""
        },
        [LOGIN_REQEUST_SESSION_LOADING]: false,
        [LOGIN_REQUEST_SESSION_STATUS]: {
            [STATUS]: EMPTY,
            [MESSAGE]: ""
        },
        [LOGIN_ERRORS]: []
    }
};

const Reducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case LOGIN_UPDATE:
            return { ...state, [LOGIN_KEY]: action.payload }
        case LOGIN_RESET:
        case LOG_OUT:
            return {
                ...state,
                [LOGIN_KEY]: {
                    [LOGIN_FORM]: {
                        [LOGIN_FORM_EMAIL]: "",
                        [LOGIN_FORM_PASSWORD]: ""
                    },
                    [LOGIN_REQEUST_LOADING]: false,
                    [LOGIN_REQUEST_STATUS]: {
                        [STATUS]: EMPTY,
                        [MESSAGE]: ""
                    },
                    [LOGIN_REQEUST_SESSION_LOADING]: false,
                    [LOGIN_REQUEST_SESSION_STATUS]: {
                        [STATUS]: EMPTY,
                        [MESSAGE]: ""
                    },
                    [LOGIN_ERRORS]: []
                }
            }
        default:
            return state;
    }
}

export default Reducer;