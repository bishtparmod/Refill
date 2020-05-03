import { STATUS, EMPTY, MESSAGE, SUCCESS, SERVER_SUCCESS, ERROR, FORGOT_PASSWORD_RESET, FORGOT_PASSWORD_ROOT, FORGOT_PASSWORD_KEY, FORGOT_PASSWORD_UPDATE, FORGOT_PASSWORD_FORM_EMAIL, FORGOT_PASSWORD_FORM, FORGOT_PASSWORD_REQUEST_STATUS, FORGOT_PASSWORD_REQEUST_LOADING, SERVER_NO_VALUE } from "../Types";
import { refillForgotPassword } from "../../apis/APIs";
import Utils from "../../common/util/Utils";

/** Forgot Password data */
export const forgotPassword = () => {
    return async (dispatch, getState) => {
        try {
            const forgot_password_info = getState()[FORGOT_PASSWORD_ROOT][FORGOT_PASSWORD_KEY];
            const form_data = forgot_password_info && forgot_password_info[FORGOT_PASSWORD_FORM] ? forgot_password_info[FORGOT_PASSWORD_FORM] : {};

            //Intialize state
            dispatch(updateForgotPasswordUIConstraints({
                [FORGOT_PASSWORD_REQUEST_STATUS]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                [FORGOT_PASSWORD_REQEUST_LOADING]: true
            }));

            const body = {
                email: form_data[FORGOT_PASSWORD_FORM_EMAIL]
            }

            try {
                const res = await refillForgotPassword(body);
                Utils.log("Forgot password response ===> ", res);
                if (res && res.message === SERVER_SUCCESS) {
                    dispatch(updateForgotPasswordUIConstraints({
                        [FORGOT_PASSWORD_REQUEST_STATUS]: {
                            [STATUS]: SUCCESS,
                            [MESSAGE]: res
                        },
                        [FORGOT_PASSWORD_REQEUST_LOADING]: false
                    }))
                    dispatch(resetForgotPasswordState());
                } else {
                    const _res = res && res.length ? res[0] : res;
                    let message = "";
                    switch (_res.message) {
                        case SERVER_NO_VALUE:
                            message = "No user found, please try with other email address";
                            break;
                        default:
                            message = "Internal server error, please try again";
                    }

                    dispatch(updateForgotPasswordUIConstraints({
                        [FORGOT_PASSWORD_REQUEST_STATUS]: {
                            [STATUS]: ERROR,
                            [MESSAGE]: message
                        },
                        [FORGOT_PASSWORD_REQEUST_LOADING]: false
                    }))
                }
            } catch (error) {
                Utils.log("Forgot password response ===> error", error);
                dispatch(updateForgotPasswordUIConstraints({
                    [FORGOT_PASSWORD_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: "Please try again"
                    },
                    [FORGOT_PASSWORD_REQEUST_LOADING]: false
                }))
            }
        } catch (error) {
            Utils.log("Update Forgot Password Form Data ===> error ", error);
        }
    }
}

/** Manage Forgot Password Form Data */
export const updateForgotPasswordFormData = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[FORGOT_PASSWORD_ROOT][FORGOT_PASSWORD_KEY];
            const data = Object.assign(formData[FORGOT_PASSWORD_FORM], obj);

            dispatch(updateForgotPasswordState(Object.assign(formData, {
                [FORGOT_PASSWORD_FORM]: data
            })));
        } catch (error) {
            Utils.log("Update Forgot Password Form Data ===> error ", error);
        }
    }
}

/** Manage Forgot Password UI Constraints */
export const updateForgotPasswordUIConstraints = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[FORGOT_PASSWORD_ROOT][FORGOT_PASSWORD_KEY];
            const data = Object.assign(formData, obj);

            dispatch(updateForgotPasswordState(data));
        } catch (error) {
            Utils.log("Update Forgot Password UI Constraints ===> error ", error);
        }
    }
}

/** Update forgot password data state */
const updateForgotPasswordState = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[FORGOT_PASSWORD_ROOT][FORGOT_PASSWORD_KEY];

            dispatch({
                type: FORGOT_PASSWORD_UPDATE,
                payload: Object.assign(formData, obj)
            })
        } catch (error) {
            Utils.log("Update Forgot Password State ===> error ", error);
        }
    }
}

/** Reset forgot password data state */
export const resetForgotPasswordState = () => {
    return (dispatch) => {
        try {
            dispatch({
                type: FORGOT_PASSWORD_RESET,
                payload: {}
            })
        } catch (error) {
            Utils.log("Reset Forgot Password State ===> error ", error);
        }
    }
}