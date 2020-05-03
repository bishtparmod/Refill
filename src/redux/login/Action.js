import { LOGIN_ROOT, LOGIN_KEY, LOGIN_FORM, LOGIN_UPDATE, LOGIN_RESET, LOGIN_REQUEST_STATUS, STATUS, MESSAGE, LOGIN_REQEUST_LOADING, LOGIN_FORM_EMAIL, LOGIN_FORM_PASSWORD, SERVER_SUCCESS, SUCCESS, SERVER_PRESENT, ERROR, SERVER_NO_VALUE, SERVER_NOT_AUTHORIZED, LOGIN_REQEUST_FACEBOOK_LOADING, LOGIN_REQEUST_GOOGLE_LOADING, USER_DATA, DEVICE_IS_LOGGED_IN, RESPONSE, USER_ROOT, USER_KEY, DEVICE_IS_LOGIN_SKIPPED, SERVER_VALIDATION_ERROR, SERVER_EMAIL_PRESENT } from "../Types";
import Utils from "../../common/util/Utils";
import { EMPTY } from "rxjs";
import { refillLogin, refillSessionLogin, refillSocialLogin } from "../../apis/APIs";
import { LoginManager, AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
import { updateUserUIConstraints, resetUserState } from "../user/Action";
import { updateDeviceUIConstraints } from "../device/Action";
import { RefillStorage } from "../../apis";
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/messaging';
import { Platform } from 'react-native';

/** Login data */
export const login = () => {
    return async (dispatch, getState) => {
        try {
            const login_info = getState()[LOGIN_ROOT][LOGIN_KEY];
            const form_data = login_info && login_info[LOGIN_FORM] ? login_info[LOGIN_FORM] : {};

            //Intialize state
            dispatch(updateLoginUIConstraints({
                [LOGIN_REQUEST_STATUS]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                [LOGIN_REQEUST_LOADING]: true
            }));
            dispatch(updateUserUIConstraints({
                [USER_DATA]: {}
            }));

            const token_data = await RefillStorage.getRefillFCMDeviceTokenData();
            const token = token_data && token_data.response ? token_data.response : "";

            const body = {
                email: form_data[LOGIN_FORM_EMAIL],
                password: form_data[LOGIN_FORM_PASSWORD],
                device_token: typeof token === "string" ? token : "",
                platform: Platform.OS
            }

            try {
                const res = await refillLogin(body);
                Utils.log("Login response ===> ", res, body);
                if (res && res.message === SERVER_SUCCESS) {
                    dispatch(updateLoginUIConstraints({
                        [LOGIN_REQUEST_STATUS]: {
                            [STATUS]: SUCCESS,
                            [MESSAGE]: "Success"
                        },
                        [LOGIN_REQEUST_LOADING]: false
                    }))

                    await RefillStorage.storeRefillLoginData(res.data);
                    const user_data_obj = await RefillStorage.getRefillLoginData();
                    const user_data = user_data_obj && user_data_obj[STATUS] === SUCCESS ? user_data_obj[RESPONSE] : {};
                    if (user_data && user_data._id) {
                        dispatch(updateUserUIConstraints({
                            [USER_DATA]: user_data
                        }));

                        if (user_data.reset_password !== 1)
                            dispatch(updateDeviceUIConstraints({
                                [DEVICE_IS_LOGGED_IN]: true
                            }));

                        dispatch(resetLoginState());
                    } else {
                        dispatch(updateLoginUIConstraints({
                            [LOGIN_REQUEST_STATUS]: {
                                [STATUS]: ERROR,
                                [MESSAGE]: "Unable to store user data, Please try again!"
                            },
                            [LOGIN_REQEUST_LOADING]: false
                        }));
                    }
                } else {
                    const _res = res && res.length ? res[0] : res;
                    let message = "";
                    switch (_res.message) {
                        case SERVER_NOT_AUTHORIZED:
                            message = "Either email or password is incorrect.";
                            break;
                        default:
                            message = "Internal server error, please try again";
                    }

                    dispatch(updateLoginUIConstraints({
                        [LOGIN_REQUEST_STATUS]: {
                            [STATUS]: ERROR,
                            [MESSAGE]: message
                        },
                        [LOGIN_REQEUST_LOADING]: false
                    }));
                }
            } catch (error) {
                Utils.log("Login response ===> error", error);
                dispatch(updateLoginUIConstraints({
                    [LOGIN_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: "Please try again"
                    },
                    [LOGIN_REQEUST_LOADING]: false
                }));
            }
        } catch (error) {
            Utils.log("Update Login Form Data ===> error ", error);
        }
    }
}

/** Session login data */
export const sessionLogin = () => {
    return async (dispatch, getState) => {
        try {
            const user_data_info = getState()[USER_ROOT][USER_KEY];
            const user_data = user_data_info && user_data_info[USER_DATA] ? user_data_info[USER_DATA] : {};

            //Intialize state
            dispatch(updateLoginUIConstraints({
                [LOGIN_REQUEST_STATUS]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                [LOGIN_REQEUST_LOADING]: true
            }));

            if (!user_data.user_token) {
                dispatch(updateLoginUIConstraints({
                    [LOGIN_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: "User token not found, please try again."
                    },
                    [LOGIN_REQEUST_LOADING]: false
                }));

                return;
            }

            const body = {
                user_token: user_data.user_token
            }

            try {
                const res = await refillSessionLogin(body);
                Utils.log("Session login response ===> ", res);
                if (res && res.message === SERVER_SUCCESS) {
                    dispatch(updateLoginUIConstraints({
                        [LOGIN_REQUEST_STATUS]: {
                            [STATUS]: SUCCESS,
                            [MESSAGE]: "Success"
                        },
                        [LOGIN_REQEUST_LOADING]: false
                    }))

                    await RefillStorage.storeRefillLoginData(res.data);
                    const user_data_obj = await RefillStorage.getRefillLoginData();
                    const user_data = user_data_obj && user_data_obj[STATUS] === SUCCESS ? user_data_obj[RESPONSE] : {};
                    if (user_data && user_data._id) {
                        dispatch(updateUserUIConstraints({
                            [USER_DATA]: user_data
                        }));

                        if (user_data.reset_password !== 1)
                            dispatch(updateDeviceUIConstraints({
                                [DEVICE_IS_LOGGED_IN]: true
                            }));

                        dispatch(resetLoginState());
                    } else {
                        dispatch(updateLoginUIConstraints({
                            [LOGIN_REQUEST_STATUS]: {
                                [STATUS]: ERROR,
                                [MESSAGE]: "Unable to store user data, Please try again!"
                            },
                            [LOGIN_REQEUST_LOADING]: false
                        }));
                    }
                } else {
                    const _res = res && res.length ? res[0] : res;
                    let message = "";
                    switch (_res.message) {
                        case SERVER_NOT_AUTHORIZED:
                            message = "Either email or password is incorrect.";
                            break;
                        default:
                            message = "Internal server error, please try again";
                    }

                    dispatch(updateLoginUIConstraints({
                        [LOGIN_REQUEST_STATUS]: {
                            [STATUS]: ERROR,
                            [MESSAGE]: message
                        },
                        [LOGIN_REQEUST_LOADING]: false
                    }));
                }
            } catch (error) {
                Utils.log("Session login response ===> error", error);
                dispatch(updateLoginUIConstraints({
                    [LOGIN_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: "Please try again"
                    },
                    [LOGIN_REQEUST_LOADING]: false
                }));
            }
        } catch (error) {
            Utils.log("Update Login Form Data ===> error ", error);
        }
    }
}

/** Facebook Login */
export const facebookLogin = () => {
    return async (dispatch, getState) => {
        const scop = this;

        //Intialize state
        dispatch(updateLoginUIConstraints({
            [LOGIN_REQUEST_STATUS]: {
                [STATUS]: EMPTY,
                [MESSAGE]: ""
            },
            [LOGIN_REQEUST_FACEBOOK_LOADING]: true
        }));

        // LoginFormM.setLoginData({ isLoginLoading: true, message: "Facebook login is in progress, please wait..." });
        await LoginManager.logOut();
        LoginManager.logInWithPermissions(['public_profile', 'email']).then(
            function (result) {
                if (result.isCancelled) {
                    Utils.log('Facebook Login ===> cancelled');
                    dispatch(updateLoginUIConstraints({
                        [LOGIN_REQUEST_STATUS]: {
                            [STATUS]: ERROR,
                            [MESSAGE]: ""
                        },
                        [LOGIN_REQEUST_FACEBOOK_LOADING]: false
                    }));
                } else {
                    Utils.log('Facebook Login ===> Permissions '
                        + result.grantedPermissions.toString(), result);
                    AccessToken.getCurrentAccessToken().then((data) => {
                        Utils.log(data);
                        const infoRequest = new GraphRequest(
                            '/me?fields=name,picture,email,first_name,last_name',
                            null,
                            (err, result) => {
                                Utils.log(err, result)
                                if (err) {
                                    dispatch(updateLoginUIConstraints({
                                        [LOGIN_REQUEST_STATUS]: {
                                            [STATUS]: ERROR,
                                            [MESSAGE]: "Internal Error, Please try again!"
                                        },
                                        [LOGIN_REQEUST_FACEBOOK_LOADING]: false
                                    }));
                                }
                                else {
                                    const { id, name, picture, email, first_name, last_name } = result;
                                    const imageUrl = picture ? picture.data.url : '';

                                    const body = { id, name, email, imageUrl, first_name, last_name };
                                    Utils.log("Facebook Login ===> response ", Object.assign(body, data));
                                    dispatch(handleResponse(Object.assign(body, data)));
                                }
                            }
                        );
                        // Start the graph request.
                        new GraphRequestManager().addRequest(infoRequest).start();
                    }, (err) => {
                        Utils.log("Facebook Login ===> err ", err);
                        dispatch(updateLoginUIConstraints({
                            [LOGIN_REQUEST_STATUS]: {
                                [STATUS]: ERROR,
                                [MESSAGE]: "Internal Error, Please try again!"
                            },
                            [LOGIN_REQEUST_FACEBOOK_LOADING]: false
                        }));
                    });
                }
            },
            function (error) {
                Utils.log('Facebook Login ===> Error ' + error);
                dispatch(updateLoginUIConstraints({
                    [LOGIN_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: "Internal Error, Please try again!"
                    },
                    [LOGIN_REQEUST_FACEBOOK_LOADING]: false
                }));
            }
        );
    }
};

/** Google login */
export const googleLogin = () => {
    return async (dispatch, getState) => {
        try {
            GoogleSignin.configure({
                webClientId: '787023457233-a0ebjor3k37r17liemaukf3uh2eno6rh.apps.googleusercontent.com',
                offlineAccess: false
            });

            // if (loginFormM.isLoginLoading) {
            //     this.showLoadingMessage();
            //     return;
            // }

            // this._setState({ isLoading: true });
            // LoginFormM.setLoginData({ isLoginLoading: true, message: "Google login is in progress, please wait..." });

            //Intialize state
            dispatch(updateLoginUIConstraints({
                [LOGIN_REQUEST_STATUS]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                [LOGIN_REQEUST_GOOGLE_LOADING]: true
            }));

            // await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            Utils.log("Google login ===> ", userInfo);
            dispatch(handleResponse(userInfo.user));
        } catch (error) {
            Utils.log("Google login ===> error", error);
            Utils.log(error);
            let message = "";
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                message = "cancelled the login flow.";
            } else if (error.code === statusCodes.IN_PROGRESS) {
                message = "login is in progress already";
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                message = "play services not available or outdated"
            } else {
                // some other error happened
                message = "Internal server error, Please try again!";
            }

            dispatch(updateLoginUIConstraints({
                [LOGIN_REQUEST_STATUS]: {
                    [STATUS]: ERROR,
                    [MESSAGE]: message
                },
                [LOGIN_REQEUST_GOOGLE_LOADING]: false
            }));
        }
    }
};

