import { RESET_PASSWORD_KEY, RESET_PASSWORD_FORM, RESET_PASSWORD_FORM_EMAIL, RESET_PASSWORD_REQEUST_LOADING, RESET_PASSWORD_ERRORS, RESET_PASSWORD_REQUEST_STATUS, STATUS, MESSAGE, RESET_PASSWORD_UPDATE, RESET_PASSWORD_RESET, LOG_OUT, RESET_PASSWORD_FORM_PASSWORD, RESET_PASSWORD_FORM_CONFIRM_PASSWORD, RESET_PASSWORD_TOGGLE_SECURE_ENTRY, RESET_CONFIRM_PASSWORD_TOGGLE_SECURE_ENTRY } from "../Types";

const INIT_STATE = {
    [RESET_PASSWORD_KEY]: {
        [RESET_PASSWORD_FORM]: {
            [RESET_PASSWORD_FORM_PASSWORD]: "",
            [RESET_PASSWORD_FORM_CONFIRM_PASSWORD]: ""
        },
        [RESET_PASSWORD_REQEUST_LOADING]: false,
        [RESET_PASSWORD_TOGGLE_SECURE_ENTRY]: true,
        [RESET_CONFIRM_PASSWORD_TOGGLE_SECURE_ENTRY]: true,
        [RESET_PASSWORD_ERRORS]: [],
        [RESET_PASSWORD_REQUEST_STATUS]: {
            [STATUS]: undefined,
            [MESSAGE]: undefined
        }
    }
}

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case RESET_PASSWORD_UPDATE:
            return { ...state, [RESET_PASSWORD_KEY]: action.payload };
        case RESET_PASSWORD_RESET:
        case LOG_OUT:
            return {
                ...state,
                ...{
                    [RESET_PASSWORD_KEY]: {
                        [RESET_PASSWORD_FORM]: {
                            [RESET_PASSWORD_FORM_PASSWORD]: "",
                            [RESET_PASSWORD_FORM_CONFIRM_PASSWORD]: ""
                        },
                        [RESET_PASSWORD_REQEUST_LOADING]: false,
                        [RESET_PASSWORD_ERRORS]: [],
                        [RESET_PASSWORD_REQUEST_STATUS]: {
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