import { FORGOT_PASSWORD_KEY, FORGOT_PASSWORD_FORM, FORGOT_PASSWORD_FORM_EMAIL, FORGOT_PASSWORD_REQEUST_LOADING, FORGOT_PASSWORD_ERRORS, FORGOT_PASSWORD_REQUEST_STATUS, STATUS, MESSAGE, FORGOT_PASSWORD_UPDATE, FORGOT_PASSWORD_RESET, LOG_OUT } from "../Types";

const INIT_STATE = {
    [FORGOT_PASSWORD_KEY]: {
        [FORGOT_PASSWORD_FORM]: {
            [FORGOT_PASSWORD_FORM_EMAIL]: ""
        },
        [FORGOT_PASSWORD_REQEUST_LOADING]: false,
        [FORGOT_PASSWORD_ERRORS]: [],
        [FORGOT_PASSWORD_REQUEST_STATUS]: {
            [STATUS]: undefined,
            [MESSAGE]: undefined
        }
    }
}

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case FORGOT_PASSWORD_UPDATE:
            return { ...state, [FORGOT_PASSWORD_KEY]: action.payload };
        case FORGOT_PASSWORD_RESET:
        case LOG_OUT:
            return {
                ...state,
                ...{
                    [FORGOT_PASSWORD_KEY]: {
                        [FORGOT_PASSWORD_FORM]: {
                            [FORGOT_PASSWORD_FORM_EMAIL]: ""
                        },
                        [FORGOT_PASSWORD_REQEUST_LOADING]: false,
                        [FORGOT_PASSWORD_ERRORS]: [],
                        [FORGOT_PASSWORD_REQUEST_STATUS]: {
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