/** Handle facebook and google response */
const handleResponse = (data) => {
    return async (dispatch, getState) => {
        try {
            const { id, email, name, imageUrl, photo } = data;
            const token_data = await RefillStorage.getRefillFCMDeviceTokenData();
            const token = token_data && token_data.response ? token_data.response : "";

            const body = {
                email,
                social_id: id,
                social_name: name,
                social_image: imageUrl ? imageUrl : photo,
                device_token: token,
                platform: Platform.OS
            }

            try {
                const res = await refillSocialLogin(body);
                Utils.log("Social Login response ===> ", body);
                if (res && res.message === SERVER_SUCCESS) {
                    dispatch(updateLoginUIConstraints({
                        [LOGIN_REQUEST_STATUS]: {
                            [STATUS]: SUCCESS,
                            [MESSAGE]: "Success"
                        },
                        [LOGIN_REQEUST_FACEBOOK_LOADING]: false,
                        [LOGIN_REQEUST_GOOGLE_LOADING]: false
                    }))

                    await RefillStorage.storeRefillLoginData(res.data);
                    const user_data_obj = await RefillStorage.getRefillLoginData();
                    const user_data = user_data_obj && user_data_obj[STATUS] === SUCCESS ? user_data_obj[RESPONSE] : {};
                    if (user_data && user_data._id) {
                        dispatch(updateUserUIConstraints({
                            [USER_DATA]: user_data
                        }));

                        dispatch(updateDeviceUIConstraints({
                            [DEVICE_IS_LOGGED_IN]: true
                        }));
                    } else {
                        dispatch(updateLoginUIConstraints({
                            [LOGIN_REQUEST_STATUS]: {
                                [STATUS]: ERROR,
                                [MESSAGE]: "Unable to store user data, Please try again!"
                            },
                            [LOGIN_REQEUST_FACEBOOK_LOADING]: false,
                            [LOGIN_REQEUST_GOOGLE_LOADING]: false
                        }));
                    }
                } else {
                    const _res = res && res.length ? res[0] : res;
                    let message = "";
                    switch (_res.message) {
                        case SERVER_VALIDATION_ERROR:
                            message = "Valdiation Error, please try again";
                            break;
                        case "emailPresent":
                            message = "Email is present, please try with other one.";
                            break;
                        default:
                            message = "Internal server error, please try again";
                    }

                    dispatch(updateLoginUIConstraints({
                        [LOGIN_REQUEST_STATUS]: {
                            [STATUS]: ERROR,
                            [MESSAGE]: message
                        },
                        [LOGIN_REQEUST_FACEBOOK_LOADING]: false,
                        [LOGIN_REQEUST_GOOGLE_LOADING]: false
                    }));
                }
            } catch (error) {
                Utils.log("Login response ===> error", error);
                dispatch(updateLoginUIConstraints({
                    [LOGIN_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: "Please try again"
                    },
                    [LOGIN_REQEUST_FACEBOOK_LOADING]: false,
                    [LOGIN_REQEUST_GOOGLE_LOADING]: false
                }));
            }
        } catch (error) {
            Utils.log("Update Login Form Data ===> error ", error);
        }
    }
}

