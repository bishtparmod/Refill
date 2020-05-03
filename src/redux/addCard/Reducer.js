import { ADD_CARD_KEY, ADD_CARD_REQUEST_LOADING, ADD_CARD_REQUEST_STATUS, STATUS, MESSAGE, ADD_CARD_FORM, ADD_CARD_FORM_CARDHOLDER_NAME, ADD_CARD_FORM_CVV, ADD_CARD_FORM_EXPIRE_DATE, ADD_CARD_UPDATE, ADD_CARD_RESET, ADD_CARD_FORM_CARD_NUMBER, LOG_OUT, ADD_CARD_IS_CALENDAR_VISIBLE, LIST_CARD_REQUEST_DATA, LIST_CARD_REQUEST_LOADING, LIST_CARD_REQUEST_REFRESH_LOADING, LIST_CARD_REQUEST_ON_END_REACHED_LOADING, LIST_CARD_REQUEST_STATUS, ADD_CARD_ERRORS, LIST_CARD_REQUEST_PAGE } from "../Types";

const INIT_STATE = {
    [ADD_CARD_KEY]: {
        [ADD_CARD_REQUEST_LOADING]: false,
        [ADD_CARD_IS_CALENDAR_VISIBLE]: false,
        [ADD_CARD_REQUEST_STATUS]: {
            [STATUS]: undefined,
            [MESSAGE]: undefined
        },
        [ADD_CARD_FORM]: {
            [ADD_CARD_FORM_CARDHOLDER_NAME]: "",
            [ADD_CARD_FORM_CVV]: "",
            [ADD_CARD_FORM_CARD_NUMBER]: "",
            [ADD_CARD_FORM_EXPIRE_DATE]: ""
        },
        [ADD_CARD_ERRORS]: [],

        [LIST_CARD_REQUEST_DATA]: [],
        [LIST_CARD_REQUEST_LOADING]: false,
        [LIST_CARD_REQUEST_REFRESH_LOADING]: false,
        [LIST_CARD_REQUEST_ON_END_REACHED_LOADING]: false,
        [LIST_CARD_REQUEST_STATUS]: {
            [STATUS]: undefined,
            [MESSAGE]: undefined
        }
    }
}

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case ADD_CARD_UPDATE:
            return { ...state, [ADD_CARD_KEY]: action.payload };
        case ADD_CARD_RESET:
        case LOG_OUT:
            return {
                ...state,
                ...{
                    [ADD_CARD_KEY]: {
                        [ADD_CARD_REQUEST_LOADING]: false,
                        [ADD_CARD_REQUEST_STATUS]: {
                            [STATUS]: undefined,
                            [MESSAGE]: undefined
                        },
                        [ADD_CARD_FORM]: {
                            [ADD_CARD_FORM_CARDHOLDER_NAME]: "",
                            [ADD_CARD_FORM_CVV]: "",
                            [ADD_CARD_FORM_CARD_NUMBER]: "",
                            [ADD_CARD_FORM_EXPIRE_DATE]: ""
                        },

                        [LIST_CARD_REQUEST_DATA]: [],
                        [LIST_CARD_REQUEST_PAGE]: 1,
                        [LIST_CARD_REQUEST_LOADING]: false,
                        [LIST_CARD_REQUEST_REFRESH_LOADING]: false,
                        [LIST_CARD_REQUEST_ON_END_REACHED_LOADING]: false,
                        [LIST_CARD_REQUEST_STATUS]: {
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