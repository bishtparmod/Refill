import { SIGNUP_KEY, SIGNUP_REQEUST_LOADING, SIGNUP_REQUEST_STATUS, STATUS, MESSAGE, SIGNUP_FORM, SIGNUP_FORM_EMAIL, SIGNUP_FORM_PASSWORD, SIGNUP_FORM_CONFIRM_PASSWORD, SIGNUP_UPDATE, LOG_OUT, SIGNUP_RESET, SIGNUP_ERRORS, SIGNUP_PASSWORD_TOGGLE_SECURE_ENTRY, SIGNUP_CONFIRM_PASSWORD_TOGGLE_SECURE_ENTRY } from "../Types";

const INIT_STATE = {
    [SIGNUP_KEY]: {
        [SIGNUP_FORM]: {
            [SIGNUP_FORM_EMAIL]: "",
            [SIGNUP_FORM_PASSWORD]: "",
            [SIGNUP_FORM_CONFIRM_PASSWORD]: ""
        },
        [SIGNUP_REQEUST_LOADING]: false,
        [SIGNUP_CONFIRM_PASSWORD_TOGGLE_SECURE_ENTRY]: true,
        [SIGNUP_PASSWORD_TOGGLE_SECURE_ENTRY]: true,
        [SIGNUP_ERRORS]: [],
        [SIGNUP_REQUEST_STATUS]: {
            [STATUS]: undefined,
            [MESSAGE]: undefined
        }
    }
}

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case SIGNUP_UPDATE:
            return { ...state, [SIGNUP_KEY]: action.payload };
        case SIGNUP_RESET:
        case LOG_OUT:
            return {
                ...state,
                ...{
                    [SIGNUP_KEY]: {
                        [SIGNUP_FORM]: {
                            [SIGNUP_FORM_EMAIL]: "",
                            [SIGNUP_FORM_PASSWORD]: "",
                            [SIGNUP_FORM_CONFIRM_PASSWORD]: ""
                        },
                        [SIGNUP_REQEUST_LOADING]: false,
                        [SIGNUP_CONFIRM_PASSWORD_TOGGLE_SECURE_ENTRY]: true,
                        [SIGNUP_PASSWORD_TOGGLE_SECURE_ENTRY]: true,
                        [SIGNUP_ERRORS]: [],
                        [SIGNUP_REQUEST_STATUS]: {
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