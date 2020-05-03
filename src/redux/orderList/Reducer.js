import { ORDER_LIST_KEY, ORDER_LIST_REQEUST_LOADING, ALL_ORDER, ORDER_LIST_REQUEST_STATUS, STATUS, MESSAGE, ORDER_LIST_UPDATE, ORDER_LIST_RESET, LOG_OUT, ORDER_LIST_REQUEST_DATA, ORDER_LIST_TYPE, ORDER_LIST_REQUEST_PAGE, ORDER_LIST_REQUEST_PAGE_SIZE, ORDER_LIST_REQEUST_REFRESH_LOADING, ORDER_LIST_REQEUST_ON_END_REACHED_LOADING, ORDER_LIST_REQEUST_ON_END_REACHED_DONE } from "../Types";

const INIT_STATE = {
    [ORDER_LIST_KEY]: {
        [ORDER_LIST_REQEUST_LOADING]: false,
        [ORDER_LIST_REQEUST_REFRESH_LOADING]: false,
        [ORDER_LIST_REQEUST_ON_END_REACHED_LOADING]: false,
        [ORDER_LIST_REQEUST_ON_END_REACHED_DONE]: false,
        [ORDER_LIST_REQUEST_DATA]: [],
        [ORDER_LIST_TYPE]: ALL_ORDER,
        [ORDER_LIST_REQUEST_PAGE]: 1,
        [ORDER_LIST_REQUEST_PAGE_SIZE]: 10,
        [ORDER_LIST_REQUEST_STATUS]: {
            [STATUS]: undefined,
            [MESSAGE]: undefined
        }
    }
}

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case ORDER_LIST_UPDATE:
            return { ...state, [ORDER_LIST_KEY]: action.payload };
        case ORDER_LIST_RESET:
        case LOG_OUT:
            return {
                ...state,
                ...{
                    [ORDER_LIST_KEY]: {
                        [ORDER_LIST_REQEUST_LOADING]: false,
                        [ORDER_LIST_REQEUST_REFRESH_LOADING]: false,
                        [ORDER_LIST_REQEUST_ON_END_REACHED_LOADING]: false,
                        [ORDER_LIST_REQEUST_ON_END_REACHED_DONE]: false,
                        [ORDER_LIST_REQUEST_DATA]: [],
                        [ORDER_LIST_TYPE]: ALL_ORDER,
                        [ORDER_LIST_REQUEST_PAGE]: 1,
                        [ORDER_LIST_REQUEST_PAGE_SIZE]: 10,
                        [ORDER_LIST_REQUEST_STATUS]: {
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