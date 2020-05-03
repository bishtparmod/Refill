import { refillChangePassword } from '../../apis/APIs'
import Utils from '../../components/util/Utils';
import { CHANGE_PASSWORD_KEY, CHANGE_PASSWORD_ROOT, CHANGE_PASSWORD_FORM, CHANGE_PASSWORD_UPDATE, USER_ROOT, USER_KEY, USER_DATA, TOKEN_NOT_FOUND, CHANGE_PASSWORD_REQUEST_STATUS, STATUS, EMPTY, MESSAGE, CHANGE_PASSWORD_REQEUST_LOADING, CHANGE_PASSWORD_FORM_OLD_PASSWORD, CHANGE_PASSWORD_FORM_PASSWORD, CHANGE_PASSWORD_FORM_CONFIRM_PASSWORD, SUCCESS, ERROR } from '../Types';
import { RefillStorage } from '../../apis';

/** Change Password */
export const changePassword = () => {
    return (dispatch, getState) => {
        try {
            //Form Data
            const change_password_data = getState()[CHANGE_PASSWORD_ROOT][CHANGE_PASSWORD_KEY];
            const formData = change_password_data[CHANGE_PASSWORD_FORM];

            //User data
            const data = getState()[USER_ROOT][USER_KEY];
            const user_token = data && data[USER_DATA] && data[USER_DATA].user_token ? data[USER_DATA].user_token : undefined;

            if (!user_token) {
                dispatch(updateUIConstraints({
                    [CHANGE_PASSWORD_REQUEST_STATUS]: {
                        [STATUS]: EMPTY,
                        [MESSAGE]: {
                            message: TOKEN_NOT_FOUND
                        }
                    },
                    [CHANGE_PASSWORD_REQEUST_LOADING]: false
                }));
                return;
            }

            //Intialize the request status and loading
            dispatch(updateUIConstraints({
                [CHANGE_PASSWORD_REQUEST_STATUS]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                [CHANGE_PASSWORD_REQEUST_LOADING]: true
            }));

            const body = {
                "user_token": user_token,
                "old_password": formData[CHANGE_PASSWORD_FORM_OLD_PASSWORD],
                "password": formData[CHANGE_PASSWORD_FORM_PASSWORD],
                "confirm_password": formData[CHANGE_PASSWORD_FORM_CONFIRM_PASSWORD]
            }

            refillChangePassword(body).then(async (res) => {
                Utils.log("Refill Change Password Response ===> ", res);

                if (res && res.status === 200) {
                    dispatch(updateUIConstraints({
                        [CHANGE_PASSWORD_REQUEST_STATUS]: {
                            [STATUS]: SUCCESS,
                            [MESSAGE]: res
                        },
                        [CHANGE_PASSWORD_REQEUST_LOADING]: false
                    }));
                } else {
                    dispatch(updateUIConstraints({
                        [CHANGE_PASSWORD_REQUEST_STATUS]: {
                            [STATUS]: ERROR,
                            [MESSAGE]: res
                        },
                        [CHANGE_PASSWORD_REQEUST_LOADING]: false
                    }));
                }
            }).catch(error => {
                Utils.log("Refill Change Password ===> error", error);
                dispatch(updateUIConstraints({
                    [CHANGE_PASSWORD_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: ""
                    },
                    [CHANGE_PASSWORD_REQEUST_LOADING]: false
                }));
            });
        } catch (error) {
            Utils.log("Refill Change Password ===> error", error);
            dispatch(updateUIConstraints({
                [CHANGE_PASSWORD_REQUEST_STATUS]: {
                    [STATUS]: ERROR,
                    [MESSAGE]: ""
                },
                [CHANGE_PASSWORD_REQEUST_LOADING]: false
            }));
        }
    }
}

/** Manage Form Data */
export const updateFormData = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[CHANGE_PASSWORD_ROOT][CHANGE_PASSWORD_KEY];
            const data = Object.assign(formData[CHANGE_PASSWORD_FORM], obj);

            dispatch(updateChangePasswordState(Object.assign(formData, {
                [CHANGE_PASSWORD_FORM]: data
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
            const formData = getState()[CHANGE_PASSWORD_ROOT][CHANGE_PASSWORD_KEY];
            const data = Object.assign(formData, obj);

            dispatch(updateChangePasswordState(data));
        } catch (error) {
            Utils.log("Update UI Constraints ===> error ", error);
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
            Utils.log("Update Login State ===> error ", error);
        }
    }
}