/** Skip Login data */
export const skipLogin = () => {
    return async (dispatch, getState) => {
        try {

            //Intialize state
            await RefillStorage.storeRefillSkipLoginData({
                [DEVICE_IS_LOGIN_SKIPPED]: true
            });
            dispatch(updateDeviceUIConstraints({
                [DEVICE_IS_LOGIN_SKIPPED]: true
            }));

        } catch (error) {
            Utils.log("Update Login Form Data ===> error ", error);
        }
    }
}

/** Logout data */
export const logout = () => {
    return async (dispatch, getState) => {
        try {

            //Intialize state
            await RefillStorage.clearRefillLoginData();
            await RefillStorage.clearRefillSkipLoginData();
            // await RefillStorage.clearRefillFCMDeviceTokenData();

            dispatch(updateDeviceUIConstraints({
                [DEVICE_IS_LOGIN_SKIPPED]: false,
                [DEVICE_IS_LOGGED_IN]: false
            }));
            dispatch(resetUserState());

            if (firebase.messaging().isRegisteredForRemoteNotifications) {
                await firebase.messaging().unregisterForRemoteNotifications();
            }

        } catch (error) {
            Utils.log("Update Login Form Data ===> error ", error);
        }
    }
}

/** Silent Logout data */
export const silentLogout = () => {
    return async (dispatch, getState) => {
        try {

            //Intialize state
            await RefillStorage.clearRefillLoginData();
            await RefillStorage.clearRefillSkipLoginData();
            // await RefillStorage.clearRefillFCMDeviceTokenData();

            dispatch(updateDeviceUIConstraints({
                [DEVICE_IS_LOGIN_SKIPPED]: true,
                [DEVICE_IS_LOGGED_IN]: false
            }));
            dispatch(resetUserState());

            if (firebase.messaging().isRegisteredForRemoteNotifications) {
                await firebase.messaging().unregisterForRemoteNotifications();
            }

        } catch (error) {
            Utils.log("Update Login Form Data ===> error ", error);
        }
    }
}

/** Manage Login Form Data */
export const updateLoginFormData = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[LOGIN_ROOT][LOGIN_KEY];
            const data = Object.assign(formData[LOGIN_FORM], obj);

            dispatch(updateLoginState(Object.assign(formData, {
                [LOGIN_FORM]: data
            })));
        } catch (error) {
            Utils.log("Update Login Form Data ===> error ", error);
        }
    }
}

/** Manage Login UI Constraints */
export const updateLoginUIConstraints = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[LOGIN_ROOT][LOGIN_KEY];
            const data = Object.assign(formData, obj);

            dispatch(updateLoginState(data));
        } catch (error) {
            Utils.log("Update Login UI Constraints ===> error ", error);
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
export const resetLoginState = () => {
    return (dispatch) => {
        try {
            dispatch({
                type: LOGIN_RESET,
                payload: {}
            })
        } catch (error) {
            Utils.log("Reset Login State ===> error ", error);
        }
    }
}