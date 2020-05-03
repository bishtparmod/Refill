import { PRODUCT_DETAIL_KEY, PRODUCT_DETAIL_REQUEST_LOADING, PRODUCT_DETAIL_REQUEST_DATA, PRODUCT_DETAIL_REQUEST_PAGE, PRODUCT_DETAIL_REQUEST_PAGE_SIZE, PRODUCT_DETAIL_REQUEST_STATUS, STATUS, MESSAGE, PRODUCT_DETAIL_UPDATE, PRODUCT_DETAIL_RESET, LOG_OUT, PRODUCT_DETAIL_FORM, PRODUCT_DETAIL_FORM_ORDER_START_DATE, PRODUCT_DETAIL_FORM_ORDER_END_DATE, PRODUCT_DETAIL_FORM_ORDER_QUANTITY, PRODUCT_DETAIL_FORM_ORDER_TYPE, PRODUCT_DETAIL_FORM_ORDER_CUSTOM_DATES, WEEKLY_ORDER, PRODUCT_DETAIL_IS_ORDER_TYPE_ALERT, PRODUCT_DETAIL_IS_ORDER_CALENDAR_ALERT, PRODUCT_DETAIL_ORDERS_ESTIMATE_LIST, PRODUCT_DETAIL_FORM_ORDER_CARD_ID, PRODUCT_DETAIL_ORDERS_ESTIMATE_LOADING, PRODUCT_DETAIL_ORDERS_IS_REFILL, PRODUCT_DETAIL_REFILL_ORDER_IS_CANCEL_VISIBLE, PRODUCT_DETAIL_REFILL_ORDER_IS_GET_NOW_VISIBLE, PRODUCT_DETAIL_REFILL_ORDER_IS_SKIP_VISIBLE, PRODUCT_DETAIL_ORDERS_REFILL_DATA, PRODUCT_DETAIL_REFILL_ORDER_IS_SKIP_UPCOMING_ORDER } from "../Types";

const INIT_STATE = {
    [PRODUCT_DETAIL_KEY]: {
        [PRODUCT_DETAIL_REQUEST_LOADING]: false,
        [PRODUCT_DETAIL_REQUEST_DATA]: [],
        [PRODUCT_DETAIL_REQUEST_PAGE]: 1,
        [PRODUCT_DETAIL_REQUEST_PAGE_SIZE]: 10,
        [PRODUCT_DETAIL_REQUEST_STATUS]: {
            [STATUS]: undefined,
            [MESSAGE]: undefined
        },
        [PRODUCT_DETAIL_FORM]: {
            [PRODUCT_DETAIL_FORM_ORDER_START_DATE]: "",
            [PRODUCT_DETAIL_FORM_ORDER_END_DATE]: "",
            [PRODUCT_DETAIL_FORM_ORDER_QUANTITY]: 1,
            [PRODUCT_DETAIL_FORM_ORDER_TYPE]: WEEKLY_ORDER,
            [PRODUCT_DETAIL_FORM_ORDER_CUSTOM_DATES]: [],
            [PRODUCT_DETAIL_FORM_ORDER_CARD_ID]: ""
        },
        [PRODUCT_DETAIL_ORDERS_ESTIMATE_LIST]: [],
        [PRODUCT_DETAIL_ORDERS_ESTIMATE_LOADING]: false,
        
        [PRODUCT_DETAIL_ORDERS_IS_REFILL]: false,
        [PRODUCT_DETAIL_ORDERS_REFILL_DATA]: {},

        [PRODUCT_DETAIL_REFILL_ORDER_IS_CANCEL_VISIBLE]: false,
        [PRODUCT_DETAIL_REFILL_ORDER_IS_GET_NOW_VISIBLE]: false,
        [PRODUCT_DETAIL_REFILL_ORDER_IS_SKIP_VISIBLE]: false,

        [PRODUCT_DETAIL_REFILL_ORDER_IS_SKIP_UPCOMING_ORDER]: false
    }
}

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case PRODUCT_DETAIL_UPDATE:
            return { ...state, [PRODUCT_DETAIL_KEY]: action.payload };
        case PRODUCT_DETAIL_RESET:
        case LOG_OUT:
            return {
                ...state,
                ...{
                    [PRODUCT_DETAIL_KEY]: {
                        [PRODUCT_DETAIL_REQUEST_LOADING]: false,
                        [PRODUCT_DETAIL_REQUEST_DATA]: [],
                        [PRODUCT_DETAIL_REQUEST_PAGE]: 1,
                        [PRODUCT_DETAIL_REQUEST_PAGE_SIZE]: 10,
                        [PRODUCT_DETAIL_REQUEST_STATUS]: {
                            [STATUS]: undefined,
                            [MESSAGE]: undefined
                        },
                        [PRODUCT_DETAIL_IS_ORDER_TYPE_ALERT]: false,
                        [PRODUCT_DETAIL_IS_ORDER_CALENDAR_ALERT]: false,
                        [PRODUCT_DETAIL_REQUEST_PAGE_SIZE]: false,
                        [PRODUCT_DETAIL_FORM]: {
                            [PRODUCT_DETAIL_FORM_ORDER_START_DATE]: "",
                            [PRODUCT_DETAIL_FORM_ORDER_END_DATE]: "",
                            [PRODUCT_DETAIL_FORM_ORDER_QUANTITY]: 1,
                            [PRODUCT_DETAIL_FORM_ORDER_TYPE]: WEEKLY_ORDER,
                            [PRODUCT_DETAIL_FORM_ORDER_CUSTOM_DATES]: [],
                            [PRODUCT_DETAIL_FORM_ORDER_CARD_ID]: ""
                        },
                        [PRODUCT_DETAIL_ORDERS_ESTIMATE_LIST]: [],
                        [PRODUCT_DETAIL_ORDERS_ESTIMATE_LOADING]: false,
                        
                        [PRODUCT_DETAIL_ORDERS_IS_REFILL]: false,
                        [PRODUCT_DETAIL_ORDERS_REFILL_DATA]: {},
                        
                        [PRODUCT_DETAIL_REFILL_ORDER_IS_CANCEL_VISIBLE]: false,
                        [PRODUCT_DETAIL_REFILL_ORDER_IS_GET_NOW_VISIBLE]: false,
                        [PRODUCT_DETAIL_REFILL_ORDER_IS_SKIP_VISIBLE]: false,

                        [PRODUCT_DETAIL_REFILL_ORDER_IS_SKIP_UPCOMING_ORDER]: false
                    }
                }
            }
        default:
            return state;
    }
};