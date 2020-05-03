import { ORDER_VIEW_KEY, ORDER_VIEW_REQEUST_LOADING, ORDER_VIEW_REQUEST_DATA, ORDER_VIEW_UPDATE, ORDER_VIEW_RESET, LOG_OUT, ORDER_VIEW_REQUEST_STATUS, STATUS, MESSAGE, ORDER_VIEW_REQUEST_ID } from "../Types";

const INIT_STATE = {
    [ORDER_VIEW_KEY]: {
        [ORDER_VIEW_REQEUST_LOADING]: false,
        [ORDER_VIEW_REQUEST_DATA]: [],
        [ORDER_VIEW_REQUEST_STATUS]: {
            [STATUS]: undefined,
            [MESSAGE]: undefined
        },
        [ORDER_VIEW_REQUEST_ID]: ""
    }
}

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case ORDER_VIEW_UPDATE:
            return { ...state, [ORDER_VIEW_KEY]: action.payload };
        case ORDER_VIEW_RESET:
        case LOG_OUT:
            return {
                ...state,
                ...{
                    [ORDER_VIEW_KEY]: {
                        [ORDER_VIEW_REQEUST_LOADING]: false,
                        [ORDER_VIEW_REQUEST_DATA]: [],
                        [ORDER_VIEW_REQUEST_STATUS]: {
                            [STATUS]: undefined,
                            [MESSAGE]: undefined
                        },
                        [ORDER_VIEW_REQUEST_ID]: ""
                    }
                }
            }
        default:
            return state;
    }
};