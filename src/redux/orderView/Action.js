import { STATUS, MESSAGE, SERVER_SUCCESS, SUCCESS, ERROR, SERVER_NO_VALUE, USER_DATA, USER_ROOT, USER_KEY, ORDER_VIEW_RESET, ORDER_VIEW_UPDATE, ORDER_VIEW_KEY, ORDER_VIEW_ROOT, ORDER_VIEW_REQEUST_LOADING, ORDER_VIEW_REQUEST_DATA, ORDER_VIEW_REQUEST_STATUS, ORDER_VIEW_REQUEST_ID } from "../Types";
import Utils from "../../common/util/Utils";
import { EMPTY } from "rxjs";
import { refillOrderView } from "../../apis/APIs";

/** Order View data */
export const orderView = () => {
    return async (dispatch, getState) => {
        try {
            const data_info = getState()[ORDER_VIEW_ROOT][ORDER_VIEW_KEY];

            const order_id = data_info && data_info[ORDER_VIEW_REQUEST_ID] ? data_info[ORDER_VIEW_REQUEST_ID] : "";

            const user_data_info = getState()[USER_ROOT][USER_KEY];
            const user_data = user_data_info && user_data_info[USER_DATA] ? user_data_info[USER_DATA] : {};

            //Intialize state
            dispatch(updateOrderViewUIConstraints({
                [ORDER_VIEW_REQUEST_STATUS]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                [ORDER_VIEW_REQEUST_LOADING]: true,
                [ORDER_VIEW_REQUEST_DATA]: []
            }));

            if (!user_data.user_token) {
                dispatch(updateOrderViewUIConstraints({
                    [ORDER_VIEW_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: "User token not found, please try again."
                    },
                    [ORDER_VIEW_REQEUST_LOADING]: false
                }));

                return;
            }

            const body = {
                user_token: user_data.user_token,
                order_id: order_id
            }

            try {
                const res = await refillOrderView(body);
                Utils.log("Order View Response ===> ", res, body);
                if (res && res.message === SERVER_SUCCESS) {
                    dispatch(updateOrderViewUIConstraints({
                        [ORDER_VIEW_REQUEST_STATUS]: {
                            [STATUS]: SUCCESS,
                            [MESSAGE]: "Success"
                        },
                        [ORDER_VIEW_REQEUST_LOADING]: false,
                        [ORDER_VIEW_REQUEST_DATA]: res.data
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

                    dispatch(updateOrderViewUIConstraints({
                        [ORDER_VIEW_REQUEST_STATUS]: {
                            [STATUS]: ERROR,
                            [MESSAGE]: message
                        },
                        [ORDER_VIEW_REQEUST_LOADING]: false
                    }));
                }
            } catch (error) {
                Utils.log("Order View Loading Response ===> error", error);
                dispatch(updateOrderViewUIConstraints({
                    [ORDER_VIEW_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: "Please try again"
                    },
                    [ORDER_VIEW_REQEUST_LOADING]: false
                }));
            }
        } catch (error) {
            Utils.log("Update Order View Form Data ===> error ", error);
        }
    }
}

/** Manage Order Order UI Constraints */
export const updateOrderViewUIConstraints = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[ORDER_VIEW_ROOT][ORDER_VIEW_KEY];
            const data = Object.assign(formData, obj);

            dispatch(updateOrderViewState(data));
        } catch (error) {
            Utils.log("Update Order View UI Constraints ===> error ", error);
        }
    }
}

/** Update order view data state */
const updateOrderViewState = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[ORDER_VIEW_ROOT][ORDER_VIEW_KEY];

            dispatch({
                type: ORDER_VIEW_UPDATE,
                payload: Object.assign(formData, obj)
            })
        } catch (error) {
            Utils.log("Update Order View State ===> error ", error);
        }
    }
}

/** Reset order view data state */
export const resetOrderViewState = () => {
    return (dispatch) => {
        try {
            dispatch({
                type: ORDER_VIEW_RESET,
                payload: {}
            })
        } catch (error) {
            Utils.log("Reset Order View State ===> error ", error);
        }
    }
}