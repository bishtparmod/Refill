import { STATUS, MESSAGE, LOGIN_REQEUST_LOADING, LOGIN_FORM_EMAIL, LOGIN_FORM_PASSWORD, SERVER_SUCCESS, SUCCESS, SERVER_PRESENT, ERROR, SERVER_NO_VALUE, SERVER_NOT_AUTHORIZED, LOGIN_REQEUST_FACEBOOK_LOADING, LOGIN_REQEUST_GOOGLE_LOADING, USER_DATA, DEVICE_IS_LOGGED_IN, RESPONSE, USER_ROOT, USER_KEY, DEVICE_IS_LOGIN_SKIPPED, SERVER_VALIDATION_ERROR, SERVER_EMAIL_PRESENT, ORDER_LIST_RESET, ORDER_LIST_ROOT, ORDER_LIST_KEY, ORDER_LIST_UPDATE, ORDER_LIST_REQUEST_STATUS, ORDER_LIST_REQEUST_LOADING, ORDER_LIST_REQUEST_PAGE, ORDER_LIST_REQUEST_DATA, ORDER_LIST_REQUEST_PAGE_SIZE, ORDER_LIST_TYPE, ORDER_LIST_REQEUST_REFRESH_LOADING, ORDER_LIST_REQEUST_ON_END_REACHED_LOADING, ALL_ORDER, ORDER_LIST_REQEUST_ON_END_REACHED_DONE } from "../Types";
import Utils from "../../common/util/Utils";
import { EMPTY } from "rxjs";
import { refillOrderList } from "../../apis/APIs";

/** Order List data */
export const orderList = (isRefresh = false, isEndReached = false) => {
    return async (dispatch, getState) => {
        try {
            const data_info = getState()[ORDER_LIST_ROOT][ORDER_LIST_KEY];

            const page = data_info && data_info[ORDER_LIST_REQUEST_PAGE] ? data_info[ORDER_LIST_REQUEST_PAGE] : 1;
            const page_size = data_info && data_info[ORDER_LIST_REQUEST_PAGE_SIZE] ? data_info[ORDER_LIST_REQUEST_PAGE_SIZE] : 10;
            const order_status = data_info && data_info[ORDER_LIST_TYPE] ? data_info[ORDER_LIST_TYPE] : "";
            const data = data_info && data_info[ORDER_LIST_REQUEST_DATA] && data_info[ORDER_LIST_REQUEST_DATA].length ? data_info[ORDER_LIST_REQUEST_DATA] : [];

            const user_data_info = getState()[USER_ROOT][USER_KEY];
            const user_data = user_data_info && user_data_info[USER_DATA] ? user_data_info[USER_DATA] : {};

            //Intialize state
            dispatch(updateOrderListUIConstraints(Object.assign({
                [ORDER_LIST_REQUEST_STATUS]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                [ORDER_LIST_REQEUST_LOADING]: (isRefresh || isEndReached) ? false : true,
                [ORDER_LIST_REQEUST_REFRESH_LOADING]: isRefresh,
                [ORDER_LIST_REQEUST_ON_END_REACHED_LOADING]: isEndReached,
                [ORDER_LIST_REQEUST_ON_END_REACHED_DONE]: false,
                [ORDER_LIST_REQUEST_PAGE]: isEndReached ? page : 1
            }, (isEndReached) ? {
            } : {

                })));

            if (!user_data.user_token) {
                dispatch(updateOrderListUIConstraints({
                    [ORDER_LIST_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: "User token not found, please try again."
                    },
                    [ORDER_LIST_REQEUST_LOADING]: false
                }));

                return;
            }

            const body = {
                user_token: user_data.user_token,
                order_status: order_status,
                page: page,
                page_size: page_size
            }

            try {
                const res = await refillOrderList(body);
                const orders = res.data && res.data.length ? res.data : res.data && res.data.data ? res.data.data : [];
                Utils.log("Order List Response ===> ", data, orders);

                if (res && res.message === SERVER_SUCCESS) {
                    dispatch(updateOrderListUIConstraints({
                        [ORDER_LIST_REQUEST_STATUS]: {
                            [STATUS]: SUCCESS,
                            [MESSAGE]: "Success"
                        },
                        [ORDER_LIST_REQEUST_LOADING]: false,
                        [ORDER_LIST_REQEUST_REFRESH_LOADING]: false,
                        [ORDER_LIST_REQEUST_ON_END_REACHED_LOADING]: false,
                        [ORDER_LIST_REQEUST_ON_END_REACHED_DONE]: res.data && res.data.length ? !res.data.hasMore : false,
                        [ORDER_LIST_REQUEST_DATA]: isEndReached && order_status !== ALL_ORDER ? orders.concat(data) : orders
                    }));
                } else {
                    const _res = res && res.length ? res[0] : res;
                    let message = "";
                    switch (_res.message) {
                        case SERVER_NO_VALUE:
                            message = "No order available";
                            break;
                        default:
                            message = "Internal server error, please try again";
                    }

                    dispatch(updateOrderListUIConstraints({
                        [ORDER_LIST_REQUEST_STATUS]: {
                            [STATUS]: ERROR,
                            [MESSAGE]: message
                        },
                        [ORDER_LIST_REQEUST_LOADING]: false,
                        [ORDER_LIST_REQEUST_REFRESH_LOADING]: false,
                        [ORDER_LIST_REQEUST_ON_END_REACHED_DONE]: _res.message === SERVER_NO_VALUE ? true : false,
                        [ORDER_LIST_REQEUST_ON_END_REACHED_LOADING]: false
                    }));
                }
            } catch (error) {
                Utils.log("Order List Loading Response ===> error", error);
                dispatch(updateOrderListUIConstraints({
                    [ORDER_LIST_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: "Please try again"
                    },
                    [ORDER_LIST_REQEUST_LOADING]: false,
                    [ORDER_LIST_REQEUST_REFRESH_LOADING]: false,
                    [ORDER_LIST_REQEUST_ON_END_REACHED_LOADING]: false
                }));
            }
        } catch (error) {
            Utils.log("Update Order List Form Data ===> error ", error);
        }
    }
}

/** Manage Order List UI Constraints */
export const updateOrderListUIConstraints = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[ORDER_LIST_ROOT][ORDER_LIST_KEY];
            const data = Object.assign(formData, obj);

            dispatch(updateOrderListState(data));
        } catch (error) {
            Utils.log("Update Login UI Constraints ===> error ", error);
        }
    }
}

/** Update order list data state */
const updateOrderListState = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[ORDER_LIST_ROOT][ORDER_LIST_KEY];

            dispatch({
                type: ORDER_LIST_UPDATE,
                payload: Object.assign(formData, obj)
            })
        } catch (error) {
            Utils.log("Update Order List State ===> error ", error);
        }
    }
}

/** Reset order list data state */
export const resetOrderListState = () => {
    return (dispatch) => {
        try {
            dispatch({
                type: ORDER_LIST_RESET,
                payload: {}
            })
        } catch (error) {
            Utils.log("Reset Order List State ===> error ", error);
        }
    }
}