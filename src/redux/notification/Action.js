import { STATUS, MESSAGE, LOGIN_REQEUST_LOADING, LOGIN_FORM_EMAIL, LOGIN_FORM_PASSWORD, SERVER_SUCCESS, SUCCESS, SERVER_PRESENT, ERROR, SERVER_NO_VALUE, SERVER_NOT_AUTHORIZED, LOGIN_REQEUST_FACEBOOK_LOADING, LOGIN_REQEUST_GOOGLE_LOADING, USER_DATA, DEVICE_IS_LOGGED_IN, RESPONSE, USER_ROOT, USER_KEY, DEVICE_IS_LOGIN_SKIPPED, SERVER_VALIDATION_ERROR, SERVER_EMAIL_PRESENT, ORDER_LIST_RESET, ORDER_LIST_ROOT, ORDER_LIST_KEY, ORDER_LIST_UPDATE, ORDER_LIST_REQUEST_STATUS, ORDER_LIST_REQEUST_LOADING, ORDER_LIST_REQUEST_PAGE, ORDER_LIST_REQUEST_DATA, ORDER_LIST_REQUEST_PAGE_SIZE, ORDER_LIST_TYPE, NOTIFICATION_RESET, NOTIFICATION_ROOT, NOTIFICATION_KEY, NOTIFICATION_UPDATE, NOTIFICATION_REQUEST_PAGE, NOTIFICATION_REQUEST_PAGE_SIZE, NOTIFICATION_REQUEST_STATUS, NOTIFICATION_REQEUST_LOADING, NOTIFICATION_REQUEST_DATA, NOTIFICATION_REQEUST_REFRESH_LOADING, NOTIFICATION_REQEUST_ON_END_REACHED_LOADING, NOTIFICATION_REQEUST_ON_END_REACHED_DONE } from "../Types";
import Utils from "../../common/util/Utils";
import { EMPTY } from "rxjs";
import { refillNotificationList } from "../../apis/APIs";

/** Notification List data */
export const notificationList = (isRefresh = false, isEndReached = false) => {
    return async (dispatch, getState) => {
        try {
            const data_info = getState()[NOTIFICATION_ROOT][NOTIFICATION_KEY];

            const data = data_info && data_info[NOTIFICATION_REQUEST_DATA] ? data_info[NOTIFICATION_REQUEST_DATA] : [];

            const page = data_info && data_info[NOTIFICATION_REQUEST_PAGE] ? data_info[NOTIFICATION_REQUEST_PAGE] : 1;
            const page_size = data_info && data_info[NOTIFICATION_REQUEST_PAGE_SIZE] ? data_info[NOTIFICATION_REQUEST_PAGE_SIZE] : 10;

            const user_data_info = getState()[USER_ROOT][USER_KEY];
            const user_data = user_data_info && user_data_info[USER_DATA] ? user_data_info[USER_DATA] : {};

            //Intialize state
            dispatch(updateNotificationListUIConstraints({
                [NOTIFICATION_REQUEST_STATUS]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                [NOTIFICATION_REQEUST_LOADING]: (isRefresh || isEndReached) ? false : true,
                [NOTIFICATION_REQEUST_REFRESH_LOADING]: isRefresh,
                [NOTIFICATION_REQEUST_ON_END_REACHED_LOADING]: isEndReached,
                [NOTIFICATION_REQUEST_PAGE]: isEndReached ? page : 1
            }));

            if (!user_data.user_token) {
                dispatch(updateNotificationListUIConstraints({
                    [NOTIFICATION_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: "User token not found, please try again."
                    },
                    [NOTIFICATION_REQEUST_LOADING]: false,
                    [NOTIFICATION_REQEUST_REFRESH_LOADING]: false,
                    [NOTIFICATION_REQEUST_ON_END_REACHED_LOADING]: false,
                }));

                return;
            }

            const body = {
                user_token: user_data.user_token,
                page: isEndReached ? page : 1,
                page_size: page_size,
                sort: 'dsc'
            }

            Utils.log("Notification List Response ===> ", body);

            try {
                const res = await refillNotificationList(body);
                Utils.log("Notification List Response ===> ", res, body);
                if (res && res.message === SERVER_SUCCESS) {
                    dispatch(updateNotificationListUIConstraints({
                        [NOTIFICATION_REQUEST_STATUS]: {
                            [STATUS]: SUCCESS,
                            [MESSAGE]: "Success"
                        },
                        [NOTIFICATION_REQEUST_LOADING]: false,
                        [NOTIFICATION_REQEUST_REFRESH_LOADING]: false,
                        [NOTIFICATION_REQEUST_ON_END_REACHED_LOADING]: false,
                        [NOTIFICATION_REQUEST_DATA]: isEndReached ? data.concat(res.data) : res.data,
                        [NOTIFICATION_REQEUST_ON_END_REACHED_DONE]: isEndReached ? res && res.data && res.data.length ? false : true : false
                    }));
                } else {
                    const _res = res && res.length ? res[0] : res;
                    let message = "";
                    switch (_res.message) {
                        case SERVER_NO_VALUE:
                            message = "Notification list is empty";
                            break;
                        default:
                            message = "Internal server error, please try again";
                    }

                    dispatch(updateNotificationListUIConstraints({
                        [NOTIFICATION_REQUEST_STATUS]: {
                            [STATUS]: ERROR,
                            [MESSAGE]: message
                        },
                        [NOTIFICATION_REQEUST_LOADING]: false,
                        [NOTIFICATION_REQEUST_REFRESH_LOADING]: false,
                        [NOTIFICATION_REQEUST_ON_END_REACHED_LOADING]: false,
                        [NOTIFICATION_REQEUST_ON_END_REACHED_DONE]: _res.message === SERVER_NO_VALUE ? true : false
                    }));
                }
            } catch (error) {
                Utils.log("Order Notification Loading Response ===> error", error);
                dispatch(updateNotificationListUIConstraints({
                    [NOTIFICATION_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: "Please try again"
                    },
                    [NOTIFICATION_REQEUST_LOADING]: false,
                    [NOTIFICATION_REQEUST_REFRESH_LOADING]: false,
                    [NOTIFICATION_REQEUST_ON_END_REACHED_LOADING]: false,
                    [NOTIFICATION_REQEUST_ON_END_REACHED_DONE]: false
                }));
            }
        } catch (error) {
            Utils.log("Update Notification List Form Data ===> error ", error);
        }
    }
}

/** Manage Notification List UI Constraints */
export const updateNotificationListUIConstraints = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[NOTIFICATION_ROOT][NOTIFICATION_KEY];
            const data = Object.assign(formData, obj);

            dispatch(updateNotificationListState(data));
        } catch (error) {
            Utils.log("Update Login UI Constraints ===> error ", error);
        }
    }
}

/** Update notification list data state */
const updateNotificationListState = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[NOTIFICATION_ROOT][NOTIFICATION_KEY];

            dispatch({
                type: NOTIFICATION_UPDATE,
                payload: Object.assign(formData, obj)
            })
        } catch (error) {
            Utils.log("Update Order List State ===> error ", error);
        }
    }
}

/** Reset notification data state */
export const resetNotificationListState = () => {
    return (dispatch) => {
        try {
            dispatch({
                type: NOTIFICATION_RESET,
                payload: {}
            })
        } catch (error) {
            Utils.log("Reset Order List State ===> error ", error);
        }
    }
}