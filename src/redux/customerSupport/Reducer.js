import { CUSTOMER_SUPPORT_KEY, CUSTOMER_SUPPORT_REQUEST_LOADING, CUSTOMER_SUPPORT_REQUEST_STATUS, STATUS, MESSAGE, EMPTY, CUSTOMER_SUPPORT_FORM_MESSAGE, CUSTOMER_SUPPORT_FORM, CUSTOMER_SUPPORT_UPDATE, CUSTOMER_SUPPORT_RESET, LOG_OUT, CUSTOMER_SUPPORT_ERRORS } from "../Types";

const INIT_STATE = {
    [CUSTOMER_SUPPORT_KEY]: {
        [CUSTOMER_SUPPORT_REQUEST_LOADING]: false,
        [CUSTOMER_SUPPORT_REQUEST_STATUS]: {
            [STATUS]: EMPTY,
            [MESSAGE]: ""
        },
        [CUSTOMER_SUPPORT_ERRORS]: [],
        [CUSTOMER_SUPPORT_FORM]: {
            [CUSTOMER_SUPPORT_FORM_MESSAGE]: ""
        }
    }
}

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case CUSTOMER_SUPPORT_UPDATE:
            return { ...state, [CUSTOMER_SUPPORT_KEY]: action.payload };
        case CUSTOMER_SUPPORT_RESET:
        case LOG_OUT:
            return {
                ...state,
                ...{
                    [CUSTOMER_SUPPORT_KEY]: {
                        [CUSTOMER_SUPPORT_REQUEST_LOADING]: false,
                        [CUSTOMER_SUPPORT_REQUEST_STATUS]: {
                            [STATUS]: EMPTY,
                            [MESSAGE]: ""
                        },
                        [CUSTOMER_SUPPORT_ERRORS]: [],
                        [CUSTOMER_SUPPORT_FORM]: {
                            [CUSTOMER_SUPPORT_FORM_MESSAGE]: ""
                        }
                    }
                }
            }
        default:
            return state;
    }
};