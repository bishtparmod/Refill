import { gcsLogin, refillResetPassword } from '../../apis/APIs'
import Utils from '../../components/util/Utils';
import { RESET_PASSWORD_ROOT, RESET_PASSWORD_KEY, RESET_PASSWORD_FORM, RESET_PASSWORD_UPDATE, USER_ROOT, USER_KEY, USER_DATA, RESET_PASSWORD_REQUEST_STATUS, EMPTY, STATUS, MESSAGE, TOKEN_NOT_FOUND, RESET_PASSWORD_REQEUST_LOADING, RESET_PASSWORD_FORM_PASSWORD, RESET_PASSWORD_FORM_CONFIRM_PASSWORD, SUCCESS, ERROR, FORGOT_PASSWORD_RESET, RESET_PASSWORD_RESET } from '../Types';

/** Reset Password */
export const resetPassword = () => {
    return (dispatch, getState) => {
        try {
            //Form Data
            const reset_password_data = getState()[RESET_PASSWORD_ROOT][RESET_PASSWORD_KEY];
            const formData = reset_password_data[RESET_PASSWORD_FORM];

            //User data
            const data = getState()[USER_ROOT][USER_KEY];
            const user_token = data && data[USER_DATA] && data[USER_DATA].user_token ? data[USER_DATA].user_token : undefined;

            if (!user_token) {
                dispatch(updateUIConstraints({
                    [RESET_PASSWORD_REQUEST_STATUS]: {
                        [STATUS]: EMPTY,
                        [MESSAGE]: {
                            message: TOKEN_NOT_FOUND
                        }
                    },
                    [RESET_PASSWORD_REQEUST_LOADING]: false
                }));
                return;
            }

            //Intialize the request status and loading
            dispatch(updateUIConstraints({
                [RESET_PASSWORD_REQUEST_STATUS]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                [RESET_PASSWORD_REQEUST_LOADING]: true
            }));

            const body = {
                "user_token": user_token,
                "password": formData[RESET_PASSWORD_FORM_PASSWORD],
                "confirm_password": formData[RESET_PASSWORD_FORM_CONFIRM_PASSWORD]
            }

            refillResetPassword(body).then(async (res) => {
                Utils.log("Refill Reset Password Response ===> ", res);

                if (res && res.status === 200) {
                    dispatch(updateUIConstraints({
                        [RESET_PASSWORD_REQUEST_STATUS]: {
                            [STATUS]: SUCCESS,
                            [MESSAGE]: res
                        },
                        [RESET_PASSWORD_REQEUST_LOADING]: false
                    }));
                } else {
                    dispatch(updateUIConstraints({
                        [RESET_PASSWORD_REQUEST_STATUS]: {
                            [STATUS]: ERROR,
                            [MESSAGE]: res
                        },
                        [RESET_PASSWORD_REQEUST_LOADING]: false
                    }));
                }
            }).catch(error => {
                Utils.log("Refill Reset Password ===> error", error);
                dispatch(updateUIConstraints({
                    [RESET_PASSWORD_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: ""
                    },
                    [RESET_PASSWORD_REQEUST_LOADING]: false
                }));
            });
        } catch (error) {
            Utils.log("Refill Reset Password ===> error", error);
            dispatch(updateUIConstraints({
                [RESET_PASSWORD_REQUEST_STATUS]: {
                    [STATUS]: ERROR,
                    [MESSAGE]: ""
                },
                [RESET_PASSWORD_REQEUST_LOADING]: false
            }));
        }
    }
}

/** Manage Form Data */
export const updateFormData = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[RESET_PASSWORD_ROOT][RESET_PASSWORD_KEY];
            const data = Object.assign(formData[RESET_PASSWORD_FORM], obj);

            dispatch(updateResetPasswordState(Object.assign(formData, {
                [RESET_PASSWORD_FORM]: data
            })));
        } catch (error) {
            Utils.log("Update Form Data ===> error ", error);
        }
    }
}

/** Manage UI Constraints */
export const updateUIConstraints = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[RESET_PASSWORD_ROOT][RESET_PASSWORD_KEY];
            const data = Object.assign(formData, obj);

            dispatch(updateResetPasswordState(data));
        } catch (error) {
            Utils.log("Update UI Constraints ===> error ", error);
        }
    }
}

/** Update rest password data state */
const updateResetPasswordState = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[RESET_PASSWORD_ROOT][RESET_PASSWORD_KEY];

            dispatch({
                type: RESET_PASSWORD_UPDATE,
                payload: Object.assign(formData, obj)
            })
        } catch (error) {
            Utils.log("Update Login State ===> error ", error);
        }
    }
}

/** Reset reset data state */
export const resetResetDataState = (obj) => {
    return (dispatch, getState) => {
        try {
            dispatch({
                type: RESET_PASSWORD_RESET,
                payload: {}
            })
        } catch (error) {
            Utils.log("Update Forgot State ===> error ", error);
        }
    }
}