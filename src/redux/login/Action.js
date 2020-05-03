import { refillLogin, refillSessionLogin, refillLogout } from '../../apis/APIs'
import { LOGIN_KEY, LOGIN_FORM, LOGIN_ROOT, LOGIN_UPDATE, LOGIN_REQUEST_STATUS, LOGIN_REQEUST_LOADING, STATUS, MESSAGE, EMPTY, LOGIN_FORM_EMAIL, LOGIN_FORM_PASSWORD, USER_DATA, ERROR, SUCCESS, SYSTEM_DATA_IS_AUTHENTICATED, LOGIN_REQUEST_SESSION_STATUS, LOGIN_REQEUST_SESSION_LOADING, LOGIN_REQEUST_LOGOUT_LOADING, LOG_OUT, LOGIN_RESET } from "../Types";
import Utils from '../../components/util/Utils';
import { RefillStorage } from '../../apis';
import { updateUserData } from '../user/Action';
import { updateSystemData } from '../system/Action';

/** Login */
export const login = (obj) => {
    return (dispatch, getState) => {
        try {
            const loginInfo = getState()[LOGIN_ROOT][LOGIN_KEY];
            const formData = loginInfo[LOGIN_FORM];

            //Intialize the request status and loading
            dispatch(updateUIConstraints({
                [LOGIN_REQUEST_STATUS]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                [LOGIN_REQEUST_LOADING]: true
            }));

            const body = {
                "email": formData[LOGIN_FORM_EMAIL],
                "password": formData[LOGIN_FORM_PASSWORD]
            }

            refillLogin(body).then(async (res) => {
                Utils.log("Refill Login Response ===> ", res);

                if (res && res.status === 200) {
                    try {
                        await RefillStorage.storeRefillLoginData(res.data);
                        const userData = await RefillStorage.getRefillLoginData();
                        dispatch(updateUserData({
                            [USER_DATA]: userData && userData.response ? userData.response : userData
                        }));
                    } catch (error) {
                        Utils.log("Refill Login Storage ===> Error ", error);
                        dispatch(updateUIConstraints({
                            [LOGIN_REQUEST_STATUS]: {
                                [STATUS]: ERROR,
                                [MESSAGE]: "Unable to store data, please try again"
                            },
                            [LOGIN_REQEUST_LOADING]: false
                        }));
                        return;
                    }
                    dispatch(updateUIConstraints({
                        [LOGIN_REQUEST_STATUS]: {
                            [STATUS]: SUCCESS,
                            [MESSAGE]: res
                        },
                        [LOGIN_REQEUST_LOADING]: false
                    }));

                    //Update System Data
                    dispatch(updateSystemData({
                        [SYSTEM_DATA_IS_AUTHENTICATED]: true
                    }));
                } else {
                    dispatch(updateUIConstraints({
                        [LOGIN_REQUEST_STATUS]: {
                            [STATUS]: ERROR,
                            [MESSAGE]: res
                        },
                        [LOGIN_REQEUST_LOADING]: false
                    }));
                }
            }).catch(error => {
                Utils.log("Refill Login ===> error", error);
                dispatch(updateUIConstraints({
                    [LOGIN_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: ""
                    },
                    [LOGIN_REQEUST_LOADING]: false
                }));
            });
        } catch (error) {
            Utils.log("Update Form Data ===> error ", error);
            dispatch(updateUIConstraints({
                [LOGIN_REQUEST_STATUS]: {
                    [STATUS]: ERROR,
                    [MESSAGE]: ""
                },
                [LOGIN_REQEUST_LOADING]: false
            }));
        }
    }
}

/** Session Login */
export const sessionLogin = (obj) => {
    return (dispatch, getState) => {
        try {
            RefillStorage.getRefillLoginData().then(value => {
                const userData = value && value.response && value.response.user_token ? value.response : undefined;

                if (!userData || userData && !userData.user_token) {

                    dispatch(updateUserData({
                        [USER_DATA]: undefined
                    }));
                    //Update System Data
                    dispatch(updateSystemData({
                        [SYSTEM_DATA_IS_AUTHENTICATED]: false
                    }));
                    return;
                }

                //Intialize the request status and loading
                dispatch(updateUIConstraints({
                    [LOGIN_REQUEST_SESSION_STATUS]: {
                        [STATUS]: EMPTY,
                        [MESSAGE]: ""
                    },
                    [LOGIN_REQEUST_SESSION_LOADING]: true
                }));

                const body = {
                    "user_token": userData.user_token
                }

                refillSessionLogin(body).then(async (res) => {
                    Utils.log("Refill Session Login Response ===> ", res);

                    if (res && res.status === 200) {
                        try {
                            await RefillStorage.storeRefillLoginData(res.data);
                            const userData = await RefillStorage.getRefillLoginData();
                            dispatch(updateUserData({
                                [USER_DATA]: userData && userData.response ? userData.response : userData
                            }));
                        } catch (error) {
                            Utils.log("Refill Session Login Storage ===> Error ", error);
                            dispatch(updateUIConstraints({
                                [LOGIN_REQUEST_SESSION_STATUS]: {
                                    [STATUS]: ERROR,
                                    [MESSAGE]: "Unable to store data, please try again"
                                },
                                [LOGIN_REQEUST_SESSION_LOADING]: false
                            }));
                            return;
                        }
                        dispatch(updateUIConstraints({
                            [LOGIN_REQUEST_SESSION_STATUS]: {
                                [STATUS]: SUCCESS,
                                [MESSAGE]: res
                            },
                            [LOGIN_REQEUST_SESSION_LOADING]: false
                        }));

                        //Update System Data
                        dispatch(updateSystemData({
                            [SYSTEM_DATA_IS_AUTHENTICATED]: true
                        }));
                    } else {
                        dispatch(updateUIConstraints({
                            [LOGIN_REQUEST_SESSION_STATUS]: {
                                [STATUS]: ERROR,
                                [MESSAGE]: res
                            },
                            [LOGIN_REQEUST_SESSION_LOADING]: false
                        }));
                    }
                }).catch(error => {
                    Utils.log("Refill Login ===> error", error);
                    dispatch(updateUIConstraints({
                        [LOGIN_REQUEST_SESSION_STATUS]: {
                            [STATUS]: ERROR,
                            [MESSAGE]: ""
                        },
                        [LOGIN_REQEUST_SESSION_LOADING]: false
                    }));
                });
            })
                .catch(error => {
                    Utils.log("Refill Session Login Get Storage Data ===> Error ", error);
                    dispatch(updateUIConstraints({
                        [LOGIN_REQUEST_SESSION_STATUS]: {
                            [STATUS]: ERROR,
                            [MESSAGE]: "Unable to get stored data, please try again"
                        },
                        [LOGIN_REQEUST_SESSION_LOADING]: false
                    }));
                    return;
                });
        } catch (error) {
            Utils.log("Update Form Data ===> error ", error);
            dispatch(updateUIConstraints({
                [LOGIN_REQUEST_SESSION_STATUS]: {
                    [STATUS]: ERROR,
                    [MESSAGE]: ""
                },
                [LOGIN_REQEUST_SESSION_LOADING]: false
            }));
        }
    }
}

