import Utils from "../../common/util/Utils";
import { CHANGE_PASSWORD_RESET, CHANGE_PASSWORD_ROOT, CHANGE_PASSWORD_KEY, CHANGE_PASSWORD_UPDATE, CHANGE_PASSWORD_FORM, CHANGE_PASSWORD_REQUEST_STATUS, STATUS, MESSAGE, EMPTY, CHANGE_PASSWORD_REQEUST_LOADING, SERVER_SUCCESS, SUCCESS, SERVER_NO_VALUE, ERROR, CHANGE_OLD_PASSWORD_FORM_PASSWORD, CHANGE_PASSWORD_FORM_PASSWORD, CHANGE_PASSWORD_FORM_CONFIRM_PASSWORD, USER_ROOT, USER_KEY, USER_DATA } from "../Types";
import { refillChangePassword } from "../../apis/APIs";

/** Change Password data */
export const changePassword = () => {
    return async (dispatch, getState) => {
        try {
            const change_password_info = getState()[CHANGE_PASSWORD_ROOT][CHANGE_PASSWORD_KEY];
            const form_data = change_password_info && change_password_info[CHANGE_PASSWORD_FORM] ? change_password_info[CHANGE_PASSWORD_FORM] : {};

            const user_data_info = getState()[USER_ROOT][USER_KEY];
            const user_data = user_data_info && user_data_info[USER_DATA] ? user_data_info[USER_DATA] : {};

            //Intialize state
            dispatch(updateChangePasswordUIConstraints({
                [CHANGE_PASSWORD_REQUEST_STATUS]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                [CHANGE_PASSWORD_REQEUST_LOADING]: true
            }));

            if (!user_data.user_token) {
                dispatch(updateChangePasswordUIConstraints({
                    [CHANGE_PASSWORD_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: "User token not found, please try again."
                    },
                    [CHANGE_PASSWORD_REQEUST_LOADING]: false
                }));

                return;
            }

            const body = {
                user_token: user_data.user_token,
                old_password: form_data[CHANGE_OLD_PASSWORD_FORM_PASSWORD],
                password: form_data[CHANGE_PASSWORD_FORM_PASSWORD],
                confirm_password: form_data[CHANGE_PASSWORD_FORM_CONFIRM_PASSWORD]
            }

            try {
                const res = await refillChangePassword(body);
                Utils.log("Change password response ===> ", res, body);
                if (res && res.message === SERVER_SUCCESS) {
                    dispatch(updateChangePasswordUIConstraints({
                        [CHANGE_PASSWORD_REQUEST_STATUS]: {
                            [STATUS]: SUCCESS,
                            [MESSAGE]: "success"
                        },
                        [CHANGE_PASSWORD_REQEUST_LOADING]: false
                    }))
                    dispatch(resetChangePasswordState());
                } else {
                    const _res = res && res.length ? res[0] : res;
                    let message = "";
                    switch (_res.message) {
                        case SERVER_NO_VALUE:
                            message = "Old password is not valid, please check your password again.";
                            break;
                        default:
                            message = "Internal server error, please try again";
                    }

                    dispatch(updateChangePasswordUIConstraints({
                        [CHANGE_PASSWORD_REQUEST_STATUS]: {
                            [STATUS]: ERROR,
                            [MESSAGE]: message
                        },
                        [CHANGE_PASSWORD_REQEUST_LOADING]: false
                    }))
                }
            } catch (error) {
                Utils.log("Change password response ===> error", error);
                dispatch(updateChangePasswordUIConstraints({
                    [CHANGE_PASSWORD_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: "Please try again"
                    },
                    [CHANGE_PASSWORD_REQEUST_LOADING]: false
                }))
            }
        } catch (error) {
            Utils.log("Update Change Password Form Data ===> error ", error);
        }
    }
}

/** Manage Change Password Form Data */
export const updateChangePasswordFormData = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[CHANGE_PASSWORD_ROOT][CHANGE_PASSWORD_KEY];
            const data = Object.assign(formData[CHANGE_PASSWORD_FORM], obj);

            dispatch(updateChangePasswordState(Object.assign(formData, {
                [CHANGE_PASSWORD_FORM]: data
            })));
        } catch (error) {
            Utils.log("Update Change Password Form Data ===> error ", error);
        }
    }
}

/** Manage Change Password UI Constraints */
export const updateChangePasswordUIConstraints = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[CHANGE_PASSWORD_ROOT][CHANGE_PASSWORD_KEY];
            const data = Object.assign(formData, obj);

            dispatch(updateChangePasswordState(data));
        } catch (error) {
            Utils.log("Update Change Password UI Constraints ===> error ", error);
        }
    }
}

/** Update change password data state */
const updateChangePasswordState = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[CHANGE_PASSWORD_ROOT][CHANGE_PASSWORD_KEY];

            dispatch({
                type: CHANGE_PASSWORD_UPDATE,
                payload: Object.assign(formData, obj)
            })
        } catch (error) {
            Utils.log("Update Change Password State ===> error ", error);
        }
    }
}

/** Reset change password data state */
export const resetChangePasswordState = () => {
    return (dispatch) => {
        try {
            dispatch({
                type: CHANGE_PASSWORD_RESET,
                payload: {}
            })
        } catch (error) {
            Utils.log("Reset Change Password State ===> error ", error);
        }
    }
}