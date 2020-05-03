import Utils from "../../common/util/Utils";
import { RESET_PASSWORD_KEY, RESET_PASSWORD_FORM, RESET_PASSWORD_RESET, RESET_PASSWORD_UPDATE, RESET_PASSWORD_ROOT, RESET_PASSWORD_REQUEST_STATUS, EMPTY, STATUS, MESSAGE, RESET_PASSWORD_REQEUST_LOADING, SERVER_SUCCESS, SUCCESS, SERVER_NO_VALUE, ERROR, RESET_PASSWORD_FORM_CONFIRM_PASSWORD, RESET_PASSWORD_FORM_PASSWORD, SERVER_VALIDATION_ERROR, USER_ROOT, USER_KEY, USER_DATA } from "../Types";
import { refillResetPassword } from "../../apis/APIs";
import { sessionLogin } from "../login/Action";

/** Reset Password data */
export const resetPassword = () => {
    return async (dispatch, getState) => {
        try {
            const reset_password_info = getState()[RESET_PASSWORD_ROOT][RESET_PASSWORD_KEY];
            const form_data = reset_password_info && reset_password_info[RESET_PASSWORD_FORM] ? reset_password_info[RESET_PASSWORD_FORM] : {};

            const user_data_info = getState()[USER_ROOT][USER_KEY];
            const user_data = user_data_info && user_data_info[USER_DATA] ? user_data_info[USER_DATA] : {};

            //Intialize state
            dispatch(updateResetPasswordUIConstraints({
                [RESET_PASSWORD_REQUEST_STATUS]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                [RESET_PASSWORD_REQEUST_LOADING]: true
            }));

            if (!user_data.user_token) {
                dispatch(updateResetPasswordUIConstraints({
                    [RESET_PASSWORD_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: "User token not found, please try again."
                    },
                    [RESET_PASSWORD_REQEUST_LOADING]: false
                }));

                return;
            }

            const body = {
                user_token: user_data.user_token,
                password: form_data[RESET_PASSWORD_FORM_PASSWORD],
                confirm_password: form_data[RESET_PASSWORD_FORM_CONFIRM_PASSWORD]
            }

            try {
                const res = await refillResetPassword(body);
                Utils.log("Reset password response ===> ", res, body);
                if (res && res.message === SERVER_SUCCESS) {
                    dispatch(updateResetPasswordUIConstraints({
                        [RESET_PASSWORD_REQUEST_STATUS]: {
                            [STATUS]: SUCCESS,
                            [MESSAGE]: "success"
                        },
                        [RESET_PASSWORD_REQEUST_LOADING]: false
                    }))
                    dispatch(sessionLogin());
                    dispatch(resetResetPasswordState());
                } else {
                    const _res = res && res.length ? res[0] : res;
                    let message = "";
                    switch (_res.message) {
                        case SERVER_VALIDATION_ERROR:
                            message = "Validation error, please try again.";
                            break;
                        default:
                            message = "Internal server error, please try again.";
                    }

                    dispatch(updateResetPasswordUIConstraints({
                        [RESET_PASSWORD_REQUEST_STATUS]: {
                            [STATUS]: ERROR,
                            [MESSAGE]: message
                        },
                        [RESET_PASSWORD_REQEUST_LOADING]: false
                    }))
                }
            } catch (error) {
                Utils.log("Reset password response ===> error", error);
                dispatch(updateResetPasswordUIConstraints({
                    [RESET_PASSWORD_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: "Please try again"
                    },
                    [RESET_PASSWORD_REQEUST_LOADING]: false
                }))
            }
        } catch (error) {
            Utils.log("Update Reset Password Form Data ===> error ", error);
        }
    }
}

/** Manage Reset Password Form Data */
export const updateResetPasswordFormData = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[RESET_PASSWORD_ROOT][RESET_PASSWORD_KEY];
            const data = Object.assign(formData[RESET_PASSWORD_FORM], obj);

            dispatch(updateResetPasswordState(Object.assign(formData, {
                [RESET_PASSWORD_FORM]: data
            })));
        } catch (error) {
            Utils.log("Update Reset Password Form Data ===> error ", error);
        }
    }
}

/** Manage Reset Password UI Constraints */
export const updateResetPasswordUIConstraints = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[RESET_PASSWORD_ROOT][RESET_PASSWORD_KEY];
            const data = Object.assign(formData, obj);

            dispatch(updateResetPasswordState(data));
        } catch (error) {
            Utils.log("Update Reset Password UI Constraints ===> error ", error);
        }
    }
}

/** Update reset password data state */
const updateResetPasswordState = (obj) => {
    return (dispatch, getState) => {
        try {
            Utils.log("formData ===> ", getState());

            const formData = getState()[RESET_PASSWORD_ROOT][RESET_PASSWORD_KEY];

            dispatch({
                type: RESET_PASSWORD_UPDATE,
                payload: Object.assign(formData, obj)
            })
        } catch (error) {
            Utils.log("Update Reset Password State ===> error ", error);
        }
    }
}

/** Reset reset password data state */
export const resetResetPasswordState = () => {
    return (dispatch) => {
        try {
            dispatch({
                type: RESET_PASSWORD_RESET,
                payload: {}
            })
        } catch (error) {
            Utils.log("Reset Reset Password State ===> error ", error);
        }
    }
}