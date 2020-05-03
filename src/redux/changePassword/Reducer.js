import { CHANGE_PASSWORD_KEY, CHANGE_PASSWORD_FORM, CHANGE_OLD_PASSWORD_FORM_PASSWORD, CHANGE_PASSWORD_FORM_CONFIRM_PASSWORD, CHANGE_PASSWORD_REQEUST_LOADING, CHANGE_PASSWORD_ERRORS, CHANGE_PASSWORD_REQUEST_STATUS, STATUS, MESSAGE, CHANGE_PASSWORD_UPDATE, CHANGE_PASSWORD_RESET, LOG_OUT, CHANGE_PASSWORD_FORM_PASSWORD, CHANGE_PASSWORD_TOGGLE_SECURE_ENTRY, CHANGE_CONFIRM_PASSWORD_TOGGLE_SECURE_ENTRY, CHANGE_OLD_PASSWORD_TOGGLE_SECURE_ENTRY } from "../Types";

const INIT_STATE = {
    [CHANGE_PASSWORD_KEY]: {
        [CHANGE_PASSWORD_FORM]: {
            [CHANGE_OLD_PASSWORD_FORM_PASSWORD]: "",
            [CHANGE_PASSWORD_FORM_PASSWORD]: "",
            [CHANGE_PASSWORD_FORM_CONFIRM_PASSWORD]: ""
        },
        [CHANGE_PASSWORD_REQEUST_LOADING]: false,
        [CHANGE_PASSWORD_ERRORS]: [],
        [CHANGE_PASSWORD_REQUEST_STATUS]: {
            [STATUS]: undefined,
            [MESSAGE]: undefined
        },
        [CHANGE_PASSWORD_TOGGLE_SECURE_ENTRY]: true,
        [CHANGE_CONFIRM_PASSWORD_TOGGLE_SECURE_ENTRY]: true,
        [CHANGE_OLD_PASSWORD_TOGGLE_SECURE_ENTRY]: true
    }
}

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case CHANGE_PASSWORD_UPDATE:
            return { ...state, [CHANGE_PASSWORD_KEY]: action.payload };
        case CHANGE_PASSWORD_RESET:
        case LOG_OUT:
            return {
                ...state,
                ...{
                    [CHANGE_PASSWORD_KEY]: {
                        [CHANGE_PASSWORD_FORM]: {
                            [CHANGE_OLD_PASSWORD_FORM_PASSWORD]: "",
                            [CHANGE_PASSWORD_FORM_PASSWORD]: "",
                            [CHANGE_PASSWORD_FORM_CONFIRM_PASSWORD]: ""
                        },
                        [CHANGE_PASSWORD_REQEUST_LOADING]: false,
                        [CHANGE_PASSWORD_ERRORS]: [],
                        [CHANGE_PASSWORD_REQUEST_STATUS]: {
                            [STATUS]: undefined,
                            [MESSAGE]: undefined
                        },
                        [CHANGE_PASSWORD_TOGGLE_SECURE_ENTRY]: true,
                        [CHANGE_CONFIRM_PASSWORD_TOGGLE_SECURE_ENTRY]: true,
                        [CHANGE_OLD_PASSWORD_TOGGLE_SECURE_ENTRY]: true
                    }
                }
            }
        default:
            return state;
    }
};