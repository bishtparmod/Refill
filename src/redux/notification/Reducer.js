import { NOTIFICATION_KEY, NOTIFICATION_REQEUST_LOADING, NOTIFICATION_REQUEST_DATA, NOTIFICATION_REQUEST_STATUS, STATUS, MESSAGE, NOTIFICATION_UPDATE, NOTIFICATION_RESET, LOG_OUT, NOTIFICATION_REQEUST_REFRESH_LOADING, NOTIFICATION_REQEUST_ON_END_REACHED_LOADING, NOTIFICATION_REQEUST_ON_END_REACHED_DONE, NOTIFICATION_REQUEST_PAGE, NOTIFICATION_REQUEST_PAGE_SIZE } from "../Types";

const INIT_STATE = {
    [NOTIFICATION_KEY]: {
        [NOTIFICATION_REQEUST_LOADING]: false,
        [NOTIFICATION_REQEUST_REFRESH_LOADING]: false,
        [NOTIFICATION_REQEUST_ON_END_REACHED_LOADING]: false,
        [NOTIFICATION_REQEUST_ON_END_REACHED_DONE]: false,
        [NOTIFICATION_REQUEST_DATA]: [],
        [NOTIFICATION_REQUEST_STATUS]: {
            [STATUS]: undefined,
            [MESSAGE]: undefined
        },
        [NOTIFICATION_REQUEST_PAGE]: 1,
        [NOTIFICATION_REQUEST_PAGE_SIZE]: 10
    }
}

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case NOTIFICATION_UPDATE:
            return { ...state, [NOTIFICATION_KEY]: action.payload };
        case NOTIFICATION_RESET:
        case LOG_OUT:
            return {
                ...state,
                ...{
                    [NOTIFICATION_KEY]: {
                        [NOTIFICATION_REQEUST_LOADING]: false,
                        [NOTIFICATION_REQEUST_REFRESH_LOADING]: false,
                        [NOTIFICATION_REQEUST_ON_END_REACHED_LOADING]: false,
                        [NOTIFICATION_REQEUST_ON_END_REACHED_DONE]: false,
                        [NOTIFICATION_REQUEST_DATA]: [],
                        [NOTIFICATION_REQUEST_STATUS]: {
                            [STATUS]: undefined,
                            [MESSAGE]: undefined
                        },
                        [NOTIFICATION_REQUEST_PAGE]: 1,
                        [NOTIFICATION_REQUEST_PAGE_SIZE]: 10
                    }
                }
            }
        default:
            return state;
    }
};