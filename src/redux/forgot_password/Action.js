import { refillForgotPassword } from '../../apis/APIs'
import { FORGOT_PASSWORD_ROOT, FORGOT_PASSWORD_KEY, FORGOT_PASSWORD_FORM, FORGOT_PASSWORD_UPDATE, FORGOT_PASSWORD_REQUEST_STATUS, STATUS, EMPTY, MESSAGE, FORGOT_PASSWORD_REQEUST_LOADING, FORGOT_PASSWORD_FORM_EMAIL, SUCCESS, ERROR, FORGOT_PASSWORD_RESET } from "../Types";
import Utils from '../../components/util/Utils';

/** Forgot Password */
export const forgotPassword = () => {
    return (dispatch, getState) => {
        try {
            const forgotPasswordInfo = getState()[FORGOT_PASSWORD_ROOT][FORGOT_PASSWORD_KEY];
            const formData = forgotPasswordInfo[FORGOT_PASSWORD_FORM];

            //Intialize the request status and loading
            dispatch(updateUIConstraints({
                [FORGOT_PASSWORD_REQUEST_STATUS]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                [FORGOT_PASSWORD_REQEUST_LOADING]: true
            }));

            const body = {
                "email": formData[FORGOT_PASSWORD_FORM_EMAIL]
            }

            refillForgotPassword(body).then(async (res) => {
                Utils.log("Refill Forgot Passwrod Response ===> ", res);

                if (res && res.status === 200) {
                    dispatch(updateUIConstraints({
                        [FORGOT_PASSWORD_REQUEST_STATUS]: {
                            [STATUS]: SUCCESS,
                            [MESSAGE]: res
                        },
                        [FORGOT_PASSWORD_REQEUST_LOADING]: false
                    }));
                } else {
                    dispatch(updateUIConstraints({
                        [FORGOT_PASSWORD_REQUEST_STATUS]: {
                            [STATUS]: ERROR,
                            [MESSAGE]: res
                        },
                        [FORGOT_PASSWORD_REQEUST_LOADING]: false
                    }));
                }
            }).catch(error => {
                Utils.log("Refill Forgot Password ===> error", error);
                dispatch(updateUIConstraints({
                    [FORGOT_PASSWORD_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: ""
                    },
                    [FORGOT_PASSWORD_REQEUST_LOADING]: false
                }));
            });
        } catch (error) {
            Utils.log("Update Forgot Password Form Data ===> error ", error);
            dispatch(updateUIConstraints({
                [FORGOT_PASSWORD_REQUEST_STATUS]: {
                    [STATUS]: ERROR,
                    [MESSAGE]: ""
                },
                [FORGOT_PASSWORD_REQEUST_LOADING]: false
            }));
        }
    }
}


/** Manage Form Data */
export const updateFormData = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[FORGOT_PASSWORD_ROOT][FORGOT_PASSWORD_KEY];
            const data = Object.assign(formData[FORGOT_PASSWORD_FORM], obj);

            dispatch(updateForgotPasswordState(Object.assign(formData, {
                [FORGOT_PASSWORD_FORM]: data
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
            const formData = getState()[FORGOT_PASSWORD_ROOT][FORGOT_PASSWORD_KEY];
            const data = Object.assign(formData, obj);

            dispatch(updateForgotPasswordState(data));
        } catch (error) {
            Utils.log("Update UI Constraints ===> error ", error);
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
            Utils.log("Update Login State ===> error ", error);
        }
    }
}

/** Reset forgot data state */
export const resetForgotState = (obj) => {
    return (dispatch, getState) => {
        try {
            dispatch({
                type: FORGOT_PASSWORD_RESET,
                payload: {}
            })
        } catch (error) {
            Utils.log("Update Forgot State ===> error ", error);
        }
    }
}