import Utils from "../../common/util/Utils";
import { STATUS, MESSAGE, EMPTY, SUCCESS, ERROR, USER_ROOT, USER_KEY, USER_DATA, CUSTOMER_SUPPORT_RESET, CUSTOMER_SUPPORT_ROOT, CUSTOMER_SUPPORT_KEY, CUSTOMER_SUPPORT_UPDATE, CUSTOMER_SUPPORT_FORM, CUSTOMER_SUPPORT_REQUEST_STATUS, CUSTOMER_SUPPORT_REQUEST_LOADING } from "../Types";

/** Send Message Data */
export const sendMessage = () => {
    return async (dispatch, getState) => {
        try {
            const customer_support_info = getState()[CUSTOMER_SUPPORT_ROOT][CUSTOMER_SUPPORT_KEY];
            const form_data = customer_support_info && customer_support_info[CUSTOMER_SUPPORT_FORM] ? customer_support_info[CUSTOMER_SUPPORT_FORM] : {};

            const user_data_info = getState()[USER_ROOT][USER_KEY];
            const user_data = user_data_info && user_data_info[USER_DATA] ? user_data_info[USER_DATA] : {};

            //Intialize state
            dispatch(updateCustomerSupportFormData({
                [CUSTOMER_SUPPORT_REQUEST_STATUS]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                [CUSTOMER_SUPPORT_REQUEST_LOADING]: true
            }));

            if (!user_data.user_token) {
                dispatch(updateCustomerSupportFormData({
                    [CUSTOMER_SUPPORT_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: "User token not found, please try again."
                    },
                    [CUSTOMER_SUPPORT_REQUEST_LOADING]: false
                }));

                return;
            }

            const body = {

            }

            try {
                dispatch(updateCustomerSupportFormData({
                    [CUSTOMER_SUPPORT_REQUEST_STATUS]: {
                        [STATUS]: SUCCESS,
                        [MESSAGE]: "success"
                    },
                    [CUSTOMER_SUPPORT_REQUEST_LOADING]: false
                }))
            } catch (error) {
                Utils.log("Customer Support Response ===> error", error);
                dispatch(updateCustomerSupportFormData({
                    [CUSTOMER_SUPPORT_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: "Please try again"
                    },
                    [CUSTOMER_SUPPORT_REQUEST_LOADING]: false
                }))
            }
        } catch (error) {
            Utils.log("Update Customer Support Form Data ===> error ", error);
        }
    }
}

/** Manage Customer Support Form Data */
export const updateCustomerSupportFormData = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[CUSTOMER_SUPPORT_ROOT][CUSTOMER_SUPPORT_KEY];
            const data = Object.assign(formData[CUSTOMER_SUPPORT_FORM], obj);

            dispatch(updateCustomerSupportState(Object.assign(formData, {
                [CUSTOMER_SUPPORT_FORM]: data
            })));
        } catch (error) {
            Utils.log("Update Customer Support Form Data ===> error ", error);
        }
    }
}

/** Manage Customer Support UI Constraints */
export const updateCustomerSupportUIConstraints = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[CUSTOMER_SUPPORT_ROOT][CUSTOMER_SUPPORT_KEY];
            const data = Object.assign(formData, obj);

            dispatch(updateCustomerSupportState(data));
        } catch (error) {
            Utils.log("Update Customer Support UI Constraints ===> error ", error);
        }
    }
}

/** Update Customer Support Data State */
const updateCustomerSupportState = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[CUSTOMER_SUPPORT_ROOT][CUSTOMER_SUPPORT_KEY];

            dispatch({
                type: CUSTOMER_SUPPORT_UPDATE,
                payload: Object.assign(formData, obj)
            })
        } catch (error) {
            Utils.log("Update Customer Support State ===> error ", error);
        }
    }
}

/** Reset customer support data state */
export const resetCustomerSupportState = () => {
    return (dispatch) => {
        try {
            dispatch({
                type: CUSTOMER_SUPPORT_RESET,
                payload: {}
            })
        } catch (error) {
            Utils.log("Reset Customer Support State ===> error ", error);
        }
    }
}