/** Logout */
export const logout = (obj) => {
    return (dispatch, getState) => {
        try {
            RefillStorage.getRefillLoginData().then(value => {
                const userData = value && value.response && value.response.user_token ? value.response : undefined;

                if (!userData || userData && !userData.user_token) {

                    dispatch(updateUserData({
                        [USER_DATA]: undefined
                    }));
                    //Update System Data
                    dispatch(updateSystemData({
                        [SYSTEM_DATA_IS_AUTHENTICATED]: false
                    }));
                    return;
                }

                //Intialize the request status and loading
                dispatch(updateUIConstraints({
                    [LOGIN_REQEUST_LOGOUT_LOADING]: true
                }));

                const body = {
                    "user_token": userData.user_token
                }

                refillLogout(body).then(async (res) => {
                    Utils.log("Refill Logout Response ===> ", res);

                    if (res && res.status === 200) {
                        try {
                            await RefillStorage.clearRefillLoginData(res.data);
                        } catch (error) {
                            Utils.log("Refill Clear Login Data ===> Error ", error);
                            dispatch(updateUIConstraints({
                                [LOGIN_REQEUST_LOGOUT_LOADING]: false
                            }));
                            return;
                        }
                        dispatch(updateUIConstraints({
                            [LOGIN_REQEUST_LOGOUT_LOADING]: false
                        }));

                        //Update System Data
                        dispatch(updateSystemData({
                            [SYSTEM_DATA_IS_AUTHENTICATED]: false
                        }));

                        //Logout
                        // dispatch(updateLogoutState());
                    } else {
                        dispatch(updateUIConstraints({
                            [LOGIN_REQEUST_SESSION_LOADING]: false
                        }));
                    }
                }).catch(error => {
                    Utils.log("Refill logout ===> error", error);
                    dispatch(updateUIConstraints({
                        [LOGIN_REQEUST_LOGOUT_LOADING]: false
                    }));
                });
            })
                .catch(error => {
                    Utils.log("Refill Login Get Storage Data ===> Error Logout ", error);
                    dispatch(updateUIConstraints({
                        [LOGIN_REQEUST_LOGOUT_LOADING]: false
                    }));
                    return;
                });
        } catch (error) {
            Utils.log("Update Logout Form Data ===> error", error);
            dispatch(updateUIConstraints({
                [LOGIN_REQEUST_LOGOUT_LOADING]: false
            }));
        }
    }
}

/** Manage Form Data */
export const updateFormData = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[LOGIN_ROOT][LOGIN_KEY];
            const data = Object.assign(formData[LOGIN_FORM], obj);

            dispatch(updateLoginState(Object.assign(formData, {
                [LOGIN_FORM]: data
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
            const formData = getState()[LOGIN_ROOT][LOGIN_KEY];
            const data = Object.assign(formData, obj);

            dispatch(updateLoginState(data));
        } catch (error) {
            Utils.log("Update UI Constraints ===> error ", error);
        }
    }
}

/** Update login data state */
const updateLoginState = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[LOGIN_ROOT][LOGIN_KEY];

            dispatch({
                type: LOGIN_UPDATE,
                payload: Object.assign(formData, obj)
            })
        } catch (error) {
            Utils.log("Update Login State ===> error ", error);
        }
    }
}

/** Reset login data state */
export const resetLoginState = (obj) => {
    return (dispatch, getState) => {
        try {
            dispatch({
                type: LOGIN_RESET,
                payload: {}
            })
        } catch (error) {
            Utils.log("Update Login State ===> error ", error);
        }
    }
}

/** Update logout data state */
export const updateLogoutState = () => {
    return (dispatch, getState) => {
        try {
            dispatch({
                type: LOG_OUT,
                payload: {}
            })
        } catch (error) {
            Utils.log("Update Login State ===> error ", error);
        }
    }
}